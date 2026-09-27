import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../api/starter-guide.mjs';

const environmentKeys = [
  'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'RATE_LIMIT_SALT',
  'SYSTEME_API_KEY', 'SYSTEME_GUIDE_TAG_ID', 'SYSTEME_NEW_LEAD_TAG_ID',
  'SYSTEME_SMS_EVENTS_TAG_ID', 'SYSTEME_SMS_OFFERS_TAG_ID',
  'MMWU_OPTIN_URL', 'MMWU_WEBHOOK_KEY',
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
  return new Request('https://i2ministries.org/api/starter-guide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.5' },
    body: JSON.stringify({
      firstName: 'Jane',
      email: 'jane@example.com',
      country: 'GB',
      phone: '07700 900123',
      smsEvents: true,
      smsOffers: true,
      source: 'popup-about',
      ...overrides,
    }),
  });
}

function contactAndTagFetch(calls, extraRoutes = {}) {
  return async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith('/contacts') && options.method === 'POST') {
      return Response.json({ id: 123 }, { status: 201 });
    }
    if (String(url).includes('/contacts/123/tags')) {
      return Response.json({}, { status: 200 });
    }
    for (const [matcher, handler] of Object.entries(extraRoutes)) {
      if (String(url).includes(matcher)) return handler(url, options);
    }
    throw new Error(`Unexpected request: ${url}`);
  };
}

test('GET is not allowed', async () => {
  const response = await GET();
  assert.equal(response.status, 405);
  const body = await response.json();
  assert.deepEqual(body, { ok: false, message: 'Method not allowed.' });
});

test('missing first name is rejected before any network call', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ firstName: '' }));
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.match(body.message, /first name/i);
});

test('invalid email is rejected before any network call', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ email: 'not-an-email' }));
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.match(body.message, /valid email/i);
});

test('invalid phone is rejected before any network call', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ country: 'US', phone: '123' }));
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.match(body.message, /valid phone number/i);
});

test('unknown country code is rejected when a phone is given', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ country: 'ZZ', phone: '5551234567' }));
  assert.equal(response.status, 400);
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

test('oversized request is rejected', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(new Request('https://i2ministries.org/api/starter-guide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'x'.repeat(4001),
  }));
  assert.equal(response.status, 413);
});

test('new contact is tagged with first_name, phone_number (E.164), and country when a US phone is given', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request({ country: 'US', phone: '(816) 555-0100' }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, message: 'Download it now. Watch your inbox for next steps from MMWU.', download: '/downloads/emfci-one-day-starter-guide.pdf' });
  const contactBody = JSON.parse(calls[0].options.body);
  assert.deepEqual(contactBody.fields, [
    { slug: 'first_name', value: 'Jane' },
    { slug: 'phone_number', value: '+18165550100' },
    { slug: 'country', value: 'US' },
  ]);
});

test('a UK number with a leading trunk zero is normalized to E.164', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request({ country: 'GB', phone: '07911 123456' }));
  assert.equal(response.status, 200);
  const contactBody = JSON.parse(calls[0].options.body);
  const phoneField = contactBody.fields.find((f) => f.slug === 'phone_number');
  assert.equal(phoneField.value, '+447911123456');
});

test('a phone already carrying the dial code is not double-prefixed', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request({ country: 'US', phone: '18165550100' }));
  assert.equal(response.status, 200);
  const contactBody = JSON.parse(calls[0].options.body);
  const phoneField = contactBody.fields.find((f) => f.slug === 'phone_number');
  assert.equal(phoneField.value, '+18165550100');
});

test('a missing phone number is rejected before any network call', async () => {
  global.fetch = () => { throw new Error('fetch should not be called'); };
  const response = await POST(request({ phone: '' }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /phone number/i);
});

test('guide tag and new-lead tag are both applied', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_NEW_LEAD_TAG_ID = '10';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request());
  assert.equal(response.status, 200);
  const tagCalls = calls.filter((c) => c.url.includes('/contacts/123/tags'));
  const bodies = tagCalls.map((c) => JSON.parse(c.options.body));
  assert.deepEqual(bodies, [{ tagId: 77 }, { tagId: 10 }]);
});

test('both SMS consent tags are applied, since both boxes are required', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_SMS_EVENTS_TAG_ID = '20';
  process.env.SYSTEME_SMS_OFFERS_TAG_ID = '21';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request({ country: 'US', phone: '8165550100' }));
  assert.equal(response.status, 200);
  const bodies = calls.filter((c) => c.url.includes('/contacts/123/tags')).map((c) => JSON.parse(c.options.body));
  assert.deepEqual(bodies, [{ tagId: 77 }, { tagId: 20 }, { tagId: 21 }]);
});

for (const [label, overrides] of [
  ['the events box', { smsEvents: false }],
  ['the offers box', { smsOffers: false }],
  ['both boxes', { smsEvents: false, smsOffers: false }],
  ['a truthy non-boolean', { smsEvents: 'yes' }],
]) {
  test(`leaving ${label} unticked is rejected before any network call`, async () => {
    global.fetch = () => { throw new Error('fetch should not be called'); };
    const response = await POST(request(overrides));
    assert.equal(response.status, 400);
    assert.match((await response.json()).message, /tick both boxes/i);
  });
}

test('missing SYSTEME_API_KEY queues the signup when Upstash backup succeeds', async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  global.fetch = async () => Response.json([{ result: 1 }, { result: 1 }]);
  const response = await POST(request());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true, message: 'Download it now. Watch your inbox for next steps from MMWU.', queued: true, download: '/downloads/emfci-one-day-starter-guide.pdf' });
});

test('systeme failure without Upstash backup returns 503 and never echoes the key', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
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
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    return Response.json([{ result: 7 }, { result: 1 }]);
  };
  const response = await POST(request());
  assert.equal(response.status, 429);
  assert.equal(calls.length, 1);
});

// ── MMWU SMS opt-in webhook ──────────────────────────────────────────────

test('a +1 number with SMS consent calls the MMWU opt-in webhook with the exact body shape and ?key=', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_SMS_EVENTS_TAG_ID = '20';
  process.env.MMWU_OPTIN_URL = 'https://mmwu.example/optin';
  process.env.MMWU_WEBHOOK_KEY = 'super-secret-key';
  const calls = [];
  global.fetch = contactAndTagFetch(calls, {
    'mmwu.example/optin': async () => new Response('{}', { status: 200 }),
  });
  const response = await POST(request({ country: 'US', phone: '8165550100', smsEvents: true }));
  assert.equal(response.status, 200);
  const optinCall = calls.find((c) => c.url.includes('mmwu.example/optin'));
  assert.ok(optinCall, 'expected the MMWU opt-in webhook to be called');
  assert.match(optinCall.url, /\?key=super-secret-key$/);
  assert.deepEqual(JSON.parse(optinCall.options.body), {
    data: {
      contact: {
        email: 'jane@example.com',
        fields: { phone_number: '+18165550100', first_name: 'Jane' },
      },
      funnel_step: {
        funnel: { name: 'i2 site - Starter Guide popup' },
      },
    },
  });
});


test('a +44 number with SMS consent does not call the MMWU opt-in webhook', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_SMS_EVENTS_TAG_ID = '20';
  process.env.MMWU_OPTIN_URL = 'https://mmwu.example/optin';
  process.env.MMWU_WEBHOOK_KEY = 'super-secret-key';
  const calls = [];
  global.fetch = contactAndTagFetch(calls, {
    'mmwu.example/optin': () => { throw new Error('opt-in should not be called'); },
  });
  const response = await POST(request({ country: 'GB', phone: '7911123456', smsEvents: true }));
  assert.equal(response.status, 200);
  assert.ok(!calls.some((c) => c.url.includes('mmwu.example/optin')));
});

test('the opt-in webhook is skipped silently when its env vars are missing', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_SMS_EVENTS_TAG_ID = '20';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request({ country: 'US', phone: '8165550100', smsEvents: true }));
  assert.equal(response.status, 200);
});

test('a 500 from the opt-in webhook still returns a 200 signup response', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_SMS_EVENTS_TAG_ID = '20';
  process.env.MMWU_OPTIN_URL = 'https://mmwu.example/optin';
  process.env.MMWU_WEBHOOK_KEY = 'super-secret-key';
  const calls = [];
  global.fetch = contactAndTagFetch(calls, {
    'mmwu.example/optin': async () => new Response('Server error', { status: 500 }),
  });
  const response = await POST(request({ country: 'US', phone: '8165550100', smsEvents: true }));
  assert.equal(response.status, 200);
});

test('the MMWU webhook key never appears in console output', async () => {
  process.env.SYSTEME_API_KEY = 'test-systeme-key';
  process.env.SYSTEME_GUIDE_TAG_ID = '77';
  process.env.SYSTEME_SMS_EVENTS_TAG_ID = '20';
  process.env.MMWU_OPTIN_URL = 'https://mmwu.example/optin';
  process.env.MMWU_WEBHOOK_KEY = 'super-secret-key';
  const calls = [];
  global.fetch = contactAndTagFetch(calls, {
    'mmwu.example/optin': async () => new Response('Server error', { status: 500 }),
  });
  const originalConsoleError = console.error;
  const logged = [];
  console.error = (...args) => { logged.push(args.map(String).join(' ')); };
  try {
    await POST(request({ country: 'US', phone: '8165550100', smsEvents: true }));
  } finally {
    console.error = originalConsoleError;
  }
  assert.ok(!logged.some((line) => line.includes('super-secret-key')));
});

function contactBody(calls) {
  const create = calls.find((c) => c.url.endsWith('/contacts') && c.options.method === 'POST');
  return JSON.parse(create.options.body);
}

async function phoneFor(country, phone) {
  process.env.SYSTEME_API_KEY = 'k';
  process.env.SYSTEME_GUIDE_TAG_ID = '1';
  const calls = [];
  global.fetch = contactAndTagFetch(calls);
  const response = await POST(request({ country, phone, elapsedMs: 5000 }));
  assert.equal(response.status, 200);
  return contactBody(calls).fields.find((f) => f.slug === 'phone_number')?.value;
}

test('a national number that starts with its own country code is not treated as already prefixed', async () => {
  // Indian mobiles commonly start with 9; "91..." must still get +91 added.
  assert.equal(await phoneFor('IN', '91234 56789'), '+919123456789');
});

test('phone numbers: US with leading 1, international +, 00 prefix and trunk 0', async () => {
  assert.equal(await phoneFor('US', '1 (415) 555-1234'), '+14155551234');
  assert.equal(await phoneFor('US', '415-555-1234'), '+14155551234');
  assert.equal(await phoneFor('US', '+44 7700 900123'), '+447700900123');
  assert.equal(await phoneFor('GB', '0044 7700 900123'), '+447700900123');
  assert.equal(await phoneFor('GB', '07700 900123'), '+447700900123');
});

test('an existing contact gets the new name, phone and country written with PATCH', async () => {
  process.env.SYSTEME_API_KEY = 'k';
  process.env.SYSTEME_GUIDE_TAG_ID = '1';
  const calls = [];
  global.fetch = async (url, options) => {
    url = String(url);
    calls.push({ url, options });
    if (url.endsWith('/contacts') && options.method === 'POST') return Response.json({ violations: [{ propertyPath: 'email', message: 'This value is already used.' }] }, { status: 422 });
    if (url.includes('/contacts?email=')) return Response.json({ items: [{ id: 77 }] });
    if (url.endsWith('/contacts/77') && options.method === 'PATCH') return Response.json({ id: 77 });
    if (url.includes('/contacts/77/tags')) return new Response(null, { status: 204 });
    throw new Error(`Unexpected request: ${url}`);
  };
  const response = await POST(request({ country: 'NG', phone: '0803 123 4567', elapsedMs: 5000 }));
  assert.equal(response.status, 200);
  const patch = calls.find((c) => c.options.method === 'PATCH');
  assert.ok(patch, 'existing contact must be patched');
  assert.equal(patch.options.headers['Content-Type'], 'application/merge-patch+json');
  const body = JSON.parse(patch.options.body);
  assert.deepEqual(Object.keys(body), ['fields']);
  assert.deepEqual(body.fields, [
    { slug: 'first_name', value: 'Jane' },
    { slug: 'phone_number', value: '+2348031234567' },
    { slug: 'country', value: 'NG' },
  ]);
});

test('an address systeme refuses (no MX) is a 400 asking the visitor to check it, not a 503', async () => {
  process.env.SYSTEME_API_KEY = 'k';
  process.env.SYSTEME_GUIDE_TAG_ID = '1';
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push(String(url));
    if (String(url).endsWith('/contacts') && options.method === 'POST') {
      return Response.json({ violations: [{ propertyPath: 'email', message: 'This email address is invalid and can’t receive emails because its domain lacks a valid MX or A DNS record.' }] }, { status: 422 });
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  const response = await POST(request({ email: 'jane@gmial.con', elapsedMs: 5000 }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /check it for typos/);
  assert.equal(calls.length, 1, 'must not look up or tag a refused address');
});
