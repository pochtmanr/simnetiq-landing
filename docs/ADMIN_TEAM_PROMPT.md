# Task: admin team, roles, settings, invites, customer deletion, hardening

You are working in `/Volumes/RomanSSD/Developer/smsapp`, which holds two git repos:
- `landing/` is the Next.js 16.2 site with the admin panel at `landing/app/(admin)/admin/`. Read `landing/AGENTS.md` and the matching guide in `node_modules/next/dist/docs/` before writing Next code.
- `sms-expo/` is the app plus Supabase: `sms-expo/supabase/migrations`, `sms-expo/supabase/functions`.

Read `landing/CLAUDE.md` for the git rules. **Do not commit, push, deploy, or touch the production database.** The owner reviews the work, applies migrations and deploys edge functions.

## How the admin works today (read these first)

**Auth**
- Password + TOTP sign-in lives in `landing/app/(admin)/admin/AuthGate.tsx`. It includes a recovery flow (`SetPassword`, `consumeRecoveryHash`).
- `lib/admin/guard.ts` holds `resolveAdminState`, which returns anon, needsEnrol, needsChallenge or ready.
- The browser uses a Supabase client (`lib/admin/client.ts`) with the anon key only. The service-role key is banned from Vercel.

**Authorization**
- `public.is_admin()` (in `sms-expo/supabase/migrations/20260834000000_admin.sql`) requires an **aal2** session and a live row in the `public.admins` allowlist (`user_id, note, added_at, revoked_at`).
- Every `admin_*` RPC is `security definer`, calls `admin_assert()`, and writes `admin_log(...)` for any write.

**Admin UI**
- `lib/admin/rpc.ts` is the typed `rpc` object. Its errors are `AdminDenied` (42501) and `MigrationMissing` (PGRST202/42883).
- Shared components are in `app/(admin)/admin/components/` and re-exported by `ui.tsx`: Card, PageHeader, Facts, Stat (with `help`), Badge, DataTable (turns into cards on phones), EntityLink, States (MigrationNotice), Nav (TopNav plus BottomNav with a More sheet), and RevealSms.
- Screens load data with `useAdminData` + `<Loaded>`.
- Follow the look, the mobile-first rules (375px wide, no sideways scroll) and the comment style (comments explain *why*) of the existing pages.

**Other relevant code**
- The only account deletion today is self-service: `sms-expo/supabase/functions/delete-account/index.ts`. It covers the retention rules, `deleted_account_facts`, and `auth.admin.deleteUser` cascades. Reuse its logic; don't duplicate it.
- The jobs table is `admin_jobs()`, returning `JobRow`, and is shown on `app/(admin)/admin/system/page.tsx`.
- `landing/app/robots.ts` currently allows `/` and disallows only `/api/`. The admin layout (`app/(admin)/layout.tsx`) sets `robots: noindex` metadata.

## What to build

### 1. Roles
- Add `role text not null default 'worker' check (role in ('owner','worker'))` to `public.admins`, plus `email`, `invited_by`, `invited_at` and `last_seen_at` if useful.
  - **owner** means main admin. There can be **at most 2** live owners, enforced in the database with a trigger or constraint, not just in the UI.
  - **worker** gets everything in the panel **except** team management and deleting customer accounts.
- Seed: the admin with email `rpochtman@simnetiq.store` becomes `owner`. Look up the email in `auth.users` rather than hard-coding a uid. Every other existing admin becomes `worker`. Confirm that email with the owner if nothing matches.
- Add `public.is_owner()`, which is `is_admin()` plus role = owner.
- Owner-only RPCs call an `owner_assert()`.
- An owner cannot demote or revoke themselves if that would leave zero owners.
- Add RPCs:
  - `admin_me()`: my uid, email, role, `added_at`, invited_by, and the factor count if it's reachable via `auth.mfa_factors`.
  - `admin_team_list()`: owner only.
  - `admin_team_set_role(uid, role, reason)`: owner only, audited.
  - `admin_team_revoke(uid, reason)`: owner only, audited.
  - `admin_team_restore(...)`: optional.
- The migration goes in `sms-expo/supabase/migrations/20260846000000_admin_team.sql`.

### 2. A privileged edge function, `sms-expo/supabase/functions/admin-team/`
The service role is only allowed inside edge functions.
1. Verify the caller's JWT with the existing shared helpers in `_shared/` (look for requireUser or similar). Require `aal = 'aal2'`, then check `is_owner()` by calling the database as the caller, so the same SQL rules apply.
2. **`invite`** `{email, role, note}`:
   - If the email is new: `auth.admin.inviteUserByEmail` with `redirectTo` = `https://simnetiq.xyz/admin`. Insert or update the `admins` row with the role and inviter, and audit it.
   - The auth project is shared with the mobile app, so the email may already belong to an app user. In that case add the `admins` row anyway and send a password-recovery link, so they set a password and then enrol TOTP. Tell the UI which of the two happened.
   - Enforce the 2-owner limit.
3. **`delete_user`** `{user_id, reason, confirm_email}` is for owners only.
   - Refuse if the target is in `admins`.
   - Require a reason of at least 8 characters, and a `confirm_email` that matches the target's real email case-insensitively. The check happens server-side; the real email never goes back to the browser.
   - Write the audit row first through `admin_log`, run the same retention and facts path as `delete-account`, then call `auth.admin.deleteUser`.
   - Return the audit id.
4. Return the same generic error shape the other functions use, send CORS only for `https://simnetiq.xyz` (plus localhost in dev), and log without PII.

### 3. The invite landing in AuthGate
- Handle an invite or recovery link that arrives at `/admin`, the same way `PASSWORD_RECOVERY` is handled now: set a password (minimum 12 characters), then enrol TOTP, then ready.
- If a newly invited person is not yet active in `admins`, they get the denied screen as usual.

### 4. Settings page `/admin/settings` (everyone)
Add it to the nav: the desktop top nav, and the phone More sheet.
- **My account:** email, role badge, member since, invited by.
- **How I'm connected:**
  - sign-in method (password + authenticator)
  - enrolled TOTP factors with created dates
  - current assurance level
  - last sign-in
  - session expiry
- **Change password:** current password, new, and confirm. Re-verify the current password before `updateUser` and enforce a minimum of 12 characters.
- **Send me a reset link.**
- **Sign out of all devices:** `signOut({ scope: 'global' })`.
- **Re-enrol authenticator** (optional): only after a fresh TOTP challenge.

### 5. Team page `/admin/team` (owners only)
- Workers never see the nav item, and the RPCs refuse them anyway.
- A member list as a DataTable: email, role badge, status (active / invited / revoked), added, invited by.
- **Invite** form: email and role (owner disabled when 2 owners already exist, with the reason explained).
- Per member: change role, revoke or restore. Each needs a typed reason (at least 8 characters) and a confirm step, following the GrantCoins pattern in `users/[id]/Actions.tsx` and `components/RevealSms.tsx`.

### 6. Delete a customer account (owners only)
- On `users/[id]`, add a **Danger zone** card.
  - Owners: a delete button with a clear warning. Deletion wipes numbers, SMS, wallet and ledger; purchase records are kept. The owner types a reason and retypes the customer's email, then the function is called. Afterwards, redirect to `/admin/users` with a notice.
  - Workers: the card is visible but disabled, with the text "only a main admin can delete accounts".

### 7. Links from the jobs table
- Put the mapping in one file, `landing/lib/admin/jobLinks.ts`: `job_name` → `{ supabaseLogs?, n8n?, github? }`.
  - **supabaseLogs:** `https://supabase.com/dashboard/project/<ref>/functions/<fn>/logs`. Take the project ref from `NEXT_PUBLIC_SUPABASE_URL`.
  - **n8n:** built from `NEXT_PUBLIC_N8N_BASE_URL`; hide the link when that isn't set. The support-reply workflow is in `landing/n8n/`.
  - **github:** the function's folder in `https://github.com/pochtmanr/smscode` on `main`.
- Find the real job names in the migrations (`job_heartbeat` / `admin_jobs`) and in the edge function names.
- Render the links as small labelled links in each job row or card on `system/page.tsx`.

### 8. Keep search engines and attackers out
- Add `disallow: ['/api/', '/admin']` to `robots.ts`, and confirm `sitemap.ts` never lists `/admin`.
- Add `headers()` in `next.config` for `/admin/:path*` and `/api/admin/:path*`:
  - `X-Robots-Tag: noindex, nofollow`
  - `X-Frame-Options: DENY` plus CSP `frame-ancestors 'none'`
  - `Referrer-Policy: no-referrer`
  - `Cache-Control: no-store`
- Sign-in:
  - keep the single generic error message
  - add a growing client-side cool-down after failed attempts (say it's there for UX; the real protection is Supabase's own rate limits, which you should document)
  - never log passwords
  - make sure the password field has `autocomplete="current-password"`, and new-password fields `new-password`
- Check that no admin route leaks data before `aal2`.

## Verification
- In `landing`, run `npx tsc --noEmit`, `npx eslint "app/(admin)" lib/admin` and `npm run build`.
- SQL:
  - Test on a local Postgres. The earlier session used a `supabase/postgres:15.8.1.085` container, a small auth shim, then applied the landing `support_requests` migration and all sms-expo migrations in order; `supabase start` is broken on this machine because of a CLI code-signature problem.
  - Test that the 2-owner limit holds, that workers get 42501 on owner RPCs, that the last owner can't demote themselves, and that anon can't execute anything.
- Edge function: `deno check`, plus a unit test of the authorization branches if the `_shared` test pattern allows it.
- UI:
  - Run `next dev` with `NEXT_PUBLIC_SUPABASE_URL=http://fake.supabase.test`.
  - Use Playwright with a fake aal2 session cookie `sb-fake-auth-token` and fixture responses for `/rest/v1/rpc/*` and `/functions/v1/*`. There's an example in the earlier session's scratchpad `shoot.mjs`; rebuild it if it's gone.
  - Screenshot `/admin/settings`, `/admin/team` and `users/[id]` at 375px and 1280px, as owner and as worker. Check there's no horizontal overflow and no console errors.

## Final report
List:
- the files changed
- the exact commands the owner must run: apply the migration, `supabase functions deploy admin-team`, and any env vars (`NEXT_PUBLIC_N8N_BASE_URL`, Supabase Auth redirect URL allow-list entry `https://simnetiq.xyz/admin`)
- what was tested and what was not
