"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { loadTelegramSdk, takeStartParamHref } from "../../../../lib/admin/telegram";

/* ---------------------------------------------------------------------------
 * Makes the panel feel native inside the Telegram Mini App. Mounted by
 * AuthGate only for a Telegram session; renders nothing.
 *
 *   - ready() + expand(), header/background painted the panel's canvas colour
 *   - vertical swipes off, so scrolling a long table does not close the app
 *   - Telegram's back button on every screen below /admin, going to the
 *     parent path (router.back() could leave the app on the first screen)
 *   - a deep link (startapp=act_<id> etc.) opens that record once
 * ------------------------------------------------------------------------ */

const CANVAS = "#F3F4F7";

function parentPath(pathname: string): string {
  const parts = pathname.replace(/\/+$/, "").split("/");
  parts.pop();
  const up = parts.join("/");
  return up.startsWith("/admin") ? up : "/admin";
}

export function TelegramBridge({ startParam }: { startParam: string | null }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    void loadTelegramSdk().then((app) => {
      if (!app) return;
      app.ready();
      app.expand();
      if (app.isVersionAtLeast("6.1")) {
        app.setHeaderColor(CANVAS);
        app.setBackgroundColor(CANVAS);
      }
      if (app.isVersionAtLeast("7.7")) app.disableVerticalSwipes?.();
    });
  }, []);

  useEffect(() => {
    const href = takeStartParamHref(startParam);
    if (href && pathname === "/admin") router.replace(href);
  }, [startParam, pathname, router]);

  useEffect(() => {
    let off: (() => void) | undefined;
    void loadTelegramSdk().then((app) => {
      if (!app || !app.isVersionAtLeast("6.1")) return;
      if (pathname === "/admin") {
        app.BackButton.hide();
        return;
      }
      const go = () => router.push(parentPath(pathname));
      app.BackButton.onClick(go);
      app.BackButton.show();
      off = () => app.BackButton.offClick(go);
    });
    return () => off?.();
  }, [pathname, router]);

  return null;
}

/** Closes the Mini App; the panel's "Sign out" inside Telegram. */
export function closeTelegram(): void {
  void loadTelegramSdk().then((app) => app?.close());
}
