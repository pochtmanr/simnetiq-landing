import Link from "next/link";
import { localePath, type Locale } from "../../lib/i18n";
import { SupportForm } from "../SupportForm";
import { Arrow } from "../Arrow";
import { supportUi } from "../../lib/content/ui";
import { getHelpArticle } from "../../lib/content/help";
import { SUPPORT_EMAIL } from "../../lib/site";

export function SupportPageContent({ locale }: { locale: Locale }) {
  const { page: t, form } = supportUi(locale);
  const safety = getHelpArticle(locale, "choosing-country");
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
          <SupportForm locale={locale} t={form} />
        </div>
        <div className="flex flex-col gap-[22px] md:order-first">
          {t.items.map((item) => (
            <div key={item.title} className="card !p-[34px]">
              <h2 className="font-sans text-subheading font-medium">{item.title}</h2>
              <p className="mt-[10px] text-label text-ink-muted">{item.body}</p>
              {getHelpArticle(locale, item.slug) && (
                <Link
                  className="blue-link mt-[14px] inline-block text-label"
                  href={localePath(locale, `/support/${item.slug}`)}
                >
                  {t.readGuide} <Arrow />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
      {safety && (
        <nav aria-label={t.knowledgeBase} className="card">
          <h2 className="text-subheading font-medium">{t.safetyTitle}</h2>
          <Link
            className="blue-link mt-[14px] inline-block"
            href={localePath(locale, "/support/choosing-country")}
          >
            {t.safetyLink} <Arrow />
          </Link>
        </nav>
      )}
    </div>
  );
}
