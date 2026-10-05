"use client";

import { createClient } from "@supabase/supabase-js";
import { setAdminClientOverride } from "./client";

/* ---------------------------------------------------------------------------
 * The admin panel as a Telegram Mini App.
 *
 * The bot's "Panel" button opens https://simnetiq.xyz/admin inside Telegram.
 * Telegram appends #tgWebAppData=<initData>&… to that URL, signed with the
 * bot token. AuthGate sees it and, instead of password + TOTP, posts it to the
 * tg-auth edge function, which checks the signature and that this Telegram
 * account is linked to a live admin (/admin/settings → Link Telegram). It
 * answers with a 15-minute aal2 access token for that admin; this module keeps
 * it fresh and installs a client that uses it, so every page, RPC and
 * is_admin() check is the same one the web panel uses.
 *
 * The hash is gone after the first client-side navigation, so the launch is
 * kept in sessionStorage (per Telegram webview, cleared when it closes) — the
 * same thing telegram-web-app.js does.
 * ------------------------------------------------------------------------ */

export type TelegramWebApp = {
  initData: string;
  initDataUnsafe?: { start_param?: string };
  version: string;
  ready(): void;
  expand(): void;
  close(): void;
  isVersionAtLeast(v: string): boolean;
  setHeaderColor(c: string): void;
  setBackgroundColor(c: string): void;
  disableVerticalSwipes?: () => void;
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void };
  HapticFeedback?: { notificationOccurred(t: "success" | "warning" | "error"): void };
  openLink(url: string): void;
  openTelegramLink?: (url: string) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

const STORE_KEY = "admin:tg-launch";

/** The ops bot; Mini App links and deep links go through it. */
export const TG_BOT = "smscodelogbot";

/** Opens a t.me link: inside Telegram without leaving the Mini App, else a new tab. */
export function openTelegramUrl(url: string): void {
  const app = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
  if (app?.openTelegramLink && readTelegramLaunch()) app.openTelegramLink(url);
  else window.open(url, "_blank", "noopener");
}
const SDK_SRC = "https://telegram.org/js/telegram-web-app.js?59";

export type TelegramLaunch = { initData: string; startParam: string | null };

/** The Mini App launch, if this page was opened by Telegram; null on the web. */
export function readTelegramLaunch(): TelegramLaunch | null {
  if (typeof window === "undefined") return null;
  try {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const initData = hash.get("tgWebAppData");
    if (initData) {
      const startParam = new URLSearchParams(initData).get("start_param");
      const launch = { initData, startParam };
      sessionStorage.setItem(STORE_KEY, JSON.stringify(launch));
      /* The hash stays: telegram-web-app.js reads the platform version and
         theme from it when it loads. It lives only in Telegram's webview. */
      return launch;
    }
    const kept = sessionStorage.getItem(STORE_KEY);
    return kept ? (JSON.parse(kept) as TelegramLaunch) : null;
  } catch {
    return null;
  }
}

let sdk: Promise<TelegramWebApp | null> | null = null;

/** Loads telegram-web-app.js once, inside Telegram only. Never rejects. */
export function loadTelegramSdk(): Promise<TelegramWebApp | null> {
  if (sdk) return sdk;
  sdk = new Promise((resolve) => {
    if (window.Telegram?.WebApp) return resolve(window.Telegram.WebApp);
    const s = document.createElement("script");
    s.src = SDK_SRC;
    s.async = true;
    s.onload = () => resolve(window.Telegram?.WebApp ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return sdk;
}

export type TelegramSignInError =
  | "initdata_missing"
  | "initdata_invalid"
  | "initdata_expired"
  | "not_linked"
  | "not_configured"
  | "network";

export type TelegramSession = {
  user: { id: string; email: string | null; role: string };
  telegram: { id: number; username: string | null; first_name: string };
};

type AuthResponse = TelegramSession & { access_token: string; expires_at: number };

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing");
  return { url, anonKey };
}

async function exchange(initData: string): Promise<AuthResponse | { error: TelegramSignInError; telegramId?: number }> {
  const { url, anonKey } = env();
  try {
    const res = await fetch(`${url}/functions/v1/tg-auth`, {
      method: "POST",
      headers: { Authorization: `tma ${initData}`, apikey: anonKey },
    });
    const body = (await res.json().catch(() => ({}))) as Partial<AuthResponse> & { code?: string; telegram_id?: number };
    if (res.ok && body.access_token) return body as AuthResponse;
    const known: TelegramSignInError[] = ["initdata_missing", "initdata_invalid", "initdata_expired", "not_linked", "not_configured"];
    const code = known.find((c) => c === body.code) ?? "network";
    return { error: code, telegramId: body.telegram_id };
  } catch {
    return { error: "network" };
  }
}

/** Refresh this long before the token's exp. */
const REFRESH_EARLY_S = 120;

type StartResult = TelegramSession | { error: TelegramSignInError; telegramId?: number };

/* Every admin page mounts its own AuthGate, so this is asked for on each
   navigation. One sign-in and one refresh timer per page load. */
let started: Promise<StartResult> | null = null;
let lostListener: ((reason: TelegramSignInError) => void) | null = null;

/**
 * Signs in with the launch's initData and installs the Telegram client.
 * Resolves with the session, or with the reason it could not. `onLost` is
 * called if a later refresh fails (the most recent gate's callback wins).
 */
export function startTelegramSession(
  launch: TelegramLaunch,
  onLost: (reason: TelegramSignInError) => void,
): Promise<StartResult> {
  lostListener = onLost;
  if (!started) {
    started = signIn(launch).then((r) => {
      if ("error" in r) started = null;
      return r;
    });
  }
  return started;
}

async function signIn(launch: TelegramLaunch): Promise<StartResult> {
  const onLost = (reason: TelegramSignInError) => lostListener?.(reason);
  const first = await exchange(launch.initData);
  if ("error" in first) return first;

  let token = first.access_token;
  let expiresAt = first.expires_at;
  const { url, anonKey } = env();
  const client = createClient(url, anonKey, { accessToken: async () => token });

  const schedule = () => {
    const ms = Math.max(5_000, (expiresAt - REFRESH_EARLY_S) * 1000 - Date.now());
    window.setTimeout(async () => {
      const next = await exchange(launch.initData);
      if ("error" in next) {
        /* A network blip is retried; anything else ends the session. */
        if (next.error === "network" && expiresAt * 1000 > Date.now()) return schedule();
        return onLost(next.error);
      }
      token = next.access_token;
      expiresAt = next.expires_at;
      void client.realtime.setAuth(token);
      schedule();
    }, ms);
  };
  schedule();

  setAdminClientOverride({ client, token: async () => token });
  return { user: first.user, telegram: first.telegram };
}

/** Where a deep link (t.me/<bot>/<app>?startapp=act_<id>) should land. */
export function startParamHref(p: string | null): string | null {
  if (!p) return null;
  const m = /^(act|usr|tkt|txn)_([A-Za-z0-9_-]{1,80})$/.exec(p);
  if (!m) return null;
  const id = m[2];
  switch (m[1]) {
    case "act":
      return `/admin/activations/${id}`;
    case "usr":
      return `/admin/users/${id}`;
    case "tkt":
      return `/admin/support/${id}`;
    case "txn":
      return `/admin/purchases/${encodeURIComponent(id)}`;
  }
  return null;
}

let startTaken = false;

/** startParamHref, but only the first time per page load. */
export function takeStartParamHref(p: string | null): string | null {
  if (startTaken) return null;
  startTaken = true;
  return startParamHref(p);
}
