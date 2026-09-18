# i2 Ministries — Static Site

## What this is
Static HTML site for i2 Ministries. **Twelve pages**, deployed to Vercel via git push (no build step).

⚠️ **Since PR #45 (2026-09-18) every served file lives under `public/`** — `public/index.html`,
`public/styles/`, `public/js/`, `public/images/`. `vercel.json` sets `outputDirectory: public`.
Serverless functions stay OUTSIDE it, in `/api` (`api/contact.mjs`). Paths below are relative to `public/`.
Per-page inline `<script>` has been extracted to `public/js/pages/*.js`, GSAP is vendored at
`public/vendor/gsap/`, and fonts are self-hosted in `public/fonts/`. A strict CSP in `vercel.json`
blocks third-party scripts — automated tools that inject a CDN script need `bypassCSP`.

- `index.html` — Homepage (`/`)
- `about.html` — About / Dr. Joshua Lingel (`/about`, `/joshua-lingel`)
- `mission.html` — The Mission (`/the-mission`)
- `get-trained.html` — Get Trained (`/get-trained`)
- `the-initiative.html` — Every Muslim for Christ Initiative (`/the-initiative`)
- `mmwu.html` — Mission Muslim World University (`/mmwu`)
- `wise-global.html` — WISE Global App (`/wise-global`)
- `donate.html` → `donate-form.html` — GivingFuel / PayPal handoff
- `contact.html` — FormSubmit.co contact form
- `vercel.json` — URL rewrites + image cache headers
- `images/` — Static assets (populate via `download-images.sh`)
- `privacy.html`, `cookie-policy.html` — legal pages (added with the consent controls)
- `/api/contact.mjs` — contact endpoint; verifies a Cloudflare Turnstile token server-side.
  ⚠️ Until `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` are set in Vercel the contact page
  shows a plain mailto fallback instead of the form. Open tasks live in `PLAN.md`.

## Design system (v2 cinematic pass, 2026-04-22)

External stylesheets layered on top of each page's inline CSS. Load order per page:
1. Inline `<style>` (original)
2. `<link href="/styles/tokens.css">` — design tokens + `.sr-only` utility
3. `<link href="/styles/home.css">` — shared section patterns (EMFCI stats, endorsement cards, CTAs) — loaded on all content pages
4. `<link href="/styles/<page>.css">` — page-specific overrides

Full architecture + rationale in `DESIGN-DECISIONS.md`. Don't touch sacred content (see that doc).

### Motion layer

GSAP 3.13.0 + ScrollTrigger, **vendored at `/vendor/gsap/`** (no longer CDN — the CSP blocks that), plus `/js/animations.js` which provides:
- `[data-counter]` — count 0 → target on scroll entry
- `[data-progress]` — bar fill 0% → target% on scroll entry
- `[data-hero-lines]` — word cascade on page load (free SplitText substitute)
- `[data-stat-stagger]` — stagger children on scroll entry
- `[data-scroll-reveal]` — generic fade-up on scroll entry

All bail instantly if `prefers-reduced-motion: reduce`. Existing inline JS (death counter, mobile menu, dropdown, `.reveal` observer, ebook modal) runs unchanged.

## Hard constraints
- **No framework. No build step. No bundler.** This is pure HTML/CSS/JS served as-is.
- Do **not** introduce React, Next.js, Vite, Webpack, TypeScript compilation, or any preprocessor.
- Do **not** convert existing pages into components or modules.
- Edits are made directly in the `.html` files. Nav changes must be mirrored across all pages.
- Vercel auto-deploys on push to `main`. No CI, no preview step.

## Animation tooling
`package.json` declares `gsap`, `lenis`, and `motion` so Claude and IDE tooling can reference up-to-date APIs — **the site itself loads these from CDN**, not from `node_modules`. See `AUGMENTATION-NOTES.md` for CDN snippets and usage patterns.

When adding motion:
1. Add the CDN `<script>` to the specific page that needs it (not globally).
2. Prefer GSAP + ScrollTrigger for scroll-driven effects; Motion One for simple component transitions; Lenis for smooth scroll.
3. Respect `prefers-reduced-motion` — wrap non-essential animations.
4. Keep bundles out of the repo; CDN URLs are pinned in `AUGMENTATION-NOTES.md`.

## External services (separate domains, don't touch)
- `resources.i2ministries.org` — Shopify
- `i2ministries-emfci.com` — EMFCI
- `mmwu.org` — Mission Muslim World University
- `thewadi.org` — WADI video training
- `i2ministries.givingfuel.com` — Donation processing
- FormSubmit.co — Contact form delivery (requires email verification on first submission)

## Contact form anti-bot stack (don't weaken)
1. Honeypot fields (hidden inputs)
2. Time gate (<3s = bot)
3. Math challenge (random addition)
4. FormSubmit `_honey` parameter

## Deploy
Push to `main`. Vercel rebuilds in ~10 seconds. `.vercel` and `node_modules` are gitignored.

## Skills available in this project
`/impeccable`, `/animate`, `/polish`, `/audit`, `/critique`, `/layout`, `/typeset`, `/colorize`, `/a11y-debugging`, `/debug-optimize-lcp`, plus the 8 GSAP skills under `.agents/skills/gsap-*` (core, timeline, scrolltrigger, plugins, performance, utils, react, frameworks). MCPs: context7, playwright, chrome-devtools.


## Local preview

`cd ~/i2-site/public && python3 -m http.server 8787` → http://localhost:8787/index.html
Serve from **`public/`**, not the repo root — from the root every `/styles/…` and `/images/…` path 404s.
(The `/api` functions do not run under a plain static server; use `vercel dev` if you need them.)

## Colour + accessibility rules (2026-09-17 audit, keep these true)

The site measures **0 axe-core WCAG 2.0/2.1 A+AA violations across all 12 pages**. Two rules keep it there:

- **Never put small text on `--color-accent` (#3b82f6), or white text on it as a button fill.**
  It measures 3.67:1 both ways, against a 4.5:1 requirement. Use **`--color-accent-text` (#1d4ed8,
  6.70:1)** for that, defined in `styles/polish.css` section (k). `#3b82f6` stays correct for
  decorative use and large display type, which only need 3:1.
- **Overrides go in `styles/polish.css`** — it is linked LAST on every page, and each page's inline
  `<style>` loads FIRST, so an inline rule loses to `styles/*.css`. Sections: (i) logo strip,
  (j) urgency cards, (k) accessible text accent, (l) tap targets (44px, mobile breakpoint only).

⚠️ **Auditing this site gives false positives unless animations settle.** GSAP `.reveal` elements
are mid-fade for a few seconds after scrolling; axe then reports hundreds of bogus contrast
failures and `scrollWidth` reads ~450–495 instead of 390. Scroll the full height, then wait
**~4s**, then measure — and check both 390 and 1440.
