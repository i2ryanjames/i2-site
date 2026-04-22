# Baseline Design & UX Findings

**Date:** 2026-04-22
**Method:** Manual review of all 7 pages (desktop 1440 + mobile 390 captures in `./before/`) cross-referenced with source HTML, using the `web-design-guidelines` rubric (typography, visual hierarchy, accessibility, motion, mobile-first sizing).

The current site is competent and functional. It has a clear structure, consistent nav/footer, and the content is authoritative and well-written. The issues below are what stand between it and the "documentary cinematic" target described in the augmentation brief.

---

## Top 10 issues (prioritized for the v2 pass)

### 1. No visual distinction between urgency content and hope content
The 38K-deaths-per-day stat, the 1:450K missionary ratio, and the Muslim global stats all sit on the same cream background as the endorsements and gallery. Urgency reads muted; hope reads flat. Both need separate visual treatments.
**Phase:** 2 (dark/light section tokens) + 4 (applied per page)

### 2. Display numerals are not designed
The huge stats (`38,000`, `2B+`, `1:450K`, `97%`) are rendered in what appears to be the body font at a larger size. They should be the design's centerpiece — either a dedicated display serif/weight at 6rem+ with tabular figures, or a treatment like outlined-number-with-label. Currently they blend into their labels.
**Phase:** 2 (`.display-num` component) + 4 (stat-heavy pages)

### 3. Color contrast failures on the gold accent
Gold `#b8862d` fails WCAG AA on the cream background (3.09:1) and as a CTA background behind white text (3.23:1). Footer copyright at 2.69:1 is materially unreadable. See `baseline-lighthouse.md` for the full list and the proposed darker variant.
**Phase:** 2 (color tokens — darker text/link variant of the gold)

### 4. Footer column headers are gold and low-weight — they read as decorative, not structural
On cream, `#b8862d` at 9.8pt bold reads as afterthought labels. They should be either a semantic grey (darker than body) or promoted to a genuine heading style. Also fails heading-order (they're `<h4>` without parent `<h3>`).
**Phase:** 3 (footer rebuild)

### 5. Hero typography is undersized for the mission's gravitas
Current home H1 "Finishing the *Great Commission* Among Muslims" appears at roughly 2.25rem. For a headline that large-statement, the target range is 4–6rem on desktop with proper optical sizing. The italic emphasis on "Great Commission" also deserves a design moment — color accent, slight size lift, or a dedicated italic weight.
**Phase:** 2 (type scale) + 4.1 (home hero)

### 6. `/the-mission` is a wall of near-identical stat cards
Seven sections, each with a grid of small cards holding numbers. Visually monotonous — the reader can't tell which argument is most important, and scroll fatigue sets in by the third section. Needs varied treatment: one pin-and-reveal hero stat per section, different grid densities, occasional full-width dark breaks to reset the eye.
**Phase:** 4.3 (mission page cinematic choreography)

### 7. No `<main>` landmark on any page; `mission.html` has no `<h1>`
Accessibility and SEO structural deficits. Screen reader users cannot jump to main content.
**Phase:** 3 (shell) + 4.3 (mission H1)

### 8. Mobile hero overflow and crammed cards
On mobile the hero image is stacked below the text at roughly half width, creating dead space. Card layouts on `/get-trained` drop to single-column with no padding relief, and the embedded YouTube thumbnail retains desktop proportions. Each primary layout needs a dedicated mobile rhythm, not a squeeze of the desktop one.
**Phase:** 2 (container + fluid type tokens) + 4 per page

### 9. Endorser cards are generic quote-cards; the names are the value
Josh McDowell, William Lane Craig, JP Moreland, Francis Anfuso, Robert Coleman, Stuart McAllister, and the African church leaders are extraordinary attributions. The current presentation — small round avatar, name/title below a plain quote — reads like a testimonials widget from a SaaS template. These deserve editorial blockquote treatment: large opening quote glyph, serif italic quote body, full-width card on desktop with the portrait as a strong visual anchor, clear name/title hierarchy.
**Phase:** 2 (`.quote-block`, `.endorsement-card`) + 4.1 / 4.2 (home & about endorsements)

### 10. No scroll choreography — the page just appears
The existing IntersectionObserver reveals are effectively invisible (short duration, small offset). A documentary site benefits from intentional pacing: text lines cascade, numbers count, progress bars fill on demand. Currently there's no moment that rewards the reader for scrolling.
**Phase:** 5 (motion layer)

---

## Secondary observations (not in top 10 but tracked)

- **Home opens with a modal** ("A Word from Joshua Lingel" or similar welcome popup). Blocks the hero on every first visit. Decide: keep, make dismissable-once, or remove. *Flag for user.*
- **Homepage "Trusted by..." logos** are a scattered monochrome row without consistent sizing or spacing. A refined logo bar with even cell widths would cost nothing and elevate trust.
- **`/donate` "Current funding progress" cards** — the three progress bars (38%, 20%, 30%) are small, unanimated, and their "still waiting" context is buried. This is the single most persuasive data on the page and deserves animated scroll-triggered fill + clearer typographic treatment of the gap.
- **`/get-trained` large embedded YouTube player** dominates the top of the page above even the hero stats. Consider pushing it below the "Four ways to get equipped" cards, or reframe it with a cinematic poster state that plays on click.
- **Buttons use chevron `→` arrow glyph inconsistently** — some have it, some don't, and the glyph styling varies. Standardize in `.btn-primary` / `.btn-secondary` components.
- **No consistent eyebrow label treatment** — "The Urgency", "Who We Work With", "Secure Donation" all appear but with slightly different sizing and color depending on page. Standardize via `.eyebrow`.
- **`/donate-form` available-funds list** is a vertical stack of 13 plain button-like chips. Works, but reads as an unfinished form-builder rather than a purposeful list. Minor polish, not rework.

---

## Content discrepancies flagged for user

These are differences between the augmentation brief and what's actually in the current HTML. I will preserve what's in the HTML (that's the deployed sacred content) and flag for your reconciliation.

| Location | Brief says | Current HTML says |
|---|---|---|
| Home hero stat | `2B+` Muslims | `1.9B+` |
| Urgency stat | `38,000` die/day | `37,000` |
| About hero | (not specified) | "Mobilize. Equip. Energize." (kept) |

If the brief numbers are the correct updated figures, tell me and I'll update the HTML as part of Phase 4. If the current HTML is correct, I'll treat the brief's numbers as informal references only.

---

## What the site does well (preserve, don't over-correct)

- **Information density is appropriate.** Every stat has a label and a source context. Don't reduce content in pursuit of a cleaner look.
- **The content voice is consistent and earned.** Scripture woven naturally, no over-marketing.
- **Footer contact block is clear and complete** (PO Box, 501(c)(3), EIN). Keep.
- **Contact form anti-bot stack works and is well-implemented.** Don't touch the honeypot/time-gate/math-challenge logic.
- **Nav structure is sound.** 5 items plus CTA — don't add or remove.
