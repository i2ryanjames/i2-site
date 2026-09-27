import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const publicDir = join(root, 'public');
const pages = readdirSync(publicDir).filter((name) => name.endsWith('.html'));

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count++;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

test('no page still calls the free resource an "ebook" in visible copy', () => {
  for (const page of pages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    assert.doesNotMatch(html, /free ebook/i, page);
  }
});

test('the-borrowed-christ.html has no nav-ebook link', () => {
  const html = readFileSync(join(publicDir, 'the-borrowed-christ.html'), 'utf8');
  assert.doesNotMatch(html, /class="nav-ebook"/, 'the-borrowed-christ.html');
});

test('every gommwu.org/ebook link carries UTM tracking', () => {
  for (const page of pages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    const marker = 'gommwu.org/ebook';
    let index = html.indexOf(marker);
    while (index !== -1) {
      const after = html.slice(index + marker.length, index + marker.length + '?utm_source=i2-site'.length);
      assert.equal(after, '?utm_source=i2-site', `${page} at index ${index}`);
      index = html.indexOf(marker, index + marker.length);
    }
  }
});

test('homepage: the book promo and the starter guide strip are not adjacent sections', () => {
  const html = readFileSync(join(publicDir, 'index.html'), 'utf8');
  const newBookIndex = html.indexOf('id="new-book"');
  const freeEbookIndex = html.indexOf('id="free-ebook"');
  assert.ok(newBookIndex !== -1 && freeEbookIndex !== -1, 'both sections must exist');
  assert.ok(newBookIndex < freeEbookIndex, 'book promo must come before the starter guide strip');
  const between = html.slice(newBookIndex, freeEbookIndex);
  assert.ok(countOccurrences(between, '<section') >= 2, 'expected at least 2 sections between #new-book and #free-ebook');
});

test('get-trained.html: the new-book resource and the starter guide strip are not adjacent sections', () => {
  const html = readFileSync(join(publicDir, 'get-trained.html'), 'utf8');
  const newResourceIndex = html.indexOf('id="new-resource"');
  const freeEbookIndex = html.indexOf('id="free-ebook"');
  assert.ok(newResourceIndex !== -1 && freeEbookIndex !== -1, 'both sections must exist');
  assert.ok(newResourceIndex < freeEbookIndex, 'new-resource must come before the starter guide strip');
  const between = html.slice(newResourceIndex, freeEbookIndex);
  assert.ok(countOccurrences(between, '<section') >= 1, 'expected at least 1 section between #new-resource and #free-ebook');
});

test('every page with the MMWU nav-dropdown-item also links The Borrowed Christ from the nav', () => {
  for (const page of pages) {
    const html = readFileSync(join(publicDir, page), 'utf8');
    const hasMmwuDropdownItem = /href="\/mmwu" class="nav-dropdown-item"/.test(html);
    if (hasMmwuDropdownItem) {
      assert.match(html, /href="\/the-borrowed-christ"/, page);
    }
  }
});
