import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "../lib/i18n";
import { FOOTER } from "../lib/content/common";
import { ALL_SERVICES } from "../lib/content/services";
import { APP_STORE_URL, SUPPORT_EMAIL } from "../lib/site";

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

/* Mono uppercase column header — the ops-console kicker. */
const kicker =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-pure-white/40";

/* Nav link: dim by default, brightens on hover (no underline). */
const link =
  "text-label text-pure-white/55 transition-colors hover:text-pure-white";

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const t = FOOTER[locale];
  const services = FOOTER_SERVICE_SLUGS.map((slug) =>
    ALL_SERVICES.find((s) => s.slug === slug),
  ).filter((s) => s !== undefined);

  return (
    <footer className="mt-[94px] border-t border-pure-white/10 bg-off-black text-pure-white">
      <div className="mx-auto max-w-[1200px] px-[clamp(24px,6vw,69px)]">
        {/* System strip — logo wordmark + mono path, the signature line */}
        <div className="flex items-center justify-between gap-[16px] border-b border-pure-white/10 py-[20px]">
          <div className="flex items-center gap-[12px]">
            <Image
              src="/brand/logo.png"
              alt=""
              width={60}
              height={61}
              className="h-[28px] w-[28px] object-contain"
            />
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-pure-white/80">
              SMS Code
            </span>
          </div>
          <span className="flex items-center gap-[9px] font-mono text-[11px] uppercase tracking-[0.18em] text-pure-white/35">
            <span
              aria-hidden
              className="h-[6px] w-[6px] shrink-0 bg-signal-blue"
            />
            simnetiq / sms-code
          </span>
        </div>

        {/* Nav grid — hairline rules drawn between cells via gap-px + bg */}
        <div className="grid gap-px bg-pure-white/10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-[16px] bg-off-black py-[40px] md:pr-[32px]">
            <p className="max-w-[26ch] text-subheading leading-[1.35] text-pure-white/90">
              {t.tagline}
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="blue-link font-mono text-[12px]"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Popular services */}
          <nav
            aria-label={t.servicesLabel}
            className="flex flex-col gap-[12px] bg-off-black py-[40px] md:px-[28px]"
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
              className="blue-link text-label"
            >
              {t.allServices} →
            </Link>
          </nav>

          {/* Resources */}
          <nav
            aria-label={t.resourcesLabel}
            className="flex flex-col gap-[12px] bg-off-black py-[40px] md:px-[28px]"
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
            className="flex flex-col gap-[12px] bg-off-black py-[40px] md:pl-[28px]"
          >
            <span className={kicker}>{t.companyLabel}</span>
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

        {/* Bottom bar */}
        <div className="border-t border-pure-white/10 py-[24px]">
          <p className="font-mono text-[12px] text-pure-white/40">
            © {new Date().getFullYear()} SIMNETIQ LTD · {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
