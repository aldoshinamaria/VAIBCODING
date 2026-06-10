/**
 * MA.digital — UI квиза «Подобрать решение за 2 минуты»
 */
(function () {
  'use strict';

  var app = document.getElementById('quiz-mvp-app');
  if (!app) return;

  var C = window.QuizMvpConstants;
  var Rec = window.QuizMvpRecommendations;
  var Leads = window.LeadsService;

  var viewport = document.getElementById('quiz-mvp-viewport');
  var progressBar = document.getElementById('quiz-mvp-progress-bar');
  var progressText = document.getElementById('quiz-mvp-progress-text');
  var statusText = document.getElementById('quiz-mvp-status-text');
  var backBtn = document.getElementById('quiz-mvp-back');
  var restartBtn = document.getElementById('quiz-mvp-restart');
  var resultEl = document.getElementById('quiz-mvp-result');
  var resultTitle = document.getElementById('quiz-mvp-result-title');
  var resultLead = document.getElementById('quiz-mvp-result-lead');
  var resultFormats = document.getElementById('quiz-mvp-result-formats');
  var formWrap = document.getElementById('quiz-mvp-form-wrap');
  var formEl = document.getElementById('quiz-mvp-form');
  var formSuccess = document.getElementById('quiz-mvp-form-success');
  var formError = document.getElementById('quiz-mvp-form-error');
  var submitBtn = document.getElementById('quiz-mvp-submit');

  var steps = app.querySelectorAll('.quiz-mvp__step');
  var currentStep = 1;
  var transitioning = false;
  var answers = {
    client_type: '',
    goal: '',
    current_state: '',
    urgency: '',
  };
  var lastRecommendation = null;

  function setProgress(step) {
    var pct = Math.round((step / C.TOTAL_STEPS) * 100);
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressText) progressText.textContent = 'Шаг ' + step + ' из ' + C.TOTAL_STEPS;
    if (statusText) {
      statusText.textContent =
        step <= C.TOTAL_STEPS ? 'Вопрос ' + step + ' из ' + C.TOTAL_STEPS : 'Рекомендация готова';
    }
  }

  function showStep(num) {
    steps.forEach(function (step) {
      var n = parseInt(step.getAttribute('data-step'), 10);
      var active = n === num;
      step.classList.toggle('is-active', active);
      step.hidden = !active;
    });
    if (resultEl) {
      resultEl.classList.remove('is-visible');
      resultEl.hidden = true;
    }
    if (formWrap) formWrap.hidden = true;
    if (formEl) formEl.hidden = true;
    if (formSuccess) formSuccess.hidden = true;
    currentStep = num;
    setProgress(num);
    if (backBtn) backBtn.classList.toggle('is-visible', num > 1);
  }

  function goToStep(num) {
    if (transitioning || num < 1 || num > C.TOTAL_STEPS) return;
    var from = app.querySelector('.quiz-mvp__step.is-active');
    var to = app.querySelector('.quiz-mvp__step[data-step="' + num + '"]');
    if (!from || !to || from === to) {
      showStep(num);
      return;
    }
    transitioning = true;
    from.classList.add('is-leaving');
    from.classList.remove('is-active');
    setTimeout(function () {
      from.classList.remove('is-leaving');
      from.hidden = true;
      to.hidden = false;
      to.classList.add('is-active');
      currentStep = num;
      setProgress(num);
      if (backBtn) backBtn.classList.toggle('is-visible', num > 1);
      transitioning = false;
    }, 280);
  }

  function showResult() {
    steps.forEach(function (step) {
      step.classList.remove('is-active');
      step.hidden = true;
    });
    lastRecommendation = Rec.getRecommendation(answers);

    if (resultTitle) resultTitle.textContent = lastRecommendation.title;
    if (resultLead) resultLead.textContent = lastRecommendation.intro || lastRecommendation.summary;
    if (resultFormats) {
      resultFormats.innerHTML = '';
      lastRecommendation.formats.forEach(function (fmt) {
        var li = document.createElement('li');
        li.textContent = fmt;
        resultFormats.appendChild(li);
      });
    }

    if (resultEl) {
      resultEl.hidden = false;
      requestAnimationFrame(function () {
        resultEl.classList.add('is-visible');
      });
    }
    if (formWrap) formWrap.hidden = false;
    if (formEl) formEl.hidden = false;
    if (formSuccess) formSuccess.hidden = true;
    if (formError) formError.hidden = true;
    if (statusText) statusText.textContent = 'Рекомендация готова';
    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.textContent = 'Готово';
    if (backBtn) backBtn.classList.add('is-visible');
    currentStep = C.TOTAL_STEPS + 1;
  }

  function handleOptionClick(btn) {
    var field = btn.getAttribute('data-field');
    var value = btn.getAttribute('data-value');
    if (!field || !value || transitioning) return;

    answers[field] = value;

    if (currentStep < C.TOTAL_STEPS) {
      goToStep(currentStep + 1);
    } else {
      showResult();
    }
  }

  function restart() {
    answers = { client_type: '', goal: '', current_state: '', urgency: '' };
    lastRecommendation = null;
    if (formWrap) formWrap.hidden = true;
    if (formEl) {
      formEl.reset();
      formEl.hidden = true;
    }
    if (formSuccess) formSuccess.hidden = true;
    if (formError) formError.hidden = true;
    showStep(1);
  }

  function handleBack() {
    if (currentStep > C.TOTAL_STEPS) {
      showStep(C.TOTAL_STEPS);
      return;
    }
    if (currentStep > 1) goToStep(currentStep - 1);
  }

  function setFormMessage(el, message, visible) {
    if (!el) return;
    el.hidden = !visible;
    if (visible && message) el.textContent = message;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!lastRecommendation) return;

    var name = formEl.elements.name.value.trim();
    var telegram = formEl.elements.telegram.value.trim();
    var description = formEl.elements.description.value.trim();

    if (name.length < 2) {
      setFormMessage(formError, 'Укажите имя (минимум 2 символа).', true);
      return;
    }
    if (telegram.length < 3) {
      setFormMessage(formError, 'Укажите Telegram для связи.', true);
      return;
    }

    if (!Leads.isConfigured()) {
      setFormMessage(
        formError,
        'Форма временно недоступна: не настроен Supabase. Напишите в Telegram — ссылка внизу страницы.',
        true
      );
      return;
    }

    submitBtn.disabled = true;
    setFormMessage(formError, '', false);

    Leads.insertLead({
      name: name,
      telegram: telegram,
      client_type: C.labelFor('client_type', answers.client_type),
      goal: C.labelFor('goal', answers.goal),
      current_state: C.labelFor('current_state', answers.current_state),
      urgency: C.labelFor('urgency', answers.urgency),
      recommendation: lastRecommendation.recommendationText,
      description: description,
    })
      .then(function (res) {
        if (res.error) throw res.error;
        formEl.hidden = true;
        setFormMessage(
          formSuccess,
          'Заявка отправлена. Свяжусь с вами в Telegram и пришлю персональное предложение.',
          true
        );
      })
      .catch(function (err) {
        setFormMessage(
          formError,
          'Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram.',
          true
        );
        console.error('[quiz-mvp]', err);
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  }

  app.addEventListener('click', function (e) {
    var btn = e.target.closest('.quiz-mvp__option');
    if (btn) handleOptionClick(btn);
  });

  if (backBtn) backBtn.addEventListener('click', handleBack);
  if (restartBtn) restartBtn.addEventListener('click', restart);
  if (formEl) formEl.addEventListener('submit', handleSubmit);

  if (formWrap) formWrap.hidden = true;
  showStep(1);
})();
