(function () {
  'use strict';

  var container = document.getElementById('formContainer');
  if (!container) return;
  var status = document.getElementById('verificationStatus');
  var button = document.getElementById('submitBtn');
  var buttonMarkup = button.innerHTML;
  var token = '';
  var widgetId = null;
  var setupPromise = null;

  function setStatus(message) { status.textContent = message; }

  function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Verification could not load')); };
      document.head.appendChild(script);
    });
  }

  function setupVerification() {
    if (setupPromise) return setupPromise;
    setStatus('Loading verification…');
    setupPromise = fetch('/api/contact', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Contact form is unavailable');
        return response.json();
      })
      .then(function (config) {
        if (!config.siteKey) throw new Error('Contact form is unavailable');
        return loadTurnstileScript().then(function () {
          widgetId = window.turnstile.render('#turnstileContainer', {
            sitekey: config.siteKey,
            action: 'contact',
            callback: function (value) { token = value; setStatus('Verification complete.'); },
            'expired-callback': function () { token = ''; setStatus('Verification expired. Please complete it again.'); },
            'error-callback': function () { token = ''; setStatus('Verification failed to load. Please try again.'); },
          });
          setStatus('Complete the verification to send your message.');
        });
      })
      .catch(function (error) {
        setupPromise = null;
        setStatus('Contact form is unavailable. Please email info@i2ministries.org.');
        throw error;
      });
    return setupPromise;
  }

  container.addEventListener('focusin', function () {
    setupVerification().catch(function () { /* The visible status contains the fallback. */ });
  }, { once: true });

  window.sendForm = async function () {
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value.trim();
    var website = document.getElementById('website').value;
    var company = document.getElementById('company').value;

    if (website || company) {
      container.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
      return;
    }
    if (!firstName || !lastName || !subject || message.length < 10 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      setStatus('Please complete every field, including a message of at least 10 characters.');
      return;
    }
    try { await setupVerification(); } catch (_) { return; }
    if (!token) {
      setStatus('Please complete the verification before sending.');
      document.getElementById('turnstileContainer').focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending…';
    document.getElementById('formError').style.display = 'none';
    try {
      var response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, subject: subject, message: message, website: website, company: company, turnstileToken: token }),
      });
      var result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'Message could not be sent.');
      container.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    } catch (error) {
      setStatus(error.message || 'Message could not be sent. Please try again.');
      document.getElementById('formError').style.display = 'block';
      token = '';
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
    } finally {
      button.disabled = false;
      button.innerHTML = buttonMarkup;
    }
  };
})();
