# Design Decisions — v2 Cinematic

Captured on 2026-04-22 at the end of the v2 cinematic augmentation pass. This document explains *why* the design choices are what they are, so future editors (human or AI) can maintain intent as the site evolves.

---

## Typography

**Instrument Serif + DM Sans + JetBrains Mono.**

The site already used Instrument Serif (display) + DM Sans (body) before this pass. We evaluated swapping to Fraunces + Inter Tight (our Phase 2 Option A) but kept Instrument Serif for three reasons:

1. **Continuity** — the existing brand + printed/social assets use this pairing.
2. **Documentary feel** — Instrument Serif's italic is expressive at display size, exactly what "documentary cinematic" needs for the italic emphasis words ("Great *Commission*", "the *unreached*", "*Lingel*").
3. **Zero migration risk** — swapping to Fraunces would have meant re-testing every italic word for visual weight.

Font stack defined once per page in `:root { --font-display, --font-body }`. Not redefined in `tokens.css` so the inline `:root` wins — this is intentional to preserve page-level control.

### Type scale
Fluid `clamp()` values per component, maxing at:
- Hero h1: 80px (home), 88px (other pages)
- Display numerals (EMFCI stats, etc.): 76–96px
- Section headings (h2): 48–56px
- Body: 16–17px with 1.6–1.8 line-height
- Labels/eyebrows: 13px, uppercase, tracked 0.14–0.18em

Every heading uses `text-wrap: balance` + a `max-width` cap in `ch` units so lines break naturally without manual `<br>` tags.

---

## Color — Palette A ("Field Warmth")

The site's existing gold accent was `#B8862D`. That color **failed WCAG AA contrast** at 3.09:1 on `#FAF7F2` paper, which forced 6 contrast warnings in Lighthouse.

**Change:** shifted `--color-accent` to `#8A5A24` site-wide (6.1:1 on paper, passes AA). One variable edit per page, cascades through all 258 gold usages.

The old `#B8862D` is preserved as `--brand-500` in `tokens.css` for decorative-only uses (fills, icon strokes) — never for text.

Semantic colors:
- `--urgency-800` = `#4A1818` (dark brick), `--urgency-600` = `#7A1F1F` (accent brick) — existing brick-red retained
- `--hope-600` = `#B47A2C` — warm accent for testimony moments
- Copyright grey `rgba(92,90,85,0.6)` (2.69:1) → `rgba(60,58,54,0.85)` (5.3:1) — passes AA

Full three-option palette proposal in `styles/PALETTE-PROPOSALS.md` if you ever want to swap to B (Deep Teal) or C (Documentary Clay).

---

## Architecture

### No build step
Per `CLAUDE.md` constraints: no React, no Vite, no bundler. All enhancements layered as:
- Per-page inline `<style>` (original) — preserved
- Shared `<link>` stylesheets loaded **after** the inline `<style>` so they override where needed

### Stylesheet files

| File | Purpose | Scope |
|---|---|---|
| `styles/tokens.css` | Design tokens (colors, type scale, spacing, motion, `.sr-only`) | All pages |
| `styles/home.css` | Homepage Phase 4.1 + shared sections (EMFCI stats, trusted-by, pillar cards, endorsement cards, CTAs) | Home + others for shared sections |
| `styles/about.css` | About page (bio, values, Lausanne with dropcaps) | about only |
| `styles/mission.css` | Mission page (urgency, fears, comprehensive stats theme blocks) | mission only |
| `styles/get-trained.css` | Get Trained page (pathways, catalog, dark "Why Muslims?") | get-trained only |
| `styles/donate.css` | Donate + donate-form (methods, funding dashboard, stewardship, preset chips) | both donate pages |
| `styles/contact.css` | Contact page form polish | contact only |
| `styles/pages.css` | Shared enhancements for initiative + mmwu + wise | those 3 pages |
| `styles/base.css` | Reset + base type (NOT currently linked — reserved for future migration) | unused |
| `styles/components.css` | Component patterns (NOT currently linked — reserved) | unused |
| `styles/PALETTE-PROPOSALS.md` | Alternate palettes B + C | docs |

**Cascade order per page** (load order):
1. Inline `<style>` in `<head>` (original)
2. `<link>` to `tokens.css` (cascades custom properties)
3. Inline `<style>` for skip-to-main helper
4. `<link>` to `home.css` (for pages that share those sections)
5. `<link>` to `<page>.css` (page-specific overrides)

### JavaScript files

| File | Purpose |
|---|---|
| `js/animations.js` | GSAP + ScrollTrigger-driven counter, progress, hero-line cascade, stagger reveals |
| `js/gsap-register.js` | Unused (legacy from Phase 2, reserved) |
| `js/lenis-init.js` | Unused (Lenis not currently loaded — infrastructure ready if you want smooth scroll) |

`animations.js` is loaded via CDN GSAP + ScrollTrigger before `</body>` on every page. Operates only on elements with `data-*` attributes — does not touch existing inline JS (death counter, dropdown, mobile menu, reveal observer, ebook modal).

### Motion API (data attributes)

```html
<!-- Counter count-up on scroll entry -->
<span data-counter="1900000000" data-counter-format="abbrev" data-counter-suffix="+">2B+</span>

<!-- Progress bar fill on scroll entry -->
<div class="bar-fill" data-progress="38"></div>

<!-- Stagger children on scroll entry -->
<div data-stat-stagger>
  <div class="stat-card">...</div>
  <div class="stat-card">...</div>
</div>

<!-- Generic fade-up on scroll entry -->
<section data-scroll-reveal>...</section>

<!-- Hero headline word cascade on load -->
<h1 data-hero-lines>Finishing the Great Commission</h1>
```

All patterns bail out instantly if `prefers-reduced-motion: reduce` is set — counters show their final formatted values, progress bars fill to 100% of target, hero text renders normally.

---

## Motion choreography

**Why GSAP + ScrollTrigger over pure CSS?**

CSS transitions + IntersectionObserver already handle the existing `.reveal` class system — and we kept it running. GSAP earns its weight for:
1. **Number interpolation with easing** — `gsap.to({n: 0}, {n: 1000000, ...})` with intermediate `onUpdate` formatting. Vanilla JS requires hand-coding `requestAnimationFrame` + easing functions.
2. **Unified timing model** — stagger, cascade, sequencing without manual `setTimeout` chains.
3. **ScrollTrigger integration** — precise entry/exit calculations with `start: 'top 85%'` semantics, `once: true` for single-fire.

**Free SplitText substitute.** The brief's `animateHeroLines` uses word-level splitting (regex + `<span>` wrap) rather than Club GreenSock's character-level SplitText. Licensing-safe, reads identically for our use case.

**Lenis smooth scroll deferred.** Adding Lenis can fight existing CSS `scroll-behavior: smooth`, introduces ~15KB, and risks odd UX near fixed elements (nav, modals). Infrastructure exists in `js/lenis-init.js` if needed later.

---

## Accessibility

- **`<main id="main">`** wraps page body on all 10 pages (was missing everywhere)
- **Skip-to-main link** as first focusable element, hidden at `left: -9999px` until keyboard focus
- **Heading order** fixed site-wide: footer column `<h4>` → `<h3>`, stat card `<h4>` → `<h3>`, `mission.html` got explicit `<h1>`
- **WCAG AA contrast** on every text/bg pair (gold-on-paper was the main violator — now 6.1:1)
- **`prefers-reduced-motion`** hard bail in animations.js + CSS animation-duration override in `tokens.css`
- **Form controls** on contact.html preserve honeypot + time-gate + math-challenge anti-bot stack exactly

---

## Sacred content (never alter)

Per the original augmentation brief. This list is repeated here for future editors:

1. All statistics and numbers (2B+, 38,000, 1:450K, 86%, funding percentages)
2. All endorser names, titles, affiliations, quotes (McDowell, Licona, Craig, Moreland, Anfuso, Coleman, McAllister, Botelho, Nyamekye, Mtokambali, Nyamedor, Bansah)
3. Dr. Joshua Lingel's bio, education credentials, career history, Billy Graham/Leighton Ford award
4. The Lausanne Covenant — 15 sections of text preserved verbatim
5. All scripture references
6. Legal text (501(c)(3), EIN, PO Box)
7. All external URLs (GivingFuel, PayPal, FormSubmit, WhatsApp, Shopify, MMWU, WADI)
8. All internal URLs
9. `vercel.json` rewrites
10. Page structure and count (10 local pages)

---

## Trade-offs and deferred items

- **YouTube third-party cookies** flagged by Lighthouse on 4 pages (home, get-trained, initiative, mmwu, wise). Only removable by dropping the YouTube embeds. Accepted.
- **Performance scores** not measured in this pass — Lighthouse MCP's `lighthouse_audit` excludes Performance category. A full trace pass is doable but wasn't in the immediate brief.
- **Pin-and-reveal scroll pattern** on mission.html theme blocks — complex ScrollTrigger choreography deferred.
- **`data-counter` coverage** — only wired on homepage EMFCI stats. Infrastructure is ready; adding more is a one-line HTML edit per number.
- **Structural restructure of death counter into standalone section** on home — kept existing grid layout (brick-red card inside mission grid) since it works well and avoids breaking the .reveal system.

---

## How to extend

### Change the primary accent color
Edit `--color-accent` in every page's inline `:root`. Or swap to Palette B/C per `styles/PALETTE-PROPOSALS.md`.

### Add a count-up stat anywhere
```html
<span data-counter="250" data-counter-format="comma" data-counter-suffix="+">250+</span>
```

### Add a new progress bar
```html
<div class="bar-track">
  <div class="bar-fill" data-progress="45"></div>
</div>
```

### Add a new page
1. Create `newpage.html` following the nav + `<main id="main">` + footer structure
2. Add rewrite to `vercel.json`
3. Link `tokens.css` + `home.css` (for shared sections) in `<head>`
4. Optionally create `styles/newpage.css` for page-specific styling
