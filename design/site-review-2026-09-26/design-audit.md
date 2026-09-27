# i2 Ministries design review

September 26, 2026. Independent visual review plus deterministic detection and browser checks, synthesized around the user's priorities: denominational/network leaders and donors. Full evidence is in `assessment-a.md`, `assessment-b.md`, their screenshots and JSON results.

## Main recommendation

Make the multiplication model the central story: **partner with leaders → equip trainers → activate churches**. Then give network leaders and donors clear next steps. The typography and blue identity are worth keeping; page order and audience routing need more work than the latest counter image.

Some current sections look generic: repeated centered headings, decorative grid/glow, cartoon thumbnails and repeated metric panels. The useful alternative is an editorial composition with a concise model, a real reported ministry outcome, and purposeful anonymous imagery. Generated imagery must not be presented as documentary evidence.

The scanner produced 196 flags, not 196 confirmed defects. Many refer to overridden CSS, hidden lightbox images, intentional cropping and the user's chosen fonts. Computed browser evidence confirmed the contrast and target-size gaps below. The detector's live overlay command is unavailable in this installed version; no overlays are claimed.

## Design health

These are qualitative usability scores, not a compliance certificate. The original site scored **23/40**. The quiz has since addressed part of the routing/modal issue; the full site has not been rescored.

| Heuristic | /4 | Key finding |
|---|---:|---|
| System status | 2 | Menu/current-page state needs clearer semantics |
| Match to visitors' expectations | 2 | Program names obscure audience goals |
| Control and freedom | 2 | Existing timed ebook interrupts browsing |
| Consistency | 3 | Strong brand; some actions bypass contrast tokens |
| Error prevention | 3 | Contact validation and verification exist |
| Recognition over recall | 2 | Visitors must decode EMFCI/MMWU/WISE |
| Efficiency | 2 | Repeated giving choice and long routes to action |
| Minimalist design | 2 | Repeated urgency, metrics and ebook sections |
| Error recovery | 3 | Contact preserves input and offers a fallback |
| Help and guidance | 2 | Abundant information, limited role-based guidance |
| **Total** | **23/40** | **Usable foundation; improve hierarchy and journeys** |

Site-level cognitive checklist: 4/8 failures, chiefly competing priorities and delayed routing. Current mobile type, cookie choices and stacked counter are working well. Five representative pages had no horizontal overflow at390px or1440px.

## Priorities

| Priority | Finding and effect | Concrete change |
|---|---|---|
| P1 | Network leadership is nested under Get Trained; donors must infer the multiplying model | Promote Church leaders and giving paths; explain Partner / Equip / Activate; add the optional two-question quiz |
| P1 | Mission's first in-content CTA is about15,574px down at390px; its page is about17,737px tall | Put See the plan beside the urgency message; condense repeated arguments and progressively disclose evidence |
| P1 | Giving asks for a payment-method choice twice; major-gift conversation is late | One clear provider handoff, visible stewardship, and a nearby major-gift conversation link |
| P1 | White text on donate blue measures3.68:1; Joshua's green invitation1.98:1 | Use accessible action blue#1d4ed8 or a verified darker green; add menu/accordion state semantics |
| P2 | Some14px blue links are3.68:1; privacy footer controls37px; some prose14.4–15px | Extend text contrast tokens; raise discrete touch targets to44px and prose to16px |
| P2 | Urgency is stronger than the demonstrated response; counter appears precisely live | Pair the counter with a hopeful next action; propose “estimated today” and a methodology note without changing approved rates |
| P2 | “Funding progress” mixes rollout counts and financial balances | Distinguish launched countries, scholarship status and actual funding, with verified dates/sources before changing figures |

## Audience checks

- **Network leader:** show how leadership adoption becomes trainer development, church activation and ongoing coordination. Separate an exploratory discussion from the formal ministry agreement.
- **Strategic donor:** connect funding to the system and show stewardship near giving. Avoid invented impact-per-dollar claims, accreditations or donation designations.
- **First-time visitor:** explain the model before presenting acronyms as destinations.
- **Distracted mobile visitor:** give an early route and short questions, readable stacked results, and a clear skip. Do not stack the quiz with an ebook or active privacy prompt.

## Design directions

**A — Mobilize the Church (recommended):** bright editorial homepage; a strong leader-focused headline; anonymous illustrative crowd; connected three-step model; navy Tanzania evidence section; distinct network and donor invitations. Best fit for communicating the partnership model.

**B — The Global Mission:** a broad cinematic crowd hero with restrained dark overlay; immediate leader/donor actions; the same clear model below; donor opportunity as a contrasting final section. Stronger visual drama, with extra care needed for mobile crops and overlay contrast.

**Quiz desktop + mobile:** a quiet white dialog, four role choices, one relevant follow-up, and a clear recommendation. No imagery is needed inside the quiz; the result should remain readable at small widths.

Stitch's initial drafts invented accreditation/governance language. Those drafts are rejected. Reviewed exports use corrected copy, the existing logo and approved illustrative assets. Their labels identify any local export refinements. The working quiz uses the original website's real destinations, independent of illustrative links in the mockups.

## Implementation order

1. `/clarify`: introduce the model and role-based next steps; deliver quiz routing.
2. `/layout` and `/distill`: reorder homepage/mission/training content around that model.
3. `/audit` and `/adapt`: address measured contrast, interaction semantics and mobile targets.
4. `/polish`: refine imagery, spacing, type wraps and responsive consistency.

The quiz is implemented as a separate change. The broader homepage/mission redesign remains a proposal for visual review.
