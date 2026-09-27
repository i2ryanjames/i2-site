# Independent design assessment A — i2 Ministries

2026-09-26. Assessment A completed independently of the automated assessment. No production files changed.

## Scope and evidence

Inspected the live homepage, `/the-initiative`, `/the-mission`, `/donate`, and `/get-trained` at 1440 × 1000 and 390 × 844 in a separate browser context/tab titled `[LLM]`. Read their source, navigation, consent, modal, contact-form and counter scripts; inspected the donation handoff source. Screenshot evidence is in `assessment-a/`. The full mission capture was taken after instant scrolling through every section and waiting for reveals; all 35 reveal elements were visible. No donation or message was submitted, and no third-party payment flow was exercised.

This is a design and usability review, not a legal, financial, or full accessibility certification. Scores for form recovery are based on source inspection rather than live submissions.

## Main judgment

The largest opportunity is to show the ministry's multiplication model clearly and give its two highest-value audiences an immediate route. The current site reads primarily as a training-resource catalogue. Its distinctive proposition is institutional: i2 equips denominational leadership, helps establish national/regional/local launches, supports reproducible training, develops leaders, and supplies coordination and evaluation. Donors fund that system. This should determine the homepage, navigation and quiz hierarchy.

The current mobile counter is now readable. At 390px the number sits above a two-line caption with strong dark-background contrast; another image replacement will have less impact than fixing the surrounding journey.

## AI-pattern verdict

**Partly generic, with a salvageable identity.** Instrument Serif plus DM Sans, the established blue palette and official logo make a recognizable foundation. However, the gridded/glowing homepage background, miniature mosque/map-pin backpacker video artwork, cartoon training-video thumbnail, rounded shadowed payment cards, repeated centered eyebrow/headline blocks, and long sequences of oversized blue statistics make parts of the site feel assembled from familiar generated landing-page patterns.

The anonymous crowd treatment is more coherent with the urgent subject. Its dark gradient serves legibility rather than decoration. Keep the typography and blue identity; replace the decorative sameness with a clearer editorial rhythm, genuine ministry evidence and a visible explanation of how denominations multiply the work. Do not fabricate field documentary imagery or present generated imagery as proof of an actual event.

## What is working

1. **Strong, consistent typographic identity.** The serif display voice and restrained blue emphasis are recognizable; homepage mobile body copy is 18px and heading 40px. The current narrow-screen layout is comfortable to read.
2. **Substantial underlying evidence.** EMFCI's Ghana/Tanzania/Central America examples, named endorsements, funding scope and stewardship explanation give the ministry a much stronger case than the first screen communicates.
3. **Sound recent UI improvements.** No horizontal overflow in the five sampled 390px entry views. The mission overlay caption now stacks correctly. Cookie choices are plain-language and visually balanced, and video consent is separated from basic navigation.

## Nielsen heuristic assessment

| Heuristic | Score / 4 | Evidence |
|---|---:|---|
| Visibility of system status | 2 | Live sampled navigation has no `aria-current`; menu open state is not exposed. Contact source does expose loading, sending and verification status. |
| Match with the real world | 2 | Purpose is understandable, but EMFCI/MMWU/WISE form the information architecture before newcomers know their roles. “Get Trained” includes an institutional mobilization framework and a management app. |
| User control and freedom | 2 | Navigation, cookie rejection and ebook Escape dismissal exist. The timed ebook interrupts browsing; its source has no focus trap, focus restoration or dialog semantics. |
| Consistency and standards | 3 | Fonts, palette and CTA treatment mostly align. Initiative navigation omits the ebook item; donation flow repeats a choice; some component colors bypass the accessible action blue. |
| Error prevention | 3 | Contact validates required fields and email, retains input on errors and gates verification. Payment completion was outside the review, so no perfect score. |
| Recognition rather than recall | 2 | Readers must map their role to product names; the network leadership route is nested beneath training and WISE appears as a peer training choice. |
| Flexibility and efficiency | 2 | Direct Donate and training links exist, but ready donors repeat method selection and mobile mission readers scroll a long way to an in-content action. |
| Aesthetic and minimalist design | 2 | Local sections are legible, but repeated statistics, urgency arguments, ebook prompts and centered headings reduce the clarity of the overall story. |
| Error recovery | 3 | Contact source has actionable verification/status messages and email fallback without clearing entries. Field-level error identification could improve. |
| Help and documentation | 2 | Rich explanations and Contact are available, but guidance is organized by offerings rather than visitor task. No concise “what happens next” for a denominational leader. |
| **Total** | **23 / 40** | **Acceptable foundation; significant journey and hierarchy improvements needed.** |

## Cognitive load

**4 of 8 failed: high load under the critique checklist.** This is a site-level routing finding, not a claim that every individual screen is cluttered.

| Check | Result | Reason |
|---|---|---|
| Single focus | Fail | Training, launch, giving and repeated ebook acquisition compete before the visitor's intent is known. |
| Chunking | Pass | Many content/stat groups are sensibly separated, with manageable local groups. |
| Grouping | Pass | Related text and actions are visually associated. |
| Visual hierarchy | Fail | Section typography is clear, but the most important audience paths do not dominate the initial story. |
| One thing at a time | Fail | Ebook popup can interrupt the current task after 20 seconds once a cookie decision exists. |
| Minimal choices | Fail | Desktop header has six top-level actions; Get Trained exposes five submenu choices; homepage training offers five destinations. |
| Working memory | Pass | Ordinary page navigation does not require users to memorize form data or hidden commands. |
| Progressive disclosure | Pass | Accordions and cookie settings reveal detail on demand, though the core model should not be entirely hidden in accordions. |

## Priority issues

### P1 — The highest-leverage audiences lack clear first-class paths

**Evidence:** Homepage nav places The Initiative under Get Trained. Hero offers “Launch the Initiative” and “Get Trained,” with giving only in the nav. Its featured training module is MMWU. Get Trained presents EMFCI, MMWU, WISE and WADI as four equivalent training options even though they serve different levels of the model.

**Why:** A denominational leader needs to recognize an institutional partnership opportunity immediately. A donor needs to see the leverage of funding national leadership and reproducible training. Neither should decode an acronym catalogue.

**Fix:** Make network mobilization and mission funding explicit paths. Explain the relationship of EMFCI, training, MMWU and WISE with one compact sequence. Make the quiz ask about the visitor's goal, then recommend an appropriate destination and next action. Keep individual training available as a secondary path. Suggested skills: `/shape`, `/clarify`, `/layout`.

### P1 — Critical explanations and next actions appear too late

**Evidence at 390px:** Get Trained's “Four ways to get equipped” begins around y1,950; EMFCI's “How we reach every Muslim” around y2,612; its major-gift Contact action around y7,670. The mission page is about 17,737px tall and its first in-content CTA appears around y15,574. Global navigation remains available, but mobile readers must reopen it.

**Why:** The site repeatedly establishes urgency before offering a clear plan. This costs attention and hides the strongest proof from the people making consequential partnership decisions.

**Fix:** Homepage sequence: concise mission/role entry → how multiplication works → one documented field result → broader opportunity → differentiated network/donor next steps. On mission, add “See the plan” near the urgency panel and progressively disclose the statistics library. Move training choice before optional video/long proof sections. Suggested skills: `/distill`, `/layout`.

### P1 — The donor flow repeats a decision and weakens financial clarity

**Evidence:** `/donate` “Give by Card or Check” opens `/donate-form`, which again asks Card/Check versus PayPal before the GivingFuel handoff. “Current funding progress” combines a country-launch completion count (50 of 130), an app funding amount, and scholarship counts, without visible as-of dates in the module.

**Why:** A ready giver should not repeat method selection. A major donor needs to distinguish completed rollout, actual funding received and the current funding opportunity.

**Fix:** Offer one giving handoff with the existing legal/stewardship reassurance nearby. Provide a secondary major-gift conversation route next to the opportunity, not far below it. Label progress measures accurately, retain approved figures, and add dates/source methodology once verified. Suggested skills: `/clarify`, `/distill`.

### P1 — Small interaction/accessibility gaps will compound if another popup is added

**Evidence:** The live donate primary button computes to white on `rgb(59,130,246)`, 16px/600: approximately **3.68:1**, below 4.5:1 for that text. Menu toggle has no `aria-expanded` or `aria-controls`. Initiative accordion script only changes classes. Existing ebook modal has no dialog semantics or focus management.

**Why:** Key actions should be usable for older visitors, low-vision users and keyboard/screen-reader users. Adding a quiz without resolving modal ownership can create overlapping prompts or lose focus.

**Fix:** Use accessible action blue (`#1d4ed8`) for normal-size white button text; expose menu/accordion state. Replace the homepage's automatic ebook prompt with the quiz instead of stacking them. Give quiz a named dialog, proper initial focus/trap/restore, Escape/close/back controls, a visible skip action and session persistence. Show only after any active consent interaction finishes. Suggested skills: `/audit`, `/adapt`, `/polish`.

### P2 — The emotional arc relies on urgency more than demonstrated possibility

**Evidence:** The mission entry is a large updating death count; it repeats several need/statistics sections before any in-content response. The count is calculated from 38,000/day and the visitor's local midnight (`mission-1.js`), not live reported deaths. The attractive anonymous crowd is a generated illustration. Field outcomes and multiplication proof live elsewhere/lower down.

**Why:** The counter creates the strongest emotional moment, but the concrete response is distant. Apparent real-time precision can reduce trust for a skeptical donor unless its estimated nature is clear.

**Fix:** Keep the sober anonymous crowd direction; pair urgency with an immediate, hopeful response. Add an honest “estimated today” explanation/methodology without changing the approved rate. Label generated imagery appropriately and use genuine documented ministry evidence for impact claims. Make a documented field result and the next feasible action the positive peak/end. Suggested skills: `/clarify`, `/layout`, `/typeset`.

## Persona flags

- **Jordan, first-time visitor:** “Get Trained” contains both an app and a country-scale initiative. The visitor needs to understand program names before selecting a path. A goal-based quiz can remove this translation work.
- **Casey, distracted mobile visitor:** The current mobile type is readable, but finding the mission's next action can require roughly eighteen screens of reading. The training choice is below video, logo proof and statistics. A short early route is more valuable than another animation.
- **Denominational/network leader:** “Launch the Initiative” from the homepage leads to a general page where donating is primary. “Launch EMFCI in Your Country” then goes to `https://www.i2ministries-emfci.com/`. Verify that external pathway and its expectations before routing the quiz. Describe the partnership sequence and leader responsibilities clearly.
- **Strategic donor:** The proof of multiplication is strong but separated from giving. Distinguish financial opportunity from historical rollout, preserve accurate stewardship language, and give a visible major-gift conversation option. Avoid unverified accreditations, promises or impact-per-dollar claims in mockups.

## Quiz recommendation

Use a concise audience-routing flow, not a personality test or a form disguised as a quiz. No email gate is needed to send people to the right page.

First question, four clear goals:

1. Mobilize a denomination or church network.
2. Fund the mission.
3. Equip my church or ministry team.
4. Grow in my own training.

Ask one follow-up only where it changes the destination. Network: explore the model versus discuss launching. Donor: understand giving opportunities versus ready to give versus major-gift discussion. Individual: free foundational learning versus advanced study. Show a short personalized explanation, one dominant next action, and a quieter alternative. Retain a “Just browsing” exit and an easy way to reopen. A role choice should never imply a donation, application, email subscription or external contact submission.

## Questions that would improve implementation

1. Is the external EMFCI site the intended official launch intake for network leaders, or should strategic relationships start with the i2 team through Contact?
2. For donors considering a country-scale launch, should the principal next step be a funding brief followed by Contact, or a direct major-gift discussion?

These are concrete routing decisions. The user's stated audience priorities already resolve the broader question of which journeys should receive visual emphasis.
