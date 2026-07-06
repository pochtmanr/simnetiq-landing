-- Support requests submitted through the /support form on simnetiq.xyz.
-- Apply manually (Supabase dashboard -> SQL Editor, or `supabase db push`).

create table public.support_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 200),
  email       text not null check (char_length(email) between 3 and 320),
  topic       text check (char_length(topic) <= 100),
  message     text not null check (char_length(message) between 1 and 5000),
  -- UI language the request was submitted from; drives the auto-reply language
  locale      text not null default 'en' check (locale in ('en', 'ru')),
  user_agent  text,
  -- new -> open -> resolved, managed by the support team
  status      text not null default 'new' check (status in ('new', 'open', 'resolved'))
);

comment on table public.support_requests is
  'Contact form submissions from simnetiq.xyz/support. Inserted by the Next.js API route using the service role key.';

create index support_requests_created_at_idx
  on public.support_requests (created_at desc);

create index support_requests_status_idx
  on public.support_requests (status)
  where status <> 'resolved';

-- RLS on with no policies: the anon and authenticated roles can do nothing.
-- The API route uses the service role key, which bypasses RLS.
alter table public.support_requests enable row level security;
