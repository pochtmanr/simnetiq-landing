# Admin Panel

The operator console lives at `https://simnetiq.xyz/admin`, in the `app/(admin)` route group. It is marked `noindex` and has its own layout, separate from the marketing site's navigation and i18n.

## Security model

**All authority lives in Postgres. The panel holds no secrets.**

- The panel is a browser client. It uses the **anon key** and the operator's own Supabase session (`lib/admin/client.ts`).
- Every capability is a `security definer` RPC named `admin_*`. Each one calls `is_admin()`, which requires **both**:
  - the caller's email is on the allow-list. There is exactly one admin (`rpochtman@simnetiq.store`), and a SQL trigger enforces the limit (`20260837000000_admin_email_lock.sql`).
  - the session is `aal2`: password plus TOTP.
- Anyone else gets `42501` from Postgres. Compromising the website runtime therefore gains an attacker nothing beyond what an anonymous visitor already has.
- Reads that expose a phone number or SMS body, and every mutation, go through `admin_log()`.
  - `admin_grant_coins` derives its idempotency key from the audit row, and `admin_reveal_sms` returns that row, so neither works without the log.
- **Hard rule:** `SUPABASE_SERVICE_ROLE_KEY` must never be used in this codebase. If a feature seems to need it, add a new `security definer` RPC in `sms-expo/supabase/migrations/` instead.

`AuthGate.tsx` decides which screen to show (sign-in, TOTP enrolment, TOTP challenge, or content). It routes between screens only and grants no permissions.

## Screens

| Route | Purpose | Main RPCs |
|---|---|---|
| `/admin` | Dashboard: money health and the recent audit trail | `admin_money_health`, `admin_audit_recent` |
| `/admin/users` | Search, summary, recent sign-ups | `admin_user_search`, `admin_users_summary`, `admin_recent_signups` |
| `/admin/users/[id]` | User 360: overview, ledger, activations, grant coins, reveal SMS | `admin_user_overview`, `admin_user_ledger`, `admin_user_activations`, `admin_grant_coins`, `admin_reveal_sms` |
| `/admin/purchases` | Purchases, refunds, top products | `admin_purchases`, `admin_purchase_summary` |
| `/admin/delivery` | Delivery KPIs and trend, per-combo rates, recent failures, supplier balance | `admin_delivery_stats`, `admin_delivery_by_combo`, `admin_recent_failures`, `admin_ops_digest`, `admin_provider_balance` |
| `/admin/support` | Support inbox, threads, status, replies | `admin_support_list`, `admin_support_thread`, `admin_support_set_status`, `admin_support_reply`, `admin_support_reply_result` |
| `/admin/system` | Cron job heartbeats (stale detection) and open provider orphans | `admin_jobs`, `admin_open_orphans` |

Typed wrappers for all RPCs are in `lib/admin/rpc.ts`. The SQL definitions are in the app repo:

- `sms-expo/supabase/migrations/20260834000000_admin.sql`
- `20260837000000_admin_email_lock.sql`
- `20260843000000_admin_p1.sql`

## Support replies

`POST /api/admin/support/reply` forwards the operator's own access token, so the RPC runs as the operator. The route then:

1. calls `admin_support_reply`, which records the reply, sets the ticket status and returns the customer's address (audit-logged);
2. calls the n8n reply webhook (`N8N_SUPPORT_REPLY_WEBHOOK_URL`), which sends the email from `support@simnetiq.store`;
3. calls `admin_support_reply_result`, which records whether step 2 succeeded.

The reply is stored even if the email fails, so the operator can retry.

## Bootstrapping the admin account

The account is created entirely in SQL, using `sms-expo/supabase/admin/create-admin-user.sql`. The operator enrols TOTP on their first sign-in. After changing the admin schema, run `sms-expo/supabase/admin/admin-panel-gates.sql`.
