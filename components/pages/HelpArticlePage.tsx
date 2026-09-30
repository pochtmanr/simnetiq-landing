import Link from "next/link";
import { HELP_ARTICLES } from "../../lib/content/help";
import { localePath, type Locale } from "../../lib/i18n";
import { LegalShell, LegalSection } from "../Legal";

export function HelpArticlePage({ article, locale }: { article: (typeof HELP_ARTICLES)[number]; locale: Locale }) {
  const t = article[locale];
  return <LegalShell label={locale === "ru" ? "База знаний" : "Knowledge base"} title={t.title} updated={locale === "ru" ? "30 сентября 2026" : "30 September 2026"} updatedLabel={locale === "ru" ? "Обновлено:" : "Last updated:"}>
    <nav className="mb-[30px]"><Link className="blue-link" href={localePath(locale, "/support")}>{locale === "ru" ? "← Поддержка и форма обращения" : "← Support and contact form"}</Link></nav>
    {t.sections.map(section => <LegalSection key={section.title} title={section.title}>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</LegalSection>)}
    {article.slug === "billing-coins-refunds" && <LegalSection title={locale === "ru" ? "Официальные ссылки Apple" : "Official Apple guidance"}>
      <a className="blue-link" href="https://reportaproblem.apple.com/">{locale === "ru" ? "Запросить возврат" : "Request a refund"}</a>
      <a className="blue-link" href="https://support.apple.com/118223">{locale === "ru" ? "Инструкция Apple" : "Apple refund instructions"}</a>
      <a className="blue-link" href="https://support.apple.com/118224">{locale === "ru" ? "Статус и сроки возврата" : "Refund status and payment timeframes"}</a>
      <a className="blue-link" href="https://www.apple.com/legal/internet-services/itunes/">{locale === "ru" ? "Региональные условия Apple" : "Apple regional terms"}</a>
      <a className="blue-link" href="https://getsupport.apple.com/">Apple Support</a>
    </LegalSection>}
    {article.slug === "billing-coins-refunds" && <p className="text-sm text-ink/70">{locale === "ru" ? "Инструкция сверена с официальными материалами Apple 30 сентября 2026. Доступность возврата зависит от страны и применимого закона." : "Guidance checked against Apple's official support materials on 30 September 2026. Refund eligibility depends on your region and applicable law."}</p>}
    <LegalSection title={locale === "ru" ? "Связанные материалы" : "Related help"}>
      {HELP_ARTICLES.filter(a => a.slug !== article.slug).map(a => <Link key={a.slug} className="blue-link" href={localePath(locale, `/support/${a.slug}`)}>{a[locale].title}</Link>)}
      <Link className="blue-link" href={localePath(locale, "/terms-of-service")}>{locale === "ru" ? "Условия использования" : "Terms of Service"}</Link>
      <Link className="blue-link" href={localePath(locale, "/privacy-policy")}>{locale === "ru" ? "Политика конфиденциальности" : "Privacy Policy"}</Link>
    </LegalSection>
  </LegalShell>;
}
