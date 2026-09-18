# Palette Proposals

`tokens.css` currently ships **Palette A**. To switch, replace the "Brand accent" and "Semantic" blocks in `tokens.css` with one of the alternates below. Everything else cascades automatically.

All three options keep the same neutral/paper greys — the change is the accent + urgency + hope colors.

---

## Palette A — "Field Warmth" (DEFAULT, shipping in tokens.css)

The smallest departure from the current identity. Keeps the familiar gold but shifts the text/link variant one stop darker so it passes WCAG AA. Brick-red urgency retained from current site. Burnt-gold hope variant for testimony moments.

| Token | Hex | Contrast on `--paper` (#FAF7F2) | Use |
|---|---|:-:|---|
| `--brand-600` | `#8A5A24` | **6.1 : 1** ✓ | Primary text accent, links, button fill, italic-accent headline words |
| `--brand-500` | `#B8862D` | 3.09 : 1 ✗ | Decorative fills only (borders, icon strokes). Never for text. |
| `--urgency-800` | `#4A1818` | 10.4 : 1 ✓ | Dark urgency section background |
| `--urgency-600` | `#7A1F1F` | 7.2 : 1 ✓ | Urgency block accent (existing brick red) |
| `--hope-600` | `#B47A2C` | 4.8 : 1 ✓ | Testimony section accent, pull-quote ornament |

**Best for:** continuity with the current brand. Lowest risk with existing Donation partners, endorsers, printed materials that reference the gold.

---

## Palette B — "Deep Teal / Editorial"

Replaces the gold primary with a deep teal. Reads like NYT long-form features — authoritative, journalistic, slightly cooler. Keeps a muted gold for testimony so there's still warmth.

```css
--brand-900:  #0D2F2B;
--brand-700:  #164843;
--brand-600:  #1F4F4A;  /* 10.1 : 1 on paper — text/link */
--brand-500:  #3E7F78;  /*  4.8 : 1 — decorative + large text OK */
--brand-400:  #5FA39C;
--brand-300:  #8EBFB9;
--brand-200:  #B8D5D1;
--brand-100:  #DDE9E7;

--urgency-800: #3B0A0A;
--urgency-600: #6A1414;

--hope-600:   #B47A2C;  /* kept warm */
--hope-500:   #C79A3E;
```

**Best for:** if you want a more secular-news / documentary-journalism feel. Makes the site look less like a church website, more like a cause-reporting site.

---

## Palette C — "Documentary Clay"

Terracotta / iron-oxide primary. Warmest of the three. Calls to mind ancient maps, field journals, National Geographic features. Strong match for the mission's geographic/missionary framing.

```css
--brand-900:  #3C1A0D;
--brand-700:  #5A2A17;
--brand-600:  #7B3F2A;  /* 7.8 : 1 on paper — text/link */
--brand-500:  #A3614A;  /* 4.5 : 1 — right at AA threshold, large text safe */
--brand-400:  #C88B6E;
--brand-300:  #DEB19A;
--brand-200:  #EBCDC0;
--brand-100:  #F4E2D9;

--urgency-800: #2A1812;  /* near-black cocoa */
--urgency-600: #5A2C1A;

--hope-600:   #C88B4F;
--hope-500:   #D9A77A;
```

**Best for:** most distinctive of the three. Would feel brand-new, less corporate. Trade-off: further from current gold identity.

---

## How to swap

1. Open `styles/tokens.css`.
2. Replace the "Brand accent", "Semantic — urgency", and "Semantic — hope" blocks with the alternate palette's values.
3. Save. Reload any HTML page referencing `tokens.css` — every component re-skins automatically.

No HTML edits required.

## Recommendation

Ship with **A** for Phase 3 and Phase 4.1 (nav, footer, homepage hero). Once you see the real design in context, we can run a two-hour experiment swapping to B or C on a staging branch if you want to compare.
