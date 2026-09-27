(function () {
  'use strict';

  var dialog = document.getElementById('guidePopup');

  // Every page that has a "Free Starter Guide" / gommwu.org link intercepts it
  // and opens the popup instead of leaving the site — even pages that don't
  // carry the dialog markup themselves (defensive; in practice all such pages
  // ship the dialog). If there's no dialog on this page, still keep links
  // working (do nothing, let the href fall through).
  var guideLinks = document.querySelectorAll('a[href*="gommwu.org/ebook"]');

  // Client copy of api/_lib/countries.mjs's COUNTRIES map (ISO2 -> dial code).
  // Written as valid JSON so tests/countries.test.mjs can extract and compare
  // it against the server copy without executing this browser-only file.
  var COUNTRIES = [
    {"code":"US","dial":"1","name":"United States"},
    {"code":"CA","dial":"1","name":"Canada"},
    {"code":"GB","dial":"44","name":"United Kingdom"},
    {"code":"AU","dial":"61","name":"Australia"},
    {"code":"NG","dial":"234","name":"Nigeria"},
    {"code":"KE","dial":"254","name":"Kenya"},
    {"code":"GH","dial":"233","name":"Ghana"},
    {"code":"ZA","dial":"27","name":"South Africa"},
    {"code":"UG","dial":"256","name":"Uganda"},
    {"code":"TZ","dial":"255","name":"Tanzania"},
    {"code":"ET","dial":"251","name":"Ethiopia"},
    {"code":"CD","dial":"243","name":"Congo (DRC)"},
    {"code":"CM","dial":"237","name":"Cameroon"},
    {"code":"IN","dial":"91","name":"India"},
    {"code":"PK","dial":"92","name":"Pakistan"},
    {"code":"BD","dial":"880","name":"Bangladesh"},
    {"code":"ID","dial":"62","name":"Indonesia"},
    {"code":"PH","dial":"63","name":"Philippines"},
    {"code":"MY","dial":"60","name":"Malaysia"},
    {"code":"EG","dial":"20","name":"Egypt"},
    {"code":"MA","dial":"212","name":"Morocco"},
    {"code":"DZ","dial":"213","name":"Algeria"},
    {"code":"TN","dial":"216","name":"Tunisia"},
    {"code":"SA","dial":"966","name":"Saudi Arabia"},
    {"code":"AE","dial":"971","name":"United Arab Emirates"},
    {"code":"JO","dial":"962","name":"Jordan"},
    {"code":"LB","dial":"961","name":"Lebanon"},
    {"code":"TR","dial":"90","name":"Turkey"},
    {"code":"IR","dial":"98","name":"Iran"},
    {"code":"IQ","dial":"964","name":"Iraq"},
    {"code":"FR","dial":"33","name":"France"},
    {"code":"DE","dial":"49","name":"Germany"},
    {"code":"NL","dial":"31","name":"Netherlands"},
    {"code":"ES","dial":"34","name":"Spain"},
    {"code":"IT","dial":"39","name":"Italy"},
    {"code":"BR","dial":"55","name":"Brazil"},
    {"code":"MX","dial":"52","name":"Mexico"},
    {"code":"CO","dial":"57","name":"Colombia"},
    {"code":"AR","dial":"54","name":"Argentina"},
    {"code":"SN","dial":"221","name":"Senegal"},
    {"code":"CI","dial":"225","name":"Cote d'Ivoire"},
    {"code":"ML","dial":"223","name":"Mali"},
    {"code":"NE","dial":"227","name":"Niger"},
    {"code":"SO","dial":"252","name":"Somalia"},
    {"code":"SD","dial":"249","name":"Sudan"},
    {"code":"RW","dial":"250","name":"Rwanda"},
    {"code":"ZM","dial":"260","name":"Zambia"},
    {"code":"ZW","dial":"263","name":"Zimbabwe"},
    {"code":"MZ","dial":"258","name":"Mozambique"},
    {"code":"AF","dial":"93","name":"Afghanistan"},
    {"code":"YE","dial":"967","name":"Yemen"},
    {"code":"KW","dial":"965","name":"Kuwait"},
    {"code":"QA","dial":"974","name":"Qatar"},
    {"code":"OM","dial":"968","name":"Oman"},
    {"code":"IL","dial":"972","name":"Israel"},
    {"code":"LK","dial":"94","name":"Sri Lanka"},
    {"code":"NP","dial":"977","name":"Nepal"},
    {"code":"TH","dial":"66","name":"Thailand"},
    {"code":"VN","dial":"84","name":"Vietnam"},
    {"code":"CN","dial":"86","name":"China"},
    {"code":"JP","dial":"81","name":"Japan"},
    {"code":"KR","dial":"82","name":"South Korea"},
    {"code":"RU","dial":"7","name":"Russia"},
    {"code":"UA","dial":"380","name":"Ukraine"},
    {"code":"PT","dial":"351","name":"Portugal"}
  ];

  function flagEmoji(iso2) {
    return iso2.replace(/./g, function (ch) {
      return String.fromCodePoint(127397 + ch.charCodeAt(0));
    });
  }

  function populateCountrySelect(select) {
    if (!select) return;
    COUNTRIES.forEach(function (country) {
      var option = document.createElement('option');
      option.value = country.code;
      option.setAttribute('data-dial', country.dial);
      option.title = country.name + ' (+' + country.dial + ')';
      option.textContent = flagEmoji(country.code) + ' +' + country.dial;
      select.appendChild(option);
    });
  }

  var SEEN_KEY = 'i2_guide_popup_seen';
  var SIGNED_KEY = 'i2_guide_signed_up';
  var FIRST_NAME_KEY = 'i2_guide_first_name';
  var DEFAULT_DOWNLOAD = '/downloads/emfci-one-day-starter-guide.pdf';
  var emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

  function safeSessionGet(key) {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  }
  function safeSessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (_) { /* storage unavailable */ }
  }
  function safeLocalGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeLocalSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* storage unavailable */ }
  }

  function markSeen() { safeSessionSet(SEEN_KEY, '1'); }

  if (!dialog) return;

  var form = dialog.querySelector('[data-guide-form]');
  var firstNameInput = dialog.querySelector('#guidePopupFirstName');
  var emailInput = dialog.querySelector('#guidePopupEmail');
  var phoneInput = dialog.querySelector('#guidePopupPhone');
  var countrySelect = dialog.querySelector('#guideCountry');
  var smsEventsCheckbox = dialog.querySelector('#guidePopupSmsEvents');
  var smsOffersCheckbox = dialog.querySelector('#guidePopupSmsOffers');
  var consentWraps = dialog.querySelectorAll('[data-guide-consent-wrap]');
  var statusEl = dialog.querySelector('[data-guide-status]');
  var announceEl = dialog.querySelector('[data-guide-announce]');
  var submitBtn = dialog.querySelector('[data-guide-submit]');
  var successPanel = dialog.querySelector('[data-guide-success]');
  var successMessageEl = dialog.querySelector('[data-guide-success-message]');
  var downloadLink = dialog.querySelector('[data-guide-download]');
  var successHeading = dialog.querySelector('[data-guide-success-heading]');
  var closeButtons = dialog.querySelectorAll('[data-guide-close]');
  var hpInput = dialog.querySelector('.guide-popup__hp input[name="website"]');

  if (!form || !firstNameInput || !emailInput || !phoneInput || !countrySelect || !smsEventsCheckbox || !smsOffersCheckbox) return;

  populateCountrySelect(countrySelect);

  var openedAt = null;
  var lastFocused = null;

  function pageSlug() {
    var path = window.location.pathname;
    if (path === '/' || path === '') return 'home';
    var slug = path.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
    return slug || 'home';
  }

  function updateConsentAvailability() {
    var hasPhone = phoneInput.value.trim().length > 0;
    smsEventsCheckbox.disabled = !hasPhone;
    smsOffersCheckbox.disabled = !hasPhone;
    if (!hasPhone) {
      smsEventsCheckbox.checked = false;
      smsOffersCheckbox.checked = false;
    }
    consentWraps.forEach(function (wrap) {
      wrap.setAttribute('data-disabled', hasPhone ? 'false' : 'true');
    });
  }
  phoneInput.addEventListener('input', updateConsentAvailability);
  updateConsentAvailability();

  function setStatus(message, state) {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    if (state) statusEl.setAttribute('data-state', state); else statusEl.removeAttribute('data-state');
  }

  function isFormFieldFocused() {
    var active = document.activeElement;
    if (!active) return false;
    var tag = active.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  function anotherDialogOpen() {
    return document.querySelectorAll('dialog[open]').length > 0;
  }

  function openPopup() {
    if (dialog.open) return;
    lastFocused = document.activeElement;
    openedAt = Date.now();
    dialog.showModal();
    markSeen();
  }

  function closePopup() {
    if (!dialog.open) return;
    dialog.close();
  }

  dialog.addEventListener('close', function () {
    if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  });

  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', closePopup);
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) closePopup();
  });

  function resetToForm() {
    if (form) form.hidden = false;
    if (successPanel) successPanel.hidden = true;
    dialog.classList.remove('is-success');
    setStatus('', null);
  }

  function buildSuccessMessage(firstName, email) {
    var tail = "If you don't see it in a few minutes, check your spam or promotions folder.";
    if (firstName && email) return firstName + ', your Starter Guide is on its way to ' + email + '. ' + tail;
    if (firstName) return firstName + ', your Starter Guide is on its way to your inbox. ' + tail;
    return 'Your Starter Guide is on its way to your inbox. ' + tail;
  }

  function showSuccess(downloadUrl, options) {
    options = options || {};
    var firstName = options.firstName || '';
    var email = options.email || '';
    var persist = options.persist !== false;
    var announce = options.announce !== false;

    if (downloadLink) downloadLink.setAttribute('href', downloadUrl || DEFAULT_DOWNLOAD);
    if (successMessageEl) successMessageEl.textContent = buildSuccessMessage(firstName, email);
    if (form) form.hidden = true;
    if (successPanel) successPanel.hidden = false;
    // Hide the pitch so the confirmation sits at the top, not below the fold on a phone.
    dialog.classList.add('is-success');
    if (dialog.scrollTo) dialog.scrollTo(0, 0);

    if (persist) {
      safeLocalSet(SIGNED_KEY, '1');
      if (firstName) safeSessionSet(FIRST_NAME_KEY, firstName);
    }
    if (announce && announceEl) announceEl.textContent = 'Success. Check your inbox.';
    if (successHeading) successHeading.focus();
  }

  function showStoredSuccess() {
    var storedName = safeSessionGet(FIRST_NAME_KEY) || '';
    showSuccess(DEFAULT_DOWNLOAD, { firstName: storedName, email: '', persist: false, announce: true });
  }

  function openManually() {
    markSeen();
    if (safeLocalGet(SIGNED_KEY) === '1') {
      showStoredSuccess();
    } else {
      resetToForm();
    }
    openPopup();
  }

  guideLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openManually();
    });
  });

  function stripPhoneFormatting(value) {
    return value.replace(/\D/g, '');
  }

  function isValidPhoneForDial(phone, dial) {
    if (!dial) return false;
    var digits = stripPhoneFormatting(phone);
    if (!digits) return false;
    var full;
    if (digits.indexOf(dial) === 0) {
      full = digits;
    } else if (digits.charAt(0) === '0') {
      full = dial + digits.slice(1);
    } else {
      full = dial + digits;
    }
    return full.length >= 8 && full.length <= 15;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus('', null);

    var firstName = firstNameInput.value.trim();
    if (!firstName) {
      setStatus('Please enter your first name.', 'error');
      firstNameInput.focus();
      return;
    }

    var email = emailInput.value.trim();
    if (!email || !emailPattern.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    var phone = phoneInput.value.trim();
    var country = countrySelect.value;
    if (phone) {
      var selectedOption = countrySelect.options[countrySelect.selectedIndex];
      var dial = selectedOption ? selectedOption.getAttribute('data-dial') : '';
      if (!isValidPhoneForDial(phone, dial)) {
        setStatus('Please enter a valid phone number, or leave it blank.', 'error');
        phoneInput.focus();
        return;
      }
    }

    var payload = {
      firstName: firstName,
      email: email,
      country: country,
      phone: phone,
      smsEvents: !!(smsEventsCheckbox.checked && phone),
      smsOffers: !!(smsOffersCheckbox.checked && phone),
      source: 'popup-' + pageSlug(),
      elapsedMs: openedAt ? Date.now() - openedAt : 0,
      website: hpInput ? hpInput.value : ''
    };

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    fetch('/api/starter-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.ok) {
          showSuccess(result.data.download, { firstName: firstName, email: email, persist: true, announce: true });
          return;
        }
        if (!result.status || result.status >= 500) {
          setStatus('Something went wrong. You can still download the guide below.', 'error');
          showSuccess(null, { firstName: firstName, email: email, persist: false, announce: false });
          return;
        }
        var message = (result.data && result.data.message) || 'Something went wrong. Please try again.';
        setStatus(message, 'error');
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = originalLabel;
      })
      .catch(function () {
        setStatus('Something went wrong. You can still download the guide below.', 'error');
        showSuccess(null, { firstName: firstName, email: email, persist: false, announce: false });
      });
  });

  var params = new URLSearchParams(window.location.search);
  var forceOpen = params.get('guide') === '1';
  var suppressOpen = params.get('guide') === '0';

  if (forceOpen) {
    resetToForm();
    openPopup();
    return;
  }

  if (suppressOpen) return;
  if (dialog.getAttribute('data-autoopen') !== 'true') return;
  if (safeSessionGet(SEEN_KEY) === '1') return;
  if (safeLocalGet(SIGNED_KEY) === '1') return;

  var triggerReady = false;
  var opened = false;

  function attemptOpen() {
    if (opened || !triggerReady) return;
    if (!(window.I2Consent && window.I2Consent.hasDecision())) return;
    if (anotherDialogOpen() || isFormFieldFocused()) return;
    resetToForm();
    openPopup();
    opened = dialog.open;
  }

  window.setTimeout(function () {
    triggerReady = true;
    attemptOpen();
  }, 20000);

  function onScroll() {
    var doc = document.documentElement;
    var scrolled = window.scrollY || doc.scrollTop || 0;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    if (scrolled / max >= 0.5) {
      triggerReady = true;
      window.removeEventListener('scroll', onScroll);
      attemptOpen();
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var pollId = window.setInterval(function () {
    if (opened) { window.clearInterval(pollId); return; }
    attemptOpen();
  }, 3000);
})();
