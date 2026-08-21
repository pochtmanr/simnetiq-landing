import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { RelatedServices } from "../RelatedServices";
import { StoreBadges } from "../StoreBadges";
import type { CountryEntry } from "../../lib/content/countries/types";
import { SERVICES_UI } from "../../lib/content/servicesUi";
import { localePath, type Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/** Template for /virtual-numbers/country/[country]. */
export function CountryPage({
  locale,
  entry,
}: {
  locale: Locale;
  entry: CountryEntry;
}) {
  const t = SERVICES_UI[locale];
  const c = entry[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <JsonLd data={faqPage(c.faqs)} />
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumbHub, path: "/virtual-numbers" },
            {
              name: entry.name[locale],
              path: `/virtual-numbers/country/${entry.slug}`,
            },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative grid items-start gap-[60px] pb-[94px] pt-[10px] md:grid-cols-[1.5fr_1fr]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[180px] bottom-0 left-[calc(50%-50vw)] -z-10 w-screen"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 72% 32%, rgba(89, 161, 252, 0.08), transparent 68%)",
          }}
        />
        <div>
          <span className="section-label">
            {entry.flag} {t.heroLabel} · {entry.name[locale]}
          </span>
          <h1 className="text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
            {c.hero.title}
          </h1>
          {c.hero.intro.map((p, i) => (
            <p
              key={i}
              className={`max-w-xl text-ink-muted ${i === 0 ? "mt-[22px] text-subheading" : "mt-[15px] text-body"}`}
            >
              {p}
            </p>
          ))}
          <div className="mt-[30px]">
            <StoreBadges locale={locale} />
          </div>
        </div>

        {/* Country facts card */}
        <div className="card">
          <div className="flex items-center gap-[15px]">
            <span className="text-[44px] leading-none">{entry.flag}</span>
            <span className="text-subheading">{entry.name[locale]}</span>
          </div>
          <div className="mt-[22px] border-t border-border pt-[22px]">
            <span className="section-label">{t.country.dialingCode}</span>
            <p className="text-heading text-accent-deep">{entry.dialingCode}</p>
          </div>
          <div className="mt-[22px] border-t border-border pt-[22px]">
            <span className="section-label">{t.country.numberFormat}</span>
            <p className="text-subheading">{entry.numberFormat}</p>
          </div>
        </div>
      </section>

      {/* Why this country */}
      <section>
        <div className="panel">
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
        <span className="section-label">{t.tipsLabel}</span>
        <h2 className="text-heading">{t.tipsTitle}</h2>
        <div className="mt-[34px] grid gap-x-[34px] gap-y-[30px] md:grid-cols-3">
          {c.tips.map((tip) => (
            <div
              key={tip.title}
              className="border-t border-border pt-[22px]"
            >
              <h3 className="text-body text-ink">{tip.title}</h3>
              <p className="mt-[10px] text-label text-ink-muted">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl pt-[94px]">
        <span className="section-label">{t.faqLabel}</span>
        <h2 className="text-heading">FAQ</h2>
        <div className="mt-[34px]">
          {c.faqs.map((item, i) => (
            <details
              key={item.q}
              className={`group py-[21px] ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-heading-sm font-light text-ink">
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

      {/* Final CTA */}
      <section className="py-[94px]">
        <div className="card flex flex-col items-center gap-[30px] text-center">
          <h2 className="max-w-2xl text-heading">{t.ctaTitle}</h2>
          <StoreBadges locale={locale} placement="service_cta" />
          <Link
            href={localePath(locale, "/support")}
            className="blue-link text-label"
          >
            {t.ctaSupport}
          </Link>
        </div>
      </section>
    </div>
  );
}
