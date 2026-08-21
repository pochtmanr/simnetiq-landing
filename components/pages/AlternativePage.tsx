import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { StoreBadges } from "../StoreBadges";
import type { AlternativeEntry } from "../../lib/content/alternatives/types";
import { ALTERNATIVES_UI } from "../../lib/content/alternativesUi";
import { localePath, type Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/** Template for /alternatives/[competitor] — fair, factual comparison. */
export function AlternativePage({
  locale,
  entry,
}: {
  locale: Locale;
  entry: AlternativeEntry;
}) {
  const t = ALTERNATIVES_UI[locale];
  const c = entry[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <JsonLd data={faqPage(c.faqs)} />
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumb, path: `/alternatives/${entry.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative pb-[70px] pt-[10px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[180px] bottom-0 left-[calc(50%-50vw)] -z-10 w-screen"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 72% 32%, rgba(89, 161, 252, 0.08), transparent 68%)",
          }}
        />
        <span className="section-label">
          {t.heroLabel} · {entry.competitorName}
        </span>
        <h1 className="max-w-3xl text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
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
      </section>

      {/* Honest positioning */}
      <section className="grid gap-[22px] md:grid-cols-2">
        <div className="card">
          <h2 className="font-sans text-subheading font-medium">{c.whenThem.title}</h2>
          <p className="mt-[10px] text-body text-ink-muted">
            {c.whenThem.body}
          </p>
        </div>
        <div className="card !border-accent">
          <h2 className="font-sans text-subheading font-medium">{c.whenUs.title}</h2>
          <p className="mt-[10px] text-body text-ink-muted">{c.whenUs.body}</p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pt-[94px]">
        <h2 className="text-heading">{c.comparison.title}</h2>
        <div className="mt-[34px] overflow-x-auto rounded-card border border-border bg-card">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-[clamp(22px,4vw,34px)] py-[18px] text-label font-normal text-muted" />
                <th className="px-[22px] py-[18px] text-label font-normal text-muted">
                  {entry.competitorName}
                </th>
                <th className="px-[22px] py-[18px] text-label font-normal text-accent-deep">
                  {t.comparisonUsColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.comparison.rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={
                    i > 0 ? "border-t border-border" : ""
                  }
                >
                  <td className="px-[clamp(22px,4vw,34px)] py-[18px] text-label text-ink">
                    {row.label}
                  </td>
                  <td className="px-[22px] py-[18px] text-label text-ink-muted">
                    {row.competitor}
                  </td>
                  <td className="px-[22px] py-[18px] text-label text-ink-muted">
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {c.comparison.note && (
          <p className="mt-[15px] text-caption text-muted">
            {c.comparison.note}
          </p>
        )}
      </section>

      {/* Switching steps */}
      <section className="pt-[94px]">
        <span className="section-label">{t.switchLabel}</span>
        <h2 className="text-heading">{c.switchSteps.title}</h2>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {c.switchSteps.steps.map((step) => (
            <div key={step.title} className="card">
              <h3 className="text-subheading">{step.title}</h3>
              <p className="mt-[10px] text-label text-ink-muted">
                {step.body}
              </p>
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
        <p className="mx-auto mt-[22px] max-w-2xl text-center text-caption text-muted">
          {t.disclaimer}
        </p>
      </section>
    </div>
  );
}
