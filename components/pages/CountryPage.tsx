import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { PaintedCta } from "../PaintedCta";
import { RelatedServices } from "../RelatedServices";
import { StoreBadges } from "../StoreBadges";
import type { CountryEntry } from "../../lib/content/countries/types";
import { servicesUi, ui } from "../../lib/content/ui";
import type { Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/** Template for /virtual-numbers/country/[country]. */
export function CountryPage({
  locale,
  entry,
}: {
  locale: Locale;
  entry: CountryEntry;
}) {
  const t = servicesUi(locale);
  const c = entry.copy;
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <JsonLd data={faqPage(locale, c.faqs)} />
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumbHub, path: "/virtual-numbers" },
            {
              name: c.name,
              path: `/virtual-numbers/country/${entry.slug}`,
            },
          ]}
        />
      </div>

      {/* Hero — the home hero's full-width panel, with the country's
          facts as a white card on its inline-end side. */}
      <section className="pt-[10px]">
        <div className="panel hero-rise page-hero !items-stretch">
          <div>
            <div className="flex flex-wrap items-center gap-[14px]">
              <span className="logo-tile text-[34px] leading-none">{entry.flag}</span>
              <div className="flex flex-wrap gap-[8px]">
                <span className="tag-chip">{t.heroLabel}</span>
                <span className="tag-chip" dir="ltr">{entry.dialingCode}</span>
              </div>
            </div>
            <h1 className="mt-[26px] text-heading-lg">{c.hero.title}</h1>
            {c.hero.intro.map((p, i) => (
              <p
                key={i}
                className={`max-w-[56ch] text-ink-muted ${i === 0 ? "mt-[20px] text-prose" : "mt-[12px] text-body"}`}
              >
                {p}
              </p>
            ))}
            <div className="mt-[30px]">
              <StoreBadges locale={locale} />
            </div>
          </div>

          {/* Country facts card */}
          <div className="card flex flex-col justify-center">
            <div className="flex items-center gap-[15px]">
              <span className="text-[44px] leading-none">{entry.flag}</span>
              <span className="text-subheading">{c.name}</span>
            </div>
            <div className="mt-[22px] border-t border-border pt-[22px]">
              <span className="section-label">{t.country.dialingCode}</span>
              <p className="figures text-heading text-accent-deep" dir="ltr">{entry.dialingCode}</p>
            </div>
            <div className="mt-[22px] border-t border-border pt-[22px]">
              <span className="section-label">{t.country.numberFormat}</span>
              <p className="text-subheading" dir="ltr">{entry.numberFormat}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this country */}
      <section className="pt-[22px]">
        <div className="card">
          <h2 className="max-w-2xl text-heading">{c.whyCountry.title}</h2>
          <div className="mt-[22px] grid gap-[22px] md:grid-cols-2">
            {c.whyCountry.body.map((p, i) => (
              <p key={i} className="text-body text-ink-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Country-specific tips */}
      <section className="pt-[94px]">
        <div className="panel">
          <span className="section-label">{t.tipsLabel}</span>
          <h2 className="text-heading">{t.tipsTitle}</h2>
          <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
            {c.tips.map((tip) => (
              <div key={tip.title} className="card">
                <span className="tip-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5M12 8h.01" />
                  </svg>
                </span>
                <h3 className="mt-[16px] text-body font-medium text-ink">{tip.title}</h3>
                <p className="mt-[10px] text-label text-ink-muted">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl pt-[94px]">
        <span className="section-label">{t.faqLabel}</span>
        <h2 className="text-heading">{ui(locale).faqHeading}</h2>
        <div className="mt-[34px]">
          {c.faqs.map((item, i) => (
            <details
              key={item.q}
              className={`group py-[21px] ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-heading-sm font-medium text-ink">
                  {item.q}
                </h3>
                <span className="mt-[6px] shrink-0 text-accent-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-[11px] max-w-[62ch] text-body text-ink-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Services commonly verified with this country */}
      <RelatedServices locale={locale} slugs={entry.popularServiceSlugs} />

      <PaintedCta
        locale={locale}
        title={t.ctaTitle}
        supportLabel={t.ctaSupport}
        placement="service_cta"
      />
    </div>
  );
}
