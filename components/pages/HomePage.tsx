import Image from "next/image";
import Link from "next/link";
import { AppShot } from "../AppShot";
import { StoreBadges } from "../StoreBadges";
import { localePath, type Locale } from "../../lib/i18n";
import { HOME, SERVICES } from "../../lib/content/home";
import { ALL_SERVICES } from "../../lib/content/services";
import { ALL_ALTERNATIVES } from "../../lib/content/alternatives";
import { BLOG_POSTS } from "../../lib/content/blog";

function SectionHeading({
  label,
  title,
  id,
  onInk = false,
}: {
  label: string;
  title: string;
  id?: string;
  onInk?: boolean;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <span className={`section-label ${onInk ? "!text-accent" : ""}`}>
        {label}
      </span>
      <h2 className="text-heading">{title}</h2>
    </div>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = HOME[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      {/* Hero — the reference system's two-column split: tinted copy panel on
          the left, heavier tint on the right holding the product. The device
          bleeds off the panel's bottom edge rather than sitting inside it. */}
      <section className="grid items-stretch gap-[22px] pb-[94px] pt-[40px] md:min-h-[min(82vh,780px)] md:grid-cols-2 md:pt-[56px]">
        <div className="panel hero-rise flex flex-col justify-center">
          <span className="section-label">{t.hero.label}</span>
          <h1 className="text-heading-lg">
            {t.hero.titleTop}
            <br />
            <span className="text-accent-deep">{t.hero.titleAccent}</span>
          </h1>
          <p className="mt-[21px] max-w-md text-subheading text-ink-muted">
            {t.hero.body}
          </p>
          <div className="mt-[28px]">
            <StoreBadges locale={locale} />
          </div>
          <p className="mt-[14px] text-caption text-ink-muted">{t.hero.note}</p>
        </div>
        <div className="panel panel--strong hero-rise flex items-center justify-center [animation-delay:0.12s]">
          <Image
            src="/app/hero-services.png"
            alt=""
            width={670}
            height={1100}
            priority
            className="h-auto w-full max-w-[400px]"
          />
        </div>
      </section>

      {/* Services */}
      <section className="scroll-mt-24" id="services">
        <span className="section-label text-center">{t.services.label}</span>
        <h2 className="text-center text-heading">{t.services.title}</h2>
        <div className="mx-[calc(50%-50vw)] mt-[28px] overflow-hidden" aria-hidden>
          <div className="marquee-track flex items-center gap-[36px] px-4">
            {[...SERVICES, ...SERVICES].map((slug, i) => (
              <img
                key={`${slug}-${i}`}
                src={`/services/${slug}.svg`}
                alt=""
                loading="lazy"
                className="h-[52px] w-[52px] shrink-0"
              />
            ))}
          </div>
        </div>
        <p className="mt-[14px] text-center text-caption text-muted">
          {t.services.caption}
        </p>
      </section>

      {/* Stats strip */}
      <section className="pt-[94px]" id="stats">
        <div className="panel panel--strong grid gap-[28px] sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.items.map((s) => (
            <div key={s.label}>
              <span className="font-display text-[52px] font-light leading-none tracking-[-0.03em] text-accent-deep">
                {s.value}
              </span>
              <p className="mt-[11px] text-label text-ink">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pt-[94px]" id="how-it-works">
        <SectionHeading label={t.how.label} title={t.how.title} />
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {t.how.steps.map((step, i) => (
            <div key={step.title} className="card">
              <span className="section-label">
                {t.how.step} {i + 1}
              </span>
              <h3 className="text-subheading">{step.title}</h3>
              <p className="mt-[11px] text-body text-ink-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pt-[94px]" id="features">
        <div className="panel">
          <SectionHeading label={t.features.label} title={t.features.title} />
          <p className="mt-[14px] max-w-xl text-body text-ink-muted">
            {t.features.sub}
          </p>
          <div className="mt-[34px] grid gap-x-[34px] gap-y-[28px] sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((f) => (
              <div key={f.title} className="border-t border-white/70 pt-[21px]">
                <h3 className="text-body text-ink">{f.title}</h3>
                <p className="mt-[11px] text-label text-ink-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by service — the site's internal-linking hub section.
          Full-bleed ink band via mx-[calc(50%-50vw)] + w-screen; body has
          overflow-x: clip so no horizontal scroll appears. */}
      <section className="pt-[94px]" id="browse">
        <div className="panel--ink mx-[calc(50%-50vw)] w-screen py-[clamp(42px,5vw,70px)]">
          <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
            <SectionHeading label={t.browse.label} title={t.browse.title} onInk />
            <p className="mt-[14px] max-w-xl text-body text-white/70">
              {t.browse.body}
            </p>
            <div className="mt-[34px] flex flex-wrap gap-[11px]">
              {ALL_SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={localePath(locale, `/virtual-numbers/${s.slug}`)}
                  className="inline-flex items-center gap-[8px] rounded-pill bg-white px-[14px] py-[9px] text-label text-ink transition-colors hover:bg-panel-strong"
                >
                  <img src={s.logo} alt="" className="h-5 w-5" />
                  {s.name}
                </Link>
              ))}
              <Link
                href={localePath(locale, "/virtual-numbers")}
                className="inline-flex items-center rounded-pill border border-white/40 px-[16px] py-[9px] text-label text-white transition-colors hover:border-white hover:bg-white/10"
              >
                {t.browse.allLink} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — coins, and the honest version of how they're spent. */}
      <section className="pt-[94px]" id="pricing">
        <SectionHeading label={t.pricing.label} title={t.pricing.title} />
        <p className="mt-[14px] max-w-2xl text-body text-ink-muted">
          {t.pricing.sub}
        </p>
        <div className="mt-[28px] flex flex-wrap items-center gap-[11px]">
          <span className="text-label text-muted">{t.pricing.packsLabel}</span>
          {t.pricing.packs.map((pack) => (
            <span key={pack} className="tag-chip !px-[16px] !py-[7px] !text-[14px]">
              {pack} {t.pricing.coinsUnit}
            </span>
          ))}
        </div>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {t.pricing.facts.map((fact) => (
            <div key={fact.title} className="card">
              <h3 className="text-subheading">{fact.title}</h3>
              <p className="mt-[11px] text-label text-ink-muted">{fact.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-[21px] text-caption text-muted">{t.pricing.note}</p>
      </section>

      {/* Inside the app — the reference system's product panel, recoloured to
          ink so the app's dark-mode screens read against it. */}
      <section className="pt-[94px]" id="inside">
        <div className="panel--ink mx-[calc(50%-50vw)] w-screen py-[clamp(42px,5vw,70px)]">
          <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
            <SectionHeading
              label={t.showcase.label}
              title={t.showcase.title}
              onInk
            />
            <p className="mt-[14px] max-w-xl text-body text-white/70">
              {t.showcase.body}
            </p>
            <div className="mt-[34px] grid grid-cols-2 gap-[22px] lg:grid-cols-4">
              {t.showcase.shots.map((shot) => (
                <AppShot key={shot.src} src={shot.src} caption={shot.caption} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use cases / personas */}
      <section className="pt-[94px]" id="use-cases">
        <SectionHeading label={t.personas.label} title={t.personas.title} />
        <div className="mt-[34px] grid gap-[22px] sm:grid-cols-2 lg:grid-cols-5">
          {t.personas.items.map((p) => (
            <div key={p.title} className="flex flex-col border-t border-border pt-[21px]">
              <h3 className="text-body text-ink">{p.title}</h3>
              <p className="mt-[11px] flex-1 text-label text-ink-muted">
                {p.body}
              </p>
              <Link
                href={localePath(locale, `/virtual-numbers/${p.slug}`)}
                className="blue-link mt-[14px] text-label"
              >
                {p.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Compare — internal crawl path to the /alternatives pages */}
      <section className="pt-[94px]" id="compare">
        <div className="panel">
          <SectionHeading label={t.compare.label} title={t.compare.title} />
          <p className="mt-[14px] max-w-xl text-body text-ink-muted">
            {t.compare.body}
          </p>
          <div className="mt-[34px] flex flex-wrap gap-[11px]">
            {ALL_ALTERNATIVES.map((a) => (
              <Link
                key={a.slug}
                href={localePath(locale, `/alternatives/${a.slug}`)}
                className="rounded-pill bg-card px-[18px] py-[9px] text-label text-ink transition-colors hover:text-accent-deep"
              >
                {t.compare.vsLabel} {a.competitorName} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — the reference system's serif question / sans answer pairing,
          kept as <details> so the accordion behaviour survives. */}
      <section className="pt-[94px]" id="faq">
        <SectionHeading label={t.faq.label} title={t.faq.title} />
        <div className="mt-[34px]">
          {t.faq.items.map((item, i) => (
            <details
              key={item.q}
              className={`group py-[21px] ${i > 0 ? "border-t border-border" : ""}`}
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

      {/* From the blog */}
      <section className="pt-[94px]" id="blog">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading label={t.blog.label} title={t.blog.title} />
          <Link
            href={localePath(locale, "/blog")}
            className="blue-link mb-[6px] hidden shrink-0 text-label sm:block"
          >
            {t.blog.allLink} →
          </Link>
        </div>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {BLOG_POSTS.slice(0, 3).map((post) => {
            const c = post[locale];
            return (
              <Link
                key={post.slug}
                href={localePath(locale, `/blog/${post.slug}`)}
                className="card group flex flex-col transition-colors hover:bg-panel"
              >
                <div className="flex flex-wrap gap-[8px]">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-[21px] text-subheading">{c.title}</h3>
                <p className="mt-[11px] flex-1 text-label text-ink-muted">
                  {c.excerpt}
                </p>
                <span className="blue-link mt-[21px] text-label">
                  {t.blog.readMore} →
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href={localePath(locale, "/blog")}
          className="blue-link mt-[21px] inline-block text-label sm:hidden"
        >
          {t.blog.allLink} →
        </Link>
      </section>

      {/* Final CTA — full-bleed heavy tint. The -mb pulls it flush to the
          footer so no canvas stripe shows in the footer's mt-[94px] gap. */}
      <section className="-mb-[94px] pt-[94px]">
        <div className="mx-[calc(50%-50vw)] w-screen bg-panel-strong py-[clamp(42px,5vw,70px)]">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[28px] px-[clamp(20px,4vw,34px)] text-center">
            <h2 className="max-w-2xl text-heading">{t.cta.title}</h2>
            <StoreBadges locale={locale} placement="final_cta" />
            <Link href={localePath(locale, "/support")} className="blue-link text-label">
              {t.cta.support}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
