import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "../../../lib/site";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../../../lib/i18n";
import { supportUi } from "../../../lib/content/ui";
import { parseSupportRequest, storedMessage } from "../../../lib/support/request";

/** Error copy in the visitor's language; unknown locales fall back to the default. */
const messages = (locale: Locale) => supportUi(locale).api;

/* ---------------------------------------------------------------------------
 * Origin check
 *
 * Cheapest filter that exists against bots POSTing straight at the endpoint:
 * they almost never bother with an Origin header, while a browser submitting
 * the real form always sends one on a same-origin POST. Referer is accepted as
 * a fallback so an unusual browser or privacy extension that strips Origin
 * cannot silently break a genuine support request — the point is to raise the
 * cost of drive-by spam, not to be a security boundary. The real boundary is
 * the RLS-locked table plus submit_support_request().
 * ------------------------------------------------------------------------- */
function hostAllowed(raw: string | null): boolean {
  if (!raw) return false;
  let host: string;
  try {
    host = new URL(raw).host.toLowerCase();
  } catch {
    return false;
  }
  const siteHost = new URL(SITE_URL).host.toLowerCase();
  if (host === siteHost || host === `www.${siteHost}`) return true;
  // Vercel preview deployments and local development.
  if (host.endsWith(".vercel.app")) return true;
  if (host === "localhost" || host.startsWith("localhost:")) return true;
  if (host === "127.0.0.1" || host.startsWith("127.0.0.1:")) return true;
  return false;
}

function originOk(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin) return hostAllowed(origin);
  return hostAllowed(request.headers.get("referer"));
}

/* ---------------------------------------------------------------------------
 * The SMS Code app
 *
 * The app's native support screen posts here too, so validation, the message
 * footer and the n8n e-mail stay in one place. It has no browser Origin and
 * cannot render Turnstile; instead it sends its Supabase session token, which
 * every install has (anonymous or linked). A token Supabase accepts stands in
 * for both checks and turns the account id from a claim into a fact.
 * ------------------------------------------------------------------------- */
async function appUserId(request: NextRequest): Promise<string | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: auth },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { id?: string };
    return typeof user.id === "string" ? user.id : null;
  } catch (err) {
    console.error("Support form: app token check failed:", err);
    return null;
  }
}

/* ---------------------------------------------------------------------------
 * Client IP, stored only as a salted one-way hash.
 *
 * A raw IP is personal data we have no use for; a salted hash still answers
 * "is this the same source as the last four submissions" inside the SQL flood
 * gate. With no salt configured we send null rather than an unsalted hash — an
 * unsalted IP hash is trivially reversible by brute force over the v4 space.
 * ------------------------------------------------------------------------- */
function ipHash(request: NextRequest): string | null {
  const salt = process.env.SUPPORT_IP_HASH_SALT;
  if (!salt) return null;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("x-real-ip") ??
    (forwarded ? forwarded.split(",")[0]?.trim() : null);
  if (!ip) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/* ---------------------------------------------------------------------------
 * Cloudflare Turnstile — optional, and a no-op until TURNSTILE_SECRET_KEY is
 * set in Vercel. Pair it with NEXT_PUBLIC_TURNSTILE_SITE_KEY, which is what
 * makes SupportForm render the widget. Setting only one of the two is the
 * failure mode to avoid: secret without site key rejects every real
 * submission, so we treat a missing token as a pass unless the widget could
 * actually have produced one.
 * ------------------------------------------------------------------------- */
async function turnstileOk(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    console.error(
      "Support form: TURNSTILE_SECRET_KEY is set but NEXT_PUBLIC_TURNSTILE_SITE_KEY is not — skipping the check rather than rejecting everyone.",
    );
    return true;
  }
  if (typeof token !== "string" || !token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, signal: AbortSignal.timeout(10_000) },
    );
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    console.error("Support form: Turnstile verification failed:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: messages(DEFAULT_LOCALE).invalidJson }, { status: 400 });
  }

  const rawLocale = (body as Record<string, unknown>)?.locale;
  const locale: Locale =
    typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const appUser = await appUserId(request);
  if (!appUser && !originOk(request)) {
    return NextResponse.json({ error: messages(locale).forbidden }, { status: 403 });
  }

  // Honeypot filled in → almost certainly a bot. Pretend success.
  if ((body as Record<string, unknown>)?.website) {
    return NextResponse.json({ ok: true });
  }

  const result = parseSupportRequest(body, locale);
  if (typeof result === "string") {
    return NextResponse.json({ error: result }, { status: 400 });
  }

  const rawIp =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  if (appUser) {
    result.context.accountId = appUser;
  } else if (!(await turnstileOk((body as Record<string, unknown>)?.turnstileToken, rawIp))) {
    return NextResponse.json({ error: messages(locale).challenge }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // The insert goes through the security-definer RPC either way. The service
  // role key is what lets 20261020000001_support_request_rpc_server_only.sql
  // revoke the RPC from anon: with it granted to the public anon key, anyone
  // could call it directly and skip every check in this route. The anon
  // fallback only keeps the form working until the key is set in Vercel.
  const rpcKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !rpcKey) {
    console.error("Support form: Supabase env vars are not configured.");
    return NextResponse.json(
      { error: messages(locale).unavailable },
      { status: 503 },
    );
  }

  // 1. Store the request in Supabase (source of truth). p_context needs
  //    20261015000000_support_request_context.sql; until that is applied the
  //    RPC answers PGRST202 (no such signature) and we store without it — the
  //    details are in the message footer either way.
  const args = {
    p_name: result.name,
    p_email: result.email,
    p_topic: result.topic,
    p_message: storedMessage(result),
    p_locale: result.locale,
    p_user_agent: request.headers.get("user-agent") ?? null,
    p_ip_hash: ipHash(request),
  };
  const callRpc = (payload: Record<string, unknown>) =>
    fetch(`${supabaseUrl}/rest/v1/rpc/submit_support_request`, {
      method: "POST",
      headers: {
        apikey: rpcKey,
        Authorization: `Bearer ${rpcKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  let rpcRes = await callRpc({
    ...args,
    p_context: { topic_id: result.topicId, ...result.context },
  });
  if (rpcRes.status === 404) {
    const err = (await rpcRes.json().catch(() => null)) as { code?: string } | null;
    if (err?.code === "PGRST202") rpcRes = await callRpc(args);
  }

  if (!rpcRes.ok) {
    const text = await rpcRes.text().catch(() => "");
    // The SQL flood gates (per IP, e-mail, account and a global cap) raise
    // rate_limited; that is the visitor's answer, not a server fault.
    if (text.includes("rate_limited")) {
      return NextResponse.json({ error: messages(locale).rateLimited }, { status: 429 });
    }
    console.error(`Support form: submit_support_request failed (${rpcRes.status}):`, text);
    return NextResponse.json(
      { error: messages(locale).saveFailed },
      { status: 502 },
    );
  }

  const rows = (await rpcRes.json()) as Array<{
    id: string;
    created_at: string;
    duplicate: boolean;
  }>;
  const saved = Array.isArray(rows) ? rows[0] : undefined;

  // A repeat of the same (email, message) inside 10 minutes: the row is
  // already stored and the team already has the email. Report success and stop
  // — firing the webhook again would mail them a second copy.
  if (saved?.duplicate) {
    return NextResponse.json({ ok: true });
  }

  // 2. Trigger the n8n email workflow. The request is already stored, so a
  //    webhook failure must not fail the submission — log it and move on.
  //    The workflow notifies the team only; it deliberately no longer
  //    auto-replies to the submitted address (see n8n/README.md).
  const webhookUrl = process.env.N8N_SUPPORT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({
          id: saved?.id,
          created_at: saved?.created_at,
          ...result,
          message: args.p_message,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!webhookRes.ok) {
        console.error(`Support form: n8n webhook returned ${webhookRes.status}.`);
      }
    } catch (err) {
      console.error("Support form: n8n webhook failed:", err);
    }
  } else {
    console.error("Support form: N8N_SUPPORT_WEBHOOK_URL is not configured.");
  }

  return NextResponse.json({ ok: true });
}
