-- MA.digital — таблица заявок из квиза «Подобрать решение за 2 минуты»
-- Выполните в Supabase SQL Editor или через supabase db push

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  telegram text not null,
  client_type text not null,
  goal text not null,
  current_state text not null,
  urgency text not null,
  recommendation text not null,
  description text
);

comment on table public.leads is 'Заявки с интерактивного консультанта MA.digital';
comment on column public.leads.client_type is 'Кто вы? (шаг 1)';
comment on column public.leads.goal is 'Что хотите получить? (шаг 2)';
comment on column public.leads.current_state is 'Что уже есть? (шаг 3)';
comment on column public.leads.urgency is 'Когда нужен результат? (шаг 4)';
comment on column public.leads.recommendation is 'Персональная рекомендация после квиза';

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Публичная форма: только вставка (anon)
create policy "leads_anon_insert"
  on public.leads
  for insert
  to anon
  with check (
    char_length(trim(name)) >= 2
    and char_length(trim(telegram)) >= 3
    and char_length(trim(client_type)) >= 1
    and char_length(trim(goal)) >= 1
    and char_length(trim(current_state)) >= 1
    and char_length(trim(urgency)) >= 1
    and char_length(trim(recommendation)) >= 1
  );

-- Админ: чтение для авторизованных пользователей
create policy "leads_auth_select"
  on public.leads
  for select
  to authenticated
  using (true);
