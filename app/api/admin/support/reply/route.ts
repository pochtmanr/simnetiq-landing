import { NextRequest, NextResponse } from "next/server";

/* ---------------------------------------------------------------------------
 * POST /api/admin/support/reply — answer a support ticket by email.
 *
 * This route holds no authority of its own. It forwards the operator's own
 * access token (from the admin panel's session) to PostgREST, so
 * `admin_support_reply` runs as that operator and `is_admin()` decides — the
 * same allowlist + aal2 check as every other admin RPC. A request without a
 * valid operator token fails in Postgres with 42501, before anything is
 * recorded or sent. No service-role key is involved (see .env.example).
 *
 * Steps:
 *   1. admin_support_reply   records the reply, sets the ticket status and
 *                            returns the customer's address (audit-logged).
 *   2. n8n reply webhook     sends the email from support@simnetiq.store.
 *   3. admin_support_reply_result  records whether step 2 worked.
 *
 * The reply is stored even when the email fails, and the response says so,
 * so the operator can retry or write from their own mailbox.
 * ------------------------------------------------------------------------ */

const MAX_BODY = 5000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ReplyTarget = {
  reply_id: string;
  email: string;
  name: string;
  locale: string;
  topic: string | null;
  message: string;
};

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Subject line in the customer's language. */
function subject(locale: string, topic: string | null): string {
  const base = locale === "ru" ? "Ответ поддержки SMS Code" : "SMS Code support";
  return topic ? `Re: ${topic} — ${base}` : base;
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return fail("Supabase is not configured.", 503);

  const auth = request.headers.get("authorization") ?? "";
  if (!/^Bearer\s+\S+$/.test(auth)) return fail("Not signed in.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON.", 400);
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id : "";
  const text = typeof b.body === "string" ? b.body.trim() : "";
  const status = b.status === "open" ? "open" : "resolved";
  if (!UUID_RE.test(id)) return fail("Invalid ticket id.", 400);
  if (!text || text.length > MAX_BODY) return fail(`Reply must be 1–${MAX_BODY} characters.`, 400);

  const rpc = (fn: string, args: Record<string, unknown>) =>
    fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        // The operator's token, not the anon key: Postgres checks this caller.
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(10_000),
    });

  // 1. Record the reply (and authorise the operator).
  const saved = await rpc("admin_support_reply", { p_id: id, p_body: text, p_status: status });
  if (!saved.ok) {
    const detail = (await saved.json().catch(() => null)) as { code?: string; message?: string } | null;
    if (detail?.code === "42501" || saved.status === 401 || saved.status === 403) {
      return fail("Not allowed.", 403);
    }
    console.error(`Admin reply: admin_support_reply failed (${saved.status}):`, detail);
    return fail(detail?.message ?? "Could not save the reply.", 502);
  }
  const target = ((await saved.json()) as ReplyTarget[])[0];
  if (!target) return fail("Ticket not found.", 404);

  // 2. Send the email through n8n.
  let sendError: string | null = null;
  const webhookUrl = process.env.N8N_SUPPORT_REPLY_WEBHOOK_URL;
  if (!webhookUrl) {
    sendError = "N8N_SUPPORT_REPLY_WEBHOOK_URL is not configured";
  } else {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({
          type: "reply",
          request_id: id,
          reply_id: target.reply_id,
          to: target.email,
          name: target.name,
          locale: target.locale,
          subject: subject(target.locale, target.topic),
          body: text,
          original_message: target.message,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) sendError = `n8n answered ${res.status}`;
    } catch (err) {
      sendError = err instanceof Error ? err.message : String(err);
    }
  }
  if (sendError) console.error("Admin reply: email not sent:", sendError);

  // 3. Record the outcome. A failure here leaves the reply marked unsent,
  //    which is the safe direction.
  const result = await rpc("admin_support_reply_result", {
    p_reply: target.reply_id,
    p_error: sendError,
  });
  if (!result.ok) {
    console.error(`Admin reply: admin_support_reply_result failed (${result.status}).`);
  }

  return NextResponse.json({ ok: true, sent: sendError === null, error: sendError });
}
