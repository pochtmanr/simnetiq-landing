"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/* ---------------------------------------------------------------------------
 * The browser Supabase client for the admin panel.
 *
 * >>> NO PRIVILEGED KEY MAY EVER BE READ HERE. <<<
 *
 * This module reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * and nothing else. The service-role key was deliberately removed from this
 * repository (see .env.example, which names the variable and says why, and the
 * support route's comment in app/api/support/route.ts) and must not come back
 * — least of all here, where it looks most tempting.
 *
 * That variable's literal name is not spelled out anywhere under lib/ or app/,
 * this warning included. The release gate greps those two directories for it,
 * and a gate that its own warning signs trip is a gate everyone learns to
 * ignore.
 *
 * The reason is the whole security model of the panel. Every capability the
 * panel has is an existing `security definer` RPC in Postgres gated by
 * `is_admin()`, which requires *both* allowlist membership and an `aal2`
 * session. Authority lives in the database; the browser holds only the
 * operator's own session. That is what makes it acceptable to serve an
 * operator tool from the same runtime as the public marketing site: an
 * attacker who fully compromises this app obtains exactly what an anonymous
 * visitor already has, because every `admin_*` RPC raises 42501 for `anon`.
 *
 * A service-role key here would collapse that in one line. It bypasses RLS on
 * every table in the production database — rented phone numbers, received SMS
 * bodies, wallets — and it would be shipped to the browser or sit in a runtime
 * that also renders untrusted public pages. If something ever seems to need
 * it, the answer is a new `security definer` RPC in the sms-expo repo, not a
 * key in this one.
 *
 * `"use client"` is on this file on purpose. The session lives in the
 * browser's cookies; importing this from a Server Component is a mistake, and
 * the module boundary makes that mistake a build-time error instead of a
 * confusing runtime one.
 * ------------------------------------------------------------------------ */

/* createBrowserClient (from @supabase/ssr, not supabase-js's createClient)
   because it persists the session in a cookie rather than localStorage. That
   is a requirement, not a preference: middleware.ts conceals /admin by looking
   for an `sb-*-auth-token` cookie, and a localStorage session is invisible to
   it — every admin page would 404 for a signed-in operator. */
let client: SupabaseClient | null = null;

/** The panel's single browser client. Anon key only; see the note above. */
export function getAdminClient(): SupabaseClient {
  if (client) return client;

  /* Both are inlined at build time by Next, so they must be written out as
     literal `process.env.NEXT_PUBLIC_…` member expressions — a computed lookup
     would silently yield undefined in the browser. */
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    /* Loud, and safe to be loud about: these two values are public by
       definition — the marketing site already ships the anon key. */
    throw new Error(
      "Admin panel: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must both be set.",
    );
  }

  client = createBrowserClient(url, anonKey);
  return client;
}
