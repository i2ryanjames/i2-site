# i2 Ministries — Static Site

## What this is
Static HTML site for i2 Ministries. **Ten pages**, plain HTML + inline CSS/JS + externally linked token stylesheets, deployed to Vercel via git push (auto-detects static, no build step).

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

## Design system (v2 cinematic pass, 2026-04-22)

External stylesheets layered on top of each page's inline CSS. Load order per page:
1. Inline `<style>` (original)
2. `<link href="/styles/tokens.css">` — design tokens + `.sr-only` utility
3. `<link href="/styles/home.css">` — shared section patterns (EMFCI stats, endorsement cards, CTAs) — loaded on all content pages
4. `<link href="/styles/<page>.css">` — page-specific overrides

Full architecture + rationale in `DESIGN-DECISIONS.md`. Don't touch sacred content (see that doc).

### Motion layer

GSAP 3.13.0 + ScrollTrigger loaded via CDN before `</body>` on every page, plus `/js/animations.js` which provides:
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
