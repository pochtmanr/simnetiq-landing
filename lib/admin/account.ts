"use client";

import { createClient } from "@supabase/supabase-js";

/* ---------------------------------------------------------------------------
 * Checking a password without touching the session that is signed in.
 *
 * The settings page asks for the current password before changing it. The
 * obvious check — signInWithPassword on the panel's own client — would REPLACE
 * the operator's aal2 session with a fresh aal1 one, and GoTrue refuses a
 * password change on aal1 when MFA is enrolled. So the check runs on a
 * separate, throwaway client that persists nothing, and its session is ended
 * straight away (scope "local": only that one session, never the operator's).
 *
 * Anon key only, like ./client.ts. This is the operator proving they know
 * their own password to GoTrue, nothing more. The server-side version of the
 * same rule is GoTrue's GOTRUE_SECURITY_UPDATE_PASSWORD_REQUIRE_CURRENT_PASSWORD,
 * which makes updateUser check `current_password` itself; the settings page
 * sends it either way, so switching that on needs no code change.
 * ------------------------------------------------------------------------ */

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !email || !password) return false;

  const probe = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      /* Its own storage key, so it can never read or clobber the panel's
         cookie-backed session even if persistence were switched on. */
      storageKey: "sb-admin-password-probe",
    },
  });
  try {
    const { error } = await probe.auth.signInWithPassword({ email, password });
    if (error) return false;
    await probe.auth.signOut({ scope: "local" }).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}
