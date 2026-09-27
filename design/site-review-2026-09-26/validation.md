# Quiz and design review validation

Production quiz commit: `d4c59db` — Vercel reported deployment complete. The deployed homepage includes `pathfinder.js` and no longer loads the timed homepage ebook script.

## Tests

- `node --test tests/*.test.mjs`: 12/12 passed. Includes existing contact security tests, static-asset/security checks, and new allowlisted contact-topic tests.
- JavaScript syntax and `git diff --check` passed.
- Browser tests exercised all 14 role/intent combinations against explicit expected destinations, plus Back to question2 and Back to question1.
- Confirmed automatic quiz stays closed before a privacy choice and opens after Reject optional while video consent remains false.
- Confirmed Escape closes it, restores focus, unlocks scrolling and saves the session dismissal. Reload does not reopen it automatically.
- Confirmed visible buttons/links meet44px height in sampled quiz states; keyboard Tab remains inside the dialog.
- Confirmed result layouts fit390px,484px,720px landscape and1440px desktop. A320px emulation exposed an existing homepage nav/stat layout overflow that expands the layout viewport to332px; the quiz fits that viewport, but this is not a clean320px whole-page pass. Record that existing narrow-screen issue for the broader responsive pass.
- No third-party requests from the quiz during local browser testing.
- Production browser: rejected optional videos, observed the automatic quiz, selected network leader → explore launch, and followed the actual result link to Contact with the initiative topic.
- No contact message, payment, application or newsletter subscription was submitted.

## Destination checks

- The existing official EMFCI agreement/intake and existing giving-method page returned200.
- WADI returned403 to a scripted HTTP request but loaded normally in the browser, showing the expected training/language content. The existing official destination is retained.
- Contact topic prefilling uses a fixed map, does not insert arbitrary query text, leaves the visitor's message empty, and retains the existing Turnstile/server validation.

## Mockups

- Four visual studies created in Google Stitch; two homepage directions and desktop/mobile quiz views.
- Initial homepage drafts invented institutional/accreditation claims. They were rejected and corrected with exact approved copy. Initial draft history remains in Stitch; reviewed local exports are the delivery versions.
- Reviewed exports replace Stitch image placeholders with the existing logo and approved anonymous illustrative crowd assets. They use local Instrument Serif/DM Sans fonts and frozen CSS with no Tailwind runtime/CDN dependency.
- Existing pages' reported statistics remain attributed to i2. This audit did not independently validate fundraising balances or ministry outcomes.

See `quiz-qa.json` for detailed browser results, `assessment-a.md` and `assessment-b.md` for independent review evidence, and `review.html` for the visual comparison.
