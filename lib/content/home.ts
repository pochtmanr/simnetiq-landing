import type { Locale } from "../i18n";

/* Landing page copy. Russian translated by hand — keep both locales in sync
   structurally when editing. */

export const SERVICES = [
  "telegram", "whatsapp", "google", "instagram", "facebook", "tiktok",
  "discord", "tinder", "snapchat", "apple", "netflix", "paypal",
  "uber", "steam", "viber", "signal", "twitter", "aliexpress",
  "wechat", "line", "airbnb", "grab", "vkcom", "adidas", "cursor",
] as const;

export const HOME = {
  en: {
    banner: { chip: "NEW", text: "One-time activation packs — no subscription" },
    hero: {
      label: "Virtual numbers · SMS verification",
      titleTop: "A number for the sign‑up.",
      titleAccent: "Not for life.",
      body: "SMS Activate gives you a real virtual number in 50+ countries and shows the verification code in seconds — so Telegram, WhatsApp, Google and 35+ other services never learn your personal number.",
      note: "Live on both stores · one-time credit packs, no subscription",
    },
    services: {
      label: "Coverage",
      title: "Works with the sign-ups you actually do",
      caption: "Telegram, WhatsApp, Google, Instagram and 35+ more services",
    },
    how: {
      label: "Overview",
      title: "Three steps, about thirty seconds",
      step: "Step",
      steps: [
        {
          title: "Pick a service and a country",
          body: "Choose what you're signing up for — Telegram, WhatsApp, Google, 35+ services — and where the number should be from.",
        },
        {
          title: "Get a real number instantly",
          body: "The app hands you a live virtual number. Paste it into the sign-up form like any other phone number.",
        },
        {
          title: "The code lands in the app",
          body: "The verification SMS shows up on screen within seconds. Tap once to copy the code, finish the sign-up, done.",
        },
      ],
    },
    features: {
      label: "Why SMS Activate",
      title: "Built for people who guard their number",
      sub: "Developers testing sign-up flows, marketers running accounts, and anyone tired of “enter your phone number to continue.”",
      items: [
        {
          title: "Your real number stays yours",
          body: "Sign up for anything without handing your personal number to one more database, mailing list, or data breach.",
        },
        {
          title: "35+ services, 50+ countries",
          body: "From Telegram and WhatsApp to Steam and Tinder — with numbers from Europe, Asia, the Americas and more.",
        },
        {
          title: "Codes in seconds, not minutes",
          body: "Numbers are live the moment you get them. The SMS appears right in the app with one-tap copy.",
        },
        {
          title: "Pay per code, no subscription",
          body: "Buy a pack of activations once and spend them whenever. No monthly plan, no auto-renew, credits don't expire.",
        },
        {
          title: "No SIM, no eSIM, no contracts",
          body: "Nothing to install in your phone's settings and nothing tied to your identity. Just open the app.",
        },
        {
          title: "Cancel pending numbers anytime",
          body: "If a number doesn't fit, cancel the pending activation right from the app and grab a different one.",
        },
      ],
    },
    pricing: {
      label: "Pricing",
      title: "Pay for codes, not for a plan",
      sub: "Credits are one-time in-app purchases. Spend one credit per activation, whenever you need it — this month or next year.",
      popular: "Popular",
      note: "Current pack prices are shown in the app — they vary by store and region.",
      packs: [
        { name: "Try it", credits: "1", label: "activation", note: "One sign-up, one code. Perfect first test.", featured: false },
        { name: "Regular", credits: "5", label: "activations", note: "For a batch of accounts or ongoing testing.", featured: true },
        { name: "Power", credits: "10", label: "activations", note: "Best value per code for heavy users.", featured: false },
      ],
    },
    faq: {
      label: "Questions",
      title: "Questions, answered",
      items: [
        {
          q: "What exactly is a virtual number?",
          a: "A real phone number that exists on a carrier network but isn't tied to a SIM card in your pocket. It can receive SMS like any other number — you use it for the verification step, and your personal number never enters the picture.",
        },
        {
          q: "How fast does the code arrive?",
          a: "Usually within seconds of the service sending it. The activation screen updates live, so you'll see the SMS text and the code the moment it lands.",
        },
        {
          q: "Which services can I verify?",
          a: "35+ popular services including Telegram, WhatsApp, Google, Instagram, Facebook, TikTok, Discord, Tinder, Steam, PayPal and more — each with its own list of available countries.",
        },
        {
          q: "What if the code never arrives?",
          a: "You can cancel a pending activation directly in the app and take another number or try a different country. Support is one message away if anything looks off.",
        },
        {
          q: "Do my credits expire?",
          a: "No. Activation packs are one-time purchases, not subscriptions — unused activations stay on your balance until you spend them, and restore across devices with your store account.",
        },
        {
          q: "Is this legal to use?",
          a: "Yes — receiving SMS on a virtual number is a standard tool for privacy, QA and development. You're responsible for complying with the terms of the services you sign up for.",
        },
      ],
    },
    browse: {
      label: "Find your number",
      title: "Pick the service. We handle the number.",
      body: "Every service gets its own guide: the real verification flow, the quirks that trip people up, and the countries that work best for it.",
      allLink: "All services and guides",
    },
    personas: {
      label: "Who it’s for",
      title: "Built for people who guard their number",
      items: [
        {
          title: "The developer",
          body: "Test sign-up flows and OTP handling with a real receiving number — no office SIM drawer.",
          slug: "cursor",
          linkLabel: "Numbers for dev tools",
        },
        {
          title: "The social media manager",
          body: "A clean contact identity for every brand account you run, without wiring them to your personal phone.",
          slug: "instagram",
          linkLabel: "Numbers for Instagram",
        },
        {
          title: "The privacy-minded",
          body: "Strangers in group chats shouldn’t have a direct line to you. Keep your real number for people you trust.",
          slug: "telegram",
          linkLabel: "Numbers for Telegram",
        },
        {
          title: "The smart shopper",
          body: "Marketplaces and promo sign-ups get a working number — the marketing SMS never reaches your pocket.",
          slug: "aliexpress",
          linkLabel: "Numbers for AliExpress",
        },
        {
          title: "The multi-account entrepreneur",
          body: "A second WhatsApp for work, a separate Telegram for the project — each with its own number.",
          slug: "whatsapp",
          linkLabel: "Numbers for WhatsApp",
        },
      ],
    },
    cta: {
      title: "Your next sign-up doesn’t need your real number",
      support: "Questions before you download? Talk to support",
    },
  },
  ru: {
    banner: { chip: "НОВОЕ", text: "Разовые пакеты активаций — без подписки" },
    hero: {
      label: "Виртуальные номера · SMS-верификация",
      titleTop: "Номер для регистрации.",
      titleAccent: "А не на всю жизнь.",
      body: "SMS Activate даёт вам настоящий виртуальный номер в 50+ странах и показывает код подтверждения за считанные секунды — Telegram, WhatsApp, Google и ещё 35+ сервисов никогда не узнают ваш личный номер.",
      note: "Доступно в обоих магазинах · разовые пакеты кредитов, без подписки",
    },
    services: {
      label: "Покрытие",
      title: "Работает с сервисами, где вы действительно регистрируетесь",
      caption: "Telegram, WhatsApp, Google, Instagram и ещё 35+ сервисов",
    },
    how: {
      label: "Обзор",
      title: "Три шага — примерно тридцать секунд",
      step: "Шаг",
      steps: [
        {
          title: "Выберите сервис и страну",
          body: "Укажите, где вы регистрируетесь — Telegram, WhatsApp, Google, 35+ сервисов — и из какой страны должен быть номер.",
        },
        {
          title: "Получите настоящий номер мгновенно",
          body: "Приложение выдаёт живой виртуальный номер. Вставьте его в форму регистрации, как обычный телефон.",
        },
        {
          title: "Код приходит прямо в приложение",
          body: "SMS с подтверждением появляется на экране за секунды. Одно касание — код скопирован, регистрация завершена.",
        },
      ],
    },
    features: {
      label: "Почему SMS Activate",
      title: "Для тех, кто бережёт свой номер",
      sub: "Разработчики, тестирующие регистрацию, маркетологи со множеством аккаунтов и все, кто устал от «введите номер телефона, чтобы продолжить».",
      items: [
        {
          title: "Ваш настоящий номер остаётся вашим",
          body: "Регистрируйтесь где угодно, не отдавая личный номер очередной базе данных, рассылке или утечке.",
        },
        {
          title: "35+ сервисов, 50+ стран",
          body: "От Telegram и WhatsApp до Steam и Tinder — с номерами из Европы, Азии, Америки и не только.",
        },
        {
          title: "Коды за секунды, а не минуты",
          body: "Номер активен с момента выдачи. SMS появляется прямо в приложении, код копируется одним касанием.",
        },
        {
          title: "Платите за коды, а не за подписку",
          body: "Купите пакет активаций один раз и тратьте когда угодно. Ни ежемесячных платежей, ни автопродления — кредиты не сгорают.",
        },
        {
          title: "Без SIM, eSIM и контрактов",
          body: "Ничего не нужно настраивать в телефоне, ничего не привязано к вашей личности. Просто откройте приложение.",
        },
        {
          title: "Отменяйте номера в любой момент",
          body: "Если номер не подошёл, отмените ожидающую активацию прямо в приложении и возьмите другой.",
        },
      ],
    },
    pricing: {
      label: "Цены",
      title: "Платите за коды, а не за тариф",
      sub: "Кредиты — разовые покупки внутри приложения. Одна активация — один кредит, когда вам удобно: в этом месяце или через год.",
      popular: "Популярный",
      note: "Актуальные цены пакетов показаны в приложении — они зависят от магазина и региона.",
      packs: [
        { name: "Попробовать", credits: "1", label: "активация", note: "Одна регистрация, один код. Идеально для первой пробы.", featured: false },
        { name: "Стандарт", credits: "5", label: "активаций", note: "Для партии аккаунтов или регулярного тестирования.", featured: true },
        { name: "Максимум", credits: "10", label: "активаций", note: "Лучшая цена за код для активных пользователей.", featured: false },
      ],
    },
    faq: {
      label: "Вопросы",
      title: "Ответы на вопросы",
      items: [
        {
          q: "Что такое виртуальный номер?",
          a: "Настоящий телефонный номер в сети оператора, но без SIM-карты у вас в кармане. Он принимает SMS, как любой другой номер: вы используете его на шаге подтверждения, а ваш личный номер вообще не участвует.",
        },
        {
          q: "Как быстро приходит код?",
          a: "Обычно через несколько секунд после отправки сервисом. Экран активации обновляется в реальном времени — вы увидите текст SMS и код в момент получения.",
        },
        {
          q: "Какие сервисы можно подтвердить?",
          a: "35+ популярных сервисов: Telegram, WhatsApp, Google, Instagram, Facebook, TikTok, Discord, Tinder, Steam, PayPal и другие — у каждого свой список доступных стран.",
        },
        {
          q: "Что делать, если код так и не пришёл?",
          a: "Отмените ожидающую активацию прямо в приложении и возьмите другой номер или попробуйте другую страну. А поддержка всегда на расстоянии одного сообщения.",
        },
        {
          q: "Сгорают ли кредиты?",
          a: "Нет. Пакеты активаций — разовые покупки, а не подписка: неиспользованные активации остаются на балансе, пока вы их не потратите, и восстанавливаются на новых устройствах через аккаунт магазина.",
        },
        {
          q: "Это законно?",
          a: "Да — приём SMS на виртуальный номер является стандартным инструментом для приватности, тестирования и разработки. Вы сами отвечаете за соблюдение правил сервисов, в которых регистрируетесь.",
        },
      ],
    },
    browse: {
      label: "Найдите свой номер",
      title: "Выберите сервис. Номер — за нами.",
      body: "У каждого сервиса свой гид: реальный процесс подтверждения, подводные камни, о которые спотыкаются чаще всего, и страны, которые подходят лучше всего.",
      allLink: "Все сервисы и гиды",
    },
    personas: {
      label: "Для кого это",
      title: "Для тех, кто бережёт свой номер",
      items: [
        {
          title: "Разработчику",
          body: "Тестируйте регистрацию и обработку OTP на настоящем принимающем номере — без ящика офисных SIM-карт.",
          slug: "cursor",
          linkLabel: "Номера для dev-инструментов",
        },
        {
          title: "SMM-менеджеру",
          body: "Чистая контактная личность для каждого бренд-аккаунта — без привязки к вашему личному телефону.",
          slug: "instagram",
          linkLabel: "Номера для Instagram",
        },
        {
          title: "Ценителю приватности",
          body: "У незнакомцев из групповых чатов не должно быть прямой линии к вам. Настоящий номер — только для своих.",
          slug: "telegram",
          linkLabel: "Номера для Telegram",
        },
        {
          title: "Умному покупателю",
          body: "Маркетплейсы и промо-подписки получают рабочий номер — а рекламные SMS никогда не доходят до вашего кармана.",
          slug: "aliexpress",
          linkLabel: "Номера для AliExpress",
        },
        {
          title: "Мультиаккаунт-предпринимателю",
          body: "Второй WhatsApp для работы, отдельный Telegram для проекта — у каждого свой номер.",
          slug: "whatsapp",
          linkLabel: "Номера для WhatsApp",
        },
      ],
    },
    cta: {
      title: "Вашей следующей регистрации не нужен ваш настоящий номер",
      support: "Есть вопросы перед загрузкой? Напишите в поддержку",
    },
  },
} satisfies Record<Locale, unknown>;
