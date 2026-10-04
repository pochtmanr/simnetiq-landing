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

/** Records a product event in every tool the visitor agreed to: Vercel and
 *  GA with analytics consent, Meta Pixel (as a custom event, name unchanged)
 *  with marketing consent. Without either it does nothing. */
export function trackEvent(name: string, props?: Record<string, string>) {
  const w = window as Window & { gtag?: Tag; fbq?: Tag };
  if (hasAnalyticsConsent()) {
    track(name, props);
    w.gtag?.("event", name.toLowerCase().replace(/\s+/g, "_"), props);
  }
  if (hasMarketingConsent()) w.fbq?.("trackCustom", name.replace(/\s+/g, ""), props);
}
