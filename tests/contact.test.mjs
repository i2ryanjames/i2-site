import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../api/contact.mjs';

const environmentKeys = [
  'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'RESEND_API_KEY',
  'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL', 'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN', 'RATE_LIMIT_SALT', 'TURNSTILE_ALLOWED_HOSTS',
];

function configured(t) {
  const before = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
  const originalFetch = global.fetch;
  Object.assign(process.env, {
    TURNSTILE_SITE_KEY: 'test-public-key',
    TURNSTILE_SECRET_KEY: 'test-secret-key',
    RESEND_API_KEY: 'test-mail-key',
    CONTACT_FROM_EMAIL: 'i2 Ministries <contact@i2ministries.org>',
    CONTACT_TO_EMAIL: 'info@i2ministries.org',
    UPSTASH_REDIS_REST_URL: 'https://test.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'test-redis-key',
    RATE_LIMIT_SALT: 'test-rate-limit-salt',
  });
  t.after(() => {
    global.fetch = originalFetch;
    for (const key of environmentKeys) {
      if (before[key] === undefined) delete process.env[key];
      else process.env[key] = before[key];
    }
  });
}

function request(overrides = {}) {
  return new Request('https://i2-site.vercel.app/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '192.0.2.15' },
    body: JSON.stringify({
      firstName: 'Jane', lastName: 'Partner', email: 'jane@example.com',
      subject: 'General Inquiry', message: 'Please contact me about the ministry.',
      turnstileToken: 'test-token', ...overrides,
    }),
  });
}

test('contact endpoint fails closed without service configuration', async (t) => {
  const before = process.env.TURNSTILE_SITE_KEY;
  delete process.env.TURNSTILE_SITE_KEY;
  t.after(() => { if (before === undefined) delete process.env.TURNSTILE_SITE_KEY; else process.env.TURNSTILE_SITE_KEY = before; });
  assert.equal((await GET()).status, 503);
  assert.equal((await POST(request())).status, 503);
});

test('public config returns only the Turnstile site key', async (t) => {
  configured(t);
  const response = await GET();
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, siteKey: 'test-public-key' });
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('invalid content is rejected before external calls', async (t) => {
  configured(t);
  global.fetch = () => { throw new Error('External call should not happen'); };
  assert.equal((await POST(request({ subject: 'Unlisted topic' }))).status, 400);
  assert.equal((await POST(request({ message: 'short' }))).status, 400);
  assert.equal((await POST(new Request('https://i2-site.vercel.app/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad json',
  }))).status, 400);
});

test('rate limit blocks before challenge and mail requests', async (t) => {
  configured(t);
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    return Response.json([{ result: 11 }, { result: 1 }]);
  };
  const response = await POST(request());
  assert.equal(response.status, 429);
  assert.equal(calls.length, 1);
  assert.match(calls[0], /upstash\.io\/pipeline/);
});

test('rejected or replayed challenge does not send mail', async (t) => {
  configured(t);
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes('upstash.io')) return Response.json([{ result: 1 }, { result: 1 }]);
    if (String(url).includes('siteverify')) return Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] });
    throw new Error('Mail must not be called');
  };
  assert.equal((await POST(request())).status, 400);
  assert.equal(calls.length, 2);
});

test('valid challenge sends one message with fixed To and CC recipients', async (t) => {
  configured(t);
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('upstash.io')) return Response.json([{ result: 1 }, { result: 1 }]);
    if (String(url).includes('siteverify')) return Response.json({ success: true, action: 'contact', hostname: 'i2-site.vercel.app' });
    if (String(url).includes('api.resend.com')) return Response.json({ id: 'sent-once' });
    throw new Error('Unexpected external request');
  };
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.equal(calls.length, 3);
  const mail = JSON.parse(calls[2].options.body);
  assert.deepEqual(mail.to, ['info@i2ministries.org']);
  assert.deepEqual(mail.cc, ['ryan@i2ministries.org']);
  assert.equal(mail.reply_to, 'jane@example.com');
  assert.match(mail.text, /Please contact me about the ministry/);
});

test('mail provider failure returns a safe retry message', async (t) => {
  configured(t);
  global.fetch = async (url) => {
    if (String(url).includes('upstash.io')) return Response.json([{ result: 1 }, { result: 1 }]);
    if (String(url).includes('siteverify')) return Response.json({ success: true, action: 'contact', hostname: 'i2-site.vercel.app' });
    return new Response('Provider error', { status: 500 });
  };
  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.doesNotMatch(JSON.stringify(await response.json()), /test-mail-key|Provider error/);
});
