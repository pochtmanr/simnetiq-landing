import { isSupportTopic, type SupportTopicId } from "../content/help/types";
import { supportUi } from "../content/ui";
import { DEFAULT_LOCALE, type Locale } from "../i18n";
import { LOCALES } from "../locales";

/* Validation and shaping for POST /api/support. Pure, so it is unit-tested
 * (request.test.ts) without a server. */

export const MAX = { name: 200, email: 320, message: 4500, field: 80, orderId: 64 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VERSION_RE = /^[\w.() -]{1,40}$/;

export type SupportContext = {
  /** Claimed by the client (the app puts it in the URL) — never trusted as
   *  identity, only as a lookup hint for the operator. */
  accountId?: string;
  appVersion?: string;
  orderId?: string;
  service?: string;
  country?: string;
  when?: string;
};

export type SupportPayload = {
  name: string;
  email: string;
  topicId: SupportTopicId;
  /** English label stored in support_requests.topic, so the inbox reads the
   *  same whatever language the visitor wrote in. Legacy free-text topics
   *  (an old cached page) pass through as-is. */
  topic: string;
  message: string;
  locale: Locale;
  context: SupportContext;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const opt = (v: unknown, max: number) => {
  const s = str(v).replace(/\s+/g, " ");
  return s ? s.slice(0, max) : undefined;
};

/** Every locale's message placeholders: submitting one of them verbatim is
 *  the web-form equivalent of the blank e-mail. */
let placeholderSet: Set<string> | null = null;
function placeholders(): Set<string> {
  if (placeholderSet) return placeholderSet;
  placeholderSet = new Set(
    LOCALES.flatMap((l) => Object.values(supportUi(l).form.messagePlaceholders ?? {})).map(normalise),
  );
  return placeholderSet;
}
const normalise = (s: string) => s.toLowerCase().replace(/[\s\p{P}]+/gu, " ").trim();

/** A message has to say something: 10+ characters, some letters or digits,
 *  and not just a placeholder pasted back. */
export function meaningfulMessage(message: string): boolean {
  if (message.length < 10 || message.length > MAX.message) return false;
  if ((message.match(/[\p{L}\p{N}]/gu)?.length ?? 0) < 5) return false;
  return !placeholders().has(normalise(message));
}

export function parseSupportRequest(body: unknown, locale: Locale): SupportPayload | string {
  const m = supportUi(locale).api;
  if (typeof body !== "object" || body === null) return m.invalidBody;
  const b = body as Record<string, unknown>;

  const name = str(b.name);
  const email = str(b.email);
  const rawTopic = str(b.topic);
  const message = str(b.message);

  if (!name || name.length > MAX.name) return m.name;
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return m.email;
  if (rawTopic.length > 100) return m.topic;
  if (!meaningfulMessage(message)) return m.message;

  const topicId: SupportTopicId = isSupportTopic(rawTopic) ? rawTopic : "other";
  const topic = isSupportTopic(rawTopic)
    ? supportUi(DEFAULT_LOCALE).form.topics[rawTopic]
    : rawTopic || supportUi(DEFAULT_LOCALE).form.topics.other;

  const accountId = str(b.accountId);
  const appVersion = str(b.appVersion);
  const context: SupportContext = {
    accountId: UUID_RE.test(accountId) ? accountId.toLowerCase() : undefined,
    appVersion: VERSION_RE.test(appVersion) ? appVersion : undefined,
    orderId: opt(b.orderId, MAX.orderId),
    service: opt(b.service, MAX.field),
    country: opt(b.country, MAX.field),
    when: opt(b.when, MAX.field),
  };
  for (const k of Object.keys(context) as (keyof SupportContext)[]) {
    if (context[k] === undefined) delete context[k];
  }

  return { name, email, topicId, topic, message, locale, context };
}

const CONTEXT_LABELS: Record<keyof SupportContext, string> = {
  accountId: "Account ID",
  appVersion: "App",
  orderId: "Apple order ID",
  service: "Service",
  country: "Country",
  when: "When",
};

/** The message as stored and e-mailed: the visitor's words, then the
 *  structured details as a footer the operator can scan. The same footer
 *  shape the app's e-mail uses ("---\nAccount ID: …"), so the inbox and
 *  /admin/support read one way whichever route a request came in by. */
export function storedMessage(p: SupportPayload): string {
  const lines = (Object.keys(CONTEXT_LABELS) as (keyof SupportContext)[])
    .filter((k) => p.context[k])
    .map((k) => `${CONTEXT_LABELS[k]}: ${p.context[k]}`);
  return lines.length ? `${p.message}\n\n---\n${lines.join("\n")}` : p.message;
}
