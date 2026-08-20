import type { ServiceEntry } from "./types";

export const shopee: ServiceEntry = {
  slug: "shopee",
  name: "Shopee",
  logo: "/services/shopee.svg",
  category: "shopping",
  relatedSlugs: ["aliexpress", "ebay", "grab", "line", "tiktok"],
  popularCountries: [
    "indonesia",
    "philippines",
    "thailand",
    "vietnam",
    "brazil",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Shopee",
    message: "382916 is your Shopee verification code. Do not share it with anyone.",
    code: "382916",
  },
  en: {
    metaTitle: "Virtual Number for Shopee — Verify Without Your Own Phone",
    metaDescription:
      "Receive Shopee’s SMS code on a real virtual number in seconds. Shop without wiring promo texts to your personal phone — with honest notes on how Shopee accounts work.",
    hero: {
      title: "A virtual number for Shopee",
      intro: [
        "Shopee is phone-first in a way Western marketplaces aren’t: across Southeast Asia and Brazil, the number is effectively the account. Sign-up starts with a phone, an OTP like “382916 is your Shopee verification code” confirms it, and from then on that number is your login, your recovery route — and the address for a steady stream of flash-sale SMS.",
        "With SMS Code you rent a real mobile number in one of 50+ countries and the code lands in the app within seconds. The account gets verified — and the marketing barrage points somewhere other than the phone that wakes you up at night.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Shopee?",
      body: [
        "Marketplaces are among the loudest services a phone number can meet. Order updates are useful; the vouchers, countdowns and “9.9 sale” blasts are not — and once your personal number is in a commerce database, it tends to stay there through every partner list and leak that follows. A separate number for shopping keeps the deal-hunting away from the number your family uses.",
        "The honest flip side: precisely because Shopee is phone-first, the number matters more here than on email-anchored services. It isn’t just a checkpoint — it’s the login. That doesn’t rule out a virtual number; it changes how you use one. Verify with it, then immediately link an email and set a password in account settings, so signing in never depends on receiving another OTP on a number you rented for one afternoon.",
      ],
    },
    howTo: {
      title: "How to verify Shopee with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Pick Shopee as the service and choose the country that matches the Shopee market you’re shopping on — the Indonesian app expects an Indonesian number, the Thai app a Thai one. One tap reserves a real mobile number.",
        },
        {
          title: "Start the sign-up with that number",
          body: "Enter the number on Shopee’s registration screen with the right country code. Shopee sends the OTP straight away — this is the time-sensitive part, so have both apps open.",
        },
        {
          title: "Type in the code",
          body: "The SMS reads “382916 is your Shopee verification code” and appears in SMS Code within seconds. Enter it and the account is live.",
        },
        {
          title: "Give the account a second anchor",
          body: "Straight after sign-up, open account settings and link your email and set a login password. That way you can sign in with username and password rather than a fresh OTP — the rented number stops being the only key.",
        },
      ],
    },
    tips: [
      {
        title: "Match the number to the market",
        body: "Shopee runs country-specific apps and sites, and each expects a local number. A Vietnamese number won’t start an account on Shopee Indonesia. Decide which market you’re actually buying from, then rent the number to match.",
      },
      {
        title: "The number is the login — plan for that",
        body: "Where email-first services treat the phone as a checkpoint, Shopee may ask for an SMS again at password resets or logins from new devices. Keep the login password set, stay signed in on your device, and treat a long-lived shop account as something worth a number you keep.",
      },
      {
        title: "Selling is a different game",
        body: "Opening a shop brings seller verification — identity documents and bank details in most markets. A virtual number covers the SMS step of a buyer account; it doesn’t stand in for the checks Shopee runs on people who take payments.",
      },
    ],
    faqs: [
      {
        q: "Can I sign up for Shopee with a virtual number?",
        a: "Yes — it’s a real mobile number on a real carrier network, and Shopee verifies it with a standard OTP. Pick the country that matches the Shopee market you’re registering on, since each market expects local numbers.",
      },
      {
        q: "What happens to my Shopee account when the rented number expires?",
        a: "The account keeps working as long as you can sign in. Because Shopee is phone-first, set a password and link an email right after registration — then everyday logins don’t need an OTP. If you plan to use the account for years, consider updating it to a number you keep.",
      },
      {
        q: "Will promo SMS come to my personal phone?",
        a: "No — that’s half the point. Marketing texts chase the number on the account, and that number lives in the SMS Code app, not in your pocket. You can also trim notifications in Shopee’s settings.",
      },
      {
        q: "Can I open a Shopee seller account this way?",
        a: "The SMS step works the same, but seller onboarding adds identity and banking verification that a phone number doesn’t replace. Expect to provide real documents if you want to sell and withdraw money.",
      },
      {
        q: "Why didn’t the Shopee code arrive?",
        a: "Most often the number’s country doesn’t match the Shopee market, or the country code was mistyped. If the SMS genuinely never comes, cancel the activation in SMS Code free of charge and take another number.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Shopee — подтверждение без своей SIM",
    metaDescription:
      "SMS-код Shopee на настоящий виртуальный номер за секунды. Покупайте, не подключая личный телефон к рекламным рассылкам, — и честно о том, как устроены аккаунты Shopee.",
    hero: {
      title: "Виртуальный номер для Shopee",
      intro: [
        "Shopee завязан на телефон сильнее западных маркетплейсов: в Юго-Восточной Азии и Бразилии номер — это, по сути, и есть аккаунт. Регистрация начинается с телефона, OTP вида «382916 is your Shopee verification code» его подтверждает, и дальше этот номер — ваш логин, путь восстановления и адрес для нескончаемых SMS о распродажах.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 50+ стран, и код приходит в приложение за считанные секунды. Аккаунт подтверждён — а рекламная канонада целится куда-то ещё, а не в телефон, который будит вас по ночам.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Shopee?",
      body: [
        "Маркетплейсы — одни из самых «шумных» сервисов, какие только может встретить номер телефона. Статусы заказов полезны; ваучеры, обратные отсчёты и залпы «распродажа 9.9» — нет. А попав в торговую базу данных, личный номер обычно остаётся там навсегда — вместе со всеми партнёрскими списками и утечками. Отдельный номер для покупок держит охоту за скидками подальше от номера, по которому вам звонит семья.",
        "Честная обратная сторона: именно потому, что Shopee строится вокруг телефона, номер здесь значит больше, чем в сервисах с якорем-почтой. Это не просто контрольная точка — это логин. Виртуальный номер это не отменяет, но меняет то, как им пользоваться: подтвердитесь им, а сразу после — привяжите почту и задайте пароль в настройках аккаунта, чтобы вход никогда не упирался в новый OTP на номер, арендованный на один вечер.",
      ],
    },
    howTo: {
      title: "Как подтвердить Shopee виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Выберите сервис Shopee и страну того рынка Shopee, где вы покупаете: индонезийское приложение ждёт индонезийский номер, тайское — тайский. Одно касание — и настоящий мобильный номер зарезервирован.",
        },
        {
          title: "Начните регистрацию с этого номера",
          body: "Введите номер на экране регистрации Shopee с правильным кодом страны. OTP уходит сразу — это самый чувствительный ко времени шаг, так что держите оба приложения открытыми.",
        },
        {
          title: "Введите код",
          body: "SMS выглядит так: «382916 is your Shopee verification code» — и появляется в SMS Code за секунды. Введите код, и аккаунт создан.",
        },
        {
          title: "Дайте аккаунту второй якорь",
          body: "Сразу после регистрации откройте настройки аккаунта, привяжите почту и задайте пароль для входа. Тогда вы сможете входить по логину и паролю, а не по свежему OTP, — и арендованный номер перестанет быть единственным ключом.",
        },
      ],
    },
    tips: [
      {
        title: "Подбирайте номер под рынок",
        body: "У Shopee отдельные приложения и сайты по странам, и каждое ждёт местный номер. Вьетнамским номером аккаунт на Shopee Indonesia не завести. Сначала решите, на каком рынке вы покупаете, потом арендуйте соответствующий номер.",
      },
      {
        title: "Номер — это логин, учитывайте это",
        body: "Там, где сервисы с почтой считают телефон контрольной точкой, Shopee может снова попросить SMS при сбросе пароля или входе с нового устройства. Держите пароль заданным, не выходите из аккаунта на своём устройстве, а магазин «на годы» заводите на номер, который останется у вас.",
      },
      {
        title: "Продажи — отдельная история",
        body: "Открытие магазина включает верификацию продавца: в большинстве стран это документы и банковские реквизиты. Виртуальный номер закрывает SMS-шаг покупательского аккаунта — но не подменяет проверки, которые Shopee проводит для тех, кто принимает платежи.",
      },
    ],
    faqs: [
      {
        q: "Можно ли зарегистрироваться в Shopee с виртуальным номером?",
        a: "Да — это настоящий мобильный номер в реальной сети оператора, и Shopee подтверждает его обычным OTP. Выбирайте страну того рынка Shopee, где регистрируетесь: каждый рынок ждёт местные номера.",
      },
      {
        q: "Что будет с аккаунтом Shopee, когда аренда номера закончится?",
        a: "Аккаунт работает, пока вы можете войти. Поскольку Shopee завязан на телефон, задайте пароль и привяжите почту сразу после регистрации — тогда повседневный вход обходится без OTP. А аккаунт «на годы» лучше со временем перевести на номер, который останется у вас.",
      },
      {
        q: "Придут ли рекламные SMS на мой личный телефон?",
        a: "Нет — в этом половина смысла. Маркетинговые сообщения гонятся за номером в аккаунте, а он живёт в приложении SMS Code, а не у вас в кармане. Уведомления можно дополнительно подрезать в настройках Shopee.",
      },
      {
        q: "Можно ли так открыть аккаунт продавца Shopee?",
        a: "SMS-шаг устроен так же, но онбординг продавца добавляет проверку личности и банковских данных, которую номер телефона не заменяет. Если хотите продавать и выводить деньги — готовьте настоящие документы.",
      },
      {
        q: "Почему не пришёл код Shopee?",
        a: "Чаще всего страна номера не совпадает с рынком Shopee или код страны введён с ошибкой. Если SMS действительно не приходит, отмените активацию в SMS Code бесплатно и возьмите другой номер.",
      },
    ],
  },
};
