/* Cookie consent: the visitor's choice, where it lives, and the one gate every
 * tracker on the site goes through. See docs/COOKIES.md.
 *
 * The choice is a first-party cookie (sc_consent), which is strictly necessary
 * and needs no consent of its own. Path=/ so one choice covers every locale.
 * Client-only: every function here touches document or window. */

import { track } from "@vercel/analytics";

/** Bump when a category is added or a tracker's purpose changes: every stored
 *  choice with an older version is ignored and the visitor is asked again. */
export const CONSENT_VERSION = 2;

const COOKIE = "sc_consent";
/** ICO/CNIL guidance: re-ask at most every 13 months. We use 12. */
const MAX_AGE_S = 60 * 60 * 24 * 365;

const CHANGE = "consentchange";
const OPEN = "opencookiesettings";

export interface Consent {
  v: number;
  analytics: boolean;
  /** Advertising measurement (Meta Pixel). */
  marketing: boolean;
  /** When the choice was made, ms since epoch. */
  ts: number;
}

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw)) as Consent;
    if (
      c.v !== CONSENT_VERSION ||
      typeof c.analytics !== "boolean" ||
      typeof c.marketing !== "boolean"
    ) return null;
    if (Date.now() - c.ts > MAX_AGE_S * 1000) return null;
    return c;
  } catch {
    return null;
  }
}

export type ConsentChoice = Pick<Consent, "analytics" | "marketing">;

export function writeConsent({ analytics, marketing }: ConsentChoice) {
  const value: Consent = { v: CONSENT_VERSION, analytics, marketing, ts: Date.now() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${MAX_AGE_S}; SameSite=Lax${secure}`;
  if (!analytics) clearCookies((n) => n === "_ga" || n.startsWith("_ga_"));
  if (!marketing) clearCookies((n) => n === "_fbp" || n === "_fbc");
  cached = undefined;
  window.dispatchEvent(new Event(CHANGE));
}

/* Withdrawing consent has to undo what consent allowed: drop the cookies a
   tracker set — Google Analytics' _ga / _ga_<ID>, Meta's _fbp / _fbc — which
   both set on the registrable domain. */
function clearCookies(match: (name: string) => boolean) {
  const host = location.hostname;
  const parts = host.split(".");
  const domains = ["", host, `.${host}`];
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join(".")}`);
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (!match(name)) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0${d ? `; Domain=${d}` : ""}`;
    }
  }
}

/* --- External store for useSyncExternalStore ---------------------------- */

/* undefined = not read yet. getSnapshot must return the same object between
   changes, so the parsed cookie is cached until writeConsent invalidates it. */
let cached: Consent | null | undefined;

export function getConsentSnapshot(): Consent | null {
  if (cached === undefined) cached = readConsent();
  return cached;
}

/** Server render: no choice known, so nothing consent-gated renders. */
export function getServerConsentSnapshot(): Consent | null {
  return null;
}

export function subscribeConsent(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  return () => window.removeEventListener(CHANGE, cb);
}

export function hasAnalyticsConsent(): boolean {
  return getConsentSnapshot()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return getConsentSnapshot()?.marketing === true;
}

/* --- Settings dialog ------------------------------------------------------ */

/** Opens the cookie preferences dialog from anywhere on the page. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN));
}

export function onOpenCookieSettings(cb: () => void) {
  window.addEventListener(OPEN, cb);
  return () => window.removeEventListener(OPEN, cb);
}

/* --- Events ----------------------------------------------------------------- */

type Tag = (...args: unknown[]) => void;
type Params = Record<string, string>;

/* How each product event reaches Meta, defined here rather than in Meta's
   Event Setup Tool. `standard` is one of Meta's standard events, which ads can
   optimise for directly; `custom` is our own name, for reporting. Events not
   listed go to Meta as a custom event with the spaces removed. */
const META_EVENTS: Record<string, { standard?: string; custom: string }> = {
  "CTA Click iOS": { standard: "Lead", custom: "AppStoreClick" },
  "Support Sent": { standard: "Contact", custom: "SupportSent" },
};

/** Records a product event in every tool the visitor agreed to: Vercel and
 *  GA with analytics consent, Meta Pixel with marketing consent. Without
 *  either it does nothing. */
export function trackEvent(name: string, props?: Params) {
  if (hasAnalyticsConsent()) {
    track(name, props);
    const gtag = (window as Window & { gtag?: Tag }).gtag;
    gtag?.("event", name.toLowerCase().replace(/\s+/g, "_"), props);
  }
  const meta = META_EVENTS[name] ?? { custom: name.replace(/\s+/g, "") };
  if (meta.standard) metaTrack("track", meta.standard, props);
  metaTrack("trackCustom", meta.custom, props);
}

/** Meta's ViewContent for a landing page about one thing (a service, a
 *  country, an alternative) — the event to build audiences from. Meta only. */
export function trackView(contentType: string, contentName: string) {
  metaTrack("track", "ViewContent", { content_type: contentType, content_name: contentName });
  metaTrack("trackCustom", `View${contentType[0].toUpperCase()}${contentType.slice(1)}`, {
    content_name: contentName,
  });
}

/* Calls made before the pixel has loaded (a page's mount effect can run
   before the loader's) wait here and are sent, in order, once it has. */
const metaPending: unknown[][] = [];

function metaTrack(method: "track" | "trackCustom", event: string, params?: Params) {
  if (!hasMarketingConsent()) return;
  const fbq = (window as Window & { fbq?: Tag }).fbq;
  if (fbq) fbq(method, event, params);
  else metaPending.push([method, event, params]);
}

/** Sends the calls queued before the pixel loaded. Called by the loader. */
export function flushMetaQueue() {
  const fbq = (window as Window & { fbq?: Tag }).fbq;
  if (!fbq) return;
  for (const args of metaPending.splice(0)) fbq(...args);
}
