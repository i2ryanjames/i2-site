import { createHmac } from 'node:crypto';

const allowedRoles = new Set([
  'Pastor or church leader',
  'Missionary or mission leader',
  'Professor or seminary student',
  'Apologist or scholar',
  'Other',
]);

const SYSTEME_BASE = 'https://api.systeme.io/api';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function reply(status, message, extra) {
  return new Response(JSON.stringify({ ok: status < 400, message, ...extra }), { status, headers: jsonHeaders });
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

class SystemeError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function upstashConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.RATE_LIMIT_SALT);
}

async function withinRateLimit(request) {
  try {
    const forwarded = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ip = forwarded.split(',')[0].trim() || 'unknown';
    const hashedIp = createHmac('sha256', process.env.RATE_LIMIT_SALT).update(ip).digest('hex');
    const bucket = Math.floor(Date.now() / 900000);
    const key = `i2:notify:${bucket}:${hashedIp}`;
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
    return count <= 6;
  } catch (error) {
    console.error('Notify rate limit check failed:', error instanceof Error ? error.message : 'Unknown error');
    return true;
  }
}

async function backupSignup(record) {
  try {
    const endpoint = new URL('/pipeline', process.env.UPSTASH_REDIS_REST_URL).toString();
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([['LPUSH', 'i2:notify:borrowed-christ:signups', JSON.stringify(record)]]),
    });
    if (!response.ok) throw new Error('Backup unavailable');
    const results = await response.json();
    if (!Array.isArray(results) || results.some((result) => result?.error)) throw new Error('Backup unavailable');
    return true;
  } catch (error) {
    console.error('Notify backup push failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

async function resolveContactId(email, firstName) {
  const createResponse = await fetchWithTimeout(`${SYSTEME_BASE}/contacts`, {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.SYSTEME_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      locale: 'en',
      fields: firstName ? [{ slug: 'first_name', value: firstName }] : [],
    }),
  });

  if (createResponse.status === 200 || createResponse.status === 201) {
    const json = await createResponse.json().catch(() => ({}));
    if (!json.id) throw new SystemeError('systeme contact create returned no id', createResponse.status);
    return json.id;
  }

  if (createResponse.status === 409 || createResponse.status === 422) {
    const lookupResponse = await fetchWithTimeout(`${SYSTEME_BASE}/contacts?email=${encodeURIComponent(email)}&limit=10`, {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.SYSTEME_API_KEY,
        Accept: 'application/json',
      },
    });
    if (!lookupResponse.ok) throw new SystemeError('systeme contact lookup failed', lookupResponse.status);
    const lookupJson = await lookupResponse.json().catch(() => ({}));
    const id = lookupJson.items?.[0]?.id;
    if (!id) throw new SystemeError('systeme contact lookup found no match', lookupResponse.status);
    return id;
  }

  throw new SystemeError('systeme contact create failed', createResponse.status);
}

async function applyTag(contactId, tagId) {
  const response = await fetchWithTimeout(`${SYSTEME_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.SYSTEME_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tagId: Number(tagId) }),
  });
  return { ok: [200, 201, 204, 422].includes(response.status), status: response.status };
}

async function syncToSysteme({ email, firstName, role, wantsBulk }) {
  const contactId = await resolveContactId(email, firstName);

  const mainTag = await applyTag(contactId, process.env.SYSTEME_TAG_ID);
  if (!mainTag.ok) throw new SystemeError('systeme main tag failed', mainTag.status);

  const extraTagIds = [];
  if (role) {
    try {
      const roleTags = JSON.parse(process.env.SYSTEME_ROLE_TAGS || '{}');
      if (roleTags && typeof roleTags === 'object' && roleTags[role]) extraTagIds.push(roleTags[role]);
    } catch (_) {
      // ignore malformed SYSTEME_ROLE_TAGS
    }
  }
  if (wantsBulk && process.env.SYSTEME_BULK_TAG_ID) extraTagIds.push(process.env.SYSTEME_BULK_TAG_ID);

  for (const tagId of extraTagIds) {
    try {
      const result = await applyTag(contactId, tagId);
      if (!result.ok) console.error('Notify extra tag application returned an unexpected status', result.status);
    } catch (error) {
      console.error('Notify extra tag application failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export async function GET() {
  return reply(405, 'Method not allowed.');
}

export async function POST(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return reply(415, 'Invalid request.');

  let raw;
  try { raw = await request.text(); } catch (_) { return reply(400, 'Invalid request.'); }
  if (raw.length > 4000) return reply(413, 'Request is too large.');

  let data;
  try { data = JSON.parse(raw); } catch (_) { return reply(400, 'Invalid request.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Invalid request.');

  if (data.website || data.company) return reply(200, 'Thank you.');
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < 1500) return reply(200, 'Thank you.');

  const email = clean(data.email, 254).toLowerCase();
  if (!email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return reply(400, 'Please enter a valid email address.');
  }

  const firstName = clean(data.firstName, 80);
  const roleValue = typeof data.role === 'string' ? data.role : '';
  const role = allowedRoles.has(roleValue) ? roleValue : '';
  const source = clean(data.source, 60) || 'book-page';
  const wantsBulk = data.wantsBulk === true;

  const upstash = upstashConfigured();

  if (upstash && !(await withinRateLimit(request))) {
    return reply(429, 'Too many sign-ups from this connection. Please try again later.');
  }

  let backedUp = false;
  if (upstash) {
    backedUp = await backupSignup({ email, firstName, role, source, wantsBulk, at: new Date().toISOString() });
  }

  if (!process.env.SYSTEME_API_KEY || !process.env.SYSTEME_TAG_ID) {
    if (backedUp) return reply(200, "You're on the list.", { queued: true });
    return reply(503, 'Sign-up is temporarily unavailable. Please email info@i2ministries.org.');
  }

  try {
    await syncToSysteme({ email, firstName, role, wantsBulk });
    return reply(200, "You're on the list.");
  } catch (error) {
    console.error('systeme sync failed', error instanceof SystemeError ? error.status : (error instanceof Error ? error.message : 'Unknown error'));
    if (backedUp) return reply(200, "You're on the list.", { queued: true });
    return reply(503, 'Sign-up is temporarily unavailable. Please email info@i2ministries.org.');
  }
}
