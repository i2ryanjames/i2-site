import { createHmac, randomUUID } from 'node:crypto';

const allowedSubjects = new Set([
  'General Inquiry',
  'Training & Events',
  'Partnership Opportunities',
  'EMFC Initiative',
  'MMWU Enrollment',
  'Donations & Giving',
  'Media & Press',
  'Other',
]);

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function reply(status, message) {
  return new Response(JSON.stringify({ ok: status < 400, message }), { status, headers: jsonHeaders });
}

function requiredConfiguration() {
  return [
    'TURNSTILE_SITE_KEY',
    'TURNSTILE_SECRET_KEY',
    'RESEND_API_KEY',
    'CONTACT_FROM_EMAIL',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RATE_LIMIT_SALT',
  ].every((key) => !!process.env[key]);
}

function clean(value, maxLength) {
  if (typeof value !== 'string') return '';
  const result = value.trim();
  if (!result || result.length > maxLength || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(result)) return '';
  return result;
}

async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function withinRateLimit(request) {
  const forwarded = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
  const ip = forwarded.split(',')[0].trim() || 'unknown';
  const hashedIp = createHmac('sha256', process.env.RATE_LIMIT_SALT).update(ip).digest('hex');
  const bucket = Math.floor(Date.now() / 900000);
  const key = `i2:contact:${bucket}:${hashedIp}`;
  const endpoint = new URL('/pipeline', process.env.UPSTASH_REDIS_REST_URL).toString();
  const response = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([['INCR', key], ['EXPIRE', key, 1800]]),
  });
  if (!response.ok) throw new Error('Rate limit unavailable');
  const results = await response.json();
  if (!Array.isArray(results) || results[0]?.error || results[1]?.error) throw new Error('Rate limit unavailable');
  const count = Number(results[0]?.result);
  if (!Number.isFinite(count)) throw new Error('Rate limit unavailable');
  return count <= 10;
}

async function verifyTurnstile(token, request) {
  const response = await fetchWithTimeout('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined,
    }),
  });
  if (!response.ok) return false;
  const result = await response.json();
  const hostname = String(result.hostname || '').toLowerCase();
  const allowedHosts = new Set(['i2-site.vercel.app', 'i2ministries.org', 'www.i2ministries.org']);
  if (process.env.TURNSTILE_ALLOWED_HOSTS) {
    for (const host of process.env.TURNSTILE_ALLOWED_HOSTS.split(',')) allowedHosts.add(host.trim().toLowerCase());
  }
  return result.success === true && result.action === 'contact' && allowedHosts.has(hostname);
}

export async function GET() {
  if (!requiredConfiguration()) return reply(503, 'Contact form is temporarily unavailable. Please email info@i2ministries.org.');
  return new Response(JSON.stringify({ ok: true, siteKey: process.env.TURNSTILE_SITE_KEY }), { headers: jsonHeaders });
}

export async function POST(request) {
  if (!requiredConfiguration()) return reply(503, 'Contact form is temporarily unavailable. Please email info@i2ministries.org.');
  if (!(request.headers.get('content-type') || '').includes('application/json')) return reply(415, 'Invalid request.');

  let raw;
  try { raw = await request.text(); } catch (_) { return reply(400, 'Invalid request.'); }
  if (raw.length > 14000) return reply(413, 'Message is too long.');

  let data;
  try { data = JSON.parse(raw); } catch (_) { return reply(400, 'Invalid request.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Invalid request.');
  if (data.website || data.company) return reply(200, 'Message received.');

  const firstName = clean(data.firstName, 80);
  const lastName = clean(data.lastName, 80);
  const email = clean(data.email, 254);
  const subject = clean(data.subject, 80);
  const message = clean(data.message, 5000);
  const token = clean(data.turnstileToken, 2048);
  if (!firstName || !lastName || !email || !subject || !message || !token || !allowedSubjects.has(subject)) {
    return reply(400, 'Please check the form and try again.');
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || message.length < 10) {
    return reply(400, 'Please check the form and try again.');
  }

  try {
    if (!(await withinRateLimit(request))) return reply(429, 'Too many messages. Please try again later.');
    if (!(await verifyTurnstile(token, request))) return reply(400, 'Verification failed. Please try again.');

    const body = {
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL || 'info@i2ministries.org'],
      reply_to: email,
      subject: `i2 Website: ${subject}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nTopic: ${subject}\n\n${message}`,
    };
    const response = await fetchWithTimeout('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `i2-contact/${randomUUID()}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Mail provider rejected message');
    return reply(200, 'Message sent.');
  } catch (error) {
    console.error('Contact delivery failed:', error instanceof Error ? error.message : 'Unknown error');
    return reply(503, 'Message could not be sent right now. Please email info@i2ministries.org.');
  }
}
