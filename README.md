# MA.digital

Сайт цифровой мастерской решений + инструмент сбора заявок.

## Квиз «Подобрать решение за 2 минуты»

Блок на главной (`#quiz-mvp`): 4 шага → рекомендация → форма заявки.

## Supabase

Инструкция: [supabase/README.md](supabase/README.md)

1. Выполните миграцию `supabase/migrations/001_create_leads.sql`
2. Укажите `url` и `anonKey` в `assets/js/config/supabase.config.js`
3. Создайте пользователя в Supabase Auth для `/admin`

## Админ-панель

`/admin` — просмотр заявок (вход по email/паролю Supabase).

## Структура

```
assets/
  css/quiz-mvp.css, admin.css
  js/
    config/supabase.config.js
    quiz-mvp/          — квиз
    leads/             — API заявок
    admin/             — админка
admin/index.html
supabase/migrations/
index.html             — главная
```
