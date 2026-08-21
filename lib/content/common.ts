import type { Locale } from "../i18n";

/* Shared chrome: nav, footer, store badges, phone mock, 404. */

/* Endonyms — shown the same in every locale. */
export const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export const NAV = {
  en: {
    langLabel: "Language",
    links: [
      { path: "/#how-it-works", label: "How it works" },
      { path: "/virtual-numbers", label: "Numbers" },
      { path: "/#pricing", label: "Pricing" },
      { path: "/#faq", label: "FAQ" },
      { path: "/support", label: "Support" },
    ],
    cta: "Get the app",
    home: "SMS Code home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  ru: {
    langLabel: "Язык",
    links: [
      { path: "/#how-it-works", label: "Как это работает" },
      { path: "/virtual-numbers", label: "Номера" },
      { path: "/#pricing", label: "Цены" },
      { path: "/#faq", label: "Вопросы" },
      { path: "/support", label: "Поддержка" },
    ],
    cta: "Скачать",
    home: "SMS Code — на главную",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
  },
} satisfies Record<Locale, unknown>;

export const FOOTER = {
  en: {
    tagline: "A phone number for the sign-up. Not for life.",
    servicesLabel: "Popular services",
    allServices: "All services",
    resourcesLabel: "Resources",
    hub: "Virtual numbers",
    blog: "Blog",
    companyLabel: "Company",
    getApp: "Get the app",
    followLabel: "Follow",
    support: "Support",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    rights: "All rights reserved.",
  },
  ru: {
    tagline: "Номер для регистрации. А не на всю жизнь.",
    servicesLabel: "Популярные сервисы",
    allServices: "Все сервисы",
    resourcesLabel: "Материалы",
    hub: "Виртуальные номера",
    blog: "Блог",
    companyLabel: "Компания",
    getApp: "Скачать приложение",
    followLabel: "Мы в соцсетях",
    support: "Поддержка",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
    rights: "Все права защищены.",
  },
} satisfies Record<Locale, unknown>;

export const BADGES = {
  en: {
    appStore: "Download on the App Store",
  },
  ru: {
    appStore: "Загрузить в App Store",
  },
} satisfies Record<Locale, unknown>;

export const PHONE_MOCK = {
  en: {
    codeLine: (service: string) => `Your ${service} code is`,
    today: "Today",
    copy: (code: string) => `Copy “${code}”`,
    inputPlaceholder: "Text Message · SMS",
  },
  ru: {
    codeLine: (service: string) => `Ваш код ${service}:`,
    today: "Сегодня",
    copy: (code: string) => `Скопировать «${code}»`,
    inputPlaceholder: "Сообщение · SMS",
  },
} satisfies Record<Locale, unknown>;

export const NOT_FOUND = {
  en: {
    title: "This page doesn’t exist",
    body: "The address may have changed. Everything about SMS Code lives on the home page.",
    back: "Back to home",
  },
  ru: {
    title: "Такой страницы нет",
    body: "Возможно, адрес изменился. Всё об SMS Code — на главной странице.",
    back: "На главную",
  },
} satisfies Record<Locale, unknown>;
