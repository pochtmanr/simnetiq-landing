import type { CSSProperties } from "react";
import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { PaintedCta } from "../PaintedCta";
import { getCountries } from "../../lib/content/countries";
import { getServices } from "../../lib/content/services";
import type { ServiceCategory } from "../../lib/content/services/types";
import { servicesUi } from "../../lib/content/ui";
import { localePath, type Locale } from "../../lib/i18n";

const CATEGORY_ORDER: ServiceCategory[] = [
  "messaging",
  "social",
  "other",
  "finance",
  "shopping",
  "travel",
  "entertainment",
  "dev",
];

function TileArrow() {
  return (
    <svg viewBox="0 0 16 16" className="svc-tile__arrow h-[16px] w-[16px] rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** /virtual-numbers — the crawl hub: every service page one click away. */
export function VirtualNumbersHubPage({ locale }: { locale: Locale }) {
  const t = servicesUi(locale);
  const services = getServices(locale);
  const countries = getCountries(locale);
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    entries: services.filter((s) => s.category === category),
  })).filter((g) => g.entries.length > 0);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumbHub, path: "/virtual-numbers" },
          ]}
        />
      </div>

      {/* Hero — a full-width ink card: the promise, a jump-chip per
          category, and every covered service drifting past underneath. */}
      <section className="pt-[10px]">
        <div className="panel panel--ink hero-rise overflow-hidden !px-0 !pb-[30px]">
          <div className="px-[clamp(28px,4vw,42px)]">
            <span className="section-label !text-accent">{t.hub.label}</span>
            <h1 className="max-w-[18ch] text-heading-lg !text-white">{t.hub.title}</h1>
            <p className="mt-[20px] max-w-[56ch] text-prose text-white/65">{t.hub.sub}</p>
            <nav className="mt-[30px] flex flex-wrap gap-[8px]" aria-label={t.breadcrumbHub}>
              {grouped.map(({ category, entries }) => (
                <a key={category} href={`#cat-${category}`} className="jump-chip">
                  {t.categories[category]}
                  <span className="jump-chip__count">{entries.length}</span>
                </a>
              ))}
              {countries.length > 0 && (
                <a href="#countries" className="jump-chip">
                  {t.country.hubLabel}
                  <span className="jump-chip__count">{countries.length}</span>
                </a>
              )}
            </nav>
          </div>
          <div className="logo-strip logo-strip--ink mt-[40px]" aria-hidden>
            <div className="marquee-track flex items-center gap-[36px] px-4">
              {[...services, ...services].map((s, i) => (
                <span
                  key={`${s.slug}-${i}`}
                  className="logo-chip !h-[40px] !w-[40px]"
                  style={{ "--logo": `url(${s.logo})` } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {grouped.map(({ category, entries }, gi) => (
        <section key={category} id={`cat-${category}`} className="scroll-mt-24 pt-[72px]">
          <div className="flex items-center gap-[12px]">
            <h2 className="text-heading-sm font-display font-medium text-ink">
              {t.categories[category]}
            </h2>
            <span className="tag-chip">{entries.length}</span>
          </div>
          <div
            className={`mt-[22px] grid gap-[12px] ${
              gi === 0
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {entries.map((entry) => (
              <Link
                key={entry.slug}
                href={localePath(locale, `/virtual-numbers/${entry.slug}`)}
                className={`svc-tile${gi === 0 ? " svc-tile--lg" : ""}`}
              >
                <span className="svc-tile__logo">
                  <img
                    src={entry.logo}
                    alt=""
                    className={gi === 0 ? "h-8 w-8" : "h-6 w-6"}
                    loading="lazy"
                  />
                </span>
                <span className={gi === 0 ? "text-subheading" : "text-body font-medium"}>
                  {entry.name}
                </span>
                <TileArrow />
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Countries */}
      {countries.length > 0 && (
        <section className="scroll-mt-24 pt-[94px]" id="countries">
          <div className="panel">
            <span className="section-label">{t.country.hubLabel}</span>
            <h2 className="text-heading">{t.country.hubTitle}</h2>
            <div className="mt-[28px] flex flex-wrap gap-[10px]">
              {countries.map((c) => (
                <Link
                  key={c.slug}
                  href={localePath(locale, `/virtual-numbers/country/${c.slug}`)}
                  className="chip !py-[10px] !text-[14px]"
                >
                  <span className="text-[18px] leading-none">{c.flag}</span>
                  {c.copy.name}
                  <span className="chip__meta" dir="ltr">{c.dialingCode}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <p className="mt-[22px] text-caption text-muted">{t.hub.allNote}</p>

      <PaintedCta locale={locale} title={t.ctaTitle} placement="hub_cta" />
    </div>
  );
}
