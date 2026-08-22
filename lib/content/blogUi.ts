import type { Locale } from "../i18n";

/* Shared chrome for /blog. */

export const BLOG_UI = {
  en: {
    breadcrumbHome: "Home",
    breadcrumb: "Blog",
    metaTitle: "Blog — Virtual Numbers, Privacy and SMS Verification",
    metaDescription:
      "Practical guides on virtual numbers, SMS verification and keeping your real phone number private — from the team behind SMS Code.",
    label: "Blog",
    title: "Guides for people who guard their number",
    sub: "Practical, honest write-ups: how verification actually works, service by service, and how to keep your personal number out of it.",
    published: "Published",
    updated: "Updated",
    ctaTitle: "Put it into practice on your next sign-up",
    ctaBody: "Get a number and see the code arrive usually within seconds.",
    readMore: "Read the guide",
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumb: "Блог",
    metaTitle: "Блог — виртуальные номера, приватность и SMS-верификация",
    metaDescription:
      "Практические гиды о виртуальных номерах, SMS-верификации и защите личного номера — от команды SMS Code.",
    label: "Блог",
    title: "Гиды для тех, кто бережёт свой номер",
    sub: "Практично и честно: как на самом деле устроена верификация в разных сервисах и как не отдавать им личный номер.",
    published: "Опубликовано",
    updated: "Обновлено",
    ctaTitle: "Примените на следующей регистрации",
    ctaBody: "Получите номер и увидите код через считанные секунды.",
    readMore: "Читать гид",
  },
} satisfies Record<Locale, unknown>;
