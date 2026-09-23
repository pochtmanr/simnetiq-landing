"use client";

import { FunctionsHttpError } from "@supabase/supabase-js";
import { getAdminClient } from "./client";
import type { TeamRole } from "./rpc";

/* ---------------------------------------------------------------------------
 * The two admin actions that need GoTrue's admin API: inviting someone, and
 * deleting a customer account.
 *
 * They go to the `admin-team` edge function in sms-expo, because the
 * service-role key those calls need is not allowed anywhere near this app (see
 * ./client.ts). `functions.invoke` sends the operator's own session token; the
 * function checks it with GoTrue, demands aal2 and asks `is_owner()` as the
 * operator, so nothing here is trusted to decide anything.
 * ------------------------------------------------------------------------ */

/** A refusal or failure from the function, with its machine-readable code
 *  (`forbidden`, `owner_limit`, `rejected`, …) and, for a deletion that was
 *  recorded but did not complete, the audit id. */
export class TeamActionError extends Error {
  status: number;
  code: string | null;
  auditId: number | null;
  constructor(message: string, status: number, code: string | null, auditId: number | null = null) {
    super(message);
    this.name = "TeamActionError";
    this.status = status;
    this.code = code;
    this.auditId = auditId;
  }
}

type Body = Record<string, unknown>;

async function call<T>(body: Body): Promise<T> {
  const { data, error } = await getAdminClient().functions.invoke<T>("admin-team", { body });
  if (!error) return data as T;

  if (error instanceof FunctionsHttpError) {
    const res = error.context as Response;
    const out = (await res.json().catch(() => null)) as { error?: string; code?: string; audit_id?: number } | null;
    /* A 404 with no JSON code is the platform, not the function: it has not
       been deployed yet. */
    if (res.status === 404 && !out?.code) {
      throw new TeamActionError(
        "The admin-team edge function is not deployed yet (supabase functions deploy admin-team).",
        404,
        "not_deployed",
      );
    }
    throw new TeamActionError(
      out?.error ?? `Request failed (${res.status}).`,
      res.status,
      out?.code ?? null,
      typeof out?.audit_id === "number" ? out.audit_id : null,
    );
  }
  /* Relay or fetch errors: offline, CORS, the function crashed before
     answering. Nothing on the server can be assumed either way. */
  throw new TeamActionError(error.message || "The request did not reach the server.", 0, "network");
}

export type InviteResult = {
  ok: true;
  /** `invited`: a new account, GoTrue sent its invitation email.
   *  `existing_account`: the address already had an account (most likely a
   *  customer of the app), so they were sent a password set-up link instead. */
  mode: "invited" | "existing_account";
  email_sent: boolean;
  audit_id: number | null;
};

export function inviteMember(email: string, role: TeamRole, note: string | null): Promise<InviteResult> {
  return call<InviteResult>({ action: "invite", email, role, note });
}

/** Irreversible. The server re-checks everything, including that
 *  `confirmEmail` matches the account's real address. */
export function deleteCustomer(userId: string, reason: string, confirmEmail: string): Promise<{ ok: true; audit_id: number }> {
  return call<{ ok: true; audit_id: number }>({
    action: "delete_user",
    user_id: userId,
    reason,
    confirm_email: confirmEmail,
  });
}
