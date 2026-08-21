import Link from "next/link";
import { localePath, type Locale } from "../lib/i18n";
import { FOOTER } from "../lib/content/common";
import { ALL_SERVICES } from "../lib/content/services";
import {
  APP_STORE_URL,
  COMPANY_SITE,
  COMPANY_URL,
  SOCIALS,
  SUPPORT_EMAIL,
} from "../lib/site";

/* Top slugs only — the /virtual-numbers hub carries the exhaustive list, the
   sitewide footer stays around 20 links total. */
const FOOTER_SERVICE_SLUGS = [
  "telegram",
  "whatsapp",
  "google",
  "instagram",
  "tiktok",
  "discord",
  "facebook",
  "twitter",
];

/* Column eyebrow. The system's one uppercase treatment, in the on-ink accent
   (#59A1FC is 5.3:1 here; #1E5AA8, its light-mode counterpart, is 2.2:1).
   !mb-0 because the columns space themselves with a flex gap. */
const kicker = "section-label !mb-0 !text-accent";

/* Nav link: canvas at reduced emphasis, full canvas on hover, 150ms colour. */
const link = "text-label text-canvas/65 transition-colors hover:text-canvas";

/* Social glyphs, inline so they inherit the link colour through currentColor.
   Monochrome, unlike the coverage marquee: X's real mark is black, which would
   disappear against the ink band the moment it was revealed. */
const SOCIAL_PATHS: Record<string, string> = {
  X: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  Instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const t = FOOTER[locale];
  const services = FOOTER_SERVICE_SLUGS.map((slug) =>
    ALL_SERVICES.find((s) => s.slug === slug),
  ).filter((s) => s !== undefined);

  return (
    <footer className="panel--ink mt-[94px]">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,34px)] py-[clamp(42px,5vw,70px)]">
        <div className="grid gap-[34px] md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col items-start gap-[16px] md:pr-[32px]">
            <div className="flex items-center gap-[10px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo.svg"
                alt=""
                width={28}
                height={28}
                className="h-[28px] w-[28px]"
              />
              <span className="text-body font-medium text-canvas">
                SMS Code
              </span>
            </div>
            <p className="max-w-[26ch] text-subheading text-canvas/85">
              {t.tagline}
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="blue-link blue-link--ink text-label"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Popular services */}
          <nav
            aria-label={t.servicesLabel}
            className="flex flex-col items-start gap-[12px]"
          >
            <span className={kicker}>{t.servicesLabel}</span>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={localePath(locale, `/virtual-numbers/${s.slug}`)}
                className={link}
              >
                {s.name}
              </Link>
            ))}
            <Link
              href={localePath(locale, "/virtual-numbers")}
              className="blue-link blue-link--ink text-label"
            >
              {t.allServices} →
            </Link>
          </nav>

          {/* Resources */}
          <nav
            aria-label={t.resourcesLabel}
            className="flex flex-col items-start gap-[12px]"
          >
            <span className={kicker}>{t.resourcesLabel}</span>
            <Link href={localePath(locale, "/virtual-numbers")} className={link}>
              {t.hub}
            </Link>
            <Link href={localePath(locale, "/blog")} className={link}>
              {t.blog}
            </Link>
            <span className={`${kicker} pt-[14px]`}>{t.getApp}</span>
            <a href={APP_STORE_URL} className={link}>
              App Store
            </a>
          </nav>

          {/* Company */}
          <nav
            aria-label={t.companyLabel}
            className="flex flex-col items-start gap-[12px]"
          >
            <span className={kicker}>{t.companyLabel}</span>
            <a href={COMPANY_URL} className={link}>
              {COMPANY_SITE}
            </a>
            <Link href={localePath(locale, "/support")} className={link}>
              {t.support}
            </Link>
            <Link href={localePath(locale, "/privacy-policy")} className={link}>
              {t.privacy}
            </Link>
            <Link href={localePath(locale, "/terms-of-service")} className={link}>
              {t.terms}
            </Link>
          </nav>
        </div>

        {/* Bottom bar — the footer's only rule, so the columns above stay open */}
        <div className="mt-[42px] flex flex-wrap items-center justify-between gap-[16px] border-t border-canvas/12 pt-[24px]">
          <p className="text-caption text-canvas/45">
            © {new Date().getFullYear()} SIMNETIQ LTD · {t.rights}
          </p>
          <nav
            aria-label={t.followLabel}
            className="flex items-center gap-[18px]"
          >
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                aria-label={s.name}
                className="text-canvas/45 transition-colors hover:text-canvas"
              >
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  height={18}
                  fill="currentColor"
                  aria-hidden
                >
                  <path d={SOCIAL_PATHS[s.name]} />
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
