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
5. **Add the theme link last**: `<link rel="stylesheet" href="/styles/theme-shadcn-blue.css">` before `</head>` — required for blue theme consistency (see v3 notes below)

---

# Design Decisions — v3 (Shadcn Blue + Cinematic Story-Scroll)

Captured 2026-05-11. Cumulative work on top of v2: site-wide blue palette swap, new homepage story-scroll, hero infinite-grid effect, mobile fixes.

## Color palette — shadcn blue (override layer)

The site's warm-earth palette (gold `#8A5A24`, brick `#4A1818`) has been **overridden** with a blue-centric shadcn token set. Implemented as a **non-destructive override stylesheet** rather than rewriting the existing CSS.

**Files:**
- `styles/theme-shadcn-blue.css` — defines the shadcn token set (`--background`, `--foreground`, `--primary`, `--accent`, `--ring`, `--chart-1..5`, etc., including a `.dark` block) AND remaps the existing `--color-*` and `--urgency-*` variables that the rest of the CSS already references.

**How it works:** the original CSS references `var(--color-accent)`, `var(--color-bg)`, `var(--urgency-800)`, etc. The theme file overrides those values site-wide:
- `--color-accent`: `#8A5A24` → `#3b82f6` (shadcn primary blue)
- `--color-accent-deep`: `#8B3A2A` → `#1e3a8a` (shadcn chart-5 deep blue)
- `--color-bg`: `#FAFAF7` → `#ffffff`
- `--urgency-800`: `#4A1818` → `#1e3a8a` (so any `.section-urgency` block stays on-theme)

Linked **last** in every page's `<head>` so it wins the cascade. To revert site-wide, delete the file (every reference becomes a harmless 404) or remove the 10 `<link>` lines.

**Pages with the theme link:** index, about, mission, get-trained, the-initiative, mmwu, wise-global, donate, donate-form, contact (all 10).

### Gradient fix
Multiple cards (death-counter, pullquote, connect-card, endorsement-card) previously used `linear-gradient(135deg, var(--color-accent-deep), #5C1A12)` — the second stop was a hardcoded dark red-brown that produced a purple appearance under the new blue theme. All instances now use `linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))` (the same blue-to-blue pattern as the donate-page CTA gradient). Search for `5C1A12` to confirm zero remaining instances.

### Known caveats
- **i2 logo** is a PNG with a brown chip baked into the image — won't recolor via CSS. Re-export the logo to make it blue.
- A handful of page-specific section backgrounds in `home.css`/`pages.css` may still reference `--color-accent-warm` (which is now remapped to a richer blue `#2563eb` — harmless).

---

## Homepage story-scroll (cinematic narrative panels)

**File locations:**
- Markup: `index.html`, immediately after `<section class="hero">` and before `<section class="trusted-by">`. Wrapped in `<div class="i2-story-scroll" data-story-scroll>` with 5 `<section data-flow-section>` children.
- Styles: `styles/home.css` (appended block — search "Story scroll"). Includes a mobile media query at `(max-width: 767px)`.
- Behavior: `js/animations.js` — `animateStoryScroll()` function, hooked into `boot()`.

### Behavior (desktop ≥ 768px)
Each panel pins via GSAP ScrollTrigger (`pin: true, pinSpacing: false`). The next panel rotates from 30° → 0° as it enters the viewport, scrubbed to scroll position with `transform-origin: bottom left`. Total: 5 panels = 4 rotations + 4 pins = 8 ScrollTriggers.

The panel themes (`theme-primary`, `theme-dark`, `theme-muted`, `theme-deep`, `theme-dark`) read from local `--ss-*` CSS variables defined on the `.i2-story-scroll` root, so the block's palette is self-contained.

### Mobile (< 768px)
Pin/rotation is **disabled entirely** — iOS Safari's dynamic URL bar collapse breaks `min-height: 100vh` pinned elements mid-scroll. JS bails out with `if (window.innerWidth < 768) return;`. CSS strips `min-height: 100vh` and `transform`, and rewrites `.flow-inner` to `justify-content: flex-start` so panels are content-sized instead of full-vh with huge empty middles.

### Content
The 5 panels are: 01 The Need / Two Billion Souls (blue) → 02 The Mission / Every Muslim For Christ (dark) → 03 Get Trained / Equipped To Engage (light) → 04 The Vision / A Global Mission Force (deep blue) → 05 Respond / Will You Go? (dark). Copy lives in `index.html` markup; edit there.

### Why not React/Tailwind
The component was originally provided as React + Tailwind + Framer Motion. Ported to vanilla HTML/CSS/JS to satisfy the project's hard constraint of no framework + no build step. GSAP was already loaded via CDN on every page, so the pin/rotation cost zero new dependencies.

---

## Homepage hero — infinite grid + mouse reveal + glow blobs

Added behind the existing two-column hero (text + YouTube video card). Original hero content is untouched and sits on top (`z-index: 1`).

**Layers (inside `<section class="hero">`, before `.container`):**
- `.hero-grid-bg` — SVG `<pattern>` with a 40×40 grid at ~8% opacity. Scrolls infinitely via `requestAnimationFrame` (driver script at the bottom of `index.html`).
- `.hero-grid-reveal` — same grid at ~55% opacity, masked with `radial-gradient(300px circle at var(--hero-mx) var(--hero-my), black, transparent)`. JS updates `--hero-mx`/`--hero-my` on mousemove so the bright grid follows the cursor.
- `.hero-glows` — 3 blurred color blobs: orange top-right, primary-blue top-right inner, blue bottom-left. Decorative, `pointer-events: none`.

Original `.hero::before` and `.hero::after` (warm radial gradient + orbiting border) are disabled in the inline `<style>` (`display: none`) so they don't fight the new layers.

Respects `prefers-reduced-motion` — animation frame and reveal layer both skip.

### To tune
- Grid intensity: change `.hero-grid-bg { opacity: 0.08 }` and `.hero-grid-reveal { opacity: 0.55 }`
- Reveal radius: change `300px` in the mask radial-gradient
- Glow color/intensity: edit `.hero-glow.glow-{orange,primary,blue}` blocks

---

## Mobile fixes summary

| Concern | Fix |
|---|---|
| Story-scroll pin breaks on iOS Safari dynamic viewport | JS bails below 768px; CSS reflows panels to content-sized |
| Story-scroll panels had huge empty middles on phone | `.flow-inner` mobile rule: `justify-content: flex-start`, `mt-auto` reset, smaller padding |
| Hero grid mouse-reveal on touch devices | Stays interactive (touch fires mousemove on most browsers); reduced-motion users get a static hero |

---

## Open follow-ups

- [ ] Re-export the i2 logo PNG with a blue chip background (currently brown — only image asset that doesn't pick up the theme)
- [ ] Consider whether the `theme-shadcn-blue.css` colors should become the primary palette (collapse the override into `tokens.css`) once the new look is committed long-term
- [ ] The shadcn `.dark` class is wired in `theme-shadcn-blue.css` but there's no toggle UI yet — add a dark-mode switch in the nav if desired
- [ ] Story-scroll content is currently in `index.html` markup; consider pulling it into a JSON file if the marketing team wants to edit it without touching HTML
