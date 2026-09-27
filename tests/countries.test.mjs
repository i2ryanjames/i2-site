import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COUNTRIES as SERVER_COUNTRIES } from '../api/_lib/countries.mjs';

// public/js/guide-popup.js is a browser IIFE (references window/document), so it
// can't be safely imported in Node. Extract its literal COUNTRIES array instead —
// it's written in valid JSON (quoted keys/strings) specifically so this works.
const jsPath = fileURLToPath(new URL('../public/js/guide-popup.js', import.meta.url));
const source = readFileSync(jsPath, 'utf8');
const match = source.match(/var COUNTRIES = (\[[\s\S]*?\]);/);

test('guide-popup.js defines a COUNTRIES array', () => {
  assert.ok(match, 'expected `var COUNTRIES = [...]` in guide-popup.js');
});

const clientCountries = match ? JSON.parse(match[1]) : [];

test('the client country list has no duplicate ISO2 codes', () => {
  const codes = clientCountries.map((c) => c.code);
  assert.equal(new Set(codes).size, codes.length);
});

test('client and server country lists cover the exact same ISO2 codes', () => {
  const serverCodes = Object.keys(SERVER_COUNTRIES).sort();
  const clientCodes = clientCountries.map((c) => c.code).sort();
  assert.deepEqual(clientCodes, serverCodes);
});

test('client and server agree on every dial code', () => {
  for (const country of clientCountries) {
    assert.equal(country.dial, SERVER_COUNTRIES[country.code], `dial code mismatch for ${country.code}`);
  }
});

test('the list defaults to the United States first', () => {
  assert.equal(clientCountries[0].code, 'US');
});
