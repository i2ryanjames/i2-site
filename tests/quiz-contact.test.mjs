import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../public/js/contact-form.js', import.meta.url), 'utf8');

function contactPage(search) {
  const fields = new Map();
  const requests = [];
  const document = {
    getElementById(id) {
      if (!fields.has(id)) fields.set(id, {
        value: '', placeholder: '', textContent: '', innerHTML: '', style: {},
        addEventListener() {},
      });
      return fields.get(id);
    },
  };
  const window = { location: { search } };
  vm.runInNewContext(script, {
    window, document, URLSearchParams,
    fetch(url, options) {
      requests.push({ url, options });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ siteKey: 'test-only' }) });
    },
  });
  return { fields, requests, window };
}

test('quiz contact topics map to valid subjects without writing a visitor message', () => {
  for (const [topic, expected] of Object.entries({
    initiative: 'EMFC Initiative', partnership: 'Partnership Opportunities',
    giving: 'Donations & Giving', training: 'Training & Events', mmwu: 'MMWU Enrollment',
  })) {
    const { fields, requests } = contactPage('?topic=' + topic);
    assert.equal(fields.get('subject').value, expected);
    assert.equal(fields.get('message').value, '');
    assert.ok(fields.get('message').placeholder.length > 30);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, '/api/contact');
    assert.equal(requests[0].options.method, undefined, 'routing must never submit a contact request');
  }
});

test('unknown or malicious query topics do not become contact text', () => {
  for (const topic of ['__proto__', 'constructor', '<img src=x onerror=alert(1)>', 'giving&message=hello']) {
    const { fields } = contactPage('?topic=' + encodeURIComponent(topic));
    assert.ok(!fields.has('subject'));
    assert.ok(!fields.has('message'));
  }
});

test('ordinary contact visits keep the default form', () => {
  const { fields, window } = contactPage('');
  assert.ok(!fields.has('subject'));
  assert.equal(typeof window.sendForm, 'function');
});
