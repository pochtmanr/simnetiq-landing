import Link from "next/link";
import { localePath } from "../../lib/i18n";
import { SupportForm } from "../SupportForm";
import { SUPPORT_PAGE } from "../../lib/content/support";
import { SUPPORT_EMAIL } from "../../lib/site";
import type { Locale } from "../../lib/i18n";

export function SupportPageContent({ locale }: { locale: Locale }) {
  const t = SUPPORT_PAGE[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <section className="pb-[50px] pt-[69px]">
        <span className="section-label">{t.label}</span>
        <h1 className="text-heading">{t.title}</h1>
        <p className="mt-[15px] max-w-xl text-body text-ink-muted">
          {t.introBefore}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link">
            {SUPPORT_EMAIL}
          </a>
          {t.introAfter}
        </p>
      </section>

      <section className="grid items-start gap-[22px] pb-[34px] md:grid-cols-3">
        <div className="relative md:order-last md:col-span-2">
          <SupportForm locale={locale} />
        </div>
        <div className="flex flex-col gap-[22px] md:order-first">
          {t.items.map((item, index) => (
            <div key={item.title} className="card !p-[34px]">
              <h2 className="font-sans text-subheading font-medium">{item.title}</h2>
              <p className="mt-[10px] text-label text-ink-muted">{item.body}</p>
              <Link className="blue-link mt-[14px] inline-block text-label" href={localePath(locale, `/support/${["activation-issues", "billing-coins-refunds", "account-balance"][index]}`)}>{locale === "ru" ? "Читать инструкцию →" : "Read the guide →"}</Link>
            </div>
          ))}
        </div>
      </section>
      <nav aria-label={locale === "ru" ? "База знаний" : "Knowledge base"} className="card">
        <h2 className="text-subheading font-medium">{locale === "ru" ? "Выбор страны и безопасность" : "Choosing a country and staying safe"}</h2>
        <Link className="blue-link mt-[14px] inline-block" href={localePath(locale, "/support/choosing-country")}>{locale === "ru" ? "Как выбрать страну и защитить аккаунт →" : "How to choose a country and protect your account →"}</Link>
      </nav>
    </div>
  );
}
