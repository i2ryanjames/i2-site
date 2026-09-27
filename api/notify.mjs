import {
  reply,
  clean,
  SystemeError,
  upstashConfigured,
  withinRateLimit,
  backupSignup,
  resolveContactId,
  applyTag,
} from './_lib/signup.mjs';

const allowedRoles = new Set([
  'Pastor or church leader',
  'Missionary or mission leader',
  'Professor or seminary student',
  'Apologist or scholar',
  'Other',
]);

async function syncToSysteme({ email, firstName, role, wantsBulk }) {
  const fields = firstName ? [{ slug: 'first_name', value: firstName }] : [];
  const contactId = await resolveContactId(email, fields);

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

  if (upstash && !(await withinRateLimit(request, 'i2:notify'))) {
    return reply(429, 'Too many sign-ups from this connection. Please try again later.');
  }

  let backedUp = false;
  if (upstash) {
    backedUp = await backupSignup('i2:notify:borrowed-christ:signups', { email, firstName, role, source, wantsBulk, at: new Date().toISOString() });
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
