# Site Inventory

**Captured:** 2026-04-22

## HTML files (7 local pages)

| File | Route(s) | Size | Lines | H1 | H2 | H3 | H4 | `<section>` | `<main>` |
|---|---|--:|--:|:-:|:-:|:-:|:-:|:-:|:-:|
| `index.html` | `/` | 33 KB | 917 | 1 | 4 | 8 | 3 | 5 | **0** |
| `about.html` | `/about`, `/joshua-lingel` | 50 KB | 1017 | 1 | 8 | 4 | 4 | 9 | **0** |
| `mission.html` | `/the-mission` | 28 KB | 638 | **0** | 4 | 0 | 3 | 6 | **0** |
| `get-trained.html` | `/get-trained` | 26 KB | 559 | 1 | 4 | 4 | 3 | 6 | **0** |
| `donate.html` | `/donate` | 26 KB | 503 | 1 | 3 | 2 | 7 | 5 | **0** |
| `donate-form.html` | `/donate-form` | 15 KB | 235 | 1 | 1 | 1 | 3 | 1 | **0** |
| `contact.html` | `/contact` | 30 KB | 574 | 1 | 1 | 3 | 3 | 2 | **0** |

**Structural gaps:** No `<main>` anywhere. `mission.html` has no `<h1>`.

## Section heading map (primary content anchors)

### index.html
1. Hero — "Finishing the *Great Commission* Among Muslims"
2. Stats trio — "1.9B+ / 37,000 / 250+ / 14" (global scale)
3. "The largest *unreached* people on the planet"
4. "Join the global community reaching *Muslims for Jesus*"
5. Four training cards — EMFCI / MMWU / WADI / Books & Resources
6. "Trusted by *global leaders*" (endorsements)
7. Pre-footer CTA — "Join the *movement*"

### about.html
1. Hero — "Mobilize. Equip. Energize."
2. Dr. Joshua Lingel bio + education + portrait
3. "See Joshua in action" (video gallery)
4. "Training initiatives worldwide" (photo gallery)
5. "We believe in *change*"
6. "Our core *values*" — Radical Discipleship / Biblical Missions / The Church / Consecration
7. "What leaders are saying about i2 Ministries" (endorsements)
8. "We affirm the *Lausanne Covenant*" (historic document section — sacred)
9. Pre-footer CTA — "Join the *movement*"

### mission.html (no H1 — opens directly into h2 section)
1. Hero stats — "Every nation needs to know the God of the Bible, the peace of God, and the truth of the Gospel" + 19,217 counter stat
2. "Why Muslims?" (section with 4+ sub-stats)
3. "Why people don't reach Muslims" (section with three forms of fear)
4. "Why the Church must be trained"
5. Seven major data blocks (scale, regional, people groups, gospel access, missionary gap, funding, urgency) — currently rendered as a wall of stat cards
6. "Join the *initiative*" pre-footer CTA

### get-trained.html
1. Hero — "Get *Trained*" + "Why Every Christian Must Be Trained"
2. Large embedded YouTube (WISE to Reach Muslims?)
3. "Trusted by some of the largest *Christian Organizations*"
4. Every Muslim for Christ Initiative stats (14, 2,000+, 10K+, 1,500+)
5. "Four ways to get equipped" — EMFCI / MMWU / WISE / WADI
6. "World-class *scholarship*, accessible anywhere" (20, 15, 250, 1,500 stats + large WADI video)
7. "Why *Muslims*?" block (dark urgency)
8. Training initiatives gallery
9. Pre-footer + "Ready to get *equipped*?"

### donate.html
1. Hero — "Because with God, *all things are possible*"
2. Two donation methods — Credit Card/Check + PayPal
3. "Current *funding progress*" — 3 funds: EMFCI 38% / WISE Global 20% / MMWU 30% (progress bars)
4. "Faithful *stewardship*" — 100% / Staff-Supported / Tax Deductible / Global Reach (four trust pillars)
5. Contact info block (PO Box + email)
6. "Where your *gifts go*" gallery
7. Free ebook CTA
8. Pre-footer — "Partner with the *mission*"

### donate-form.html
1. Hero — "Complete your *gift*"
2. Choose Your Gift — 6 preset amount chips ($10–$500) + 2 CTAs (GivingFuel + PayPal)
3. Available Funds — 13 designations (General + MMWU + Languages + 10 individual missionary names)
4. Trust icons — 100% / Tax Deductible / Questions?
5. Back link to `/donate`

### contact.html
1. Hero — "Contact *Us*"
2. Two-column: Send Us a Message (form with honeypot + math challenge) / Contact Details + Follow Our Work card
3. Free ebook CTA (Equip yourself with the *full picture*)

## Images inventory (29 files in `/images/`)

### Endorsers (8) — portrait format, square-ish
- `endorser-anfuso.png` — Pastor Francis Anfuso
- `endorser-botelho.png` — David Botelho
- `endorser-coleman.png` — Dr. Robert Coleman
- `endorser-craig.png` — Dr. William Lane Craig
- `endorser-licona.png` — Dr. Michael Licona
- `endorser-mcallister.png` — Stuart McAllister
- `endorser-mcdowell.png` — Dr. Josh McDowell
- `endorser-moreland.png` — Dr. JP Moreland

### Gallery (8) — "Training initiatives worldwide" photos
- `gallery-01.jpg` … `gallery-08.jpg`

### Hero / feature video thumbnails (6)
- `hero-video-thumb.jpg` — home hero poster
- `vid-brazil.jpg`
- `vid-gc-muslims.png`
- `vid-great-commission.jpg`
- `vid-korean.jpg`
- `vid-launching.jpg`
- `vid-why-care.jpg`

### Training pathway cards (4)
- `pathway-emfci.jpg` — Every Muslim for Christ Initiative
- `pathway-mmwu.jpg` — Mission Muslim World University
- `pathway-wadi.jpg` — WADI video training
- `pathway-wise.jpg` — WISE Global App

### Portraits
- `joshua-lingel.jpg` — about-page hero portrait

### PDF asset
- `i2-mega-strategy.pdf` — downloadable strategy doc (referenced, if at all, elsewhere)

## Repeating patterns across pages

These patterns recur and should be standardized into reusable components in `./styles/components.css` during Phase 2/3:

| Pattern | Appears on | Component name |
|---|---|---|
| Eyebrow label (small uppercase, tracked) | all | `.eyebrow` |
| Display numeral with label under | home, mission, get-trained, donate | `.display-num`, `.stat-card` |
| Big italic display headline | all (hero) | applied via heading hierarchy tokens |
| Gold accent CTA button | all | `.btn-primary` |
| Ghost outline button | home, contact | `.btn-secondary` |
| Outlined "Free Ebook" nav link | all | scoped to `.nav-ebook` |
| Endorsement quote card | home, about | `.endorsement-card`, `.quote-block` |
| Progress bar with percentage + label | donate | `.progress-bar` |
| Dark urgency block | home, get-trained, mission (partial) | `.section-dark` + `.urgency-block` |
| Cream-on-cream soft stat row | home, get-trained, donate-form | standardize padding via `.stat-row` |
| Photo gallery grid | about, get-trained, donate | `.photo-grid` |
| Pre-footer CTA band | all | `.pre-footer` |
| Nav + footer (currently copy-pasted per page) | all | Phase 3 rebuild, still inline-per-page (no partials — no build step) |

## Third-party embeds / external endpoints referenced

- YouTube iframes (home + get-trained)
- GivingFuel checkout link: `https://i2ministries.givingfuel.com/...`
- PayPal hosted button URL
- FormSubmit endpoint (contact)
- WhatsApp link `wa.link/wcuy7j`
- External domain links (preserved as outbound nav/footer links):
  - `https://www.i2ministries-emfci.com` ("The Initiative")
  - `https://www.mmwu.org/` (MMWU)
  - `https://thewadi.org` (WADI)
  - `https://resources.i2ministries.org` (Shopify store)
  - `https://linktree.com/wiseglobal` (WISE Global App)
  - `http://eepurl.com/Kurdj` (Free Ebook / Mailchimp signup)

## Local asset directories

- `/images/` — 29 files (see above)
- `/audit/before/` — 14 baseline screenshots (this capture)
- `/audit/baseline-lighthouse.md`, `baseline-findings.md`, `inventory.md`
- No `/styles/`, `/js/`, or `/public/` yet — created in Phase 2/5
