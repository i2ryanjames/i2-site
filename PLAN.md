# i2 Site Security and Cookie Consent Plan

**Status:** Code implemented on `security-cookie-hardening` and verified in a protected Vercel preview. Production release awaits contact service credentials and organization review of policy wording. Domain DNS has not changed.

**Target:** The static Vercel project served at `https://i2-site.vercel.app`. The current `i2ministries.org` WordPress site is a separate installation and is outside this plan until the domain moves to Vercel.

## Current state

- HTTPS and HSTS work on the Vercel site. The repository secret scan found no matches.
- `contact.html` sends directly from the browser to FormSubmit. Its time gate, math question, and honeypots are browser checks, and the request sets `_captcha: 'false'`.
- `vercel.json` has image caching rules but no security headers. The live pages lack CSP, framing protection, `X-Content-Type-Options`, and an explicit `Referrer-Policy`.
- Internal files such as `CLAUDE.md`, `DESIGN-DECISIONS.md`, `audit/*.py`, and `download-images.sh` are publicly served from the current static output.
- Ten pages load GSAP and ScrollTrigger from jsDelivr without integrity checks. Pages also load Google Fonts directly.
- There is no analytics or advertising tag in the reviewed source. The site uses `sessionStorage` to remember ebook popup dismissal. `get-trained.html` loads a YouTube iframe directly; other videos create YouTube or Vimeo iframes after a click. Several video thumbnails load from `img.youtube.com` before any click.
- Donations leave this site for GivingFuel or PayPal. Card details are not collected by the Vercel pages.

## 1. Protect the contact form

1. Replace the direct FormSubmit browser request in `contact.html` with `POST /api/contact` on the same origin. Keep the site plain HTML/CSS/JS; a single Vercel Function can handle this route without a frontend framework.
2. Verify a Cloudflare Turnstile token **inside the function** on every submission. Check the expected hostname and action, and reject expired, reused, or failed tokens. Keep the secret key only in Vercel environment variables. Browser-side verification alone does not protect the endpoint.
3. Validate and bound the name, email, subject, and message on the server. Use a fixed recipient, a controlled subject prefix, request size limits, timeouts, and generic error responses. Never interpolate user input into mail headers without validation.
4. Send email through a server-side mail provider API. Select and configure the provider during implementation; verify its sending domain without replacing the existing Google/Mailchimp mail records. Add shared rate limiting through Vercel WAF or a persistent rate-limit store. Do not rely on an in-memory counter in a function.
5. Remove the public FormSubmit call and `_captcha: 'false'`. Check whether the old FormSubmit destination can be deactivated; the previously published endpoint may remain known to bots after the page changes.

**Done when:** direct requests without a valid Turnstile token fail, repeated submissions are limited, normal contact messages arrive once, and no provider credential is present in HTML, JavaScript, or Git.

## 2. Serve only public site files

1. Move the ten HTML pages, `images/`, browser `js/`, browser `styles/`, favicon, `robots.txt`, and `sitemap.xml` into a `public/` directory. Leave notes, audits, Python/shell scripts, and `vercel.json` outside it. Keep the existing URL rewrites.
2. Set `outputDirectory` to `public` in `vercel.json` and verify the project remains configured as Vercel's **Other** framework with no frontend build step. Keep any `/api` function source outside `public/`.
3. On a preview deployment, verify every page and asset returns correctly while `/CLAUDE.md`, `/audit/phase5-apply.py`, `/download-images.sh`, and `/undefined/...` return 404. Check the sitemap and all ten rewrites.

**Done when:** only intended public assets are served from the deployment. Vercel documents `outputDirectory` as the directory whose contents are served statically.

## 3. Add browser security protections

1. Self-host the fixed-version GSAP/ScrollTrigger files, font files, and video thumbnails where licensing permits. If any script stays on a CDN, pin it and add Subresource Integrity with `crossorigin="anonymous"`.
2. Add `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and framing protection (`Content-Security-Policy: frame-ancestors 'none'`, with `X-Frame-Options: DENY` for older browsers) through `vercel.json`. Preserve Vercel's HTTPS/HSTS behavior.
3. Build a CSP around the actual resources: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, restricted `connect-src` for contact protection, and `frame-src` for videos only when they are enabled. Move inline JavaScript and `onclick` handlers into local files so `script-src` need not allow arbitrary inline scripts. Existing inline CSS may require a separate style policy decision.
4. Start CSP in report-only mode on a preview, inspect violations on all ten pages and form/video flows, then enforce it. Avoid a broad `*` or `unsafe-inline` script policy that provides little protection.

**Done when:** representative HTML, JavaScript, and image responses have the intended headers; all site functions work under enforced CSP; no unapproved external script executes.

## 4. Add truthful cookie and media consent

1. Recheck cookies, local/session storage, and network requests in a clean browser profile on every page. Include Vercel, FormSubmit or its replacement, Turnstile, fonts, GSAP CDN, YouTube, Vimeo, GivingFuel, and PayPal in the inventory. Do not claim the site uses analytics or advertising cookies unless those tools are actually added.
2. Add a small, accessible banner on first visit with equally clear **Reject optional**, **Allow videos**, and **Manage settings** actions. The optional category initially covers embedded YouTube/Vimeo media. Do not load optional embeds, remote video thumbnails, or video preconnects before consent. A visitor who rejects can still use the rest of the site.
3. Replace the direct iframe in `get-trained.html` with a local poster and a clear play/consent action. Apply the same behavior to the dynamically created video iframes on other pages. Offer an explicit per-video load choice for a visitor who has not enabled videos site-wide.
4. Add shared `js/consent.js` and `styles/consent.css` to the ten pages. Store only the consent decision, policy version, and timestamp in first-party storage after a choice. Provide a persistent **Cookie settings** footer link so the choice can be changed. Review the existing ebook-dismissal `sessionStorage` entry: either remove its persistence before consent or disclose and classify it accurately.
5. Add `/cookie-policy` with a plain-language inventory: what the site stores, purpose, provider, approximate duration, how to change consent, embedded media behavior, and links to provider policies. Add a privacy notice or linked section covering contact messages and the GivingFuel/PayPal handoff. Have the organization review final policy wording and contact details before publication.
6. Make the banner and settings dialog keyboard accessible, with visible focus, clear labels, focus return, and mobile layout. The banner must not block the essential site or treat closing it as consent.

**Done when:** a fresh visitor can reject optional media as easily as allow it; rejected visitors have no YouTube/Vimeo requests or embeds; allowed visitors can play videos; the choice persists and can be withdrawn; the policy matches the observed behavior.

## Release sequence and checks

1. Implement the public-directory move and headers in a preview deployment, then check routes and exposed files.
2. Implement the protected contact endpoint and test success, invalid token, duplicate token, large input, rate limit, and provider failure without sending test spam to the real inbox.
3. Implement consent, media gating, and the policy; test fresh, reject, allow, change-choice, and storage-disabled browser states on desktop and mobile.
4. Run the secret scan again, inspect the browser network/storage before and after consent, and verify CSP violations and security headers. Test GivingFuel and PayPal handoff without making a payment.
5. Review the final policy text and mail-provider/domain settings, then deploy the reviewed commit. Recheck the production Vercel URL. The `i2ministries.org` DNS cutover is a separate step and should preserve existing email records.

## Implementation dependencies

- A Turnstile site key and secret key for the Vercel hostname and eventual custom domain.
- A transactional email service or existing server-side mail API, with its sending-domain records and credentials.
- A shared rate-limit service or suitable Vercel WAF rule.
- Organizational review of the cookie/privacy wording and the address for privacy inquiries.

## References

- [Vercel static output directory](https://vercel.com/docs/builds/configure-a-build)
- [Vercel `vercel.json` headers and output directory](https://vercel.com/docs/project-configuration/vercel-json)
- [Cloudflare Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [OWASP HTTP security headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [MDN Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/SRI)
- [ICO: cookies and other storage technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/)
- [EDPB: reject and accept choices](https://www.edpb.europa.eu/system/files/2023-12/edpb_letter_out20230098_feedback_on_cookie_pledge_draft_principles_en.pdf)
