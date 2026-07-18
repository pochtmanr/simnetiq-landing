import type { Locale } from "../i18n";

/* Chrome for the /alternatives hub. Kept separate from ALTERNATIVES_UI below,
   which the [competitor] pages consume — the two have no keys in common. */

export const ALTERNATIVES_HUB_UI = {
  en: {
    metaTitle: "SMS Verification Alternatives — Honest Side-by-Side Comparisons",
    metaDescription:
      "How the SMS Activate app by SIMNETIQ compares with 5SIM, SMS-Activate.org, OnlineSim, SMS-Man and TextVerified — each written to say plainly when the other service suits you better.",
    label: "Alternatives",
    title: "How we compare — including where we lose",
    sub: "Hand-written comparisons against the services people weigh us against. Every one of them names the cases where the other platform is the better choice.",
    readMore: "Read the comparison",
  },
  ru: {
    metaTitle: "Альтернативы сервисам SMS-верификации — честные сравнения",
    metaDescription:
      "Как приложение SMS Activate от SIMNETIQ выглядит рядом с 5SIM, SMS-Activate.org, OnlineSim, SMS-Man и TextVerified — в каждом сравнении прямо сказано, когда другой сервис подойдёт вам больше.",
    label: "Альтернативы",
    title: "Как мы выглядим на фоне других — включая то, где проигрываем",
    sub: "Сравнения, написанные вручную, с теми сервисами, с которыми нас сопоставляют. В каждом названы случаи, когда другая платформа окажется для вас удачнее.",
    readMore: "Читать сравнение",
  },
} satisfies Record<Locale, unknown>;

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
