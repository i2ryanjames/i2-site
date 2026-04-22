# Baseline Lighthouse Report

**Captured:** 2026-04-22
**Target URL:** https://i2-site.vercel.app
**Tool:** Chrome DevTools MCP `lighthouse_audit` (desktop, navigation mode)

> Note: Chrome DevTools MCP's `lighthouse_audit` deliberately excludes the Performance category. Performance numbers will be captured via `performance_start_trace` in Phase 6 as part of the before/after Core Web Vitals comparison.

## Scores

| Page | Accessibility | Best Practices | SEO | Performance |
|------|:-:|:-:|:-:|:-:|
| `/` (home) | **89** | 100 | 100 | _tbd Phase 6_ |
| `/the-mission` | **89** | 100 | 100 | _tbd Phase 6_ |

## Failed audits (consistent across both pages)

### 1. `color-contrast` — FAIL (6 instances on home, same pattern on mission)

The gold accent `#b8862d` on the cream background `#fafaf7` fails WCAG AA. White text on that same gold when it's used as a button background also fails.

| Selector | Foreground | Background | Ratio | Required |
|---|---|---|:-:|:-:|
| `nav.nav-ebook` (Free Ebook link) | `#b8862d` | `#fafaf7` | **3.09** | 4.5 |
| `nav.nav-cta` (Donate button) | `#ffffff` | `#b8862d` | **3.23** | 4.5 |
| `footer h4` (column headers, 3 occurrences) | `#b8862d` | `#fafaf7` | **3.09** | 4.5 |
| `footer .footer-bottom` (copyright) | `#9b9a96` | `#fafaf7` | **2.69** | 4.5 |

**Remediation plan (Phase 2 token):** Shift the gold accent one step darker (e.g. `#8F6614` or similar) as the text/link variant, keeping the current `#b8862d` as a decorative/hover-only shade or a fill behind darker text. Copyright grey must move from `#9b9a96` to `#6B6A66` or darker.

### 2. `heading-order` — FAIL (2 instances)

- `index.html`: `.training-stats-row .training-stat-item h4` — `<h4>` used without preceding `<h3>` in its section.
- Footer `<h4>` elements ("Ministry", "Training", "Tools") — used without a preceding h3 parent.

**Remediation plan (Phase 3 footer + Phase 4 per-page):** Either promote stats to `<h3>` where they are the section's primary content, or rewrite stat blocks to use `<div>` + proper ARIA so they are not in the heading tree. Footer h4s should be either `<h3>` or replaced with styled `<p>` since they're column labels, not outline content.

### 3. `landmark-one-main` — FAIL (all pages)

No page has a `<main>` landmark. Screen readers cannot skip to primary content.

**Remediation plan (Phase 3 shell + Phase 4 per-page):** Wrap the page body between `<header>` and `<footer>` in a `<main id="main">` landmark. Add a visually-hidden "Skip to main content" link as the first focusable element (Phase 6 keyboard nav pass).

## Additional structural issue found

- `mission.html` has **zero `<h1>` elements**. The page opens directly into a section with an `<h2>`. This is both an accessibility issue and an SEO issue (even though Lighthouse rated the page 100 SEO — the page does have a `<title>` and meta description, so its SEO rubric passes).

**Remediation plan (Phase 4.3):** Add a true `<h1>` to the mission page hero.

## What passed

- 38 of 41 Lighthouse audits pass on both pages.
- All images have alt text.
- `lang` attribute is set on `<html>`.
- `<title>` and meta description present everywhere.
- No console errors on load.

## Targets for Phase 6

| Metric | Baseline | Phase 6 target |
|---|:-:|:-:|
| Accessibility | 89 | **≥ 95** |
| Best Practices | 100 | **100** |
| SEO | 100 | **100** |
| Performance | _tbd_ | **≥ 90** |
