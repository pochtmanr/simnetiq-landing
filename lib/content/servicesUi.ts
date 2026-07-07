import type { Locale } from "../i18n";
import type { ServiceCategory } from "./services/types";

/* Shared chrome for the /virtual-numbers hub and per-service pages.
   Per-service copy lives in lib/content/services/<slug>.ts. */

export const SERVICES_UI = {
  en: {
    breadcrumbHome: "Home",
    breadcrumbHub: "Virtual numbers",
    heroLabel: "Virtual numbers",
    step: "Step",
    tipsLabel: "Good to know",
    tipsTitle: "Before you verify",
    faqLabel: "Questions",
    countriesLabel: "Popular countries for this service",
    relatedLabel: "Related services",
    relatedTitle: "People also verify",
    ctaTitle: "Get a number and the code in under a minute",
    ctaSupport: "Questions? Talk to support",
    hub: {
      metaTitle: "Virtual Numbers for SMS Verification — All Services",
      metaDescription:
        "Rent a real virtual number for Telegram, WhatsApp, Google, Instagram and more. Receive SMS verification codes in seconds — no SIM, no subscription.",
      label: "Coverage",
      title: "One number away from any sign-up",
      sub: "Pick the service you're signing up for — each guide covers the real verification flow, the gotchas and the questions people actually ask.",
      allNote: "More services are added regularly — the app itself supports 35+ services in 50+ countries.",
    },
    categories: {
      messaging: "Messaging",
      social: "Social media",
      finance: "Finance",
      shopping: "Shopping",
      travel: "Travel & transport",
      entertainment: "Entertainment",
      dev: "Developer tools",
      other: "Accounts & platforms",
    } satisfies Record<ServiceCategory, string>,
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbHub: "Виртуальные номера",
    heroLabel: "Виртуальные номера",
    step: "Шаг",
    tipsLabel: "Полезно знать",
    tipsTitle: "Перед подтверждением",
    faqLabel: "Вопросы",
    countriesLabel: "Популярные страны для этого сервиса",
    relatedLabel: "Похожие сервисы",
    relatedTitle: "Часто подтверждают вместе",
    ctaTitle: "Номер и код — меньше чем за минуту",
    ctaSupport: "Есть вопросы? Напишите в поддержку",
    hub: {
      metaTitle: "Виртуальные номера для приёма SMS — все сервисы",
      metaDescription:
        "Арендуйте настоящий виртуальный номер для Telegram, WhatsApp, Google, Instagram и других сервисов. SMS-коды за секунды — без SIM-карты и подписки.",
      label: "Покрытие",
      title: "От любой регистрации вас отделяет один номер",
      sub: "Выберите сервис, в котором регистрируетесь: в каждом гиде — реальный процесс подтверждения, подводные камни и ответы на настоящие вопросы.",
      allNote: "Сервисы добавляются регулярно — само приложение поддерживает 35+ сервисов в 50+ странах.",
    },
    categories: {
      messaging: "Мессенджеры",
      social: "Соцсети",
      finance: "Финансы",
      shopping: "Покупки",
      travel: "Путешествия и транспорт",
      entertainment: "Развлечения",
      dev: "Инструменты разработчика",
      other: "Аккаунты и платформы",
    } satisfies Record<ServiceCategory, string>,
  },
} satisfies Record<Locale, unknown>;
