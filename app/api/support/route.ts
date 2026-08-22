import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "../../../lib/site";

const MAX = { name: 200, email: 320, topic: 100, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Locale = "en" | "ru";

const MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    invalidBody: "Invalid request body.",
    invalidJson: "Invalid JSON.",
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    topic: "Topic is too long.",
    message: "Please describe your issue in at least 10 characters.",
    unavailable: "Support form is temporarily unavailable. Please email us instead.",
    saveFailed: "We couldn't save your message. Please try again or email us.",
    forbidden: "This request didn't come from the support page. Please reload and try again.",
    challenge: "Please complete the verification check and try again.",
  },
  ru: {
    invalidBody: "Некорректный запрос.",
    invalidJson: "Некорректный JSON.",
    name: "Пожалуйста, укажите имя.",
    email: "Пожалуйста, укажите корректный email.",
    topic: "Слишком длинная тема.",
    message: "Опишите проблему хотя бы в 10 символах.",
    unavailable: "Форма временно недоступна. Напишите нам на почту.",
    saveFailed: "Не удалось сохранить сообщение. Попробуйте ещё раз или напишите нам на почту.",
    forbidden: "Запрос пришёл не со страницы поддержки. Обновите страницу и попробуйте снова.",
    challenge: "Пройдите проверку и попробуйте ещё раз.",
  },
};

type Payload = {
  name: string;
  email: string;
  topic: string;
  message: string;
  locale: Locale;
};

function validate(body: unknown, locale: Locale): Payload | string {
  const m = MESSAGES[locale];
  if (typeof body !== "object" || body === null) return m.invalidBody;
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const topic = typeof b.topic === "string" ? b.topic.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!name || name.length > MAX.name) return m.name;
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return m.email;
  if (topic.length > MAX.topic) return m.topic;
  if (message.length < 10 || message.length > MAX.message) return m.message;

  return { name, email, topic, message, locale };
}

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
    return NextResponse.json({ error: MESSAGES.en.invalidJson }, { status: 400 });
  }

  const rawLocale = (body as Record<string, unknown>)?.locale;
  const locale: Locale = rawLocale === "ru" ? "ru" : "en";

  if (!originOk(request)) {
    return NextResponse.json({ error: MESSAGES[locale].forbidden }, { status: 403 });
  }

  // Honeypot filled in → almost certainly a bot. Pretend success.
  if ((body as Record<string, unknown>)?.website) {
    return NextResponse.json({ ok: true });
  }

  const result = validate(body, locale);
  if (typeof result === "string") {
    return NextResponse.json({ error: result }, { status: 400 });
  }

  const rawIp =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  if (!(await turnstileOk((body as Record<string, unknown>)?.turnstileToken, rawIp))) {
    return NextResponse.json({ error: MESSAGES[locale].challenge }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Anon key, not the service role. See
  // supabase/migrations/20260822000000_submit_support_request.sql — the insert
  // goes through a security-definer RPC that is the only thing this key can do
  // to support_requests.
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.error("Support form: Supabase env vars are not configured.");
    return NextResponse.json(
      { error: MESSAGES[locale].unavailable },
      { status: 503 },
    );
  }

  // 1. Store the request in Supabase (source of truth).
  const rpcRes = await fetch(
    `${supabaseUrl}/rest/v1/rpc/submit_support_request`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_name: result.name,
        p_email: result.email,
        p_topic: result.topic,
        p_message: result.message,
        p_locale: result.locale,
        p_user_agent: request.headers.get("user-agent") ?? null,
        p_ip_hash: ipHash(request),
      }),
    },
  );

  if (!rpcRes.ok) {
    console.error(
      `Support form: submit_support_request failed (${rpcRes.status}):`,
      await rpcRes.text().catch(() => ""),
    );
    return NextResponse.json(
      { error: MESSAGES[locale].saveFailed },
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
