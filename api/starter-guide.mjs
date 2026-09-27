import {
  reply,
  clean,
  fetchWithTimeout,
  SystemeError,
  upstashConfigured,
  withinRateLimit,
  backupSignup,
  resolveContact,
  updateContactFields,
  applyTag,
} from './_lib/signup.mjs';
import { COUNTRIES } from './_lib/countries.mjs';

const DOWNLOAD_PATH = '/downloads/emfci-one-day-starter-guide.pdf';
const SUCCESS_MESSAGE = 'Download it now. Watch your inbox for next steps from MMWU.';

// Builds an E.164 number from a raw (as-typed) phone string and an ISO2 country.
// Returns null when the country is unknown or the result doesn't look like a
// plausible international number. Never throws.
function buildE164(countryCode, rawPhone) {
  const dial = COUNTRIES[countryCode];
  if (!dial) return null;
  const typed = String(rawPhone || '').trim();
  let digits = typed.replace(/\D/g, '');
  if (!digits) return null;

  let full;
  if (typed.startsWith('+')) {
    // Typed in international form: trust the country code the visitor wrote.
    full = digits;
  } else if (digits.startsWith('00')) {
    full = digits.slice(2);
  } else if (dial === '1' && digits.length === 11 && digits.startsWith('1')) {
    // US/Canada number typed with its leading 1. No NANP area code starts with 1,
    // so this cannot be a national number. Other countries are NOT stripped this
    // way: an Indian mobile such as 91234 56789 starts with its own code.
    full = digits;
  } else if (digits.startsWith('0')) {
    // Single leading trunk prefix, common outside NANP (e.g. UK 07..., NG 080...).
    full = dial + digits.slice(1);
  } else {
    full = dial + digits;
  }

  if (full.length < 8 || full.length > 15) return null;
  return { e164: `+${full}` };
}

// Best-effort SMS opt-in sync to MMWU's own funnel (ClickSend-backed), shaped like
// a systeme.io webhook payload so it reuses MMWU's existing automation. Only ever
// called for +1 (US/Canada) numbers with explicit consent. Never throws, never
// logs the webhook key, email, or phone.
async function postMmwuOptin({ email, e164, firstName }) {
  const optinUrl = process.env.MMWU_OPTIN_URL;
  const webhookKey = process.env.MMWU_WEBHOOK_KEY;
  if (!optinUrl || !webhookKey) return;

  try {
    const url = `${optinUrl}?key=${encodeURIComponent(webhookKey)}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          contact: {
            email,
            fields: { phone_number: e164, first_name: firstName },
          },
          funnel_step: {
            funnel: { name: 'i2 site - Starter Guide popup' },
          },
        },
      }),
    });
    if (!response.ok) console.error('MMWU opt-in webhook returned an unexpected status', response.status);
  } catch (error) {
    console.error('MMWU opt-in webhook failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function GET() {
  return reply(405, 'Method not allowed.');
}

export async function POST(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return reply(415, 'Invalid request.');

  let raw;
  try { raw = await request.text(); } catch (_) { return reply(400, 'Invalid request.'); }
  if (raw.length > 4000) return reply(413, 'Request is too large.');

  let data;
  try { data = JSON.parse(raw); } catch (_) { return reply(400, 'Invalid request.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Invalid request.');

  if (data.website || data.company) return reply(200, 'Thank you.');
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < 1500) return reply(200, 'Thank you.');

  const firstName = clean(data.firstName, 80);
  if (!firstName) return reply(400, 'Please enter your first name.');

  const email = clean(data.email, 254).toLowerCase();
  if (!email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return reply(400, 'Please enter a valid email address.');
  }

  const phoneRaw = clean(data.phone, 40);
  const countryRaw = clean(data.country, 2).toUpperCase();

  let e164 = '';
  let country = '';
  if (phoneRaw) {
    const built = buildE164(countryRaw, phoneRaw);
    if (!built) return reply(400, 'Please enter a valid phone number, or leave it blank.');
    e164 = built.e164;
    country = countryRaw;
  }

  const smsEvents = data.smsEvents === true && !!e164;
  const smsOffers = data.smsOffers === true && !!e164;
  const source = clean(data.source, 60) || 'popup';

  const upstash = upstashConfigured();

  if (upstash && !(await withinRateLimit(request, 'i2:guide'))) {
    return reply(429, 'Too many sign-ups from this connection. Please try again later.');
  }

  let backedUp = false;
  if (upstash) {
    backedUp = await backupSignup('i2:signups:starter-guide', {
      email, firstName, country, phone: e164, smsEvents, smsOffers, source, at: new Date().toISOString(),
    });
  }

  if (!process.env.SYSTEME_API_KEY || !process.env.SYSTEME_GUIDE_TAG_ID) {
    if (backedUp) return reply(200, SUCCESS_MESSAGE, { queued: true, download: DOWNLOAD_PATH });
    return reply(503, 'Sign-up is temporarily unavailable. Please email info@i2ministries.org.');
  }

  try {
    const fields = [{ slug: 'first_name', value: firstName }];
    if (e164) {
      fields.push({ slug: 'phone_number', value: e164 });
      fields.push({ slug: 'country', value: country });
    }
    const { id: contactId, existed } = await resolveContact(email, fields);
    if (existed) {
      try {
        const result = await updateContactFields(contactId, fields);
        if (!result.ok) console.error('Starter guide contact field update returned an unexpected status', result.status);
      } catch (error) {
        console.error('Starter guide contact field update failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    const guideTag = await applyTag(contactId, process.env.SYSTEME_GUIDE_TAG_ID);
    if (!guideTag.ok) throw new SystemeError('systeme guide tag failed', guideTag.status);

    if (process.env.SYSTEME_NEW_LEAD_TAG_ID) {
      try {
        const result = await applyTag(contactId, process.env.SYSTEME_NEW_LEAD_TAG_ID);
        if (!result.ok) console.error('Starter guide new-lead tag application returned an unexpected status', result.status);
      } catch (error) {
        console.error('Starter guide new-lead tag application failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    if (smsEvents && process.env.SYSTEME_SMS_EVENTS_TAG_ID) {
      try {
        const result = await applyTag(contactId, process.env.SYSTEME_SMS_EVENTS_TAG_ID);
        if (!result.ok) console.error('Starter guide SMS-events tag application returned an unexpected status', result.status);
      } catch (error) {
        console.error('Starter guide SMS-events tag application failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    if (smsOffers && process.env.SYSTEME_SMS_OFFERS_TAG_ID) {
      try {
        const result = await applyTag(contactId, process.env.SYSTEME_SMS_OFFERS_TAG_ID);
        if (!result.ok) console.error('Starter guide SMS-offers tag application returned an unexpected status', result.status);
      } catch (error) {
        console.error('Starter guide SMS-offers tag application failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    if (e164.startsWith('+1') && (smsEvents || smsOffers)) {
      await postMmwuOptin({ email, e164, firstName });
    }

    return reply(200, SUCCESS_MESSAGE, { download: DOWNLOAD_PATH });
  } catch (error) {
    console.error('systeme sync failed', error instanceof SystemeError ? error.status : (error instanceof Error ? error.message : 'Unknown error'));
    if (backedUp) return reply(200, SUCCESS_MESSAGE, { queued: true, download: DOWNLOAD_PATH });
    return reply(503, 'Sign-up is temporarily unavailable. Please email info@i2ministries.org.');
  }
}
