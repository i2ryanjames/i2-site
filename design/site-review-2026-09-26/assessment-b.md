# Independent Assessment B — automated design audit

Date: 2026-09-26. Target: i2 Ministries. No production source changed. Assessment A was not read.

## Method and scope

- Ran `npx --yes impeccable --json public` with Impeccable 3.5.0; exit 2 means findings, not a failed scan.
- Scope includes all 12 HTML pages and associated CSS. Ten HTML pages produced findings; cookie/privacy pages produced none. Raw output is `assessment-b-detector.json`.
- Independently inspected computed DOM styles on the live home, initiative, donate, training and about pages at 1440 × 1000 and 390 × 844. Used a new isolated browser tab, page 7, title prefixed `[Human]`.
- Saved computed evidence to `assessment-b-browser-desktop.json` and `assessment-b-browser-mobile.json`.
- Scrolled each page to trigger reveals and allowed four seconds to settle. No payments, forms, messages or third-party video consent were submitted.
- The installed CLI does not provide the skill's `impeccable live` command (`Unknown command: live`). No detector server was started, no overlays were injected, and no server needed cleanup. The `[Human]` tab contains the inspected website, not issue overlays.
- Computed contrast checks use solid foreground/background colors. They skip image/gradient backgrounds and are not a comprehensive WCAG audit. Raw geometry/image results require triage because clipped carousels, lazy images and collapsed panels can appear in DOM measurements.

## Raw deterministic findings

196 flags total: **189 non-advisory and 7 advisory**, not 196 confirmed defects. There are 189 flags attached to HTML files and 7 attached directly to CSS files; these are coincidentally the same counts and should not be conflated.

| Rule | Raw flags |
| --- | ---: |
| All-caps body | 57 |
| Layout-property animation | 40 |
| Side accent border | 16 |
| Overused font | 13 |
| Clipped overflow container | 10 |
| Dark glow | 10 |
| Cramped padding | 9 |
| Eyebrow above hero heading | 8 |
| Low contrast | 7 |
| Kicker above heading | 6 |
| Marketing buzzword | 5 |
| Broken image | 4 |
| Tight leading | 4 |
| Image hover transform (advisory) | 4 |
| Em-dash overuse (advisory) | 3 |

HTML totals: about 27; initiative 25; MMWU 24; donate 23; WISE Global 20; training 17; home 15; mission 13; donate form 13; contact 12. These are scanner signals for review, not a ranking of design quality.

## Confirmed priorities

### P1 — Two important conversion actions fail text contrast

1. Donate page, **Give by Card or Check**: white text on `#3b82f6`, 16px, measured **3.68:1**, below 4.5:1. The button is styled in `public/styles/polish.css:154`; the general darker-button override does not cover this selector.
2. About page, **Invite Joshua to Train Your Group**: white on WhatsApp green `#25d366`, 15px, measured **1.98:1**, below 4.5:1. Base styling is in `public/about.html:191`, with further styling in `public/styles/about.css:167`.

These affect exactly the donor and leader audiences the user prioritizes. Use the existing accessible blue `#1d4ed8` for the main action, or a verified darker green if WhatsApp identity is retained. Preserve the existing destination.

### P2 — Small blue text has incomplete contrast-token coverage

- Donate: the three `.funding-card-label` labels and three `.funding-card-cta` links are 14px blue on white, **3.68:1**. The labels/links are styled in `public/styles/donate.css:179` and `:253`.
- About: `.strategy-link`, `.bio-content .label`, and `.bio-credentials h3` are 14px blue on white, **3.68:1**.
- About mobile: `.vision` is approximately 19.5px normal-weight blue text on white, **3.68:1**; it needs 4.5:1 at this size. A color that passes as a desktop display headline does not automatically pass when reduced on mobile.
- About scripture references compute to **4.21:1** (`#6b7280` on `#f4efe3`). These are inside collapsible content; treat them as a component-state finding, not always-visible page text.

Extend the existing `--color-accent-text` use to actual text selectors, checking selector specificity. Keep the lighter brand blue for decorative/large uses. Raw JSON repeats nested arrow spans; count the surrounding action only once.

### P2 — Shared mobile footer privacy controls are under the project's target size

At 390px, footer **Cookie policy**, **Privacy notice**, and **Cookie settings** are each **37px high** on all five sampled pages. Increase these discrete controls to at least 44px. The inline Cookie policy link within the banner is about 20px high; inline text links have accessibility exceptions, so do not describe that as an automatic WCAG failure. The primary consent buttons and Manage settings already measure at least 44px.

Desktop navigation text links measure about 22px high and main nav buttons 42.4px, but mobile primary navigation/footer links have already been enlarged. Prioritize touch interactions before expanding every desktop element.

### P3 — Secondary paragraphs undercut the confirmed 16px body floor

Shared footer description is **14.4px**; consent explanatory copy is **15px** (`public/styles/consent.css:57`). About credentials are **15px**, and the calling attribution is **15.2px**. All these meet the 14px minimum, but not the agreed 16px body-text floor. Set prose to 16px and reserve 14px for short metadata and labels. Several funding captions are also 14px; decide whether they are metadata or explanatory body text rather than mechanically enlarging every label.

### P3 — Layout transitions remain in shared navigation/accordions

The detector's 40 layout-property animation flags include repeated `padding` transitions in navigation, `max-height/padding` transitions in accordions, and width animation for progress bars (`public/styles/components.css:364`). These are real CSS patterns, but their mere presence does not establish a performance defect. When refactoring, prefer transform/opacity, and grid-template-rows for accordion height. Preserve reduced-motion behavior. Do not spend the redesign budget on this ahead of audience routing, clearer hierarchy, or contrast.

## False positives and context-dependent flags

- **Fonts (13):** Instrument Serif and DM Sans are the user's confirmed brand choice. The detector's generic font blacklist does not override this. No font change recommended.
- **Static low contrast:** several raw flags refer to superseded brown/gold colors. Current computed styles are the source of truth; the real blue omissions listed above matter more. The WhatsApp contrast flag is real.
- **Broken images (4):** empty `#lightboxImg` placeholders are intentionally populated when a gallery opens. They are hidden, not broken page imagery. Computed scans also list unloaded lazy/hidden carousel images; none listed as unloaded was simultaneously shown as a visible image. Do not report these as broken visible assets without an actual failed request or open-state check.
- **Overflow (10):** all five pages had document width exactly 390 at mobile and 1440 at desktop. Negative-positioned skip links, clipped gallery strips and hero decoration produce raw rectangle flags without page-level horizontal scrolling.
- **Cramped padding (9):** progress-bar fills are supposed to touch the container. Lack of inset is not a defect for a track/fill visualization. Donation form content needs visual review before accepting that flag.
- **All caps (57):** the static detector frequently counts descendants of tracked labels/headings. Live sampling did not reproduce long uppercase prose on home, initiative, donate or training. About scripture references are uppercase within expandable content. Do not call 57 passages unreadable without checking actual rendered text.
- **Side border (16):** top stripes, decorative progress structures and true left callout rules are combined. A top edge is not the same design pattern as a left-stripe card. Review actual composition rather than treating every colored line as an independent problem.
- **Dark glow (10):** flags often cite old gold CSS and infer a dark page from inherited source. The deployed pages are largely white. Some decorative glows remain real aesthetic choices; ask the visual assessment whether they help the ministry story.
- **Eyebrow/kicker flags (14 combined):** short section labels can aid wayfinding. The repetition across nearly every section may make the page feel templated, but existence alone is not a failure.
- **Em dashes/image hover:** advisory only. Sacred quotations/content must not be rewritten solely to satisfy a style detector.

## Positive verification

- No horizontal page overflow at 390px or 1440px on the five sampled public pages.
- No visible non-decorative text below 14px was found. The 0px funding-fill labels are intentionally hidden and duplicated by nearby visible values.
- Main mobile navigation toggle, main footer links, and consent decision buttons meet the 44px touch target goal.
- Home, initiative and training produced no confirmed solid-background contrast failures in the sampled rendered states. This does not cover gradients, image overlays, hover/focus, expanded dialogs or every scroll-animation state.

## Implication for the planned quiz

Carry forward the accessible blue text token, 16px copy, 44px options and the existing consent controls. A quiz should not add a second simultaneous modal on top of cookie choices or the current ebook prompt. Its routing can be useful, but it needs an obvious close/skip, a clear current step, and an easy route back. Automated findings do not establish what ministry-specific routing should be; that comes from the separate ministry-model review.
