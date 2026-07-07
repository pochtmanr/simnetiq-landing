import type { ServiceEntry } from "./types";

export const instagram: ServiceEntry = {
  slug: "instagram",
  name: "Instagram",
  logo: "/services/instagram.svg",
  category: "social",
  relatedSlugs: ["facebook", "tiktok", "snapchat", "twitter", "tinder"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "france",
    "spain",
    "brazil",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Instagram",
    message: "391 504 is your Instagram code. Don't share it.",
    code: "391 504",
  },
  en: {
    metaTitle: "Virtual Number for Instagram — Verify Without Your SIM",
    metaDescription:
      "Get a real virtual number for Instagram verification in seconds. Pass the phone confirmation for a new, brand or second account without giving out your own number.",
    hero: {
      title: "A virtual number for Instagram",
      intro: [
        "Instagram lets you sign up with an email address — but the phone step rarely stays optional for long. A new device, an unfamiliar network or a few quick actions right after signup, and Instagram asks you to confirm a phone number before letting you continue. That number ends up tied to the account.",
        "With SMS Activate you rent a real number in one of 50+ countries, give it to Instagram, and the six-digit code lands in the app within seconds. Your personal number stays out of Meta's contact graph — and out of “people you may know” suggestions built on it.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Instagram?",
      body: [
        "A phone number on Instagram does more than verify you once: it links the account to your identity across Meta, and it can surface your profile to anyone who has your number saved in their contacts. If you're launching a brand page, a shop or a creator profile you'd rather keep separate from your personal life, a virtual number keeps that wall intact — the account verifies normally but doesn't point back to you.",
        "It's also the clean way to run several accounts. Instagram officially supports up to five in one app, but when its systems challenge one of them, each account may need its own contact point to confirm. A virtual number gives every project its own — without collecting SIM cards.",
      ],
    },
    howTo: {
      title: "How to verify Instagram with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Activate",
          body: "Open the SMS Activate app, choose Instagram as the service, pick a country and tap once. A real mobile number is reserved just for you — you pay per activation, no subscription.",
        },
        {
          title: "Enter it in Instagram",
          body: "Whether you're on the sign-up screen or facing a “confirm your phone number” prompt on an existing account, select the matching country code and type the number exactly as issued.",
        },
        {
          title: "Grab the code from SMS Activate",
          body: "Instagram sends a six-digit SMS — something like “391 504 is your Instagram code. Don't share it.” It appears in the SMS Activate app within seconds; type it in and the check clears.",
        },
        {
          title: "Move the account off the rented number",
          body: "Add an email address you control and turn on two-factor via an authenticator app: Settings → Accounts Center → Password and security. After that, logins and recovery never depend on the virtual number again.",
        },
      ],
    },
    tips: [
      {
        title: "Let a fresh account settle",
        body: "Instagram's checkpoint system watches for accounts that act fast right after creation — mass follows, rapid likes, instant DMs. That's exactly what triggers repeated “confirm your phone number” challenges. Fill in a profile photo and bio, post something, and behave like a person for the first days.",
      },
      {
        title: "Email signup doesn't mean no phone step",
        body: "Even accounts registered with an email get asked for a phone number whenever Instagram wants extra confirmation — a new device, an unusual network, a burst of activity. Keep that in mind: the virtual number isn't just for signup, it's for the checkpoint that may come later.",
      },
      {
        title: "If the code doesn't arrive, switch numbers",
        body: "Instagram sometimes rate-limits SMS to a number that requested codes recently. Don't keep tapping “resend” — cancel the pending activation in SMS Activate (numbers that received nothing are free) and take a fresh number, or try a different country.",
      },
    ],
    faqs: [
      {
        q: "Will my Instagram account keep working after the number expires?",
        a: "Yes. The number is only needed while the verification code is being delivered. Once you're in, add an email you control and enable two-factor through an authenticator app in Accounts Center — then the account never needs to receive another SMS on that number.",
      },
      {
        q: "Can I create a second Instagram account with a virtual number?",
        a: "Yes. Meta allows multiple accounts and Instagram supports up to five in one app. Each account may be asked to confirm its own phone number when Instagram's systems challenge it, so give each one a separate virtual number rather than reusing a single contact point.",
      },
      {
        q: "Why does Instagram keep asking me to confirm a phone number?",
        a: "That's the checkpoint flow. It usually fires when an account looks automated: created moments ago and already following dozens of people, or logging in from a network Instagram hasn't seen. Slow down, complete the profile, and verify once with a number you can receive the code on.",
      },
      {
        q: "Why didn't my Instagram code arrive?",
        a: "The most common cause is a mismatched country code; the second is Instagram rate-limiting SMS to a number that recently requested codes. Cancel the pending activation in SMS Activate — you're not charged for a number that received nothing — and try a fresh number or another country.",
      },
      {
        q: "Is signing up for Instagram with a virtual number allowed?",
        a: "Instagram's verification checks that you can receive a code on the number, not whose name the SIM is registered in. Renting a number for the confirmation step is fine for normal use — running a personal page, a brand or a shop. What matters is following Instagram's own community rules once you're in.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Instagram — регистрация без SIM-карты",
    metaDescription:
      "Настоящий виртуальный номер для подтверждения Instagram за секунды. Пройдите проверку телефона для нового, второго или бизнес-аккаунта, не раскрывая свой номер.",
    hero: {
      title: "Виртуальный номер для Instagram",
      intro: [
        "В Instagram можно зарегистрироваться по почте — но шаг с телефоном редко остаётся необязательным надолго. Новое устройство, незнакомая сеть или пара быстрых действий сразу после регистрации — и Instagram просит подтвердить номер телефона, прежде чем пустить дальше. Этот номер привязывается к аккаунту.",
        "С SMS Activate вы арендуете настоящий номер в одной из 50+ стран, указываете его в Instagram — и шестизначный код приходит в приложение за считанные секунды. Ваш личный номер не попадает в контактный граф Meta — и в построенные на нём рекомендации «возможно, вы знакомы».",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Instagram?",
      body: [
        "Номер телефона в Instagram делает больше, чем разовое подтверждение: он связывает аккаунт с вашей личностью во всех сервисах Meta и может показать ваш профиль любому, у кого этот номер сохранён в контактах. Если вы запускаете страницу бренда, магазин или профиль автора, который хотите держать отдельно от личной жизни, виртуальный номер сохраняет эту стену: аккаунт проходит проверку как обычно, но не ведёт к вам.",
        "Это же — аккуратный способ вести несколько аккаунтов. Instagram официально поддерживает до пяти в одном приложении, но когда система решает проверить один из них, каждому аккаунту может понадобиться свой контакт для подтверждения. Виртуальный номер даёт каждому проекту собственный — без коллекции SIM-карт.",
      ],
    },
    howTo: {
      title: "Как подтвердить Instagram виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Activate",
          body: "Откройте приложение SMS Activate, выберите сервис Instagram, страну — и нажмите один раз. Настоящий мобильный номер резервируется только для вас; оплата за активацию, без подписки.",
        },
        {
          title: "Введите его в Instagram",
          body: "Неважно, регистрируетесь вы или столкнулись с запросом «подтвердите номер телефона» на существующем аккаунте — выберите соответствующий код страны и введите номер ровно так, как он выдан.",
        },
        {
          title: "Заберите код из SMS Activate",
          body: "Instagram присылает шестизначную SMS — примерно такую: «391 504 is your Instagram code. Don't share it.» Она появляется в приложении SMS Activate за секунды; введите код — и проверка пройдена.",
        },
        {
          title: "Отвяжите аккаунт от арендованного номера",
          body: "Добавьте почту, которой владеете, и включите двухфакторную аутентификацию через приложение-аутентификатор: Настройки → Центр аккаунтов → Пароль и безопасность. После этого вход и восстановление больше не зависят от виртуального номера.",
        },
      ],
    },
    tips: [
      {
        title: "Дайте свежему аккаунту освоиться",
        body: "Система проверок Instagram следит за аккаунтами, которые слишком активны сразу после создания: массовые подписки, лавина лайков, мгновенные сообщения. Именно это и вызывает повторные запросы «подтвердите номер телефона». Поставьте фото профиля, заполните описание, опубликуйте что-нибудь — и первые дни ведите себя как человек.",
      },
      {
        title: "Регистрация по почте не отменяет шаг с телефоном",
        body: "Даже аккаунты, созданные по email, получают запрос номера, когда Instagram хочет дополнительного подтверждения: новое устройство, необычная сеть, всплеск активности. Помните об этом: виртуальный номер нужен не только для регистрации, но и для проверки, которая может прийти позже.",
      },
      {
        title: "Код не приходит — смените номер",
        body: "Instagram иногда ограничивает отправку SMS на номер, который недавно уже запрашивал коды. Не жмите «отправить ещё раз» без конца: отмените ожидающую активацию в SMS Activate (номера, на которые ничего не пришло, бесплатны) и возьмите свежий номер или другую страну.",
      },
    ],
    faqs: [
      {
        q: "Аккаунт Instagram продолжит работать после окончания аренды номера?",
        a: "Да. Номер нужен только на время доставки кода подтверждения. После входа добавьте почту, которой владеете, и включите двухфакторную аутентификацию через приложение-аутентификатор в Центре аккаунтов — тогда аккаунту больше никогда не понадобится SMS на этот номер.",
      },
      {
        q: "Можно ли создать второй аккаунт Instagram на виртуальный номер?",
        a: "Да. Meta разрешает несколько аккаунтов, а Instagram поддерживает до пяти в одном приложении. При проверке каждому аккаунту может понадобиться подтвердить собственный номер, поэтому дайте каждому отдельный виртуальный номер, а не один общий контакт.",
      },
      {
        q: "Почему Instagram снова и снова просит подтвердить номер телефона?",
        a: "Это проверка-чекпоинт. Обычно она срабатывает, когда аккаунт похож на автоматизированный: создан минуту назад и уже подписался на десятки людей, либо входит из сети, которую Instagram не видел. Сбавьте темп, заполните профиль и подтвердите номер один раз — с номера, на который вы можете получить код.",
      },
      {
        q: "Почему не пришёл код Instagram?",
        a: "Самая частая причина — несовпадение кода страны; вторая — Instagram ограничил SMS на номер, который недавно запрашивал коды. Отмените ожидающую активацию в SMS Activate — за номер, на который ничего не пришло, деньги не списываются, — и возьмите новый номер или другую страну.",
      },
      {
        q: "Разрешено ли регистрироваться в Instagram с виртуальным номером?",
        a: "Проверка Instagram убеждается, что вы можете получить код на номер, а не на чьё имя оформлена SIM-карта. Аренда номера для шага подтверждения — нормальная практика для обычного использования: личной страницы, бренда или магазина. Главное — соблюдать правила сообщества Instagram после входа.",
      },
    ],
  },
};
