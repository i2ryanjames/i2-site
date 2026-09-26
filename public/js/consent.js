(function () {
  'use strict';

  var storageKey = 'i2-consent-v1';
  var consentVersion = 1;
  var choice = null;
  var returnFocus = null;
  var originalMarkup = new WeakMap();
  var loadedCards = new Set();

  try {
    var stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (stored && stored.version === consentVersion && typeof stored.media === 'boolean') choice = stored;
  } catch (_) { /* Private browsing can disable storage. The in-page choice still works. */ }

  var banner = document.createElement('section');
  banner.className = 'i2-consent';
  banner.setAttribute('aria-labelledby', 'i2-consent-title');
  banner.hidden = !!choice;
  banner.innerHTML =
    '<div class="i2-consent__inner">' +
      '<div class="i2-consent__copy">' +
        '<h2 id="i2-consent-title">Cookies &amp; privacy</h2>' +
        '<p>We remember your privacy choices. Optional YouTube and Vimeo videos may use cookies and receive device data when played. Choose whether to allow them. <a href="/cookie-policy">Cookie policy</a>.</p>' +
      '</div>' +
      '<div class="i2-consent__actions">' +
        '<button type="button" class="i2-consent__button i2-consent__button--quiet" data-consent="reject">Reject optional</button>' +
        '<button type="button" class="i2-consent__button i2-consent__button--quiet" data-consent="allow">Accept optional</button>' +
        '<button type="button" class="i2-consent__manage" data-consent="manage" aria-expanded="false" aria-controls="i2-consent-settings">Manage cookies</button>' +
      '</div>' +
      '<div class="i2-consent__settings" id="i2-consent-settings" hidden>' +
        '<div class="i2-consent__necessary i2-consent__setting-copy"><strong>Essential storage · Always on</strong><span>Remembers your privacy choices and keeps the ebook invitation closed after you dismiss it.</span></div>' +
        '<div class="i2-consent__setting-copy" id="i2-consent-media-description"><strong>Optional video cookies</strong><span>YouTube and Vimeo players stay blocked until you allow them. These providers may use cookies and receive device data when you play a video. Change your choice anytime using Cookie settings in the footer.</span></div>' +
        '<div class="i2-consent__settings-actions"><label class="i2-consent__toggle"><input type="checkbox" id="i2-consent-media" aria-describedby="i2-consent-media-description"> Allow videos</label><button type="button" class="i2-consent__button" data-consent="save">Save choice</button></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(banner);

  var settings = banner.querySelector('#i2-consent-settings');
  var manage = banner.querySelector('[data-consent="manage"]');
  var mediaInput = banner.querySelector('#i2-consent-media');
  mediaInput.checked = !!(choice && choice.media);

  function restoreMedia() {
    loadedCards.forEach(function (card) {
      if (originalMarkup.has(card)) card.innerHTML = originalMarkup.get(card);
      card.removeAttribute('data-media-loaded');
      card.removeAttribute('aria-disabled');
      loadedCards.delete(card);
    });
  }

  function saveChoice(media) {
    choice = { version: consentVersion, media: !!media, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(storageKey, JSON.stringify(choice)); } catch (_) { /* Memory-only fallback. */ }
    banner.hidden = true;
    settings.hidden = true;
    manage.setAttribute('aria-expanded', 'false');
    if (!choice.media) restoreMedia();
    if (returnFocus && returnFocus.isConnected) {
      returnFocus.focus({ preventScroll: true });
      returnFocus = null;
    } else if (banner.contains(document.activeElement)) {
      document.body.setAttribute('tabindex', '-1');
      document.body.focus({ preventScroll: true });
    }
    document.dispatchEvent(new CustomEvent('i2:consent-changed', { detail: { media: choice.media } }));
  }

  function openSettings(trigger) {
    returnFocus = trigger || null;
    banner.hidden = false;
    settings.hidden = false;
    mediaInput.checked = !!(choice && choice.media);
    manage.setAttribute('aria-expanded', 'true');
    mediaInput.focus();
  }

  banner.addEventListener('click', function (event) {
    var button = event.target.closest('[data-consent]');
    if (!button) return;
    var action = button.getAttribute('data-consent');
    if (action === 'reject') saveChoice(false);
    else if (action === 'allow') saveChoice(true);
    else if (action === 'save') saveChoice(mediaInput.checked);
    else if (action === 'manage') {
      settings.hidden = !settings.hidden;
      manage.setAttribute('aria-expanded', String(!settings.hidden));
      if (!settings.hidden) mediaInput.focus();
    }
  });

  function loadMedia(card) {
    var ytId = card.getAttribute('data-yt-id');
    var vimeoId = card.getAttribute('data-vimeo-id');
    var src;
    if (ytId && /^[A-Za-z0-9_-]{11}$/.test(ytId)) src = 'https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0';
    else if (vimeoId && /^[0-9]+$/.test(vimeoId)) src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1';
    else return;

    if (!originalMarkup.has(card)) originalMarkup.set(card, card.innerHTML);
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = card.getAttribute('aria-label') || (card.querySelector('img') || {}).alt || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:inherit;';
    card.replaceChildren(iframe);
    card.setAttribute('data-media-loaded', 'true');
    card.setAttribute('aria-disabled', 'true');
    loadedCards.add(card);
  }

  function requestMedia(card) {
    if (card.hasAttribute('data-media-loaded')) return;
    if (choice && choice.media) { loadMedia(card); return; }
    var existing = card.querySelector('.i2-media-choice');
    if (existing) { existing.querySelector('button').focus(); return; }
    if (!originalMarkup.has(card)) originalMarkup.set(card, card.innerHTML);
    var provider = card.hasAttribute('data-vimeo-id') ? 'Vimeo' : 'YouTube';
    var prompt = document.createElement('div');
    prompt.className = 'i2-media-choice';
    prompt.innerHTML = '<strong>Play this video?</strong><p>Playing connects to ' + provider + ', which may use cookies or similar technologies.</p><div class="i2-media-choice__actions"><button type="button" data-media="once">Play once</button><button type="button" data-media="always">Allow all videos</button></div>';
    prompt.addEventListener('click', function (event) {
      var button = event.target.closest('[data-media]');
      if (!button) return;
      event.stopPropagation();
      if (button.getAttribute('data-media') === 'always') saveChoice(true);
      loadMedia(card);
    });
    card.appendChild(prompt);
    prompt.querySelector('button').focus();
  }

  window.I2Consent = {
    hasDecision: function () { return !!choice; },
    mediaAllowed: function () { return !!(choice && choice.media); },
    openSettings: openSettings,
    requestMedia: requestMedia
  };
})();
