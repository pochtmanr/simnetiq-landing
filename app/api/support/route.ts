import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: MESSAGES.en.invalidJson }, { status: 400 });
  }

  const rawLocale = (body as Record<string, unknown>)?.locale;
  const locale: Locale = rawLocale === "ru" ? "ru" : "en";

  // Honeypot filled in → almost certainly a bot. Pretend success.
  if ((body as Record<string, unknown>)?.website) {
    return NextResponse.json({ ok: true });
  }

  const result = validate(body, locale);
  if (typeof result === "string") {
    return NextResponse.json({ error: result }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("Support form: Supabase env vars are not configured.");
    return NextResponse.json(
      { error: MESSAGES[locale].unavailable },
      { status: 503 },
    );
  }

  const record = {
    ...result,
    user_agent: request.headers.get("user-agent") ?? null,
  };

  // 1. Store the request in Supabase (source of truth).
  const insertRes = await fetch(`${supabaseUrl}/rest/v1/support_requests`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(record),
  });

  if (!insertRes.ok) {
    console.error(
      `Support form: Supabase insert failed (${insertRes.status}):`,
      await insertRes.text().catch(() => ""),
    );
    return NextResponse.json(
      { error: MESSAGES[locale].saveFailed },
      { status: 502 },
    );
  }

  const [saved] = (await insertRes.json()) as Array<{ id: string; created_at: string }>;

  // 2. Trigger the n8n email workflow. The request is already stored, so a
  //    webhook failure must not fail the submission — log it and move on.
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
