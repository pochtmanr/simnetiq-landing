import Link from "next/link";
import { getHelpArticles } from "../../lib/content/help";
import type { HelpArticle } from "../../lib/content/help/types";
import { supportUi } from "../../lib/content/ui";
import { formatDate, localePath, type Locale } from "../../lib/i18n";
import { Arrow } from "../Arrow";
import { LegalShell, LegalSection } from "../Legal";

const APPLE_LINKS = [
  { key: "refund", href: "https://reportaproblem.apple.com/" },
  { key: "instructions", href: "https://support.apple.com/118223" },
  { key: "status", href: "https://support.apple.com/118224" },
  { key: "terms", href: "https://www.apple.com/legal/internet-services/itunes/" },
  { key: "support", href: "https://getsupport.apple.com/" },
] as const;

export function HelpArticlePage({ article, locale }: { article: HelpArticle; locale: Locale }) {
  const t = supportUi(locale).help;
  const c = article.copy;
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
        <LegalSection key={section.title} title={section.title}>
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </LegalSection>
      ))}
      {article.slug === "billing-coins-refunds" && (
        <LegalSection title={t.appleTitle}>
          {APPLE_LINKS.map(({ key, href }) => (
            <a key={key} className="blue-link" href={href}>
              {t.appleLinks[key]}
            </a>
          ))}
        </LegalSection>
      )}
      {article.slug === "billing-coins-refunds" && (
        <p className="text-sm text-ink/70">{t.appleNote}</p>
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
