(function () {
  'use strict';

  var started = Date.now();
  var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────────────────── Nav (mirrors about-1.js) ───────────────────────── */
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
  var mobileToggle = document.getElementById('mobileToggle');
  var navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      var menuOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
      mobileToggle.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Menu');
    });
    window.addEventListener('scroll', function () {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Menu');
    }, { passive: true });
  }
  var dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
  var navDropdown = document.getElementById('navDropdown');
  if (dropdownTrigger && navDropdown) {
    dropdownTrigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        navDropdown.classList.toggle('open');
        dropdownTrigger.setAttribute('aria-expanded', navDropdown.classList.contains('open') ? 'true' : 'false');
      }
    });
  }

  /* ───────────────────────── Reveal on scroll ───────────────────────── */
  var revealTargets = document.querySelectorAll('.reveal');
  if (prefersReduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ───────────────────────── Numbers band counters ───────────────────────── */
  var counters = document.querySelectorAll('[data-bk-counter]');
  function setCounterFinal(el) {
    el.textContent = el.getAttribute('data-bk-counter');
  }
  if (counters.length) {
    if (prefersReduce || !('IntersectionObserver' in window)) {
      counters.forEach(setCounterFinal);
    } else {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          counterObserver.unobserve(entry.target);
          var el = entry.target;
          var target = Number(el.getAttribute('data-bk-counter')) || 0;
          var duration = 1200;
          var startTime = null;
          function step(ts) {
            if (startTime === null) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            el.textContent = String(Math.floor(progress * target));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCounterFinal(el);
            }
          }
          window.requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ───────────────────────── Consent banner visibility watcher ───────────────────────── */
  var consentVisible = false;
  var consentListeners = [];
  function notifyConsentListeners() {
    consentListeners.forEach(function (fn) { fn(consentVisible); });
  }
  function watchConsentEl(el) {
    function update() {
      consentVisible = !el.hidden;
      notifyConsentListeners();
    }
    update();
    new MutationObserver(update).observe(el, { attributes: true, attributeFilter: ['hidden'] });
  }
  (function watchForConsentBanner() {
    var existing = document.querySelector('.i2-consent');
    if (existing) { watchConsentEl(existing); return; }
    var mo = new MutationObserver(function (mutations, obs) {
      var el = document.querySelector('.i2-consent');
      if (el) { obs.disconnect(); watchConsentEl(el); }
    });
    mo.observe(document.body, { childList: true });
  })();

  /* ───────────────────────── Sticky mobile CTA ───────────────────────── */
  var sticky = document.getElementById('bkSticky');
  var heroFormWrap = document.getElementById('bk-form-hero');
  var notifySection = document.getElementById('notify');
  if (sticky && heroFormWrap && notifySection && 'IntersectionObserver' in window) {
    sticky.hidden = false;
    var heroPassed = false;
    var notifyInView = false;
    function updateSticky() {
      var shouldShow = heroPassed && !notifyInView && !consentVisible;
      sticky.classList.toggle('bk-sticky--visible', shouldShow);
    }
    consentListeners.push(updateSticky);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        updateSticky();
      });
    }, { threshold: 0 }).observe(heroFormWrap);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        notifyInView = entry.isIntersecting;
        updateSticky();
      });
    }, { threshold: 0.1 }).observe(notifySection);
  }

  /* ───────────────────────── Smooth scroll + focus to #notify ───────────────────────── */
  document.querySelectorAll('a[href="#notify"], [data-bk-scroll-notify]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var target = document.getElementById('notify');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
      var focusEmail = function () {
        var input = document.getElementById('bk-email-offer');
        if (input) input.focus({ preventScroll: true });
      };
      if (prefersReduce) {
        focusEmail();
      } else {
        window.setTimeout(focusEmail, 550);
      }
    });
  });

  /* ───────────────────────── Notify forms ───────────────────────── */
  var allowedRoles = [
    'Pastor or church leader',
    'Missionary or mission leader',
    'Professor or seminary student',
    'Apologist or scholar',
    'Other'
  ];

  function buildSuccessPanel(pageUrl) {
    var wrap = document.createElement('div');
    wrap.className = 'bk-success';
    wrap.innerHTML =
      '<h4 tabindex="-1">&#10003; You\'re on the list.</h4>' +
      '<p>Here is the Introduction, as promised.</p>' +
      '<div class="bk-success-actions">' +
        '<a class="bk-btn bk-btn--primary" href="/downloads/the-borrowed-christ-introduction.pdf" download>Download the Introduction (PDF)</a>' +
      '</div>' +
      '<p class="bk-success-share">Know a pastor or professor who needs this? ' +
        '<button type="button" class="bk-success-copy-link" data-bk-copy-link>Copy the link</button> · ' +
        '<a href="mailto:?subject=' + encodeURIComponent('A book you should know about: The Borrowed Christ') +
        '&body=' + encodeURIComponent('Thought of you — i2 Ministries is taking sign-ups for The Borrowed Christ by Joshua Lingel: ' + pageUrl) +
        '">Email it to a colleague</a>' +
      '</p>';
    return wrap;
  }

  function bindCopyLink(container, pageUrl) {
    var btn = container.querySelector('[data-bk-copy-link]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'Link copied';
        window.setTimeout(function () { btn.textContent = original; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(done, function () { fallbackCopy(pageUrl, done); });
      } else {
        fallbackCopy(pageUrl, done);
      }
    });
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) { /* clipboard unavailable */ }
    document.body.removeChild(ta);
    done();
  }

  function setMessage(msgEl, text, state) {
    msgEl.textContent = text || '';
    if (state) msgEl.setAttribute('data-state', state); else msgEl.removeAttribute('data-state');
  }

  document.querySelectorAll('form[data-bk-notify]').forEach(function (form) {
    var msgEl = form.querySelector('.bk-form-msg');
    var submitBtn = form.querySelector('.bk-notify-submit');
    var emailInput = form.querySelector('input[type="email"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMessage(msgEl, '', null);

      if (emailInput && !emailInput.checkValidity()) {
        setMessage(msgEl, 'Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }

      var roleField = form.querySelector('select[name="role"]');
      var roleVal = roleField ? roleField.value : '';
      var payload = {
        email: emailInput ? emailInput.value.trim() : '',
        role: allowedRoles.indexOf(roleVal) !== -1 ? roleVal : '',
        wantsBulk: !!(form.querySelector('input[name="wantsBulk"]') && form.querySelector('input[name="wantsBulk"]').checked),
        firstName: '',
        website: (function () { var w = form.querySelector('input[name="website"]'); return w ? w.value : ''; })(),
        source: form.getAttribute('data-source') || 'book-page',
        elapsedMs: Date.now() - started
      };

      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Adding you…';

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.ok) {
            var panel = buildSuccessPanel(window.location.origin + '/the-borrowed-christ');
            form.replaceWith(panel);
            bindCopyLink(panel, window.location.origin + '/the-borrowed-christ');
            var heading = panel.querySelector('h4');
            if (heading) heading.focus();
          } else {
            var message = (result.data && result.data.message) || 'Something went wrong. Please try again, or email info@i2ministries.org.';
            setMessage(msgEl, message, 'error');
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.textContent = originalLabel;
          }
        })
        .catch(function () {
          setMessage(msgEl, 'Something went wrong. Please try again, or email info@i2ministries.org.', 'error');
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.textContent = originalLabel;
        });
    });
  });
})();
