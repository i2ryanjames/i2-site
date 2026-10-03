(function () {
  'use strict';
  var dialog = document.getElementById('i2-pathfinder');
  var data = window.I2Pathfinder;
  if (!dialog || !data || typeof dialog.showModal !== 'function') return;

  var content = dialog.querySelector('[data-quiz-content]');
  var progress = dialog.querySelector('[data-quiz-progress]');
  var progressLine = dialog.querySelector('[data-quiz-progress-line]');
  var category = dialog.querySelector('[data-quiz-category]');
  var back = dialog.querySelector('[data-quiz-back]');
  var next = dialog.querySelector('[data-quiz-next]');
  var skip = dialog.querySelector('[data-quiz-skip]');
  var browse = dialog.querySelector('[data-quiz-browse]');
  var answers = {};
  var history = [];
  var current = 'welcome';
  var currentResult = null;
  var returnFocus = null;
  var timer = null;
  var dismissed = false;
  // An explicit preview link works even after a previous dismissal, like the manual trigger.
  var previewPending = new URLSearchParams(location.search).get('quiz') === '1';
  var storageKey = 'i2_pathfinder_dismissed';
  try { dismissed = sessionStorage.getItem(storageKey) === 'true'; } catch (_) { /* Memory fallback. */ }

  function remember() {
    dismissed = true;
    clearTimeout(timer);
    try { sessionStorage.setItem(storageKey, 'true'); } catch (_) { /* Memory fallback. */ }
  }
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function heading(title, description) {
    var node = element('h2', 'i2-quiz__title', title);
    node.id = 'i2-quiz-title';
    node.tabIndex = -1;
    content.appendChild(node);
    if (description) content.appendChild(element('p', 'i2-quiz__description', description));
    return node;
  }
  function button(text, action, className) {
    var node = element('button', className || 'i2-quiz__quiet', text);
    node.type = 'button';
    node.setAttribute('data-quiz-' + action, '');
    return node;
  }
  function link(info, primary) {
    var node = element('a', primary ? 'btn btn-primary i2-quiz__primary' : 'i2-quiz__secondary', info.label);
    node.href = info.url;
    node.setAttribute('data-quiz-destination', '');
    if (info.external) {
      node.target = '_blank';
      node.rel = 'noopener noreferrer';
      node.appendChild(element('span', 'sr-only', ' (opens in a new tab)'));
    }
    if (primary) {
      var arrow = element('span', 'btn-arrow', '→');
      arrow.setAttribute('aria-hidden', 'true');
      node.appendChild(arrow);
    }
    return node;
  }
  function answerLabel(id) {
    var question = data.questions[id];
    if (!question || !answers[id]) return '';
    if (question.kind === 'text') return answers[id];
    var option = question.options.find(function (item) { return item.value === answers[id]; });
    return option ? option.label : '';
  }
  function summaryEntries() {
    var branch = data.branches[answers.goal];
    if (!branch) return [];
    var ids = branch.questions.slice();
    if (answers.goal === 'network' && answers['network-next'] === 'talk') ids.push('network-region', 'network-language');
    return ids.filter(function (id) { return answerLabel(id); }).map(function (id) {
      return [data.questions[id].title, answerLabel(id)];
    });
  }
  function summaryText() {
    return summaryEntries().map(function (entry) { return entry[0] + '\n' + entry[1]; }).join('\n\n');
  }
  function saveDetail() {
    var field = content.querySelector('[data-quiz-detail]');
    if (field) answers[current] = field.value.trim().slice(0, 120);
  }
  function updateNextLabel() {
    var selected = content.querySelector('input[type="radio"]:checked');
    var value = selected ? selected.value : answers[current];
    var last = ['network-next', 'donor-stage', 'church-next', 'learner-next', 'network-language'].includes(current);
    var label = current === 'welcome' ? 'Tell us about your ministry' : 'Continue';
    if (last && !(current === 'network-next' && value === 'talk')) label = 'View recommendation';
    if (current === 'donor-help' && value === 'give') label = 'See giving options';
    next.querySelector('[data-quiz-next-label]').textContent = label;
  }
  function render(moveFocus) {
    content.replaceChildren();
    dialog.dataset.quizScreen = current;
    var question = data.questions[current];
    var result = data.results[current];
    var branch = data.branches[answers.goal];
    var isSummary = current === 'summary';
    var isWelcome = current === 'welcome';
    var title;
    back.hidden = isWelcome;
    back.textContent = result ? '← Change my answers' : '← Back';
    next.hidden = !!result || isSummary;
    browse.hidden = !isWelcome;
    skip.hidden = !question || question.kind !== 'text';
    category.textContent = result ? 'Our recommendation' : isSummary ? 'Your message to i2' :
      isWelcome || current === 'goal' ? 'Serving the global Church' : branch.label;
    progress.textContent = '';
    progressLine.parentElement.hidden = isWelcome || isSummary || !!result;
    progressLine.style.width = '0%';

    if (isWelcome) {
      title = heading('The Gospel for every Muslim.', 'We serve denominational leaders, pastors, and scholars who are equipping the Church to reach Muslims for Christ.');
      content.appendChild(element('p', 'i2-quiz__intro-note', 'Tell us about your ministry, your studies, or the work you want to support.'));
    } else if (question) {
      if (question.kind === 'text') {
        progress.textContent = 'Optional detail ' + (current === 'network-region' ? '1' : '2') + ' of 2';
        progressLine.style.width = '100%';
      } else if (current === 'goal') {
        progress.textContent = 'Your ministry interests';
        progressLine.style.width = '8%';
      } else {
        var position = branch.questions.indexOf(current) + 1;
        progress.textContent = 'Question ' + position + ' of ' + branch.questions.length;
        progressLine.style.width = ((position - 1) / branch.questions.length * 100) + '%';
      }
      title = heading(question.title, question.description);
      if (question.kind === 'text') {
        var field = element('label', 'i2-quiz__field', question.label);
        var input = element('input', 'i2-quiz__input');
        input.type = 'text'; input.name = current; input.maxLength = 120;
        input.value = answers[current] || ''; input.placeholder = question.placeholder;
        input.setAttribute('data-quiz-detail', '');
        field.appendChild(input); content.appendChild(field);
      } else {
        var options = element('fieldset', 'i2-quiz__options');
        options.setAttribute('aria-labelledby', 'i2-quiz-title');
        question.options.forEach(function (option) {
          var row = element('label', 'i2-quiz__option');
          var radio = element('input', 'i2-quiz__radio');
          radio.type = 'radio'; radio.name = current; radio.value = option.value;
          radio.checked = answers[current] === option.value;
          var indicator = element('span', 'i2-quiz__radio-mark');
          indicator.setAttribute('aria-hidden', 'true');
          row.append(radio, indicator, element('span', 'i2-quiz__option-copy', option.label));
          options.appendChild(row);
        });
        content.appendChild(options);
      }
      if (question.note) content.appendChild(element('p', 'i2-quiz__note', question.note));
    } else if (result) {
      title = heading(result.title, result.description);
      var priorities = {
        network: ['network-role', 'network-reach', 'network-stage'],
        donor: ['donor-interest', 'donor-partner', 'donor-stage'],
        church: ['church-role', 'church-stage'],
        learner: ['learner-goal', 'learner-experience']
      }[answers.goal] || [];
      var labels = priorities.map(answerLabel).filter(Boolean);
      if (labels.length) {
        var context = element('div', 'i2-quiz__context');
        context.append(element('strong', '', 'Your ministry interests'), element('p', '', labels.join(' · ')));
        content.appendChild(context);
      }
      var actions = element('div', 'i2-quiz__result-actions');
      actions.append(link(result.primary, true), link(result.secondary, false));
      content.appendChild(actions);
      if (result.primary.url.indexOf('/contact?') === 0) {
        content.appendChild(button('Include these details when I contact i2', 'summary', 'i2-quiz__quiet i2-quiz__handoff'));
      }
    } else if (isSummary) {
      title = heading('Share these details with i2.', 'You can copy these answers into your message to i2. Please review them before sending.');
      var textLabel = element('label', 'i2-quiz__field', 'Your answers');
      var text = element('textarea', 'i2-quiz__summary-text');
      text.id = 'i2-quiz-summary'; text.readOnly = true; text.rows = 8; text.value = summaryText();
      textLabel.appendChild(text); content.appendChild(textLabel);
      var summaryActions = element('div', 'i2-quiz__result-actions');
      summaryActions.append(button('Copy my answers', 'copy', 'btn btn-primary i2-quiz__primary'),
        link({ label: 'Go to the Contact page', url: data.results[currentResult].primary.url }, false));
      content.appendChild(summaryActions);
      var status = element('p', 'i2-quiz__note');
      status.id = 'i2-quiz-copy-status'; status.setAttribute('role', 'status'); content.appendChild(status);
    }
    updateNextLabel();
    content.scrollTop = 0;
    if (moveFocus && title) title.focus({ preventScroll: true });
  }
  function go(id) { history.push(current); current = id; render(true); }
  function showResult() {
    remember();
    currentResult = data.recommend(answers);
    var result = data.results[currentResult];
    // Same click that asks for the recommendation. A qualifying MMWU result
    // leaves for gommwu.org immediately; the button remains if the browser blocks it.
    if (result && result.primary && result.primary.external) {
      var opened = window.open(result.primary.url, '_blank');
      if (opened) opened.opener = null;
    }
    go(currentResult);
  }
  function advance(skipDetail) {
    if (current === 'welcome') { go('goal'); return; }
    var question = data.questions[current];
    if (!question) return;
    if (question.kind === 'question') {
      var selected = content.querySelector('input[type="radio"]:checked');
      if (!selected) {
        if (!content.querySelector('#i2-quiz-error')) {
          var error = element('p', 'i2-quiz__error', 'Choose one option to continue.');
          error.id = 'i2-quiz-error'; error.setAttribute('role', 'alert');
          content.querySelector('fieldset').after(error);
          content.querySelector('fieldset').setAttribute('aria-describedby', error.id);
        }
        content.querySelector('input').focus(); return;
      }
      if (current === 'goal') {
        if (answers.goal !== selected.value) { answers = {}; history = ['welcome']; }
        answers.goal = selected.value; go(data.branches[answers.goal].questions[1]); return;
      }
      answers[current] = selected.value;
    } else if (skipDetail) answers[current] = '';
    else saveDetail();
    if (current === 'network-next') {
      if (answers[current] === 'talk') { go('network-region'); return; }
      delete answers['network-region']; delete answers['network-language'];
    }
    if (current === 'network-region') { go('network-language'); return; }
    if (current === 'network-language') { showResult(); return; }
    if (current === 'donor-help' && answers[current] === 'give') {
      delete answers['donor-stage']; showResult(); return;
    }
    var ids = data.branches[answers.goal].questions;
    var position = ids.indexOf(current);
    if (position === ids.length - 1) showResult();
    else go(ids[position + 1]);
  }
  function open(trigger) {
    if (dialog.open) return;
    clearTimeout(timer); previewPending = false; returnFocus = trigger || document.activeElement;
    render(false); dialog.showModal(); document.body.classList.add('i2-quiz-open');
    content.querySelector('h2').focus({ preventScroll: true });
  }
  function close() { saveDetail(); if (dialog.open) dialog.close(); }
  dialog.addEventListener('close', function () {
    remember(); document.body.classList.remove('i2-quiz-open');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.matches('[data-quiz-detail]')) { event.preventDefault(); advance(); return; }
    if (event.key !== 'Tab') return;
    // Radio groups contribute one tab stop, matching native keyboard behavior.
    var controls = Array.from(dialog.querySelectorAll('button:not([disabled]), a[href], input, textarea')).filter(function (node) {
      if (!node.getClientRects().length) return false;
      if (node.type !== 'radio') return true;
      var checked = content.querySelector('input[type="radio"]:checked');
      return node === (checked || content.querySelector('input[type="radio"]'));
    });
    var index = controls.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); controls[controls.length - 1].focus(); }
    else if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); controls[0].focus(); }
  });
  var backdropDown = false;
  function outside(event) {
    var bounds = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
  }
  dialog.addEventListener('pointerdown', function (event) { backdropDown = outside(event); });
  dialog.addEventListener('click', function (event) {
    if (backdropDown && outside(event)) { backdropDown = false; close(); return; }
    backdropDown = false;
    var control = event.target.closest('button, a');
    if (!control) return;
    if (control.hasAttribute('data-quiz-close')) close();
    else if (control.hasAttribute('data-quiz-next')) advance();
    else if (control.hasAttribute('data-quiz-skip')) advance(true);
    else if (control.hasAttribute('data-quiz-back')) {
      saveDetail();
      if (data.results[current]) { history = ['welcome']; current = 'goal'; }
      else current = history.pop() || 'welcome';
      render(true);
    } else if (control.hasAttribute('data-quiz-summary')) go('summary');
    else if (control.hasAttribute('data-quiz-copy')) {
      var status = document.getElementById('i2-quiz-copy-status');
      function manualCopy() {
        var text = document.getElementById('i2-quiz-summary'); text.focus(); text.select();
        status.textContent = 'Your answers are selected. Copy them, then go to the Contact page.';
      }
      if (!navigator.clipboard || !navigator.clipboard.writeText) manualCopy();
      else navigator.clipboard.writeText(summaryText()).then(function () {
        if (status.isConnected) status.textContent = 'Copied. Paste these details into your message to i2.';
      }).catch(function () { if (status.isConnected) manualCopy(); });
    } else if (control.hasAttribute('data-quiz-destination')) { remember(); close(); }
  });
  content.addEventListener('change', function (event) {
    if (event.target.type !== 'radio') return;
    if (current !== 'goal') answers[current] = event.target.value;
    var error = content.querySelector('#i2-quiz-error'); if (error) error.remove();
    var group = content.querySelector('fieldset'); if (group) group.removeAttribute('aria-describedby');
    updateNextLabel();
  });
  document.querySelectorAll('[data-quiz-open]').forEach(function (trigger) {
    trigger.hidden = false; trigger.addEventListener('click', function () { open(trigger); });
  });
  function tryOpen() {
    if ((!previewPending && dismissed) || dialog.open || document.hidden) return;
    var active = document.activeElement;
    // Opens 5s after load without waiting for the cookie banner (Ryan, 2026-09-27:
    // waiting for a privacy choice meant many visitors never saw it). Still waits
    // for another dialog, a playing video, or a focused form field, then retries.
    if (document.querySelector('dialog[open], [data-media-loaded]') ||
        (!previewPending && active && active.getClientRects().length && active.matches('input, textarea, select, [contenteditable="true"]'))) {
      timer = setTimeout(tryOpen, 1000);
      return;
    }
    open();
  }
  function schedule() {
    clearTimeout(timer);
    if ((!previewPending && dismissed) || dialog.open || document.hidden) return;
    timer = setTimeout(tryOpen, previewPending ? 0 : 5000);
  }
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pageshow', schedule);
  schedule();
})();
