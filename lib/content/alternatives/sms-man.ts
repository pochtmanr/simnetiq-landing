import type { AlternativeEntry } from "./types";

export const smsMan: AlternativeEntry = {
  slug: "sms-man",
  competitorName: "SMS-Man",
  updatedAt: "2026-07-07",
  en: {
    metaTitle: "SMS-Man Alternative — SMS Code App by SIMNETIQ",
    metaDescription:
      "Comparing SMS-Man with the SMS Code app by SIMNETIQ: a web service with many top-up methods versus a native mobile app billed safely through Apple and Google.",
    hero: {
      title: "An SMS-Man alternative billed through your app store",
      intro: [
        "SMS-Man is a long-running web service for receiving SMS verification codes on virtual numbers. You register on their site, top up an account balance — public descriptions of the service mention a wide spread of methods, from bank cards to e-payment systems and cryptocurrency — and buy numbers per activation, with an API available for automated workflows.",
        "SMS Code by SIMNETIQ trades that flexibility for a simpler trust model. It's a native iOS app where payment happens entirely through Apple billing: you buy a one-time coin pack the same way you'd buy any in-app purchase, and no card number, wallet address or payment credential is ever shared with us. Pick a service and country, and the code arrives in-app usually within seconds.",
      ],
    },
    whenThem: {
      title: "When SMS-Man is the better choice",
      body: "Choose SMS-Man if how you pay matters as much as what you buy. A web service that accepts many top-up routes — including options like cryptocurrency that store billing simply doesn't offer — suits users whose preferred payment method falls outside Apple's and Google's rails. Their API also serves developers automating verification at volume, and their catalog of countries and services is pitched at that broader, heavier use.",
    },
    whenUs: {
      title: "When the SMS Code app fits better",
      body: "Choose the app if you'd rather not hand payment details to a niche website at all. Store billing is the whole point: Apple processes the charge, we never see your card, and the purchase sits in your normal store history with its usual protections. On top of that you get the native-app experience — a few taps from service to code, 100+ countries, 100+ popular services, one-time coin packs with no subscription, and free cancellation whenever an activation receives no SMS.",
    },
    comparison: {
      title: "SMS-Man vs the SMS Code app, side by side",
      rows: [
        {
          label: "Platforms",
          competitor: "Web service with an API for automation",
          us: "Native iOS app from the App Store",
        },
        {
          label: "Pricing model",
          competitor: "Pay per activation from a topped-up account balance",
          us: "One-time coin packs, pay per activation — no subscription",
        },
        {
          label: "Payment",
          competitor: "Balance top-up with many methods, per public descriptions including cards, e-payments and crypto",
          us: "Apple store billing only — no payment details shared with us",
        },
        {
          label: "Coverage",
          competitor: "A broad catalog of countries and services aimed at heavy use",
          us: "100+ countries and 100+ popular services, curated for everyday sign-ups",
        },
        {
          label: "Cancellation",
          competitor: "Governed by their own refund rules — check their current terms",
          us: "Activations that receive no SMS cancel free, coins return",
        },
        {
          label: "Support",
          competitor: "Support channels via their website",
          us: "In-app and site contact form",
        },
        {
          label: "Best for",
          competitor: "Users who need flexible payment routes or API-driven volume",
          us: "Individuals who want store-billed simplicity and a native mobile app",
        },
      ],
      note: "Competitor details reflect public descriptions of their service at the time of writing and can change — always confirm on sms-man.com before deciding.",
    },
    switchSteps: {
      title: "Trying the app takes three steps",
      steps: [
        {
          title: "Install the app",
          body: "Get SMS Code by SIMNETIQ from the App Store — no website registration or balance top-up involved.",
        },
        {
          title: "Grab a coin pack",
          body: "Buy a one-time pack through your App Store account. Apple handles the payment; we never receive your card details.",
        },
        {
          title: "Run your first activation",
          body: "Pick a service and country, get a real number, and watch the code arrive in-app usually within seconds. If nothing arrives, the activation cancels free.",
        },
      ],
    },
    faqs: [
      {
        q: "How is paying in the SMS Code app different from SMS-Man?",
        a: "SMS-Man works like most web services: you top up a site balance using one of the methods they accept. In the app, payment goes exclusively through Apple billing — a normal in-app purchase — so no card number or payment credential is ever shared with us.",
      },
      {
        q: "Can I pay with cryptocurrency in the app?",
        a: "No. Store billing doesn't support crypto, and the app doesn't accept payment outside the App Store. If crypto is a requirement, a web service like SMS-Man that lists such options is the better fit.",
      },
      {
        q: "Is there a subscription or recurring charge?",
        a: "No. Coin packs are one-time purchases; you spend coins per activation and buy another pack only when you choose to.",
      },
      {
        q: "What happens if my code never arrives?",
        a: "The activation cancels and your coins are returned. You only pay for numbers that actually receive an SMS.",
      },
      {
        q: "Does the app have an API like SMS-Man?",
        a: "No — the app is a consumer product for verifying accounts by hand, not a platform for scripted registration. If you need programmatic access to numbers, SMS-Man's API serves that use case.",
      },
    ],
  },
  ru: {
    metaTitle: "Альтернатива SMS-Man — SMS Code от SIMNETIQ",
    metaDescription:
      "Сравниваем SMS-Man и приложение SMS Code от SIMNETIQ: веб-сервис со множеством способов пополнения против нативного приложения с безопасной оплатой через App Store.",
    hero: {
      title: "Альтернатива SMS-Man с оплатой через магазин приложений",
      intro: [
        "SMS-Man — давно работающий веб-сервис приёма SMS-кодов на виртуальные номера. Вы регистрируетесь на их сайте, пополняете баланс — публичные описания сервиса упоминают широкий набор способов, от банковских карт до электронных платёжных систем и криптовалюты — и покупаете номера поштучно; для автоматизации есть API.",
        "Приложение SMS Code от SIMNETIQ меняет эту гибкость на более простую модель доверия. Это нативное приложение для iOS, где оплата целиком проходит через Apple: вы покупаете разовый пакет монет так же, как любую встроенную покупку, и ни номер карты, ни адрес кошелька, ни другие платёжные данные нам не передаются. Выбираете сервис и страну — и код приходит в приложение обычно за секунды.",
      ],
    },
    whenThem: {
      title: "Когда SMS-Man подходит лучше",
      body: "Выбирайте SMS-Man, если способ оплаты важен не меньше самой покупки. Веб-сервис с множеством путей пополнения — включая варианты вроде криптовалюты, которых у App Store попросту нет, — подходит тем, чей привычный способ платежа лежит вне рельсов Apple. Их API пригодится разработчикам, автоматизирующим верификацию в объёмах, а каталог стран и сервисов рассчитан именно на такое, более интенсивное использование.",
    },
    whenUs: {
      title: "Когда приложение SMS Code подходит лучше",
      body: "Выбирайте приложение, если вообще не хотите оставлять платёжные данные на нишевом сайте. Оплата через App Store — в этом весь смысл: списание проводит Apple, мы вашу карту не видим, а покупка попадает в обычную историю магазина со всеми привычными гарантиями. Плюс всё остальное, что даёт нативное приложение: пара касаний от сервиса до кода, 100+ стран, 100+ популярных сервисов, разовые пакеты монет без подписки и бесплатная отмена всякий раз, когда на активацию не пришла SMS.",
    },
    comparison: {
      title: "SMS-Man и приложение SMS Code: сравнение",
      rows: [
        {
          label: "Платформы",
          competitor: "Веб-сервис с API для автоматизации",
          us: "Нативное приложение для iOS из App Store",
        },
        {
          label: "Модель оплаты",
          competitor: "Оплата за активацию с заранее пополненного баланса",
          us: "Разовые пакеты монет, оплата за активацию — без подписки",
        },
        {
          label: "Способ оплаты",
          competitor: "Пополнение множеством способов — по публичным описаниям, карты, электронные платежи и криптовалюта",
          us: "Только через App Store — платёжные данные нам не передаются",
        },
        {
          label: "Покрытие",
          competitor: "Широкий каталог стран и сервисов с расчётом на интенсивное использование",
          us: "100+ стран и 100+ популярных сервисов — подборка для повседневных регистраций",
        },
        {
          label: "Отмена",
          competitor: "По их собственным правилам возврата — проверьте актуальные условия",
          us: "Активации без входящих SMS отменяются бесплатно, монеты возвращаются",
        },
        {
          label: "Поддержка",
          competitor: "Каналы поддержки на их сайте",
          us: "Форма связи в приложении и на сайте",
        },
        {
          label: "Кому подходит",
          competitor: "Тем, кому нужны гибкие способы оплаты или объёмы через API",
          us: "Частным пользователям — оплата через магазин и нативное мобильное приложение",
        },
      ],
      note: "Сведения о конкуренте отражают публичные описания сервиса на момент написания и могут меняться — перед выбором сверьтесь с sms-man.com.",
    },
    switchSteps: {
      title: "Попробовать приложение — три шага",
      steps: [
        {
          title: "Установите приложение",
          body: "Скачайте SMS Code от SIMNETIQ из App Store — без регистрации на сайте и пополнения баланса.",
        },
        {
          title: "Возьмите пакет монет",
          body: "Купите разовый пакет через аккаунт App Store. Платёж проводит Apple; данные вашей карты до нас не доходят.",
        },
        {
          title: "Проведите первую активацию",
          body: "Выберите сервис и страну, получите настоящий номер — и код придёт в приложение обычно за секунды. Если ничего не пришло, активация отменяется бесплатно.",
        },
      ],
    },
    faqs: [
      {
        q: "Чем оплата в приложении SMS Code отличается от SMS-Man?",
        a: "SMS-Man работает как большинство веб-сервисов: вы пополняете баланс на сайте одним из принимаемых ими способов. В приложении оплата идёт исключительно через App Store — как обычная встроенная покупка, — поэтому ни номер карты, ни другие платёжные данные нам не передаются.",
      },
      {
        q: "Можно ли платить в приложении криптовалютой?",
        a: "Нет. App Store криптовалюту не поддерживает, а вне App Store приложение платежи не принимает. Если криптовалюта — обязательное условие, веб-сервис вроде SMS-Man с такими вариантами подойдёт лучше.",
      },
      {
        q: "Есть ли подписка или регулярные списания?",
        a: "Нет. Пакеты монет — разовые покупки: вы тратите монеты на активации и покупаете следующий пакет только тогда, когда сами решите.",
      },
      {
        q: "Что будет, если код так и не придёт?",
        a: "Активация отменится, а монеты вернутся. Вы платите только за номера, на которые SMS действительно пришла.",
      },
      {
        q: "Есть ли у приложения API, как у SMS-Man?",
        a: "Нет — приложение задумано как потребительский продукт для ручной верификации аккаунтов, а не платформа для скриптовых регистраций. Если нужен программный доступ к номерам, этот сценарий закрывает API SMS-Man.",
      },
    ],
  },
};
