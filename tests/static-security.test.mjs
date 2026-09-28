import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const publicDir = join(root, 'public');
const pages = readdirSync(publicDir).filter((name) => name.endsWith('.html'));

test('all public pages avoid inline executable handlers and remote passive assets', () => {
  assert.equal(pages.length, 13);
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

test('every public page has a www canonical, description, and its own share image', () => {
  const host = 'https://www.i2ministries.org';
  const images = new Set();
  for (const page of pages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.match(html, new RegExp(`<link rel="canonical" href="${host}[^"]*"`), page);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/i, page);
    assert.match(html, new RegExp(`property="og:image" content="${host}/images/[^"]+\\.(?:jpg|jpeg|png|webp)"`), page);
    assert.match(html, /property="og:image:alt" content="[^"]+"/, page);
    assert.match(html, /property="og:locale" content="en_US"/, page);
    assert.match(html, /name="twitter:card" content="summary_large_image"/, page);
    assert.match(html, /name="twitter:image:alt" content="[^"]+"/, page);
    assert.doesNotMatch(html, /https:\/\/i2ministries\.org(?![.\w])/, page);
    const image = html.match(/property="og:image" content="https:\/\/www\.i2ministries\.org(\/images\/[^"]+)"/);
    assert.ok(image, page);
    assert.ok(existsSync(join(publicDir, image[1])), `${page}: missing ${image[1]}`);
    images.add(image[1]);
    if (page === 'donate-form.html') assert.match(html, /noindex/, page);
    else assert.match(html, /"@type": "WebPage"/, page);
  }
  assert.equal(images.size, pages.length);
  const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
  assert.ok(config.redirects.some((rule) => rule.source === '/joshua-lingel' && rule.destination === '/about' && rule.permanent));
  assert.ok(config.redirects.some((rule) => rule.source === '/borrowed-christ' && rule.destination === '/the-borrowed-christ'));
  assert.ok(!config.rewrites.some((rule) => rule.source === '/joshua-lingel' || rule.source === '/borrowed-christ'));
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
