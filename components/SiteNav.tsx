"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { localePath, switchLocalePath, type Locale } from "../lib/i18n";
import { LANGUAGES, NAV } from "../lib/content/common";
import { APP_STORE_URL } from "../lib/site";

/*
 * The bar sits on the page's own grid — max-w-[1200px] with the same
 * clamp gutters as every section — rather than floating as a centred island,
 * so its edges line up with the hero panels below it. Sticky, on a flat canvas
 * band: the system has no elevation, so content passing underneath is hidden by
 * the band's fill rather than by a shadow or a blur.
 */

export function SiteNav({ locale = "en" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = NAV[locale];

  useEffect(() => {
    if (!open && !langOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, langOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [langOpen]);

  return (
    <header className="pointer-events-none sticky top-0 z-50 pb-[10px] pt-[16px] sm:pt-[22px]">
      {/* Same container as every page section, so the bar's edges land on the
          hero panels' edges rather than 34px outside them. The header itself
          paints nothing — only the bar is opaque, so the page runs under it
          instead of behind a canvas-filled band. pointer-events are handed back
          on the bar so the transparent gutters stay click-through. */}
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
        <nav
          aria-label="Main"
          className="pointer-events-auto relative flex w-full items-center gap-x-6 rounded-card bg-card px-[22px] py-[11px]"
        >
          <Link
            href={localePath(locale, "/")}
            className="flex shrink-0 items-center gap-2 text-ink"
            aria-label={t.home}
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.svg"
              alt=""
              width={24}
              height={24}
              className="h-[24px] w-[24px]"
            />
            <span className="text-body">SMS Code</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-x-[26px] lg:flex">
            {t.links.map((link) => (
              <Link
                key={link.path}
                href={localePath(locale, link.path)}
                className="ghost-link text-body"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-[16px]">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangOpen((v) => !v);
                  setOpen(false);
                }}
                aria-expanded={langOpen}
                aria-haspopup="menu"
                aria-label={t.langLabel}
                className="flex items-center gap-[6px] text-label text-ink transition-opacity hover:opacity-70"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 fill-none stroke-ink"
                  strokeWidth="1"
                  aria-hidden
                >
                  <circle cx="8" cy="8" r="6.5" />
                  <ellipse cx="8" cy="8" rx="3" ry="6.5" />
                  <path d="M1.5 8h13" />
                </svg>
                <span>{locale.toUpperCase()}</span>
                <svg
                  viewBox="0 0 8 8"
                  className={`h-2 w-2 fill-none stroke-ink transition-transform ${
                    langOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth="1"
                  aria-hidden
                >
                  <path d="M1 2.5l3 3 3-3" />
                </svg>
              </button>

              {langOpen && (
                <div
                  role="menu"
                  aria-label={t.langLabel}
                  className="absolute right-0 top-full mt-[14px] min-w-[132px] rounded-card border border-border bg-card py-[6px]"
                >
                  {LANGUAGES.map((lang) => (
                    <Link
                      key={lang.code}
                      role="menuitem"
                      href={switchLocalePath(pathname, lang.code)}
                      onClick={() => setLangOpen(false)}
                      aria-current={lang.code === locale ? "true" : undefined}
                      className={`flex items-center justify-between gap-4 px-[16px] py-[9px] text-label transition-colors hover:bg-black/[0.03] ${
                        lang.code === locale ? "text-ink" : "text-ink-muted"
                      }`}
                    >
                      {lang.label}
                      {lang.code === locale && (
                        <svg
                          viewBox="0 0 12 12"
                          className="h-3 w-3 fill-none stroke-accent-deep"
                          strokeWidth="1"
                          aria-hidden
                        >
                          <path d="M2 6.5l2.5 2.5L10 3.5" />
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Primary action — the same gradient pill as every other CTA, one
                size down so it fits the bar. */}
            <a
              href={APP_STORE_URL}
              onClick={() => track("CTA Click iOS", { placement: "nav" })}
              className="cta cta--sm max-sm:hidden"
            >
              {t.cta}
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.closeMenu : t.openMenu}
              className="-mr-[6px] flex h-8 w-8 items-center justify-center lg:hidden"
            >
              {open ? (
                <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-ink" strokeWidth="1" aria-hidden>
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-ink" strokeWidth="1" aria-hidden>
                  <path d="M1 5h14M1 11h14" />
                </svg>
              )}
            </button>
          </div>

          {/* Dropdown panel for everything below the desktop breakpoint */}
          {open && (
            <div
              id="mobile-menu"
              className="absolute left-0 right-0 top-full mt-[6px] rounded-card border border-border bg-card px-[22px] py-[6px] lg:hidden"
            >
              {t.links.map((link, i) => (
                <Link
                  key={link.path}
                  href={localePath(locale, link.path)}
                  onClick={() => setOpen(false)}
                  className={`block py-[14px] text-body text-ink ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={APP_STORE_URL}
                onClick={() => {
                  setOpen(false);
                  track("CTA Click iOS", { placement: "nav" });
                }}
                className="cta cta--sm mb-[14px] mt-[8px] w-full justify-center sm:hidden"
              >
                {t.cta}
              </a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
