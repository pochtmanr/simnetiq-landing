-- Support requests in every site language, not just en/ru.
--
-- The site now accepts any locale registered in landing/lib/locales.ts and
-- sends it with the support form. Until this is applied the RPC keeps
-- coercing anything but 'ru' to 'en', so nothing breaks in the meantime —
-- new-language requests are just recorded (and auto-replied) as English.
--
-- The shape check is deliberately loose (a language code, not a fixed list):
-- adding a language must not need a migration. The API route already
-- restricts the value to registered locales.
--
-- Apply manually (Supabase dashboard -> SQL Editor, or `supabase db push`).

alter table public.support_requests
  drop constraint if exists support_requests_locale_check;

alter table public.support_requests
  add constraint support_requests_locale_check check (locale ~ '^[a-z]{2,3}$');

create or replace function public.submit_support_request(
  p_name       text,
  p_email      text,
  p_topic      text,
  p_message    text,
  p_locale     text default 'en',
  p_user_agent text default null,
  p_ip_hash    text default null
)
returns table (id uuid, created_at timestamptz, duplicate boolean)
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_name    text := btrim(coalesce(p_name, ''));
  v_email   text := lower(btrim(coalesce(p_email, '')));
  v_topic   text := nullif(btrim(coalesce(p_topic, '')), '');
  v_message text := btrim(coalesce(p_message, ''));
  v_locale  text := case when p_locale ~ '^[a-z]{2,3}$' then p_locale else 'en' end;
  v_agent   text := nullif(left(btrim(coalesce(p_user_agent, '')), 500), '');
  v_hash    text := nullif(btrim(coalesce(p_ip_hash, '')), '');
  v_recent  public.support_requests%rowtype;
begin
  if char_length(v_name) < 1 or char_length(v_name) > 200 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;

  if char_length(v_email) < 3
     or char_length(v_email) > 320
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  if v_topic is not null and char_length(v_topic) > 100 then
    raise exception 'invalid_topic' using errcode = '22023';
  end if;

  if char_length(v_message) < 10 or char_length(v_message) > 5000 then
    raise exception 'invalid_message' using errcode = '22023';
  end if;

  -- Dedupe: the same person hitting Send twice, or a bot replaying one payload.
  select r.* into v_recent
    from public.support_requests r
   where r.email = v_email
     and r.message = v_message
     and r.created_at > now() - interval '10 minutes'
   order by r.created_at desc
   limit 1;

  if found then
    return query select v_recent.id, v_recent.created_at, true;
    return;
  end if;

  -- Flood gate. Deliberately generous — a real person with several separate
  -- problems must not be blocked — and it only bites when a salt is configured,
  -- because without one every caller hashes to null.
  if v_hash is not null
     and (select count(*)
            from public.support_requests r
           where r.ip_hash = v_hash
             and r.created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  return query
  insert into public.support_requests
              (name,   email,   topic,   message,   locale,   user_agent, ip_hash)
       values (v_name, v_email, v_topic, v_message, v_locale, v_agent,    v_hash)
    returning support_requests.id, support_requests.created_at, false;
end;
$$;

notify pgrst, 'reload schema';
