/**
 * MA.digital — константы квиза «Подобрать решение за 2 минуты»
 */
(function (global) {
  'use strict';

  var LABELS = {
    client_type: {
      entrepreneur: 'Предприниматель',
      expert: 'Эксперт',
      teacher: 'Учитель',
      school: 'Школа',
      self_employed: 'Самозанятый',
      other: 'Другое',
    },
    goal: {
      clients: 'Клиентов',
      automate: 'Автоматизировать работу',
      teach: 'Обучать людей',
      idea: 'Протестировать идею',
      engage: 'Вовлечь аудиторию',
    },
    current_state: {
      idea_only: 'Только идея',
      has_site: 'Есть сайт',
      has_vk: 'Есть группа ВК',
      has_product: 'Есть продукт',
      has_clients: 'Есть клиенты',
    },
    urgency: {
      urgent: 'Срочно',
      month: 'В течение месяца',
      exploring: 'Пока изучаю варианты',
    },
  };

  var STEPS = [
    {
      id: 1,
      field: 'client_type',
      question: 'Кто вы?',
      options: [
        { value: 'entrepreneur', label: 'Предприниматель' },
        { value: 'expert', label: 'Эксперт' },
        { value: 'teacher', label: 'Учитель' },
        { value: 'school', label: 'Школа' },
        { value: 'self_employed', label: 'Самозанятый' },
        { value: 'other', label: 'Другое' },
      ],
    },
    {
      id: 2,
      field: 'goal',
      question: 'Что хотите получить?',
      options: [
        { value: 'clients', label: 'Клиентов' },
        { value: 'automate', label: 'Автоматизировать работу' },
        { value: 'teach', label: 'Обучать людей' },
        { value: 'idea', label: 'Протестировать идею' },
        { value: 'engage', label: 'Вовлечь аудиторию' },
      ],
    },
    {
      id: 3,
      field: 'current_state',
      question: 'Что уже есть?',
      options: [
        { value: 'idea_only', label: 'Только идея' },
        { value: 'has_site', label: 'Есть сайт' },
        { value: 'has_vk', label: 'Есть группа ВК' },
        { value: 'has_product', label: 'Есть продукт' },
        { value: 'has_clients', label: 'Есть клиенты' },
      ],
    },
    {
      id: 4,
      field: 'urgency',
      question: 'Когда нужен результат?',
      options: [
        { value: 'urgent', label: 'Срочно' },
        { value: 'month', label: 'В течение месяца' },
        { value: 'exploring', label: 'Пока изучаю варианты' },
      ],
    },
  ];

  function labelFor(field, value) {
    return (LABELS[field] && LABELS[field][value]) || value;
  }

  global.QuizMvpConstants = {
    STEPS: STEPS,
    LABELS: LABELS,
    TOTAL_STEPS: STEPS.length,
    labelFor: labelFor,
  };
})(window);
