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
        <p className="mt-[15px] max-w-xl text-body text-steel-gray">
          {t.introBefore}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link">
            {SUPPORT_EMAIL}
          </a>
          {t.introAfter}
        </p>
      </section>

      <section className="grid items-start gap-[22px] pb-[34px] md:grid-cols-3">
        <div className="flex flex-col gap-[22px]">
          {t.items.map((item) => (
            <div key={item.title} className="card !p-[34px]">
              <h2 className="text-subheading">{item.title}</h2>
              <p className="mt-[10px] text-label text-steel-gray">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="relative md:col-span-2">
          <SupportForm locale={locale} />
        </div>
      </section>
    </div>
  );
}
