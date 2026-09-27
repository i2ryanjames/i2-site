import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const publicDir = join(root, 'public');
const pages = readdirSync(publicDir).filter((name) => name.endsWith('.html'));

// Every page with an on-site link to the free guide gets the popup, so that
// link can be intercepted and opened in-page instead of leaving the site.
const autoOpenPages = new Set([
  'about.html',
  'mission.html',
  'get-trained.html',
  'the-initiative.html',
  'mmwu.html',
  'wise-global.html',
]);
const manualOnlyPages = new Set([
  'index.html',
  'contact.html',
  'donate.html',
  'donate-form.html',
  'the-borrowed-christ.html',
]);
const popupPages = new Set([...autoOpenPages, ...manualOnlyPages]);

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count++;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

test('every page with a gommwu.org/ebook link has exactly one popup, its stylesheet, and its script', () => {
  for (const page of popupPages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.equal(countOccurrences(html, 'id="guidePopup"'), 1, page);
    assert.equal(countOccurrences(html, '/styles/guide-popup.css'), 1, page);
    assert.equal(countOccurrences(html, '/js/guide-popup.js'), 1, page);
  }
});

test('no page without a gommwu.org/ebook link includes the popup, its stylesheet, or its script', () => {
  for (const page of pages) {
    if (popupPages.has(page)) continue;
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.doesNotMatch(html, /id="guidePopup"/, page);
    assert.doesNotMatch(html, /\/styles\/guide-popup\.css/, page);
    assert.doesNotMatch(html, /\/js\/guide-popup\.js/, page);
  }
});

test('only the six original target pages auto-open the popup (data-autoopen="true")', () => {
  for (const page of autoOpenPages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.match(html, /id="guidePopup"[^>]*data-autoopen="true"/, page);
  }
});

test('pages that only intercept manual link clicks do not auto-open (data-autoopen="false")', () => {
  for (const page of manualOnlyPages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.match(html, /id="guidePopup"[^>]*data-autoopen="false"/, page);
  }
});

test('every gommwu.org/ebook link still carries its href (no-JS fallback)', () => {
  for (const page of popupPages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.match(html, /href="https:\/\/www\.gommwu\.org\/ebook\?/, page);
  }
});

test('guide-popup.js never assigns innerHTML', () => {
  const js = readFileSync(join(publicDir, 'js', 'guide-popup.js'), 'utf8');
  assert.doesNotMatch(js, /innerHTML/);
});

test('guide-popup.js intercepts every gommwu.org/ebook link and prevents its default navigation', () => {
  const js = readFileSync(join(publicDir, 'js', 'guide-popup.js'), 'utf8');
  assert.match(js, /gommwu\.org\/ebook/);
  const block = js.match(/guideLinks\.forEach\([\s\S]*?\n {2}\}\);/);
  assert.ok(block, 'expected a guideLinks.forEach(...) block wiring click handlers');
  assert.match(block[0], /\.addEventListener\('click'/);
  assert.match(block[0], /event\.preventDefault\(\)/);
});

test('every page with the mobile nav-links container has the Home link as its first child', () => {
  for (const page of pages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    const navIndex = html.indexOf('<div class="nav-links" id="navLinks">');
    if (navIndex === -1) continue;
    const after = html.slice(navIndex + '<div class="nav-links" id="navLinks">'.length);
    const firstAnchorMatch = after.match(/<a\b[^>]*>/);
    assert.ok(firstAnchorMatch, `${page}: expected an anchor inside nav-links`);
    assert.match(firstAnchorMatch[0], /class="nav-home"/, page);
  }
});

test('pages without a mobile nav (cookie-policy, privacy) are unaffected', () => {
  for (const page of ['cookie-policy.html', 'privacy.html']) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.doesNotMatch(html, /class="nav-home"/, page);
  }
});
