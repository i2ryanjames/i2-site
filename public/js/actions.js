(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    var target = event.target.closest('[data-i2-action]');
    if (!target || event.target.closest('.i2-media-choice')) return;
    var action = target.getAttribute('data-i2-action');
    if (action === 'media') window.I2Consent.requestMedia(target);
    else if (action === 'accordion' && typeof window.toggleAccordion === 'function') window.toggleAccordion(target);
    else if (action === 'contact-submit' && typeof window.sendForm === 'function') window.sendForm();
    else if (action === 'cookie-settings') window.I2Consent.openSettings(target);
  });

  document.addEventListener('keydown', function (event) {
    if ((event.key !== 'Enter' && event.key !== ' ') || event.target.getAttribute('data-i2-action') !== 'media') return;
    event.preventDefault();
    event.target.click();
  });

  var navDrop = document.getElementById('navDropdown');
  var navDropTrigger = navDrop && navDrop.querySelector('.nav-dropdown-trigger');
  if (navDrop && navDropTrigger) {
    var syncDrop = function () {
      var wide = window.matchMedia('(min-width: 769px)').matches;
      var open = navDrop.classList.contains('open') || (wide && (navDrop.matches(':hover') || navDrop.matches(':focus-within')));
      navDropTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    navDrop.addEventListener('mouseenter', syncDrop);
    navDrop.addEventListener('mouseleave', syncDrop);
    navDrop.addEventListener('focusin', syncDrop);
    navDrop.addEventListener('focusout', function () { setTimeout(syncDrop, 0); });
  }
})();
