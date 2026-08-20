"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, switchLocalePath, type Locale } from "../lib/i18n";
import { LANGUAGES, NAV } from "../lib/content/common";

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
    <header className="relative z-50 flex justify-center px-4 pt-[22px] sm:pt-[34px]">
      <nav
        aria-label="Main"
        className="flex w-full items-center justify-between rounded-nav border-[0.5px] border-black/[0.06] bg-pure-white px-[22px] py-[11px] sm:w-auto sm:justify-start sm:gap-x-6"
      >
        <Link
          href={localePath(locale, "/")}
          className="flex items-center gap-2 text-off-black"
          aria-label={t.home}
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/logo.png"
            alt=""
            width={30}
            height={31}
            className="h-[22px] w-[22px] object-contain"
            priority
          />
          <span className="text-body">SMS Code</span>
        </Link>

        {/* Desktop links */}
        {t.links.map((link) => (
          <Link
            key={link.path}
            href={localePath(locale, link.path)}
            className="ghost-link text-body max-sm:hidden"
          >
            {link.label}
          </Link>
        ))}

        <div className="flex items-center gap-[16px]">
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
              className="flex items-center gap-[6px] text-label text-off-black transition-opacity hover:opacity-70"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4 fill-none stroke-off-black"
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
                className={`h-2 w-2 fill-none stroke-off-black transition-transform ${
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
                className="absolute right-0 top-full mt-[14px] min-w-[132px] rounded-[14px] border-[0.5px] border-black/[0.06] bg-pure-white py-[6px]"
              >
                {LANGUAGES.map((lang) => (
                  <Link
                    key={lang.code}
                    role="menuitem"
                    href={switchLocalePath(pathname, lang.code)}
                    onClick={() => setLangOpen(false)}
                    aria-current={lang.code === locale ? "true" : undefined}
                    className={`flex items-center justify-between gap-4 px-[16px] py-[9px] text-label transition-colors hover:bg-black/[0.03] ${
                      lang.code === locale ? "text-off-black" : "text-steel-gray"
                    }`}
                  >
                    {lang.label}
                    {lang.code === locale && (
                      <svg
                        viewBox="0 0 12 12"
                        className="h-3 w-3 fill-none stroke-signal-blue"
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

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
            className="-mr-[6px] flex h-8 w-8 items-center justify-center sm:hidden"
          >
            {open ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-off-black" strokeWidth="1" aria-hidden>
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-off-black" strokeWidth="1" aria-hidden>
                <path d="M1 5h14M1 11h14" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute left-4 right-4 top-full mt-[6px] rounded-[22px] border-[0.5px] border-black/[0.06] bg-pure-white px-[22px] py-[6px] sm:hidden"
        >
          {t.links.map((link, i) => (
            <Link
              key={link.path}
              href={localePath(locale, link.path)}
              onClick={() => setOpen(false)}
              className={`block py-[14px] text-body text-off-black ${
                i > 0 ? "border-t-[0.5px] border-black/[0.06]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
