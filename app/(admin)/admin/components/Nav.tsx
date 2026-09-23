"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------------
 * Navigation. A top bar from `md` up; on a phone a thumb-reach tab bar with
 * the four screens used most, and "More" for the rest.
 * ------------------------------------------------------------------------ */

type Item = { href: string; label: string; icon: string };

const PRIMARY: Item[] = [
  { href: "/admin", label: "Overview", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/admin/money", label: "Money", icon: "M12 3v18M17 7.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 2.8 5 3.5 5 1.6 5 3.5-2.2 3-5 3-5-1.1-5-3" },
  { href: "/admin/users", label: "Users", icon: "M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7M21 19v-1a4 4 0 00-3-3.9M15.5 3.1a3.5 3.5 0 010 6.8" },
  { href: "/admin/support", label: "Support", icon: "M4 5h16v11H8l-4 4V5z" },
];

const SECONDARY: Item[] = [
  { href: "/admin/purchases", label: "Purchases", icon: "M6 6h15l-1.5 8H7.5L6 6zm0 0L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" },
  { href: "/admin/delivery", label: "Delivery", icon: "M3 17l5-5 4 4 8-8M15 8h5v5" },
  { href: "/admin/system", label: "System", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" },
];

/** Overview is active only on exactly /admin; the rest own their subtree
 *  (activations and combos belong to Money's area only loosely, so they
 *  highlight nothing rather than something misleading). */
function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function TopNav({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname() ?? "";
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1160px] items-center gap-x-[18px] px-[clamp(16px,3vw,28px)] py-[10px]">
        <Link href="/admin" className="flex items-center gap-[8px] text-label font-semibold">
          <span className="inline-block h-[10px] w-[10px] rounded-full bg-gradient-to-br from-accent to-accent-dark" aria-hidden />
          Operations
        </Link>
        <nav className="hidden items-center gap-x-[2px] text-label md:flex" aria-label="Main">
          {[...PRIMARY, ...SECONDARY].map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-[8px] px-[10px] py-[6px] ${
                  active ? "bg-panel-strong font-medium text-accent-deep" : "text-ink-muted hover:bg-panel hover:text-ink"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" onClick={onSignOut} className="ml-auto hidden text-label text-muted underline underline-offset-2 md:block">
          Sign out
        </button>
      </div>
    </header>
  );
}

export function BottomNav({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname() ?? "";
  const [more, setMore] = useState(false);
  const moreActive = SECONDARY.some((it) => isActive(pathname, it.href));

  /* Close on Escape; links close it themselves when tapped. */
  useEffect(() => {
    if (!more) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [more]);

  const tab = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-[2px] pt-[8px] pb-[6px] text-[10.5px] font-medium ${active ? "text-accent-deep" : "text-muted"}`;

  return (
    <>
      {more ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="More">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/30" onClick={() => setMore(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[18px] bg-card px-[16px] pt-[10px] pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-[10px] h-[4px] w-[36px] rounded-full bg-border" aria-hidden />
            <ul className="flex flex-col">
              {SECONDARY.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setMore(false)}
                    className={`flex items-center gap-[12px] rounded-[10px] px-[10px] py-[12px] text-body ${
                      isActive(pathname, it.href) ? "bg-panel-strong text-accent-deep" : "text-ink"
                    }`}
                  >
                    <Icon d={it.icon} />
                    {it.label}
                  </Link>
                </li>
              ))}
              <li className="mt-[6px] border-t border-border pt-[6px]">
                <button type="button" onClick={onSignOut} className="w-full rounded-[10px] px-[10px] py-[12px] text-left text-body text-bad">
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {PRIMARY.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className={tab(active)}>
              <Icon d={it.icon} />
              {it.label}
            </Link>
          );
        })}
        <button type="button" onClick={() => setMore(true)} aria-expanded={more} className={tab(moreActive)}>
          <Icon d="M5 12h.01M12 12h.01M19 12h.01" />
          More
        </button>
      </nav>
    </>
  );
}
