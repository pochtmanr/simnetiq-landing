import type { Locale } from "../i18n";

/* Landing page copy. Russian translated by hand — keep both locales in sync
   structurally when editing. */

export const SERVICES = [
  "telegram", "whatsapp", "google", "instagram", "facebook", "tiktok",
  "discord", "tinder", "snapchat", "apple", "netflix", "paypal",
  "uber", "steam", "viber", "signal", "twitter", "aliexpress",
  "wechat", "line", "airbnb", "grab", "vkcom", "adidas", "cursor",
  "twitch", "binance", "ebay", "reddit", "fiverr", "shopee",
  "kakaotalk", "zalo",
] as const;

export const HOME = {
  en: {
    banner: { chip: "NEW", text: "One-time activation packs — no subscription" },
    hero: {
      label: "Virtual numbers · SMS verification",
      titleTop: "A number for the sign‑up.",
      titleAccent: "Not for life.",
      body: "SMS Code gives you a real virtual number in 100+ countries and shows the verification code usually within seconds — so Telegram, WhatsApp, Google and 100+ other services never learn your personal number.",
      note: "One-time coin packs · no subscription",
    },
    services: {
      label: "Coverage",
      title: "Works with the sign-ups you actually do",
      caption: "Telegram, WhatsApp, Google, Instagram and 100+ more services",
    },
    how: {
      label: "Overview",
      title: "Three steps, and you're done",
      step: "Step",
      steps: [
        {
          title: "Pick a service and a country",
          body: "Choose what you're signing up for — Telegram, WhatsApp, Google, 100+ services — and where the number should be from.",
        },
        {
          title: "Get a real number instantly",
          body: "The app hands you a live virtual number. Paste it into the sign-up form like any other phone number.",
        },
        {
          title: "The code lands in the app",
          body: "The verification SMS shows up on screen usually within seconds. Tap once to copy the code, finish the sign-up, done.",
        },
      ],
    },
    features: {
      label: "Why SMS Code",
      title: "Built for people who guard their number",
      sub: "Developers testing sign-up flows, marketers running accounts, and anyone tired of “enter your phone number to continue.”",
      items: [
        {
          title: "Your real number stays yours",
          body: "Sign up for anything without handing your personal number to one more database, mailing list, or data breach.",
        },
        {
          title: "100+ services, 100+ countries",
          body: "From Telegram and WhatsApp to Steam and Tinder — with numbers from Europe, Asia, the Americas and more.",
        },
        {
          title: "Usually seconds, not minutes",
          body: "Numbers are live the moment you get them. The SMS appears right in the app with one-tap copy.",
        },
        {
          title: "Pay per code, no subscription",
          body: "Buy a pack of coins once and spend them whenever. No monthly plan, no auto-renew, nothing on your balance expires.",
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
      sub: "The app runs on coins. Buy them once in whichever pack size suits you, then spend them one verification at a time — no subscription, no auto-renew, and nothing on your balance expires.",
      packsLabel: "Coin packs",
      packs: ["20", "55", "120", "250", "700"],
      coinsUnit: "coins",
      facts: [
        {
          title: "From 20 coins — but check the service first",
          body: "The service you're verifying drives most of the price and the country adjusts it, not the other way round. 20 coins is the floor, not the going rate: a common messenger can start around 35 coins and a high-demand service can run into the hundreds in every country it offers. The app quotes each combination live, so look at the price before you pick a pack.",
        },
        {
          title: "The price before you confirm",
          body: "Every country in the list carries its exact coin price next to it. Nothing leaves your balance until you have seen the number and tapped through.",
        },
        {
          title: "No code, coins back",
          body: "If the number is rejected or the SMS never lands, take another one. The coins from the failed activation return to your balance automatically.",
        },
      ],
      note: "Pack prices are set in the App Store and vary by region.",
    },
    showcase: {
      label: "Inside the app",
      title: "What it actually looks like",
      body: "No mock-ups — these are real screens from the app. The app is updated regularly, so the fine print in a screenshot may be a version behind.",
      shots: [
        { src: "/app/shot-countries.png", caption: "Every country priced before you pick one" },
        { src: "/app/shot-waiting.png", caption: "The code lands on the activation screen" },
        { src: "/app/shot-activations.png", caption: "Active numbers, one tap to copy" },
        { src: "/app/shot-languages.png", caption: "Ten languages, switched from Settings" },
      ],
    },
    faq: {
      label: "Questions",
      title: "Questions, answered",
      items: [
        {
          q: "What exactly is a virtual number?",
          a: "A real phone number that exists on a carrier network but isn't tied to a SIM card in your pocket. It can receive SMS like any other number — you use it for the verification step, and your personal number never enters the picture. An activation is single-use: the number is reserved for you alone while it runs, and when it ends the number returns to the provider's pool, where it may later be issued to someone else. So treat it as a number for the sign-up, not a number you keep.",
        },
        {
          q: "Can I reuse a number or have the code resent?",
          a: "No. An activation covers one code on one number. Once it finishes or expires the number goes back to the provider's pool — you can't have another SMS delivered to it, and it may be reissued to a different customer later. Need to verify again? Start a new activation and you'll get a fresh number. For any account you plan to keep, add a recovery email and app-based two-factor right after signing up, so the account never depends on a number you no longer hold.",
        },
        {
          q: "How fast does the code arrive?",
          a: "Usually within seconds of the service sending it. The activation screen updates live, so you'll see the SMS text and the code the moment it lands.",
        },
        {
          q: "Which services can I verify?",
          a: "100+ popular services including Telegram, WhatsApp, Google, Instagram, Facebook, TikTok, Discord, Tinder, Steam, PayPal and more — each with its own list of available countries.",
        },
        {
          q: "What if the code never arrives?",
          a: "You can cancel a pending activation directly in the app and take another number or try a different country. Support is one message away if anything looks off.",
        },
        {
          q: "How long does an activation last, and can I swap the number?",
          a: "The activation window is 15 minutes. If nothing arrives you can swap to a different number from the same screen — the app has to hold the current number for two minutes first, because the supplier will not let a number be released sooner than that, and you can swap up to three times within one activation. You can also cancel outright and start a fresh activation instead. Either way, the coins for a number that never received an SMS return to your balance.",
        },
        {
          q: "How many numbers can I have at once?",
          a: "Three active at a time. There are also hourly and daily ceilings on how many coins one account can spend. They are set well above ordinary use — they exist to stop automated abuse, not to ration normal customers.",
        },
        {
          q: "Do my coins expire?",
          a: "No. Coin packs are one-time purchases, not subscriptions — unused coins stay on your balance until you spend them, and follow your account onto a new device.",
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
    stats: {
      label: "At a glance",
      items: [
        { value: "100+", label: "countries with real mobile numbers on live carrier networks" },
        { value: "100+", label: "services you can verify, from Telegram to Steam" },
        { value: "3", label: "taps from picking a service to a live number on screen" },
        { value: "0", label: "subscriptions — one-time coin packs, and coins never expire" },
      ],
    },
    compare: {
      label: "Compare",
      title: "How SMS Code stacks up",
      body: "Weighing us against SMS-Activate.org, 5SIM or another provider? We wrote the side-by-side comparisons ourselves — what each service does well, and where a mobile-first app with one-time coin packs is the better fit.",
      vsLabel: "SMS Code vs",
    },
    blog: {
      label: "From the blog",
      title: "Guides worth reading before your next sign-up",
      readMore: "Read the guide",
      allLink: "All articles",
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
      body: "SMS Code даёт вам настоящий виртуальный номер в 100+ странах и показывает код подтверждения обычно за считанные секунды — Telegram, WhatsApp, Google и ещё 100+ сервисов никогда не узнают ваш личный номер.",
      note: "Разовые пакеты монет · без подписки",
    },
    services: {
      label: "Покрытие",
      title: "Работает с сервисами, где вы действительно регистрируетесь",
      caption: "Telegram, WhatsApp, Google, Instagram и ещё 100+ сервисов",
    },
    how: {
      label: "Обзор",
      title: "Три шага — и готово",
      step: "Шаг",
      steps: [
        {
          title: "Выберите сервис и страну",
          body: "Укажите, где вы регистрируетесь — Telegram, WhatsApp, Google, 100+ сервисов — и из какой страны должен быть номер.",
        },
        {
          title: "Получите настоящий номер мгновенно",
          body: "Приложение выдаёт живой виртуальный номер. Вставьте его в форму регистрации, как обычный телефон.",
        },
        {
          title: "Код приходит прямо в приложение",
          body: "SMS с подтверждением появляется на экране обычно за секунды. Одно касание — код скопирован, регистрация завершена.",
        },
      ],
    },
    features: {
      label: "Почему SMS Code",
      title: "Для тех, кто бережёт свой номер",
      sub: "Разработчики, тестирующие регистрацию, маркетологи со множеством аккаунтов и все, кто устал от «введите номер телефона, чтобы продолжить».",
      items: [
        {
          title: "Ваш настоящий номер остаётся вашим",
          body: "Регистрируйтесь где угодно, не отдавая личный номер очередной базе данных, рассылке или утечке.",
        },
        {
          title: "100+ сервисов, 100+ стран",
          body: "От Telegram и WhatsApp до Steam и Tinder — с номерами из Европы, Азии, Америки и не только.",
        },
        {
          title: "Обычно секунды, а не минуты",
          body: "Номер активен с момента выдачи. SMS появляется прямо в приложении, код копируется одним касанием.",
        },
        {
          title: "Платите за коды, а не за подписку",
          body: "Купите пакет монет один раз и тратьте когда угодно. Ни ежемесячных платежей, ни автопродления — ничто на балансе не сгорает.",
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
      sub: "Приложение работает на монетах. Покупаете их один раз пакетом любого размера и тратите по одной активации за раз — без подписки, без автопродления, и ничего на балансе не сгорает.",
      packsLabel: "Пакеты монет",
      packs: ["20", "55", "120", "250", "700"],
      coinsUnit: "монет",
      facts: [
        {
          title: "От 20 монет — но сначала посмотрите на сервис",
          body: "Цену задаёт прежде всего сам сервис, а страна её корректирует, а не наоборот. 20 монет — это нижняя граница, а не обычная цена: распространённый мессенджер начинается примерно с 35 монет, а сервис с высоким спросом может стоить сотни монет в любой стране, где он доступен. Приложение показывает цену для каждой пары вживую — посмотрите её, прежде чем выбирать пакет.",
        },
        {
          title: "Цена — до подтверждения",
          body: "Рядом с каждой страной в списке стоит её точная цена в монетах. С баланса ничего не спишется, пока вы не увидите цифру и не нажмёте дальше.",
        },
        {
          title: "Нет кода — монеты возвращаются",
          body: "Если номер отклонили или SMS так и не пришла, возьмите другой. Монеты за неудавшуюся активацию автоматически вернутся на баланс.",
        },
      ],
      note: "Цены пакетов задаются в App Store и зависят от региона.",
    },
    showcase: {
      label: "Внутри приложения",
      title: "Как это выглядит на самом деле",
      body: "Никаких макетов — это настоящие экраны приложения. Приложение регулярно обновляется, поэтому мелкие детали на скриншоте могут отставать на версию.",
      shots: [
        { src: "/app/shot-countries.png", caption: "Цена каждой страны видна до выбора" },
        { src: "/app/shot-waiting.png", caption: "Код появляется прямо на экране активации" },
        { src: "/app/shot-activations.png", caption: "Активные номера, копирование одним касанием" },
        { src: "/app/shot-languages.png", caption: "Десять языков, переключаются в настройках" },
      ],
    },
    faq: {
      label: "Вопросы",
      title: "Ответы на вопросы",
      items: [
        {
          q: "Что такое виртуальный номер?",
          a: "Настоящий телефонный номер в сети оператора, но без SIM-карты у вас в кармане. Он принимает SMS, как любой другой номер: вы используете его на шаге подтверждения, а ваш личный номер вообще не участвует. Активация одноразовая: пока она идёт, номер закреплён только за вами, а после её завершения возвращается в пул провайдера, откуда позже может достаться другому пользователю. Поэтому считайте его номером для регистрации, а не номером, который остаётся у вас.",
        },
        {
          q: "Можно ли повторно использовать номер или запросить повторную отправку кода?",
          a: "Нет. Одна активация — один код на одном номере. После её завершения или истечения номер возвращается в пул провайдера: получить на него ещё одну SMS нельзя, а позже он может быть выдан другому пользователю. Нужно подтвердить ещё раз — создайте новую активацию и получите новый номер. А для аккаунта, который вы планируете сохранить, сразу после регистрации добавьте резервную почту и двухфакторную аутентификацию через приложение, чтобы аккаунт не зависел от номера, которого у вас больше нет.",
        },
        {
          q: "Как быстро приходит код?",
          a: "Обычно через несколько секунд после отправки сервисом. Экран активации обновляется в реальном времени — вы увидите текст SMS и код в момент получения.",
        },
        {
          q: "Какие сервисы можно подтвердить?",
          a: "100+ популярных сервисов: Telegram, WhatsApp, Google, Instagram, Facebook, TikTok, Discord, Tinder, Steam, PayPal и другие — у каждого свой список доступных стран.",
        },
        {
          q: "Что делать, если код так и не пришёл?",
          a: "Отмените ожидающую активацию прямо в приложении и возьмите другой номер или попробуйте другую страну. А поддержка всегда на расстоянии одного сообщения.",
        },
        {
          q: "Сколько длится активация и можно ли сменить номер?",
          a: "Окно активации — 15 минут. Если ничего не приходит, номер можно сменить прямо на этом экране: сначала приложение обязано подержать текущий номер две минуты — раньше провайдер освободить его не даёт, — а всего в рамках одной активации доступно до трёх смен. Можно и просто отменить активацию и начать новую. В любом случае монеты за номер, на который SMS так и не пришла, возвращаются на баланс.",
        },
        {
          q: "Сколько номеров можно держать одновременно?",
          a: "Три активных одновременно. Есть также часовой и суточный лимиты на количество монет, которые может потратить один аккаунт. Они заданы с большим запасом относительно обычного использования: их задача — остановить автоматические злоупотребления, а не ограничивать обычных пользователей.",
        },
        {
          q: "Сгорают ли монеты?",
          a: "Нет. Пакеты монет — разовые покупки, а не подписка: непотраченные монеты остаются на балансе, пока вы их не потратите, и переезжают вместе с аккаунтом на новое устройство.",
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
    stats: {
      label: "Коротко о главном",
      items: [
        { value: "100+", label: "стран с настоящими мобильными номерами в живых сетях операторов" },
        { value: "100+", label: "сервисов для верификации — от Telegram до Steam" },
        { value: "3", label: "касания от выбора сервиса до живого номера на экране" },
        { value: "0", label: "подписок — разовые пакеты монет, а монеты не сгорают" },
      ],
    },
    compare: {
      label: "Сравнение",
      title: "Как SMS Code выглядит на фоне других",
      body: "Выбираете между нами, SMS-Activate.org, 5SIM или другим сервисом? Мы сами написали честные сравнения бок о бок — что каждый сервис делает хорошо и где мобильное приложение с разовыми пакетами монет подходит лучше.",
      vsLabel: "SMS Code против",
    },
    blog: {
      label: "Из блога",
      title: "Гиды, которые стоит прочитать перед следующей регистрацией",
      readMore: "Читать гид",
      allLink: "Все статьи",
    },
    cta: {
      title: "Вашей следующей регистрации не нужен ваш настоящий номер",
      support: "Есть вопросы перед загрузкой? Напишите в поддержку",
    },
  },
} satisfies Record<Locale, unknown>;
