# SMS Code admin panel — design

> Status: approved 2026-08-23. Data layer already exists (migration
> `20260834000000_admin.sql` in the `sms-expo` repo). This spec covers the UI,
> the auth flow, and the SQL-only account bootstrap.

## Problem

Every operational task — reading the money-health row, answering "where did my
coins go", granting a make-good, reading an SMS body for a support case — is
currently a paste-into-the-Supabase-SQL-editor job. That is slow, it is done
with a connection that owns every table in the database, and it leaves no
record distinguishable from any other query.

The database half of the fix already shipped. `20260834000000_admin.sql`
provides the allowlist, the audit trail, the masked views and ten `admin_*`
RPCs. What is missing is something to drive them.

## Non-goals

- No user-facing feature changes. This is an operator tool.
- No new database authority. Every capability already exists as an RPC; the
  panel is a client for them and adds no privilege of its own.
- No test runner. This repo has none, and introducing one is a separate
  decision. Verification is a SQL gate script plus manual browser checks.
- No refactor of the existing support API route.

## Decisions taken

| Question | Decision |
|---|---|
| Where it lives | A route group inside the existing `landing` Next.js app |
| Concealment | 404 for anyone without a session — indistinguishable from a missing route |
| Admin identity | Exactly one: `rpochtman@simnetiq.store`, enforced by a SQL trigger |
| First factor | Password, with the account created entirely in SQL |
| Second factor | TOTP, mandatory (`is_admin()` already requires `aal2`) |
| MFA enrollment | A one-time screen in the panel |
| v1 scope | All four areas: dashboard, user 360, actions, support inbox |

## The security model, stated once

**All authority lives in Postgres.** `is_admin()` requires *both* allowlist
membership and an `aal2` session; `admin_assert()` gates reads, and
`admin_log()` gates-and-records anything that mutates state or returns a phone
number or SMS body. Two RPCs are built so that removing the log breaks them:
`admin_grant_coins` derives its idempotency key from the audit row id, and
`admin_reveal_sms` returns it.

**Therefore the panel holds no secrets.** It uses the anon key and the
operator's own session, exactly as an ordinary visitor would. This is the
property that makes hosting it inside the public marketing site acceptable:
an attacker who fully compromises the landing runtime obtains what an
anonymous visitor already has, because every `admin_*` RPC raises `42501` for
`anon`.

> **Hard constraint.** `SUPABASE_SERVICE_ROLE_KEY` must never re-enter this
> codebase. It was removed from the support route on 2026-08-23 for exactly
> this reason. A service-role key anywhere in this app collapses the model
> above, and the admin route is the most tempting place to reintroduce one.
> If a future task seems to need it, the answer is a new `security definer`
> RPC, not a key.

## Architecture

```
landing/
  middleware.ts                     ← 404s /admin* without a session cookie
  app/(admin)/
    layout.tsx                      ← own shell; no marketing nav/footer/i18n
    admin/
      page.tsx                      ← dashboard
      users/page.tsx                ← search
      users/[id]/page.tsx           ← overview + ledger + activations + actions
      support/page.tsx              ← inbox
  lib/admin/
    client.ts                       ← browser supabase client (anon key only)
    guard.ts                        ← session → {anon|needsEnrol|needsChallenge|ready}
    rpc.ts                          ← thin typed wrappers over the admin_* RPCs
```

`(admin)` is a route group, so it shares no layout with `(en)`/`(ru)`. The
Supabase SDK is imported only under `(admin)` and code-splits out of the
marketing bundle.

### Concealment

`middleware.ts` matches `/admin/:path*` and rewrites to a 404 when no Supabase
session cookie is present. **404, not 401 and not a redirect** — an
unauthenticated prober cannot tell the route from one that does not exist.

A signed-in user who is not on the allowlist sees the same 404. No "you are
not an admin" message: that message confirms the route exists.

Excluded from `sitemap.ts`, `robots.ts` and `public/llms.txt`; `noindex,
nofollow`; never linked from any public page.

> Concealment is a nuisance filter, not a control. The control is `is_admin()`.
> Nothing in the panel may rely on the route being hard to find.

### Auth flow

```
no session          → 404
session, not listed → 404
listed, no factor   → enrol  (QR shown once, then verify)
listed, aal1        → challenge (6 digits)
listed, aal2        → panel
```

The enrollment screen **enrols a factor; it never grants access.** Reaching it
requires already being in `public.admins`, which is service-role-only and
populated by hand. Someone who is not listed cannot reach it, and enrolling a
factor on a non-listed account would still yield nothing.

Session drop below `aal2` (expiry) re-challenges rather than 404s, so a lapsed
session reads as "enter your code", not as a broken site.

## SQL-only bootstrap

New migration `20260837000000_admin_email_lock.sql`:

- `before insert or update on public.admins`: raise unless
  `(select email from auth.users where id = new.user_id)` is
  `rpochtman@simnetiq.store`.

This is defence in depth, not the primary control. The primary control is that
`public.admins` is service-role only. The trigger exists so that a mistyped or
pasted-wrong uid fails loudly instead of silently granting production access to
someone else's account.

New runbook `supabase/admin/create-admin-user.sql` (in the `sms-expo` repo,
beside the existing runbooks):

1. `insert into auth.users (...)` with
   `encrypted_password = crypt('<password>', gen_salt('bf'))`.
2. `insert into public.admins (user_id, note)`.

Direct `auth.users` inserts are documented-but-unsupported by Supabase and can
break on an Auth upgrade. The runbook therefore pins the exact column set and
says so at the top, with a verification query that confirms the row can
actually authenticate before anyone relies on it.

## Screens

**Dashboard** `/admin` — `admin_money_health()` and `admin_audit_recent()`.
Read-only, no PII, no prompts. The daily-glance screen: balances reconciled,
refunds, margins, and every action taken in the panel.

**Users** `/admin/users` — `admin_user_search()`. Then `/admin/users/[id]`
composing `admin_user_overview`, `admin_user_ledger`,
`admin_user_activations`. Numbers masked, SMS bodies absent.

**Actions**, on the user page:

- *Grant coins* — `admin_grant_coins`. Hard cap 2000 in SQL; reason of at
  least eight characters; confirm step. The UI must not imply it can exceed
  the cap.
- *Reveal SMS* — `admin_reveal_sms`. The only path to a full number or an SMS
  body. Reason required, confirm step, result shown once, and the returned
  audit id displayed back to the operator so the record is visibly real.

**Support** `/admin/support` — `admin_support_list`,
`admin_support_set_status`.

## Error handling

| Condition | Behaviour |
|---|---|
| `42501 insufficient_privilege` | Treat as not-an-admin → 404. Never explain. |
| Session below `aal2` | Re-challenge screen. |
| RPC network/5xx | Inline error with retry; never a blank screen. |
| Mutating RPC success | Show the returned audit id. |

## Verification

No test runner is introduced. Instead:

`supabase/admin/admin-panel-gates.sql`, in the style of the existing
`deploy-gates.sql` (which writes nothing — gate 3 aborts a plpgsql
subtransaction deliberately). Gates:

1. The `admins` trigger rejects a uid whose email is not
   `rpochtman@simnetiq.store`.
2. `is_admin()` is false for an `aal1` session.
3. Every `admin_*` RPC raises `42501` for `anon`.
4. `public.admins` contains at most one non-revoked row.

Plus manual browser verification: the 404 for an anonymous visitor, the enrol
→ challenge → panel path once, and each of the four screens rendering real
data.

## Risks accepted

- **Shared runtime with the public marketing site.** Mitigated by the anon-key
  constraint above; the residual risk is that a future change reintroduces a
  privileged key. The gate script and this document exist to make that loud.
- **Direct `auth.users` insert** may break on a Supabase Auth upgrade. The
  failure mode is "cannot create a *new* admin", not "existing admin locked
  out", so it is recoverable.
- **One admin, one TOTP factor.** Losing the authenticator means re-enrolling
  via SQL (delete the factor row, re-enrol). Documented in the runbook.
