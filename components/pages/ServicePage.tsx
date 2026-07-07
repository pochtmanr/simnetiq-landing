import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { RelatedServices } from "../RelatedServices";
import { StoreBadges } from "../StoreBadges";
import { getCountry } from "../../lib/content/countries";
import type { ServiceEntry } from "../../lib/content/services/types";
import { SERVICES_UI } from "../../lib/content/servicesUi";
import { localePath, type Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/** Template for /virtual-numbers/[service]. All copy comes from the entry;
 *  this file only lays it out in the home page's visual system. */
export function ServicePage({
  locale,
  entry,
}: {
  locale: Locale;
  entry: ServiceEntry;
}) {
  const t = SERVICES_UI[locale];
  const c = entry[locale];
  const countries = entry.popularCountries
    .map((slug) => getCountry(slug))
    .filter((e) => e !== undefined);
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <JsonLd data={faqPage(c.faqs)} />
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumbHub, path: "/virtual-numbers" },
            { name: entry.name, path: `/virtual-numbers/${entry.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative pb-[94px] pt-[10px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[180px] bottom-0 left-[calc(50%-50vw)] -z-10 w-screen"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 72% 32%, rgba(0, 113, 227, 0.08), transparent 68%)",
          }}
        />
        <div className="card max-w-[760px]">
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-[26px] border-[0.5px] border-black/[0.06] bg-pure-white">
            <img src={entry.logo} alt="" className="h-11 w-11" />
          </div>
          <span className="section-label mt-[22px] flex items-center">
            {t.heroLabel} · {entry.name}
          </span>
          <h1 className="text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
            {c.hero.title}
          </h1>
          {c.hero.intro.map((p, i) => (
            <p
              key={i}
              className={`max-w-md text-steel-gray ${i === 0 ? "mt-[22px] text-subheading" : "mt-[15px] text-body"}`}
            >
              {p}
            </p>
          ))}
          <div className="mt-[30px]">
            <StoreBadges locale={locale} />
          </div>
        </div>
      </section>

      {/* Why a virtual number for this service */}
      <section className="pt-[0px]">
        <div className="rounded-[63px] border-[0.5px] border-black/[0.06] bg-pure-white px-[clamp(16px,2.2vw,24px)] py-[clamp(18px,2.8vw,30px)]">
          <h2 className="max-w-2xl text-heading">{c.whyVirtual.title}</h2>
          <div className="mt-[22px] grid gap-[22px] md:grid-cols-2">
            {c.whyVirtual.body.map((p, i) => (
              <p key={i} className="text-body text-steel-gray">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* How to */}
      <section className="pt-[94px]">
        <h2 className="text-heading">{c.howTo.title}</h2>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-2 lg:grid-cols-4">
          {c.howTo.steps.map((step, i) => (
            <div key={step.title} className="card">
              <span className="section-label">
                {t.step} {i + 1}
              </span>
              <h3 className="text-subheading">{step.title}</h3>
              <p className="mt-[10px] text-label text-steel-gray">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service-specific tips */}
      <section className="pt-[94px]">
        <span className="section-label">{t.tipsLabel}</span>
        <h2 className="text-heading">{t.tipsTitle}</h2>
        <div className="mt-[34px] grid gap-x-[34px] gap-y-[30px] md:grid-cols-3">
          {c.tips.map((tip) => (
            <div
              key={tip.title}
              className="border-t-[0.5px] border-black/[0.06] pt-[22px]"
            >
              <h3 className="text-body text-pure-black">{tip.title}</h3>
              <p className="mt-[10px] text-label text-steel-gray">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl pt-[94px]">
        <span className="section-label">{t.faqLabel}</span>
        <h2 className="text-heading">FAQ</h2>
        <div className="mt-[34px] overflow-hidden rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white">
          {c.faqs.map((item, i) => (
            <details
              key={item.q}
              className={`group px-[clamp(22px,4vw,34px)] py-[22px] ${
                i > 0 ? "border-t-[0.5px] border-black/[0.06]" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-signal-blue transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-[10px] max-w-[56ch] text-label text-steel-gray">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Countries popular for this service */}
      {countries.length > 0 && (
        <section className="pt-[94px]">
          <span className="section-label">{t.countriesLabel}</span>
          <div className="mt-[15px] flex flex-wrap gap-[10px]">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={localePath(
                  locale,
                  `/virtual-numbers/country/${country.slug}`,
                )}
                className="inline-flex items-center gap-[8px] rounded-full border-[0.5px] border-black/[0.08] bg-pure-white px-[14px] py-[8px] text-label text-off-black transition-colors hover:border-signal-blue hover:text-signal-blue"
              >
                <span>{country.flag}</span>
                {country.name[locale]}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related services */}
      <RelatedServices locale={locale} slugs={entry.relatedSlugs} />

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
