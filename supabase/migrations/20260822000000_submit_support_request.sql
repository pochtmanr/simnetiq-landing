-- Support form hardening.
--
-- BEFORE: app/api/support/route.ts sent SUPABASE_SERVICE_ROLE_KEY to PostgREST
-- for exactly one insert. That key bypasses RLS on every table in the
-- production project — wallets, wallet_ledger, activations (rented phone
-- numbers *and* the full text of every received SMS), device_tokens,
-- auth.users. One contact-form insert never justified that blast radius, and
-- the key lived in a Vercel env var on a public marketing site.
--
-- AFTER: the site calls public.submit_support_request(...) with the ANON key.
-- The function is `security definer`, so it can write the RLS-locked table, and
-- it is the only thing the anon role may do with support_requests: no select,
-- no update, no delete, and no reach into any other table in the project.
--
-- Apply manually (Supabase dashboard -> SQL Editor, or `supabase db push`).
-- AFTER APPLYING: delete SUPABASE_SERVICE_ROLE_KEY from the Vercel project
-- (Settings -> Environment Variables) and from landing/.env.local. The route
-- no longer reads it.

-- ---------------------------------------------------------------------------
-- 1. Columns the hardened path needs
-- ---------------------------------------------------------------------------

alter table public.support_requests
  add column if not exists ip_hash text;

comment on column public.support_requests.ip_hash is
  'sha256(SUPPORT_IP_HASH_SALT || client ip), hex. Salted and one-way so the raw '
  'address is never stored, but repeat submissions from one source are still '
  'countable. Null when the salt is not configured.';

comment on table public.support_requests is
  'Contact form submissions from simnetiq.xyz/support. Written only by '
  'public.submit_support_request(), which the Next.js API route calls with the '
  'anon key. The service-role key is deliberately no longer used here.';

-- Supports both the (email, message) dedupe and the per-ip_hash flood gate
-- inside submit_support_request().
create index if not exists support_requests_email_created_at_idx
  on public.support_requests (email, created_at desc);

create index if not exists support_requests_ip_hash_created_at_idx
  on public.support_requests (ip_hash, created_at desc)
  where ip_hash is not null;

-- ---------------------------------------------------------------------------
-- 2. The only write path
-- ---------------------------------------------------------------------------
--
-- Validation is duplicated from the API route on purpose. The route's checks
-- are a UX affordance; these are the security boundary, because the anon key is
-- public and anyone can call this RPC directly without going through the site.
--
-- Returns `duplicate = true` (and the ORIGINAL row's id) when the same
-- (email, message) pair arrived inside the last 10 minutes. The caller uses
-- that to skip the n8n webhook, so a double-submit does not send the team two
-- emails.

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
  v_locale  text := case when p_locale = 'ru' then 'ru' else 'en' end;
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

comment on function public.submit_support_request(text,text,text,text,text,text,text) is
  'Insert one contact-form submission. The ONLY write path into '
  'support_requests that is reachable without the service-role key. Validates, '
  'dedupes on (email, message) within 10 minutes, and flood-gates per ip_hash.';

-- Functions are granted to PUBLIC by default; take that away first.
revoke all on function public.submit_support_request(text,text,text,text,text,text,text)
  from public;

grant execute on function public.submit_support_request(text,text,text,text,text,text,text)
  to anon, authenticated;

-- The anon role must still not be able to read anyone's support requests.
-- RLS stays enabled with no policies (from 20260706000000); this is belt and
-- braces in case a future `grant ... on all tables` widens things.
revoke all on table public.support_requests from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Make an n8n outage visible
-- ---------------------------------------------------------------------------
--
-- The row is written before the webhook fires, and a webhook failure is only
-- logged. So if n8n stops, submissions keep succeeding for the user and land in
-- a table nobody is watching. This view is the thing to alert on: any row still
-- 'new' a day later means either nobody read the email or the email never
-- arrived. Wire it to whatever check runs the other health queries; querying it
-- by hand once a day is still better than the current zero.

create or replace view public.support_requests_stale as
  select id, created_at, topic, locale, status,
         now() - created_at as age
    from public.support_requests
   where status = 'new'
     and created_at < now() - interval '24 hours'
   order by created_at;

comment on view public.support_requests_stale is
  'Support requests still unacknowledged after 24h. Non-empty means the n8n '
  'email workflow is down or nobody is reading support@simnetiq.store.';

revoke all on public.support_requests_stale from anon, authenticated;

-- PostgREST caches the schema; without this the new RPC 404s until it reloads.
notify pgrst, 'reload schema';
