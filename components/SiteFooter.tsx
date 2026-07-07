import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "../lib/i18n";
import { FOOTER } from "../lib/content/common";
import { ALL_COUNTRIES } from "../lib/content/countries";
import { ALL_SERVICES } from "../lib/content/services";
import { APP_STORE_URL, PLAY_STORE_URL, SUPPORT_EMAIL } from "../lib/site";

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

const FOOTER_COUNTRY_SLUGS = [
  "united-states",
  "united-kingdom",
  "germany",
  "france",
  "poland",
  "netherlands",
];

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const t = FOOTER[locale];
  const services = FOOTER_SERVICE_SLUGS.map((slug) =>
    ALL_SERVICES.find((s) => s.slug === slug),
  ).filter((s) => s !== undefined);
  const countries = FOOTER_COUNTRY_SLUGS.map((slug) =>
    ALL_COUNTRIES.find((c) => c.slug === slug),
  ).filter((c) => c !== undefined);

  return (
    <footer className="mt-[94px] bg-off-black px-[clamp(24px,6vw,69px)] pb-[34px] pt-[50px] text-pure-white">
      <div className="mx-auto max-w-[1200px]">
        <div
          className={`grid gap-[40px] ${countries.length > 0 ? "md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]" : "md:grid-cols-[1.4fr_1fr_1fr_1fr]"}`}
        >
          {/* Brand */}
          <div className="flex flex-col items-start gap-[22px]">
            <Image
              src="/brand/logo.png"
              alt=""
              width={60}
              height={61}
              className="h-[46px] w-[46px] object-contain"
            />
            <p className="text-heading">SMS Activate</p>
            <p className="max-w-[28ch] text-body text-pure-white/60">
              {t.tagline}
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link text-label">
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Popular services */}
          <nav aria-label={t.servicesLabel} className="flex flex-col gap-[12px]">
            <span className="text-caption uppercase tracking-[0.08em] text-pure-white/40">
              {t.servicesLabel}
            </span>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={localePath(locale, `/virtual-numbers/${s.slug}`)}
                className="ghost-link text-label"
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
          <nav aria-label={t.resourcesLabel} className="flex flex-col gap-[12px]">
            <span className="text-caption uppercase tracking-[0.08em] text-pure-white/40">
              {t.resourcesLabel}
            </span>
            <Link
              href={localePath(locale, "/virtual-numbers")}
              className="ghost-link text-label"
            >
              {t.hub}
            </Link>
            <Link
              href={localePath(locale, "/blog")}
              className="ghost-link text-label"
            >
              {t.blog}
            </Link>
            <span className="text-caption uppercase tracking-[0.08em] text-pure-white/40 pt-[10px]">
              {t.getApp}
            </span>
            <a href={APP_STORE_URL} className="ghost-link text-label">
              App Store
            </a>
            <a href={PLAY_STORE_URL} className="ghost-link text-label">
              Google Play
            </a>
          </nav>

          {/* Company */}
          <nav aria-label={t.companyLabel} className="flex flex-col gap-[12px]">
            <span className="text-caption uppercase tracking-[0.08em] text-pure-white/40">
              {t.companyLabel}
            </span>
            <Link href={localePath(locale, "/support")} className="ghost-link text-label">
              {t.support}
            </Link>
            <Link
              href={localePath(locale, "/privacy-policy")}
              className="ghost-link text-label"
            >
              {t.privacy}
            </Link>
            <Link
              href={localePath(locale, "/terms-of-service")}
              className="ghost-link text-label"
            >
              {t.terms}
            </Link>
          </nav>
        </div>

        <p className="mt-[50px] border-t-[0.5px] border-pure-white/10 pt-[22px] text-caption text-pure-white/40">
          © {new Date().getFullYear()} SIMNETIQ LTD. {t.rights}
        </p>
      </div>
    </footer>
  );
}
