import type { Locale } from "../i18n";

/* Support page + form copy. Russian translated by hand. */

export const SUPPORT_PAGE = {
  en: {
    label: "Support",
    title: "How can we help?",
    introBefore: "Send us a message below or email ",
    introAfter: " — we usually reply within one business day.",
    items: [
      {
        title: "Activation issues",
        body: "Code didn't arrive? Cancel the pending number in the app and take another — then tell us the service, country and time so we can check what happened.",
      },
      {
        title: "Billing & credits",
        body: "Purchases go through the App Store or Google Play. Include your store receipt or order ID and we'll trace any missing credits.",
      },
      {
        title: "Restore purchases",
        body: "Credits are tied to your store account. Reinstalled the app? Use 'Restore purchases' in settings — and write in if the balance still looks wrong.",
      },
    ],
  },
  ru: {
    label: "Поддержка",
    title: "Чем помочь?",
    introBefore: "Напишите нам через форму ниже или на ",
    introAfter: " — обычно отвечаем в течение одного рабочего дня.",
    items: [
      {
        title: "Проблемы с активацией",
        body: "Код не пришёл? Отмените ожидающий номер в приложении и возьмите другой, а нам напишите сервис, страну и время — мы проверим, что случилось.",
      },
      {
        title: "Оплата и кредиты",
        body: "Покупки проходят через App Store или Google Play. Приложите чек или номер заказа — мы отследим недостающие кредиты.",
      },
      {
        title: "Восстановление покупок",
        body: "Кредиты привязаны к аккаунту магазина. Переустановили приложение? Нажмите «Восстановить покупки» в настройках — и напишите нам, если баланс всё ещё неверный.",
      },
    ],
  },
} satisfies Record<Locale, unknown>;

export const SUPPORT_FORM = {
  en: {
    name: "Your name",
    namePlaceholder: "Alex",
    email: "Email",
    emailPlaceholder: "you@example.com",
    topic: "Topic",
    topicPlaceholder: "Choose a topic",
    topics: [
      "Activation didn't arrive",
      "Billing & credits",
      "Account & restore purchases",
      "Bug report",
      "Feature request",
      "Something else",
    ],
    message: "Message",
    messagePlaceholder:
      "Tell us what happened — the service, country and rough time of the activation help us find it fast.",
    honeypot: "Leave this field empty",
    send: "Send message",
    sending: "Sending…",
    genericError: "Something went wrong. Please try again.",
    sentChip: "Sent",
    sentTitle: "Message received",
    sentBody:
      "Thanks for reaching out — a confirmation is on its way to your inbox, and we usually reply within one business day.",
    sendAnother: "Send another message",
  },
  ru: {
    name: "Ваше имя",
    namePlaceholder: "Алекс",
    email: "Email",
    emailPlaceholder: "you@example.com",
    topic: "Тема",
    topicPlaceholder: "Выберите тему",
    topics: [
      "Активация не пришла",
      "Оплата и кредиты",
      "Аккаунт и восстановление покупок",
      "Сообщение об ошибке",
      "Предложение функции",
      "Другое",
    ],
    message: "Сообщение",
    messagePlaceholder:
      "Расскажите, что произошло — сервис, страна и примерное время активации помогут нам быстро найти проблему.",
    honeypot: "Оставьте это поле пустым",
    send: "Отправить",
    sending: "Отправляем…",
    genericError: "Что-то пошло не так. Попробуйте ещё раз.",
    sentChip: "Отправлено",
    sentTitle: "Сообщение получено",
    sentBody:
      "Спасибо за обращение — подтверждение уже летит на вашу почту, обычно мы отвечаем в течение одного рабочего дня.",
    sendAnother: "Отправить ещё одно сообщение",
  },
} satisfies Record<Locale, unknown>;
