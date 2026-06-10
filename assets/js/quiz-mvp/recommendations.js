/**
 * MA.digital — движок персональных рекомендаций квиза
 */
(function (global) {
  'use strict';

  var C = global.QuizMvpConstants;

  var GOAL_CORE = {
    clients: {
      title: 'Лендинг + форма заявки',
      formats: ['лендинг', 'форма заявки', 'страница услуг'],
    },
    automate: {
      title: 'Мини-сервис или бот',
      formats: ['мини-сервис', 'цифровой помощник', 'автоматизация рутины'],
    },
    teach: {
      title: 'Образовательный продукт',
      formats: ['образовательный продукт', 'тренажёр', 'методические материалы'],
    },
    engage: {
      title: 'Игра или интерактив',
      formats: ['игра', 'интерактив', 'вовлекающая механика'],
    },
    idea: {
      title: 'MVP для проверки гипотезы',
      formats: ['MVP', 'прототип', 'быстрый запуск для теста'],
    },
  };

  function buildIntro(answers) {
    var parts = [];

    if (answers.client_type === 'teacher' || answers.client_type === 'school') {
      parts.push('В образовательной среде важно, чтобы решение было понятным и удобным для вашей аудитории.');
    } else if (answers.client_type === 'expert') {
      parts.push('Эксперту нужна ясная подача и доверие с первого экрана.');
    } else if (answers.client_type === 'entrepreneur') {
      parts.push('Для бизнеса важно быстро проверить спрос и получать понятный результат.');
    } else if (answers.client_type === 'self_employed') {
      parts.push('Самозанятому нужен компактный инструмент без лишней сложности.');
    }

    if (answers.current_state === 'idea_only') {
      parts.push('Начнём с небольшого формата, чтобы проверить гипотезу без больших вложений.');
    } else if (answers.current_state === 'has_site') {
      parts.push('У вас уже есть сайт — можно усилить его или добавить нужный инструмент.');
    } else if (answers.current_state === 'has_vk') {
      parts.push('Аудитория в соцсетях есть — нужна точка входа, куда удобно направлять людей.');
    } else if (answers.current_state === 'has_product') {
      parts.push('Продукт уже работает — поможем развить его или снять рутину.');
    } else if (answers.current_state === 'has_clients') {
      parts.push('Клиенты есть — задача в том, чтобы масштабировать и систематизировать процесс.');
    }

    if (answers.urgency === 'urgent') {
      parts.push('При срочном сроке предложу компактный формат с быстрым запуском.');
    } else if (answers.urgency === 'month') {
      parts.push('За месяц реально собрать рабочую версию и довести до запуска.');
    } else if (answers.urgency === 'exploring') {
      parts.push('Можно спокойно разобрать варианты и выбрать оптимальный формат.');
    }

    return parts.join(' ');
  }

  function refineFormats(goal, answers, formats) {
    var list = formats.slice();

    if (goal === 'clients') {
      if (answers.current_state === 'has_site') {
        list[0] = 'доработка сайта под заявки';
      }
      if (answers.client_type === 'expert') {
        list.push('сайт эксперта');
      }
    }

    if (goal === 'automate' && answers.current_state === 'has_vk') {
      list.push('бот для обработки обращений');
    }

    if (goal === 'teach' && (answers.client_type === 'teacher' || answers.client_type === 'school')) {
      list[0] = 'цифровой учебный формат';
    }

    if (goal === 'engage' && answers.client_type === 'school') {
      list[0] = 'обучающий интерактив';
    }

    if (goal === 'idea' && answers.urgency === 'urgent') {
      list[0] = 'быстрый MVP';
    }

    return list.slice(0, 3);
  }

  function getRecommendation(answers) {
    var goal = answers.goal || 'idea';
    var core = GOAL_CORE[goal] || GOAL_CORE.idea;
    var formats = refineFormats(goal, answers, core.formats);
    var intro = buildIntro(answers);

    var summary =
      core.title +
      ' — оптимальный формат для задачи «' +
      C.labelFor('goal', goal) +
      '».';

    return {
      title: core.title,
      summary: summary,
      intro: intro,
      formats: formats,
      recommendationText: summary + (intro ? ' ' + intro : ''),
    };
  }

  global.QuizMvpRecommendations = {
    getRecommendation: getRecommendation,
  };
})(window);
