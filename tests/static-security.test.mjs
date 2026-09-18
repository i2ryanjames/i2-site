import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const publicDir = join(root, 'public');
const pages = readdirSync(publicDir).filter((name) => name.endsWith('.html'));

test('all public pages avoid inline executable handlers and remote passive assets', () => {
  assert.equal(pages.length, 12);
  for (const page of pages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.doesNotMatch(html, /\s(?:onclick|onload|onerror|onsubmit)=/i, page);
    assert.doesNotMatch(html, /<script\s*>/i, page);
    assert.doesNotMatch(html, /fonts\.googleapis\.com|cdn\.jsdelivr\.net|img\.youtube\.com/i, page);
    assert.doesNotMatch(html, /<iframe\s/i, page);
    assert.match(html, /\/js\/consent\.js/, page);
    assert.match(html, /\/cookie-policy/, page);
    assert.match(html, /\/privacy/, page);
    for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:css|js|png|jpg|jpeg|webp|woff2|ico))"/gi)) {
      assert.ok(existsSync(join(publicDir, match[1])), `${page}: missing ${match[1]}`);
    }
  }
});

test('Vercel serves only the public output and configures security headers', () => {
  const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
  assert.equal(config.outputDirectory, 'public');
  assert.ok(!readdirSync(publicDir).some((name) => name.endsWith('.md')));
  assert.ok(!readdirSync(join(publicDir, 'styles')).some((name) => name.endsWith('.md')));
  const headers = config.headers.flatMap((entry) => entry.headers);
  for (const key of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Content-Security-Policy']) {
    assert.ok(headers.some((header) => header.key === key), `missing ${key}`);
  }
});
