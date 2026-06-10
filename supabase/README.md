# Supabase для MA.digital

## 1. Создайте проект

1. [supabase.com](https://supabase.com) → New project
2. Скопируйте **Project URL** и **anon public key** (Settings → API)

## 2. Примените миграцию

В **SQL Editor** выполните файл `migrations/001_create_leads.sql`.

## 3. Настройте конфиг на сайте

```bash
cp assets/js/config/supabase.config.example.js assets/js/config/supabase.config.js
```

Заполните `url` и `anonKey` в `assets/js/config/supabase.config.js`.

> Используйте только **anon public key** в браузере. Service role key не подключайте к сайту.

## 4. Создайте администратора

Authentication → Users → Add user (email + пароль).

Этим аккаунтом входите на `/admin`.

## 5. Проверка

1. Пройдите квиз на главной → отправьте форму
2. Table Editor → `leads` — должна появиться запись
3. `/admin` — войдите и откройте заявку

## RLS

| Роль            | insert | select |
|-----------------|--------|--------|
| anon (сайт)     | ✅     | ❌     |
| authenticated   | ❌     | ✅     |

Для CRM позже: отдельные роли, статусы заявок, заметки.
