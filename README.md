# i2 Ministries website

Static HTML, CSS, and JavaScript deployed on Vercel. Public files live in `public/`; the contact form runs in `api/contact.mjs`. Vercel must use the **Other** framework with `public` as its output directory (set in `vercel.json`). Internal notes, audits, and utility scripts stay outside `public/`.

## Local checks

```bash
node --test tests/*.test.mjs
python3 -m http.server 8000 --directory public
```

Open `http://localhost:8000`. The static server does not provide the clean URL rewrites or `/api/contact`; use a Vercel preview to test those.

For the homepage quiz and ebook preview, run `python3 scripts/serve-preview.py` and open `http://127.0.0.1:8789`. This local server supports the site's clean page URLs and security headers. It serves only `public/` and does not send contact messages; the Contact page uses its existing email fallback locally.

To open the quiz immediately for review, use `http://127.0.0.1:8789/?quiz=1`. This explicit invitation works even after you dismissed it earlier and does not change your cookie choice. On the ordinary homepage, the quiz appears five seconds after the page loads (it does not wait for a cookie choice); it retries after temporary interactions and stays dismissed for the session when closed.

The homepage guide has four audience paths (five or six core questions, with two optional planning details for network conversations), a ready-to-give shortcut, and 14 recommendations to existing pages. It can be closed, reopened, or navigated backward. Answers stay in page memory; visitors can optionally copy them before opening Contact. The automatic invitation waits until after a privacy choice and stays closed for the session after dismissal or completion.

Ebook popups are replaced by a slim inline banner on Home, About, The Mission, Get Trained, MMWU, The Initiative, WISE Global, and Contact. Each banner sits after the relevant content; Contact places it below the form. Donate, Donate Form, and the legal pages have no ebook banner. Shared styling lives in `public/styles/ebook.css`; these static links need no JavaScript or browser storage. Add `#free-ebook` to a page URL to review its banner directly.

## Contact form setup

The contact form fails closed until all required server-side variables are set in the Vercel project for the relevant environment:

| Variable | Value |
| --- | --- |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile public site key |
| `TURNSTILE_SECRET_KEY` | Matching server secret |
| `RESEND_API_KEY` | Resend API key with sending permission |
| `CONTACT_FROM_EMAIL` | Sender at a verified Resend domain, e.g. `Website <website@send.i2ministries.org>` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `RATE_LIMIT_SALT` | Random secret, at least 32 bytes; generate with `openssl rand -hex 32` |

Optional: `CONTACT_TO_EMAIL` defaults to `info@i2ministries.org`. Every successful form email also CCs `ryan@i2ministries.org`. `TURNSTILE_ALLOWED_HOSTS` is a comma-separated list of additional preview hostnames. Add the production Vercel hostname and eventual custom domain to the Turnstile widget's allowed domains. Never use Cloudflare's test keys in production.

Production uses the `i2 Form` Turnstile widget; `i2-site.vercel.app` was verified live. Check that `i2ministries.org` is also allowed before the custom-domain cutover. The form currently shares SOH's Resend sending key and Upstash Redis service. The verified sender is `Spirit of Health <hello@mail.spiritofhealthkc.com>`; messages still go to `info@i2ministries.org`. To use an i2-branded sender later, verify a dedicated sending subdomain in Resend and update `CONTACT_FROM_EMAIL`. Add only the DNS records Resend specifies for that subdomain, preserving existing Google Workspace, Mailchimp, and other mail records. Never commit keys or create `NEXT_PUBLIC_` versions of the server secrets. Redeploy after changing Vercel environment variables.

The endpoint validates form content, checks Turnstile on the server, limits repeated submissions in Upstash, and sends mail to the fixed recipient. A `503` from `GET /api/contact` means the environment is incomplete. After setup, verify an ordinary message through the preview without sending repeated test mail to the organization.

## Security and consent

- `vercel.json` enforces a Content Security Policy, framing protection, MIME sniffing protection, and a referrer policy.
- Fonts, GSAP, and video thumbnails are served locally. YouTube and Vimeo players load only after the visitor allows videos or chooses **Play once**.
- The footer on every page provides **Cookie policy**, **Privacy notice**, and **Cookie settings**. Consent is stored as `i2-consent-v1` in first-party local storage. Homepage quiz dismissal uses `i2_pathfinder_dismissed` in session storage. Ebook banners do not read or write browser storage. These preferences are documented in the cookie policy.
- The organization should review the contact details and legal wording in `public/cookie-policy.html` and `public/privacy.html` and update them if needed.

## Deploy and domain

Push to `main` to trigger the linked Vercel production deployment, or use `vercel deploy` for a protected preview. Check all clean URLs, headers, the contact form, and private-file 404s before promoting.

The custom domain is a separate DNS cutover. Add `i2ministries.org` and `www.i2ministries.org` in Vercel first, then apply the exact DNS records shown by Vercel at the authoritative DNS provider. Confirm the nameservers before editing; they were hosted by IONOS when checked in September 2026, even though the domain is managed through GoDaddy. Change only the website A/CNAME records; preserve MX, TXT, and existing subdomain records. Check both hostnames and HTTPS after DNS propagates.

Donations leave this site for GivingFuel or PayPal. Card details are not handled by this repository.
