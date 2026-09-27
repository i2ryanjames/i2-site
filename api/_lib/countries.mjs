// ISO 3166-1 alpha-2 country code -> international calling code (no leading '+').
// This list is duplicated (not imported) in public/js/guide-popup.js because the
// client is a plain static site with no build step and /api is never served as a
// static asset. tests/countries.test.mjs asserts the two lists stay in sync.
export const COUNTRIES = {
  US: '1', CA: '1', GB: '44', AU: '61', NG: '234', KE: '254', GH: '233', ZA: '27',
  UG: '256', TZ: '255', ET: '251', CD: '243', CM: '237', IN: '91', PK: '92', BD: '880',
  ID: '62', PH: '63', MY: '60', EG: '20', MA: '212', DZ: '213', TN: '216', SA: '966',
  AE: '971', JO: '962', LB: '961', TR: '90', IR: '98', IQ: '964', FR: '33', DE: '49',
  NL: '31', ES: '34', IT: '39', BR: '55', MX: '52', CO: '57', AR: '54', SN: '221',
  CI: '225', ML: '223', NE: '227', SO: '252', SD: '249', RW: '250', ZM: '260', ZW: '263',
  MZ: '258', AF: '93', YE: '967', KW: '965', QA: '974', OM: '968', IL: '972', LK: '94',
  NP: '977', TH: '66', VN: '84', CN: '86', JP: '81', KR: '82', RU: '7', UA: '380', PT: '351',
};
