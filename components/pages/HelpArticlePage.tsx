import Image from "next/image";
import Link from "next/link";
import { getHelpArticles } from "../../lib/content/help";
import type { HelpArticle } from "../../lib/content/help/types";
import { supportUi } from "../../lib/content/ui";
import { formatDate, localePath, type Locale } from "../../lib/i18n";
import { getDeliveryTiers } from "../../lib/support/deliveryTiers";
import { Arrow } from "../Arrow";
import { DeliveryTiers } from "../DeliveryTiers";
import { LegalShell, LegalSection, RichText } from "../Legal";

const APPLE_LINKS = [
  { key: "refund", href: "https://reportaproblem.apple.com/" },
  { key: "instructions", href: "https://support.apple.com/118223" },
  { key: "status", href: "https://support.apple.com/118224" },
  { key: "terms", href: "https://www.apple.com/legal/internet-services/itunes/" },
  { key: "support", href: "https://getsupport.apple.com/" },
] as const;

export async function HelpArticlePage({ article, locale }: { article: HelpArticle; locale: Locale }) {
  const t = supportUi(locale).help;
  const c = article.copy;
  const tiers = article.deliveryTiers ? await getDeliveryTiers() : [];
  return (
    <LegalShell
      label={t.label}
      title={c.title}
      updated={formatDate(article.updatedAt, locale)}
      updatedLabel={t.updatedLabel}
    >
      <nav className="mb-[30px]">
        <Link className="blue-link" href={localePath(locale, "/support")}>
          <Arrow back /> {t.back}
        </Link>
      </nav>
      {c.sections.map((section) => (
        <LegalSection key={section.title} id={section.id} title={section.title}>
            {section.paragraphs?.map((p) => (
              <p key={p}>
                <RichText text={p} locale={locale} />
              </p>
            ))}
            {section.steps && (
              <ol className="flex flex-col gap-[8px] ps-[22px] [&>li]:list-decimal [&>li]:ps-[4px]">
                {section.steps.map((s) => (
                  <li key={s}>
                    <RichText text={s} locale={locale} />
                  </li>
                ))}
              </ol>
            )}
            {section.image && (
              <Image
                src={section.image.src}
                alt={section.image.alt}
                width={section.image.width}
                height={section.image.height}
                className="mt-[6px] h-auto w-full rounded-[14px] border border-border"
                sizes="(max-width: 820px) 100vw, 760px"
              />
            )}
            {section.cta && (
              <div className="mt-[6px]">
                <a className="cta" href={section.cta.href} target="_blank" rel="noopener noreferrer">
                  {section.cta.label} <Arrow />
                </a>
              </div>
            )}
        </LegalSection>
      ))}
      {article.deliveryTiers && tiers.length > 0 && (
        <LegalSection id="delivery" title={t.tiers.title}>
          <p>{t.tiers.intro}</p>
          <DeliveryTiers rows={tiers} labels={t.tiers} locale={locale} />
        </LegalSection>
      )}
      {article.appleLinks && (
        <LegalSection title={t.appleTitle}>
          {APPLE_LINKS.map(({ key, href }) => (
            <a key={key} className="blue-link" href={href}>
              {t.appleLinks[key]}
            </a>
          ))}
          <p className="text-sm text-ink/70">{t.appleNote}</p>
        </LegalSection>
      )}
      {article.topic && (
        <div className="my-[30px] rounded-[14px] bg-panel p-[24px]">
          <h2 className="font-sans text-subheading font-medium">{t.stillNeedTitle}</h2>
          <p className="mt-[8px] text-label text-ink-muted">{t.stillNeedBody}</p>
          <Link
            className="blue-link mt-[12px] inline-block text-label"
            href={`${localePath(locale, "/support")}?topic=${article.topic}&anyway=1#contact`}
          >
            {t.submitAnyway} <Arrow />
          </Link>
        </div>
      )}
      <LegalSection title={t.related}>
        {getHelpArticles(locale)
          .filter((a) => a.slug !== article.slug)
          .map((a) => (
            <Link key={a.slug} className="blue-link" href={localePath(locale, `/support/${a.slug}`)}>
              {a.copy.title}
            </Link>
          ))}
        <Link className="blue-link" href={localePath(locale, "/terms-of-service")}>
          {t.terms}
        </Link>
        <Link className="blue-link" href={localePath(locale, "/privacy-policy")}>
          {t.privacy}
        </Link>
      </LegalSection>
    </LegalShell>
  );
}
