import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../api/notify.mjs';

const environmentKeys = [
  'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'RATE_LIMIT_SALT',
  'SYSTEME_API_KEY', 'SYSTEME_TAG_ID', 'SYSTEME_ROLE_TAGS', 'SYSTEME_BULK_TAG_ID',
];

let originalEnv;
let originalFetch;

beforeEach(() => {
  originalEnv = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
  originalFetch = global.fetch;
  for (const key of environmentKeys) delete process.env[key];
});

afterEach(() => {
  for (const key of environmentKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  global.fetch = originalFetch;
});

function request(overrides = {}) {
  return new Request('https://i2ministries.org/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.5' },
    body: JSON.stringify({
      email: 'jane@example.com',
      firstName: 'Jane',
      source: 'book-page',
      ...overrides,
    }),
  });
}

test('GET is not allowed', async () => {
  const response = await GET();
  assert.equal(response.status, 405);
  const body = await response.json();
  assert.deepEqual(body, { ok: false, message: 'Method not allowed.' });
});

test('invalid email is rejected before any network call', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ email: 'not-an-email' }));
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.match(body.message, /valid email/i);
});

test('honeypot field short-circuits with no network calls', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ website: 'http://spam.example' }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, message: 'Thank you.' });
});

test('fast submissions (elapsedMs) short-circuit with no network calls', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ elapsedMs: 400 }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, message: 'Thank you.' });
});

test('new contact is created and tagged', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_TAG_ID = '77';
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith('/contacts') && options.method === 'POST') {
      return Response.json({ id: 123 }, { status: 201 });
    }
    if (String(url).includes('/contacts/123/tags')) {
      return Response.json({}, { status: 200 });
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  const response = await POST(request());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, message: "You're on the list." });
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/contacts$/);
  assert.equal(calls[1].url, 'https://api.systeme.io/api/contacts/123/tags');
  assert.deepEqual(JSON.parse(calls[1].options.body), { tagId: 77 });
});

test('existing contact (422) is looked up and tagged', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_TAG_ID = '77';
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith('/contacts') && options.method === 'POST') {
      return new Response('Conflict', { status: 422 });
    }
    if (String(url).includes('/contacts?email=')) {
      return Response.json({ items: [{ id: 456 }] }, { status: 200 });
    }
    if (String(url).includes('/contacts/456/tags')) {
      return Response.json({}, { status: 200 });
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  const response = await POST(request({ email: 'existing@example.com' }));
  assert.equal(response.status, 200);
  assert.equal(calls.length, 3);
  assert.match(calls[1].url, /\/contacts\?email=existing%40example\.com&limit=10/);
  assert.match(calls[2].url, /\/contacts\/456\/tags$/);
});

test('missing SYSTEME_API_KEY queues the signup when Upstash backup succeeds', async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    return Response.json([{ result: 1 }, { result: 1 }]);
  };
  const response = await POST(request());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, message: "You're on the list.", queued: true });
  assert.equal(calls.length, 2);
  assert.match(calls[0], /upstash\.io\/pipeline/);
  assert.match(calls[1], /upstash\.io\/pipeline/);
});

test('systeme failure without Upstash backup returns 503 and never echoes the key', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_TAG_ID = '77';
  global.fetch = async () => new Response('Server error', { status: 500 });
  const response = await POST(request());
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.doesNotMatch(JSON.stringify(body), /test-systeme-key/);
});

test('rate limit blocks before any systeme calls', async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_TAG_ID = '77';
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    return Response.json([{ result: 7 }, { result: 1 }]);
  };
  const response = await POST(request());
  assert.equal(response.status, 429);
  assert.equal(calls.length, 1);
});

test('role tag is applied when SYSTEME_ROLE_TAGS maps the role', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_TAG_ID = '77';
  process.env.SYSTEME_ROLE_TAGS = JSON.stringify({ 'Pastor or church leader': '88' });
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith('/contacts') && options.method === 'POST') {
      return Response.json({ id: 123 }, { status: 201 });
    }
    if (String(url).includes('/contacts/123/tags')) {
      return Response.json({}, { status: 200 });
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  const response = await POST(request({ role: 'Pastor or church leader' }));
  assert.equal(response.status, 200);
  const tagCalls = calls.filter((call) => call.url.includes('/contacts/123/tags'));
  assert.equal(tagCalls.length, 2);
  const bodies = tagCalls.map((call) => JSON.parse(call.options.body));
  assert.deepEqual(bodies, [{ tagId: 77 }, { tagId: 88 }]);
});
