"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { localePath, switchLocalePath, type Locale } from "../lib/i18n";
import { LOCALE_REGISTRY } from "../lib/locales";
import type { UiDict } from "../lib/content/ui";
import { APP_STORE_URL } from "../lib/site";
import { AppleGlyph } from "./AppleGlyph";
import { LangFlag } from "./LangFlag";

/*
 * The bar sits on the page's own grid — max-w-[1200px] with the same
 * clamp gutters as every section — rather than floating as a centred island,
 * so its edges line up with the hero panels below it. Sticky, on a flat canvas
 * band: the system has no elevation, so content passing underneath is hidden by
 * the band's fill rather than by a shadow or a blur.
 */

export function SiteNav({
  locale,
  t,
  mainNavLabel,
}: {
  locale: Locale;
  t: UiDict["nav"];
  mainNavLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
        {/* Insets are optical, not uniform: each end element sits the same
            distance from the bar's edge on every side. The 37px CTA gets 10px
            all round (pr = py); the 24px logo floats 16.5px from top and
            bottom in the 57px bar, so it gets 16px on the left. Below sm the
            CTA is hidden and the hamburger glyph lands ~18px in both ways. */}
        <nav
          aria-label={mainNavLabel}
          className="pointer-events-auto relative flex w-full items-center gap-x-6 rounded-card bg-card py-[10px] ps-[16px] pe-[16px] sm:pe-[10px]"
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
            {/* Wordmark in the display face, so the bar carries the same
                voice as the headlines rather than reading as plain UI. */}
            <span className="font-display text-[15px] font-semibold tracking-[-0.02em]">
              SMS Code
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-x-[26px] lg:flex">
            {t.links.map((link) => (
              <Link
                key={link.path}
                href={localePath(locale, link.path)}
                className="text-body font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ms-auto flex items-center gap-[16px]">
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
                className="flex items-center gap-[7px] text-label font-medium text-ink transition-opacity hover:opacity-70"
              >
                <LangFlag locale={locale} />
                <span>{locale.toUpperCase()}</span>
              </button>

              {langOpen && (
                <div
                  role="menu"
                  aria-label={t.langLabel}
                  className="absolute end-0 top-full mt-[14px] min-w-[156px] rounded-card border border-border bg-card py-[6px]"
                >
                  {LOCALE_REGISTRY.map((lang) => (
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
                      <span className="flex items-center gap-[10px]">
                        <LangFlag locale={lang.code} />
                        {lang.nativeName}
                      </span>
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
              <AppleGlyph className="h-[14px] w-[14px]" />
              {t.cta}
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.closeMenu : t.openMenu}
              className="-me-[6px] flex h-8 w-8 items-center justify-center lg:hidden"
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
                <AppleGlyph className="h-[14px] w-[14px]" />
                {t.cta}
              </a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
