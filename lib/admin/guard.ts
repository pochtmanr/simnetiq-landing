"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

export { AdminDenied, isAdminDenied } from "./rpc";

/* ---------------------------------------------------------------------------
 * Which screen the operator should be looking at.
 *
 * This is a router, not a control. Nothing here decides whether someone is an
 * admin — `is_admin()` in Postgres does, and it demands allowlist membership
 * *and* an `aal2` session. `resolveAdminState` only answers "given the session
 * this browser is holding, what is the next step?", so that a lapsed session
 * reads as "enter your code" instead of as a broken site.
 * ------------------------------------------------------------------------ */

export type AdminState = "anon" | "needsEnrol" | "needsChallenge" | "ready";

/**
 * Map the browser's current session onto the screen to render.
 *
 * - `anon`           → no session at all. The caller renders the 404 body.
 * - `needsEnrol`     → signed in, no verified TOTP factor yet.
 * - `needsChallenge` → signed in with a factor, but the session is still aal1.
 * - `ready`          → aal2. Render the panel.
 *
 * **Allowlist membership is deliberately not checked here.** It is checked by
 * every RPC, which is the only place a check cannot be skipped by editing the
 * client. A signed-in stranger who somehow enrols a factor reaches `'ready'`
 * and then gets 42501 — an `AdminDenied` — from the very first call, which the
 * UI renders as the same 404 an anonymous visitor sees. Duplicating the check
 * here would buy nothing and would tempt someone into trusting it.
 */
export async function resolveAdminState(
  client: SupabaseClient,
): Promise<AdminState> {
  /* getSession() reads the cookie without a round-trip. That is fine precisely
     because this function grants nothing: a forged or stale session gets the
     operator as far as a screen that immediately fails against Postgres. */
  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData.session) return "anon";

  /* Decoded from the access token, so also local and also cheap. `aal2` means
     the second factor has already been presented for THIS session. */
  const { data: aal, error: aalError } =
    await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalError) return "anon";
  if (aal.currentLevel === "aal2") return "ready";

  /* listFactors() does go to the network (it re-fetches the user), which is
     also how a session that has been revoked server-side stops looking valid
     here rather than dead-ending on a challenge screen that can never pass. */
  const { data: factors, error: factorsError } =
    await client.auth.mfa.listFactors();
  if (factorsError) return "anon";

  /* `factors.totp` holds verified factors only — the SDK files unverified ones
     under `all` and nowhere else. So an abandoned half-finished enrolment
     correctly still reads as `needsEnrol`. (Enrolment code should therefore
     avoid a fixed `friendlyName`, which is the one thing a leftover unverified
     factor can collide with.) */
  if (factors.totp.length === 0) return "needsEnrol";

  return "needsChallenge";
}
