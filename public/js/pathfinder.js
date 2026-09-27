(function () {
  'use strict';
  var dialog = document.getElementById('i2-pathfinder');
  var paths = window.I2Pathfinder;
  if (!dialog || !paths || typeof dialog.showModal !== 'function') return;
  var content = dialog.querySelector('[data-quiz-content]');
  var progress = dialog.querySelector('[data-quiz-progress]');
  var back = dialog.querySelector('[data-quiz-back]');
  var role = null;
  var resultIndex = null;
  var returnFocus = null;
  var timer = null;
  var dismissed = false;
  var storageKey = 'i2_pathfinder_dismissed';

  try { dismissed = sessionStorage.getItem(storageKey) === 'true'; } catch (_) { /* Memory fallback. */ }

  function remember() {
    dismissed = true;
    clearTimeout(timer);
    try {
      sessionStorage.setItem(storageKey, 'true');
      // Avoid a second invitation on a destination page during the same visit.
      sessionStorage.setItem('i2_ebook_dismissed', 'true');
    } catch (_) { /* The current visit still remembers dismissal in memory. */ }
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function heading(text, description) {
    var h = element('h2', 'i2-quiz__title', text);
    h.id = 'i2-quiz-title';
    h.tabIndex = -1;
    content.appendChild(h);
    if (description) content.appendChild(element('p', 'i2-quiz__description', description));
    return h;
  }

  function option(title, description, key, value) {
    var button = element('button', 'i2-quiz__option');
    button.type = 'button';
    button.setAttribute(key, value);
    var copy = element('span', 'i2-quiz__option-copy');
    copy.appendChild(element('strong', '', title));
    copy.appendChild(element('span', '', description));
    button.appendChild(copy);
    var arrow = element('span', 'i2-quiz__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    button.appendChild(arrow);
    return button;
  }

  function render(moveFocus) {
    content.replaceChildren();
    back.hidden = role === null;
    var title;
    if (role === null) {
      progress.textContent = 'Question 1 of 2';
      title = heading('How would you like to take part?', 'Two quick questions to find the right place to begin.');
      var roles = element('div', 'i2-quiz__options');
      Object.keys(paths).forEach(function (key) {
        roles.appendChild(option(paths[key].title, paths[key].description, 'data-quiz-role', key));
      });
      content.appendChild(roles);
    } else if (resultIndex === null) {
      progress.textContent = 'Question 2 of 2';
      back.textContent = '← Back';
      title = heading(paths[role].question);
      var choices = element('div', 'i2-quiz__options');
      paths[role].options.forEach(function (item, index) {
        choices.appendChild(option(item.title, item.description, 'data-quiz-choice', index));
      });
      content.appendChild(choices);
    } else {
      progress.textContent = 'Your next step';
      back.textContent = '← Change my answers';
      var result = paths[role].options[resultIndex].result;
      title = heading(result.title, result.description);
      if (result.points) {
        var points = element('ul', 'i2-quiz__points');
        result.points.forEach(function (point) { points.appendChild(element('li', '', point)); });
        content.appendChild(points);
      }
      var actions = element('div', 'i2-quiz__result-actions');
      ['primary', 'secondary'].forEach(function (kind) {
        var link = element('a', 'i2-quiz__link i2-quiz__link--' + kind, result[kind][0]);
        link.href = result[kind][1];
        link.setAttribute('data-quiz-destination', '');
        actions.appendChild(link);
      });
      content.appendChild(actions);
    }
    dialog.scrollTop = 0;
    if (moveFocus) title.focus({ preventScroll: true });
  }

  function open(trigger) {
    if (dialog.open) return;
    clearTimeout(timer);
    returnFocus = trigger || document.querySelector('[data-quiz-open]');
    role = null;
    resultIndex = null;
    render(false);
    dialog.showModal();
    document.body.classList.add('i2-quiz-open');
    content.querySelector('h2').focus({ preventScroll: true });
  }

  function close() { if (dialog.open) dialog.close(); }

  dialog.addEventListener('close', function () {
    remember();
    document.body.classList.remove('i2-quiz-open');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var controls = Array.from(dialog.querySelectorAll('button:not([disabled]), a[href]')).filter(function (node) {
      return node.getClientRects().length > 0;
    });
    if (!controls.length) return;
    var index = controls.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      controls[controls.length - 1].focus();
    } else if (!event.shiftKey && index === controls.length - 1) {
      event.preventDefault();
      controls[0].focus();
    }
  });
  dialog.addEventListener('click', function (event) {
    var button = event.target.closest('button, a');
    if (!button) return;
    if (button.hasAttribute('data-quiz-close')) close();
    else if (button.hasAttribute('data-quiz-back')) {
      if (resultIndex !== null) resultIndex = null;
      else role = null;
      render(true);
    } else if (button.hasAttribute('data-quiz-role')) {
      var key = button.getAttribute('data-quiz-role');
      if (!Object.prototype.hasOwnProperty.call(paths, key)) return;
      role = key;
      render(true);
    } else if (button.hasAttribute('data-quiz-choice') && role !== null) {
      var index = Number(button.getAttribute('data-quiz-choice'));
      if (!Number.isInteger(index) || !paths[role].options[index]) return;
      resultIndex = index;
      render(true);
    } else if (button.hasAttribute('data-quiz-destination')) {
      remember();
      close();
    }
  });

  document.querySelectorAll('[data-quiz-open]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () { open(button); });
  });

  function schedule() {
    clearTimeout(timer);
    if (dismissed || dialog.open || location.hash || !window.I2Consent || !window.I2Consent.hasDecision()) return;
    timer = setTimeout(function () {
      var banner = document.querySelector('.i2-consent');
      var active = document.activeElement;
      // Do not interrupt a control, another modal, privacy choices, or a reader further down the page.
      if (dismissed || document.hidden || dialog.open || (banner && !banner.hidden) ||
          window.scrollY > window.innerHeight * 0.6 || document.querySelector('dialog[open], .ebook-overlay.active') ||
          (active && active.matches('input, textarea, select, button, a, [contenteditable="true"]'))) return;
      open();
    }, 6000);
  }
  document.addEventListener('i2:consent-changed', schedule);
  window.addEventListener('pageshow', schedule);
  schedule();
})();
