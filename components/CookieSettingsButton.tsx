"use client";

import { openCookieSettings } from "../lib/consent";

/** Reopens the cookie preferences dialog — withdrawing consent has to be as
 *  easy as giving it, so this sits in the footer on every page. */
export function CookieSettingsButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      {children}
    </button>
  );
}
