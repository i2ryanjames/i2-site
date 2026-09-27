import { createHmac } from 'node:crypto';

// Shared helpers for the site's signup endpoints (api/notify.mjs, api/starter-guide.mjs).
// Vercel does not route underscore-prefixed paths in /api as their own functions, so this
// file is never itself deployed as an endpoint.

export const SYSTEME_BASE = 'https://api.systeme.io/api';

export const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function reply(status, message, extra) {
  return new Response(JSON.stringify({ ok: status < 400, message, ...extra }), { status, headers: jsonHeaders });
}

export function clean(value, maxLength) {
  if (typeof value !== 'string') return '';
  const result = value.trim();
  if (!result || result.length > maxLength || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(result)) return '';
  return result;
}

export async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export class SystemeError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function upstashConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.RATE_LIMIT_SALT);
}

export async function withinRateLimit(request, keyPrefix) {
  try {
    const forwarded = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ip = forwarded.split(',')[0].trim() || 'unknown';
    const hashedIp = createHmac('sha256', process.env.RATE_LIMIT_SALT).update(ip).digest('hex');
    const bucket = Math.floor(Date.now() / 900000);
    const key = `${keyPrefix}:${bucket}:${hashedIp}`;
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
    console.error('Rate limit check failed:', error instanceof Error ? error.message : 'Unknown error');
    return true;
  }
}

export async function backupSignup(listKey, record) {
  try {
    const endpoint = new URL('/pipeline', process.env.UPSTASH_REDIS_REST_URL).toString();
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([['LPUSH', listKey, JSON.stringify(record)]]),
    });
    if (!response.ok) throw new Error('Backup unavailable');
    const results = await response.json();
    if (!Array.isArray(results) || results.some((result) => result?.error)) throw new Error('Backup unavailable');
    return true;
  } catch (error) {
    console.error('Backup push failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function resolveContactId(email, fields = []) {
  return (await resolveContact(email, fields)).id;
}

// Like resolveContactId, but also reports whether the contact already existed,
// because systeme ignores `fields` for an existing contact on create.
export async function resolveContact(email, fields = []) {
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
      fields,
    }),
  });

  if (createResponse.status === 200 || createResponse.status === 201) {
    const json = await createResponse.json().catch(() => ({}));
    if (!json.id) throw new SystemeError('systeme contact create returned no id', createResponse.status);
    return { id: json.id, existed: false };
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
    return { id, existed: true };
  }

  throw new SystemeError('systeme contact create failed', createResponse.status);
}

// Writes custom fields onto an existing contact. Only `fields` are sent: systeme
// silently discards email changes on PATCH.
export async function updateContactFields(contactId, fields) {
  const response = await fetchWithTimeout(`${SYSTEME_BASE}/contacts/${contactId}`, {
    method: 'PATCH',
    headers: {
      'X-API-Key': process.env.SYSTEME_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify({ fields }),
  });
  return { ok: response.ok, status: response.status };
}

export async function applyTag(contactId, tagId) {
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
