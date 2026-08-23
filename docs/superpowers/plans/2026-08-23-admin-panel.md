# SMS Code Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the operator a browser UI for the twelve `admin_*` RPCs that already exist in Postgres, reachable only by one MFA-enrolled account.

**Architecture:** A route group inside the existing `landing` Next.js app. The browser talks to Supabase directly with the **anon key** and the operator's own `aal2` session; every capability is an existing `security definer` RPC gated by `is_admin()`. The app holds no privileged credential, which is what makes sharing a runtime with the public marketing site acceptable.

**Tech Stack:** Next 16.2.10 (App Router), React, Tailwind, `@supabase/supabase-js`, `@supabase/ssr`, Postgres/Supabase.

**Spec:** `landing/docs/superpowers/specs/2026-08-23-admin-panel-design.md`

## Global Constraints

- **`SUPABASE_SERVICE_ROLE_KEY` must never appear in the `landing` repo.** It was removed in `a8a5ecc`. If something seems to need it, the answer is a new `security definer` RPC.
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` may be read by admin code.
- **Every failure that could reveal the route's existence renders the 404.** Never "forbidden", never "not an admin".
- The only admin email is `rpochtman@simnetiq.store`.
- Supabase project ref: `zkuwqvtwlomktysuymyw`.
- **Never write the literal string `SERVICE_ROLE` anywhere under `lib/` or `app/`,
  even inside a warning comment** — Task 3's own grep gate treats any occurrence as
  a failure. Refer to it in prose as "the service-role key".
- `lib/admin/client.ts`, `guard.ts` and `rpc.ts` are `"use client"` modules. Any
  component that fetches admin data must therefore be a client component.
- There are **ten** panel-callable `admin_*` RPCs; `admin_assert` and `admin_log`
  are internal and are not called from the browser.
- `rpc.supportSetStatus()` resolves to a bare `number` (the audit id), not a row.
- `@supabase/ssr`'s `createBrowserClient` is required, not a preference: it stores
  the session in a **cookie**, which Task 4's middleware can see. Plain
  `supabase-js` uses `localStorage`, invisible to middleware, which would 404 a
  signed-in operator out of their own panel.
- Two repos: UI in `/Users/roman/Developer/smsapp/landing`, SQL in `/Users/roman/Developer/smsapp/sms-expo`.
- **No test runner exists in either repo and none is being added** (spec decision). The mechanical gates are `npx tsc --noEmit`, `npm run build`, and a runnable SQL gate script. Every task states its own manual verification.
- Landing commits that must deploy have to be authored `rpochtman-lang <269783741+rpochtman-lang@users.noreply.github.com>` — Vercel blocks other authors. Use `git -c user.name=... -c user.email=... commit`.

### RPC reference (all `grant execute ... to authenticated`, all gated by `is_admin()`)

```
admin_money_health()                         -> setof money_health
admin_audit_recent(p_limit int = 100)        -> setof admin_audit
admin_user_search(p_query text, p_limit int = 25)
  -> user_id uuid, email_masked text, has_no_email boolean, created_at timestamptz,
     balance_coins int, purchased_coins int, activations int, risk_score int, risk_band text
admin_user_overview(p_user uuid)
  -> user_id uuid, email text, created_at timestamptz, balance_coins int,
     risk_score int, risk_band text, facts jsonb, risk jsonb, audit_id bigint
admin_user_ledger(p_user uuid, p_limit int = 100)
  -> id bigint, created_at timestamptz, kind text, delta_coins int, balance_after int,
     shortfall_coins int, activation_id uuid, rc_transaction_id text, product_id text,
     usd_value numeric, idempotency_key text, note text
admin_user_activations(p_user uuid, p_limit int = 100)
  -> id uuid, created_at timestamptz, status text, close_reason text, service text,
     country_dial int, phone_masked text, has_sms boolean, sms_received_at timestamptz,
     first_sms_seconds int, coins_spent int, retry_of uuid, retry_index int,
     is_migrated boolean, provider_cost_cents int, released_at timestamptz
admin_reveal_sms(p_activation uuid, p_reason text)
  -> id uuid, user_id uuid, created_at timestamptz, status text, service text,
     country_dial int, phone text, sms_code text, sms_text text,
     sms_received_at timestamptz, audit_id bigint
admin_grant_coins(p_user uuid, p_coins int, p_reason text)
  -> user_id uuid, delta_coins int, balance int, audit_id bigint
admin_support_list(p_status text = null, p_limit int = 50)
  -> id uuid, created_at timestamptz, name text, email text, topic text,
     message text, locale text, status text
admin_support_set_status(p_id uuid, p_status text) -> bigint
```

### File structure

```
sms-expo/
  supabase/migrations/20260837000000_admin_email_lock.sql   Task 1
  supabase/admin/create-admin-user.sql                      Task 2
  supabase/admin/admin-panel-gates.sql                      Task 1

landing/
  middleware.ts                        Task 4  route concealment
  lib/admin/client.ts                  Task 3  browser supabase client
  lib/admin/guard.ts                   Task 3  session -> AdminState
  lib/admin/rpc.ts                     Task 3  typed RPC wrappers
  lib/admin/format.ts                  Task 3  coins/dates/masking helpers
  app/(admin)/layout.tsx               Task 5  shell, no marketing chrome
  app/(admin)/admin/page.tsx           Task 6  dashboard
  app/(admin)/admin/AuthGate.tsx       Task 5  signin/enrol/challenge
  app/(admin)/admin/users/page.tsx     Task 7  search
  app/(admin)/admin/users/[id]/page.tsx Task 7 detail
  app/(admin)/admin/users/[id]/Actions.tsx Task 8 grant + reveal
  app/(admin)/admin/support/page.tsx   Task 9  inbox
  app/sitemap.ts, app/robots.ts        Task 10 exclusion
```

### Dependency graph (for parallel dispatch)

```
Wave 1 (parallel):  Task 1 + Task 2  (sms-expo, SQL)
                    Task 3           (landing, foundation)
Wave 2 (after 3):   Task 4, Task 5
Wave 3 (after 5):   Task 6 | Task 7 | Task 9   (parallel, disjoint files)
Wave 4 (after 7):   Task 8
Wave 5:             Task 10
```

---

### Task 1: Email-lock trigger + SQL gates

**Repo:** `sms-expo`

**Files:**
- Create: `supabase/migrations/20260837000000_admin_email_lock.sql`
- Create: `supabase/admin/admin-panel-gates.sql`

**Interfaces:**
- Consumes: `public.admins` (from `20260834000000_admin.sql`), `auth.users`.
- Produces: trigger `admins_email_lock` on `public.admins`. No new callable API.

- [ ] **Step 1: Write the migration**

```sql
-- Defence in depth. public.admins is already service-role only, so this does
-- not stop an attacker who has the database. It stops the realistic failure:
-- a uid pasted from the wrong row of a search result, which would silently
-- hand production access to a real customer's account.
create or replace function public.admins_email_lock()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
begin
  select u.email into v_email from auth.users u where u.id = new.user_id;
  if v_email is distinct from 'rpochtman@simnetiq.store' then
    raise exception
      'public.admins accepts only rpochtman@simnetiq.store (uid % has email %)',
      new.user_id, coalesce(v_email, '<no such user>')
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists admins_email_lock on public.admins;
create trigger admins_email_lock
  before insert or update on public.admins
  for each row execute function public.admins_email_lock();
```

- [ ] **Step 2: Write the gate script**

`supabase/admin/admin-panel-gates.sql`. Follow the existing `deploy-gates.sql`
convention: **independent statements** (the SQL editor does not guarantee a
shared session), and any write is done inside a plpgsql block that is
deliberately aborted, so the script leaves nothing behind.

```sql
-- GATE 1 — the trigger rejects a non-matching email.
do $$
declare v_other uuid; v_ok boolean := false;
begin
  select id into v_other from auth.users
   where email is distinct from 'rpochtman@simnetiq.store' limit 1;
  if v_other is null then
    raise notice 'GATE 1 SKIP - no other user exists to test with';
    return;
  end if;
  begin
    insert into public.admins (user_id, note) values (v_other, 'gate probe');
    raise exception 'GATE 1 FAIL - insert of a non-admin email succeeded';
  exception when check_violation then
    v_ok := true;
  end;
  raise notice 'GATE 1 %', case when v_ok then 'PASS' else 'FAIL' end;
  raise exception 'rollback gate 1';   -- deliberate: leave nothing behind
exception when others then
  if sqlerrm <> 'rollback gate 1' then raise; end if;
end $$;

-- GATE 2 — at most one live admin.
select case when count(*) <= 1 then 'GATE 2 PASS' else 'GATE 2 FAIL' end,
       count(*) as live_admins
  from public.admins where revoked_at is null;

-- GATE 3 — every admin_* RPC is revoked from anon.
select case when count(*) = 0 then 'GATE 3 PASS'
            else 'GATE 3 FAIL: ' || string_agg(p.proname, ', ') end
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname like 'admin\_%'
   and has_function_privilege('anon', p.oid, 'EXECUTE');

-- GATE 4 — is_admin() is false on this session unless it is a direct DB
-- connection (the SQL editor legitimately returns true; see 20260834 comments).
select public.is_admin() as is_admin_here,
       session_user,
       'expect true only in the SQL editor / psql' as note;
```

- [ ] **Step 3: Verify the migration applies cleanly**

Do **not** `db push` (bare `create table` elsewhere in the chain). Paste the
migration into the Supabase SQL editor. Expected: `CREATE FUNCTION`,
`CREATE TRIGGER`, no error.

- [ ] **Step 4: Run the gates**

Paste `admin-panel-gates.sql` statement by statement. Expected: GATE 1 PASS (or
SKIP), GATE 2 PASS, GATE 3 PASS, GATE 4 shows `true` in the editor.

- [ ] **Step 5: Record it as applied**

```bash
cd /Users/roman/Developer/smsapp/sms-expo
supabase migration repair --status applied 20260837000000
supabase migration list --linked   # 20260837 has a Remote row; 20260833 still does not
```

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260837000000_admin_email_lock.sql supabase/admin/admin-panel-gates.sql
git commit -m "Refuse any admin but the one address"
```

---

### Task 2: SQL-only admin account runbook

**Repo:** `sms-expo`

**Files:**
- Create: `supabase/admin/create-admin-user.sql`

**Interfaces:**
- Consumes: `auth.users`, `public.admins`, the Task 1 trigger.
- Produces: nothing callable. A runbook a human pastes.

- [ ] **Step 1: Write the runbook**

Header must state plainly that direct `auth.users` inserts are
**documented-but-unsupported** by Supabase and can break on an Auth upgrade,
that the failure mode is "cannot create a new admin" rather than "existing
admin locked out", and that the column set below is pinned deliberately.

```sql
-- 1. Create the account. Replace <PASSWORD> before running; do not commit it.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  'rpochtman@simnetiq.store',
  extensions.crypt('<PASSWORD>', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
  false, false
)
returning id;

-- 2. Allowlist it. The Task 1 trigger rejects any other address.
insert into public.admins (user_id, note)
select id, 'owner' from auth.users where email = 'rpochtman@simnetiq.store';

-- 3. Verify it can actually authenticate BEFORE relying on it.
select u.id, u.email, u.email_confirmed_at is not null as confirmed,
       u.encrypted_password is not null as has_password,
       a.user_id is not null as allowlisted
  from auth.users u
  left join public.admins a on a.user_id = u.id and a.revoked_at is null
 where u.email = 'rpochtman@simnetiq.store';
```

Also document **factor reset** (lost authenticator):

```sql
-- Removes the enrolled TOTP factor so the panel offers enrolment again.
delete from auth.mfa_factors
 where user_id = (select id from auth.users where email = 'rpochtman@simnetiq.store');
```

- [ ] **Step 2: Confirm `crypt` is reachable**

```sql
select extensions.gen_salt('bf') is not null as pgcrypto_ok;
```

If this errors, the extension lives in `public` on this project — adjust the
schema prefix in the runbook and say so in its header.

- [ ] **Step 3: Do NOT run it yet.** The owner runs it with a real password.
      The runbook is the deliverable.

- [ ] **Step 4: Commit**

```bash
git add supabase/admin/create-admin-user.sql
git commit -m "Create the admin account in SQL, and say what breaks it"
```

---

### Task 3: Landing foundation — client, guard, RPC wrappers

**Repo:** `landing`

**Files:**
- Modify: `package.json` (add `@supabase/supabase-js`, `@supabase/ssr`)
- Create: `lib/admin/client.ts`, `lib/admin/guard.ts`, `lib/admin/rpc.ts`, `lib/admin/format.ts`

**Interfaces:**
- Produces, relied on by Tasks 4–9:
  - `getAdminClient(): SupabaseClient` — browser client, anon key only.
  - `type AdminState = 'anon' | 'needsEnrol' | 'needsChallenge' | 'ready'`
  - `resolveAdminState(client): Promise<AdminState>`
  - `rpc.moneyHealth()`, `rpc.auditRecent(limit?)`, `rpc.userSearch(q, limit?)`,
    `rpc.userOverview(id)`, `rpc.userLedger(id, limit?)`,
    `rpc.userActivations(id, limit?)`, `rpc.revealSms(activationId, reason)`,
    `rpc.grantCoins(userId, coins, reason)`, `rpc.supportList(status?, limit?)`,
    `rpc.supportSetStatus(id, status)` — each returns the rows above, and each
    throws `AdminDenied` on Postgres `42501`.
  - `class AdminDenied extends Error`
  - `formatCoins(n)`, `formatWhen(iso)`, `formatUsd(n)`

- [ ] **Step 1: Add dependencies**

```bash
cd /Users/roman/Developer/smsapp/landing
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Write `lib/admin/client.ts`**

Must read **only** `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
and must carry a comment stating the service-role key is forbidden here and why.

- [ ] **Step 3: Write `lib/admin/guard.ts`**

`resolveAdminState` logic, in this order:

1. No session → `'anon'`.
2. `client.auth.mfa.getAuthenticatorAssuranceLevel()` → if `currentLevel === 'aal2'`, return `'ready'`.
3. `client.auth.mfa.listFactors()` → if no verified TOTP factor → `'needsEnrol'`.
4. Otherwise → `'needsChallenge'`.

Allowlist membership is **not** checked here — it is checked by the RPCs. A
non-allowlisted user reaching `'ready'` still gets `42501` from every call,
which the UI renders as the 404.

- [ ] **Step 4: Write `lib/admin/rpc.ts`**

Thin wrappers, one per RPC, with the exact parameter names from the reference
block at the top of this plan. Every wrapper maps a PostgREST error whose
`code === '42501'` to `throw new AdminDenied()`.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 6: Verify no privileged key crept in**

```bash
grep -rn "SERVICE_ROLE" lib/ app/ || echo "clean"
```
Expected: `clean`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/admin
git -c user.name='rpochtman-lang' -c user.email='269783741+rpochtman-lang@users.noreply.github.com' \
  commit -m "Admin data layer for the browser, anon key only"
```

---

### Task 4: Route concealment + the entry knock

**Repo:** `landing`

**Files:**
- Create: `proxy.ts` (Next 16 renamed the `middleware` convention; `middleware.ts` still works but is deprecated)
- Modify: `.env.example` (add `ADMIN_ENTRY_SECRET`)

**Why a knock at all.** The original rule — "404 unless a session cookie is
present" — is unsatisfiable: the sign-in form lives at `/admin`, and you have
no session until you have signed in, so it would 404 the one page you need.
The knock resolves that without weakening anything: `ADMIN_ENTRY_SECRET`
gates **visibility**, never access. Access is still password + TOTP +
`is_admin()` in Postgres. Treat the secret as a curtain, not a lock, and never
describe it as authentication.

**Interfaces:**
- Consumes: nothing from Task 3. Cookie/query inspection only — importing the
  Supabase SDK into middleware would pull it into the edge bundle.
- Produces: the guarantee Tasks 5–9 rely on, that `/admin*` is a 404 for anyone
  without either the knock cookie or a Supabase session cookie.

- [ ] **Step 1: Write the middleware**

Match `/admin/:path*`. Logic, in order:

1. If `?k=` is present and equals `process.env.ADMIN_ENTRY_SECRET`, compared
   with a **timing-safe** comparison (compare SHA-256 digests via Web Crypto with
   an XOR accumulator — `node:crypto`'s `timingSafeEqual` is not a safe assumption
   in this runtime, and digest comparison leaks nothing about length either): set cookie `admin_entry`, value = the
   secret, `httpOnly`, `secure`, `sameSite: 'lax'`, `path: '/admin'`,
   `maxAge: 60*60*24*180`; then **redirect to the same path without the query
   string**, so the secret does not linger in the address bar, in history, or
   in a `Referer` header.
2. Else if the `admin_entry` cookie matches the secret → `NextResponse.next()`.
3. Else if a Supabase session cookie is present. Match `startsWith("sb-")` **and**
   `includes("-auth-token")` — NOT `endsWith`: `@supabase/ssr` chunks a large
   session into `sb-<ref>-auth-token.0` / `.1`, and `endsWith` would miss those
   and 404 a signed-in operator → `NextResponse.next()`. This keeps a
   signed-in operator working if the knock cookie is cleared.
4. Else → render the site's real 404 body with status 404.

If `ADMIN_ENTRY_SECRET` is unset, **fail closed**: always 404. An unset secret
must never mean "open to everyone".

- [ ] **Step 2: The 404 must be indistinguishable**

Rewrite to a synthetic path that matches no route (e.g. `/_404`), so Next
renders `app/global-not-found.tsx`. Verify by diff, not by eye.

**Do NOT rewrite to Next's own `/_not-found`.** It is a real prerendered route
and answers `Cache-Control: s-maxage=31536000`, which both differs visibly from
a genuine 404 and invites the CDN to pin that 404 onto `/admin` for a year with
no `Vary: Cookie` — locking out the very operator the knock exists for.

Note dev mode cannot be byte-identical and that is intrinsic to Next, not to
this code: dev HTML embeds the requested path in the RSC payload and a
per-request nonce. Two genuine 404s differ from each other too. Judge this on a
production build.

- [ ] **Step 3: Add to `.env.example`**

```
# Gates VISIBILITY of /admin, not access. Access is password + TOTP + is_admin().
# Generate with: openssl rand -hex 24
ADMIN_ENTRY_SECRET=REPLACE-WITH-RANDOM-SECRET
```

- [ ] **Step 4: Verify locally**

```bash
npm run dev
curl -s -o /dev/null -w '%{http_code}\n' 'localhost:3000/admin'                 # 404
curl -s -o /dev/null -w '%{http_code}\n' 'localhost:3000/nope-not-real'         # 404
diff <(curl -s localhost:3000/admin) <(curl -s localhost:3000/nope-not-real)     # silent
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' 'localhost:3000/admin?k=<secret>'  # 307 -> /admin
curl -s -o /dev/null -w '%{http_code}\n' -b 'admin_entry=<secret>' localhost:3000/admin     # 200
curl -s -o /dev/null -w '%{http_code}\n' 'localhost:3000/admin?k=wrong'         # 404
```

- [ ] **Step 5: Commit** (author as rpochtman-lang)

### Task 5: Shell + auth screens

**Repo:** `landing`

**Files:**
- Create: `app/(admin)/layout.tsx`, `app/(admin)/admin/AuthGate.tsx`

**Interfaces:**
- Consumes: `resolveAdminState`, `getAdminClient`, `AdminDenied` (Task 3).
- Produces: `<AuthGate>{children}</AuthGate>` — renders children only when state is `'ready'`; renders the 404 body for `'anon'`; otherwise renders enrol or challenge.

- [ ] **Step 1: Layout** — own `<html>`-level shell, `noindex,nofollow` metadata, no `SiteFooter`, no locale switcher, no marketing nav.

- [ ] **Step 2: Sign-in** — `signInWithPassword({ email, password })`. On failure show a single neutral "Sign in failed" — never distinguish unknown-email from wrong-password.

- [ ] **Step 3: Enrol** — `mfa.enrol({ factorType: 'totp' })`, render the returned QR (`data.totp.qr_code`) and the secret as text, then `mfa.challengeAndVerify`. Warn on-screen that the QR is shown once.

- [ ] **Step 4: Challenge** — six-digit input → `mfa.challengeAndVerify({ factorId, code })` → re-resolve state.

- [ ] **Step 5: Manual verification** — with a real account: wrong password shows the neutral error; correct password with no factor shows enrol; after enrolling, a fresh sign-in shows challenge, not enrol.

- [ ] **Step 6: Commit** (author as rpochtman-lang)

---

### Task 6: Dashboard

**Repo:** `landing` · **Files:** Create `app/(admin)/admin/page.tsx`

**Interfaces:** Consumes `rpc.moneyHealth()`, `rpc.auditRecent(100)`, `formatCoins`, `formatWhen`, `<AuthGate>`.

- [ ] **Step 1:** Render the `money_health` row(s) as labelled figures, and `admin_audit` as a reverse-chronological table (when, action, subject, reason).
- [ ] **Step 2:** `AdminDenied` anywhere → render the 404 body.
- [ ] **Step 3:** Verify: `npx tsc --noEmit`; the page shows real numbers for an aal2 session.
- [ ] **Step 4:** Commit (author as rpochtman-lang).

---

### Task 7: User search and detail

**Repo:** `landing` · **Files:** Create `app/(admin)/admin/users/page.tsx`, `app/(admin)/admin/users/[id]/page.tsx`

**Interfaces:** Consumes `rpc.userSearch`, `rpc.userOverview`, `rpc.userLedger`, `rpc.userActivations`. Produces the detail route `/admin/users/[id]` that Task 8 mounts its actions into.

- [ ] **Step 1:** Search box → `rpc.userSearch(q)` → table linking each `user_id` to the detail page. Show `email_masked`, balance, activations, `risk_band`.
- [ ] **Step 2:** Detail page: overview header, then ledger and activations tables. `phone_masked` only — this page must never render a full number or SMS body.
- [ ] **Step 3:** Verify: `npx tsc --noEmit`; search a known user; confirm no unmasked PII in the DOM.
- [ ] **Step 4:** Commit (author as rpochtman-lang).

---

### Task 8: Actions — grant coins, reveal SMS

**Repo:** `landing` · **Files:** Create `app/(admin)/admin/users/[id]/Actions.tsx`; Modify `app/(admin)/admin/users/[id]/page.tsx` to mount it.

**Interfaces:** Consumes `rpc.grantCoins`, `rpc.revealSms`.

- [ ] **Step 1: Grant coins** — amount + reason. Client-side: reason ≥ 8 chars, coins 1–2000. The cap is enforced in SQL; the UI must not imply it can be exceeded. Confirm step naming the exact amount. On success show `balance` and the returned `audit_id`.
- [ ] **Step 2: Reveal SMS** — activation picker + required reason, confirm step warning that this is recorded. Render `phone`, `sms_code`, `sms_text` **once**, plus `audit_id`. Do not cache it in component state across navigation.
- [ ] **Step 3:** Verify: grant 1 coin to a test user with reason "gate probe test" → balance increments, audit row appears on the dashboard. Reveal one activation → audit row appears.
- [ ] **Step 4:** Commit (author as rpochtman-lang).

---

### Task 9: Support inbox

**Repo:** `landing` · **Files:** Create `app/(admin)/admin/support/page.tsx`

**Interfaces:** Consumes `rpc.supportList`, `rpc.supportSetStatus`.

- [ ] **Step 1:** List with a status filter; each row shows when, name, email, topic, message, locale, status.
- [ ] **Step 2:** Status control per row → `rpc.supportSetStatus(id, status)` → optimistic update, revert on error.
- [ ] **Step 3:** Verify: `npx tsc --noEmit`. The table currently renders empty — the form has never had a real submission — so assert the empty state reads correctly rather than asserting rows.
- [ ] **Step 4:** Commit (author as rpochtman-lang).

---

### Task 10: Keep it out of every index — VERIFIED, NO CHANGE NEEDED

**Repo:** `landing` · **Files:** Modify `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`

- [x] **Step 1:** Confirmed. `sitemap.ts` is an explicit `STATIC_PATHS` list plus the four content registries; `/admin` is in neither, so it cannot be emitted.
- [x] **Step 2:** `robots.ts` disallows only `/api/` and stays silent about `/admin`, as intended — naming it there would publish it.
- [x] **Step 3:** Built and grepped: no `admin` in the sitemap body, none in `robots.txt`.
- [x] **Step 4:** 156 pages (153 + the three static admin routes), build green.
- [x] **Step 5:** No code change was required, so there was nothing to commit.

---

### Task 11: Close the header leak — MEASURED, NO CHANGE NEEDED

**Repo:** `landing` · **Files:** possibly `vercel.json`

A `NextResponse.rewrite()` always emits an `x-middleware-rewrite` response
header, and Next offers no way to suppress it. A genuine 404 carries no such
header, so **the body is byte-identical but the full response is not** — a
scanner comparing headers can still tell `/admin` from a path that was never
written. The rewrite target was made deliberately dull (`/_404`) so it reads
as "this 404'd" rather than "something is hidden here", but the header's mere
presence is the tell.

**Measured on production 2026-08-23 and the answer is: Vercel strips it.** No
`vercel.json` was added, because none was needed — and the whole point of
measuring first was to avoid shipping config against a guess.

```
/admin          404  etag "984fe2314a80446846f9a40c92fa1641"  x-matched-path: /404
/nope-not-real  404  etag "984fe2314a80446846f9a40c92fa1641"  x-matched-path: /404
```

Bodies byte-identical, headers identical once `date`/`x-vercel-id`/`age` are
excluded. `x-middleware-rewrite` does not reach the client. Re-check this if
Next or Vercel's edge behaviour changes; it is their implementation detail,
not a guarantee we control.

- [x] **Step 1: Measure it on production, once deployed** — done, see above.

```bash
curl -sI https://simnetiq.xyz/admin        | grep -i x-middleware-rewrite
curl -sI https://simnetiq.xyz/nope-not-real | grep -i x-middleware-rewrite
```

- [x] **Step 2: Not needed.** The header does not reach the client.

Add a `vercel.json` response-header transform removing `x-middleware-rewrite`
on `/admin/:path*`. Do not add speculative config before Step 1 says it is
needed.

- [x] **Step 3: Confirmed indistinguishable.**

---

## Self-review

- **Spec coverage:** placement/concealment → 4, 10. Auth flow → 5. SQL bootstrap → 1, 2. Four screens → 6, 7, 8, 9. Security model → Global Constraints + 3. Error handling → 3 (`AdminDenied`) + per-screen. Verification → 1 (gates) + per-task manual steps. No gaps.
- **Deviation from the skill's TDD default,** stated deliberately: neither repo has a test runner and the approved spec declines to add one. Mechanical gates are `tsc`, `next build`, and the SQL gate script; each task carries explicit manual verification instead of a red-green cycle.
- **Type consistency:** `AdminState`, `AdminDenied`, `getAdminClient`, `resolveAdminState` and the `rpc.*` names are defined in Task 3 and used verbatim in 5–9.
