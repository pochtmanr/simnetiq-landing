import type { Locale } from "../i18n";

/* Shared chrome for /alternatives/* comparison pages. */

export const ALTERNATIVES_UI = {
  en: {
    breadcrumbHome: "Home",
    breadcrumb: "Alternatives",
    heroLabel: "Comparison",
    comparisonUsColumn: "SMS Activate",
    switchLabel: "Switching",
    faqLabel: "Questions",
    ctaTitle: "Try it on your next activation",
    ctaSupport: "Questions? Talk to support",
    disclaimer:
      "Competitor details reflect their public materials at the time of writing and can change — always check their site for current terms. All trademarks belong to their owners.",
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumb: "Альтернативы",
    heroLabel: "Сравнение",
    comparisonUsColumn: "SMS Activate",
    switchLabel: "Переход",
    faqLabel: "Вопросы",
    ctaTitle: "Попробуйте на следующей активации",
    ctaSupport: "Есть вопросы? Напишите в поддержку",
    disclaimer:
      "Данные о конкурентах отражают их публичные материалы на момент написания и могут меняться — актуальные условия проверяйте на их сайте. Все товарные знаки принадлежат их владельцам.",
  },
} satisfies Record<Locale, unknown>;
