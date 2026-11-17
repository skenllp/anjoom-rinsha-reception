-- Run once in Supabase → SQL Editor.
-- Guests (anonymous) may INSERT wishes and READ only approved ones.
-- New wishes start as approved = false; approve them in Table Editor by ticking `approved`.

create table if not exists public.wishes (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(btrim(name)) between 2 and 60),
  message    text not null check (char_length(btrim(message)) between 5 and 400),
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.wishes enable row level security;

drop policy if exists "guests can send wishes" on public.wishes;
create policy "guests can send wishes"
  on public.wishes for insert
  to anon
  with check (approved = false);

drop policy if exists "anyone can read approved wishes" on public.wishes;
create policy "anyone can read approved wishes"
  on public.wishes for select
  to anon
  using (approved = true);
