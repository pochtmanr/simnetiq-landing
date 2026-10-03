import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { PaintedCta } from "../PaintedCta";
import { RelatedServices } from "../RelatedServices";
import { StoreBadges } from "../StoreBadges";
import { getCountry } from "../../lib/content/countries";
import type { ServiceEntry } from "../../lib/content/services/types";
import { servicesUi, ui } from "../../lib/content/ui";
import { localePath, type Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/* The sample SMS with its code picked out in the accent. */
function SmsText({ message, code }: { message: string; code: string }) {
  const at = message.indexOf(code);
  if (at < 0) return <>{message}</>;
  return (
    <>
      {message.slice(0, at)}
      <span className="sms-code">{code}</span>
      {message.slice(at + code.length)}
    </>
  );
}

/** Template for /virtual-numbers/[service]. All copy comes from the entry;
 *  this file only lays it out in the home page's visual system. */
export function ServicePage({
  locale,
  entry,
}: {
  locale: Locale;
  entry: ServiceEntry;
}) {
  const t = servicesUi(locale);
  const c = entry.copy;
  const sms = entry.smsExample;
  const countries = entry.popularCountries
    .map((slug) => getCountry(locale, slug))
    .filter((e) => e !== undefined);
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <JsonLd data={faqPage(locale, c.faqs)} />
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

      {/* Hero — the home hero's full-width panel: copy on one side, the
          service's verification SMS arriving on the other. */}
      <section className="pt-[10px]">
        <div className="panel hero-rise page-hero">
          <div>
            <div className="flex flex-wrap items-center gap-[14px]">
              <span className="logo-tile">
                <img src={entry.logo} alt="" className="h-9 w-9" />
              </span>
              <div className="flex flex-wrap gap-[8px]">
                <span className="tag-chip">{t.categories[entry.category]}</span>
                <span className="tag-chip">{t.heroLabel}</span>
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

          <div className="sms-stage" aria-hidden>
            <img src={entry.logo} alt="" className="sms-stage__mark" />
            <div className="sms-preview sms-preview--ghost">
              <span className="logo-tile !h-[36px] !w-[36px] !rounded-[10px]">
                <img src={entry.logo} alt="" className="h-5 w-5" />
              </span>
              <span className="mt-[2px] h-[10px] w-[60%] rounded-full bg-panel" />
            </div>
            <div className="sms-preview">
              <span className="logo-tile !h-[36px] !w-[36px] !rounded-[10px] !bg-canvas">
                <img src={entry.logo} alt="" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1" dir="ltr">
                <div className="flex items-baseline justify-between gap-[10px]">
                  <span className="text-label font-semibold text-ink">{sms.sender}</span>
                  <span className="h-[8px] w-[8px] shrink-0 rounded-full bg-accent" />
                </div>
                <p className="mt-[3px] text-body text-ink-muted">
                  <SmsText message={sms.message} code={sms.code} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why a virtual number for this service */}
      <section className="pt-[22px]">
        <div className="card">
          <h2 className="max-w-2xl text-heading">{c.whyVirtual.title}</h2>
          <div className="mt-[22px] grid gap-[22px] md:grid-cols-2">
            {c.whyVirtual.body.map((p, i) => (
              <p key={i} className="text-body text-ink-muted">
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
            <div key={step.title} className="card flex flex-col">
              <span className="step-num" aria-label={`${t.step} ${i + 1}`}>
                {i + 1}
              </span>
              <h3 className="mt-[18px] text-subheading">{step.title}</h3>
              <p className="mt-[10px] text-label text-ink-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service-specific tips */}
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

      {/* Countries popular for this service */}
      {countries.length > 0 && (
        <section className="pt-[94px]">
          <span className="section-label">{t.countriesLabel}</span>
          <div className="mt-[6px] flex flex-wrap gap-[10px]">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={localePath(
                  locale,
                  `/virtual-numbers/country/${country.slug}`,
                )}
                className="chip"
              >
                <span className="text-[16px] leading-none">{country.flag}</span>
                {country.copy.name}
                <span className="chip__meta" dir="ltr">{country.dialingCode}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related services */}
      <RelatedServices locale={locale} slugs={entry.relatedSlugs} />

      <PaintedCta
        locale={locale}
        title={t.ctaTitle}
        supportLabel={t.ctaSupport}
        placement="service_cta"
      />
    </div>
  );
}
