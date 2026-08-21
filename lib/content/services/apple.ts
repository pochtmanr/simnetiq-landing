import type { ServiceEntry } from "./types";

export const apple: ServiceEntry = {
  slug: "apple",
  name: "Apple",
  logo: "/services/apple.svg",
  category: "other",
  relatedSlugs: ["google", "netflix", "paypal", "steam", "facebook"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "canada",
    "netherlands",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Apple",
    message: "Your Apple Account code is: 617402. Don't share it with anyone.",
    code: "617402",
  },
  en: {
    metaTitle: "Virtual Number for Apple — Apple Account Without Your SIM",
    metaDescription:
      "Verify a new Apple Account with a real virtual number. The code arrives in seconds — create the account, then move two-factor codes onto devices you control.",
    hero: {
      title: "A virtual number for Apple",
      intro: [
        "A new Apple Account can’t be finished without a phone: during sign-up Apple asks for a number, texts a six-digit code to prove you control it, and then keeps that number as a “trusted phone number” — the channel it will use for two-factor authentication from that day on.",
        "With SMS Code you rent a real mobile number in one of 150+ countries, receive Apple’s code in the app within seconds and complete the sign-up. Your personal number stays out of the account — and you decide later which trusted numbers and devices the account should rely on.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Apple?",
      body: [
        "An Apple Account reaches further than most sign-ups: it’s the key to the App Store, iCloud, iMessage and every Apple device you own. Sign in with a number on an iPhone and people who have that number saved can find you on iMessage and FaceTime. If the account is meant to be separate — for a test device, a different App Store region, a work profile — verifying it with your personal SIM stitches your identity right back into it.",
        "Apple also turns two-factor authentication on for every new account and requires at least one trusted phone number. A virtual number satisfies the sign-up cleanly; what matters is what you do next. Once you’re signed in on an Apple device, verification codes appear on that device without any SMS — and alongside (or instead of) the rented number you can add a trusted number that is genuinely yours.",
      ],
    },
    howTo: {
      title: "How to verify an Apple Account with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Choose Apple as the service, pick a country and tap once to reserve a real mobile number. If the account is meant for a specific App Store region, take a number from that country — it keeps the account’s details consistent.",
        },
        {
          title: "Enter it during Apple’s sign-up",
          body: "Create the account at account.apple.com or straight from an iPhone’s setup screen. When Apple asks for a phone number, choose verification by text message and type the rented number with the right country selected.",
        },
        {
          title: "Type in the code",
          body: "The SMS reads “Your Apple Account code is: 617402. Don't share it with anyone.” and lands in the SMS Code app within seconds. Enter the six digits and the account is verified.",
        },
        {
          title: "Add trusted factors you control",
          body: "Sign in on an Apple device you own — from then on two-factor codes appear right on that device, no SMS needed. Then open the account’s Sign-In and Security settings and add a second trusted phone number that actually belongs to you.",
        },
      ],
    },
    tips: [
      {
        title: "Trusted devices beat trusted numbers",
        body: "Once you’re signed in on an iPhone, iPad or Mac, Apple shows two-factor codes directly on the device — SMS becomes the fallback, not the main channel. Keep at least one trusted device signed in and the rented number stays what it should be: a one-time sign-up tool.",
      },
      {
        title: "Apple keeps the number as a 2FA anchor",
        body: "Every two-factor Apple Account must keep at least one trusted phone number on file. Don’t let the rented number remain the only one: add a number you control first, then remove the rented one under Sign-In and Security.",
      },
      {
        title: "Match the country to the account’s region",
        body: "The number alone doesn’t set your App Store region — that follows the account’s country settings and payment method. But a number from the same country keeps the details consistent, so pick one from wherever the account is meant to live.",
      },
    ],
    faqs: [
      {
        q: "Does Apple require a phone number to create an Apple Account?",
        a: "Yes — sign-up asks for a number it can text or call, and new accounts get two-factor authentication with that number saved as trusted. A virtual number passes this step exactly like a SIM: the code arrives in the SMS Code app and the account gets created.",
      },
      {
        q: "Will the account keep working after the rented number expires?",
        a: "Yes. The number is checked when Apple texts the code; after that the account lives on your trusted devices. Do step four early — sign in on a device you own and add a trusted number you control — and nothing about the account depends on the rented number anymore.",
      },
      {
        q: "Can I change the trusted phone number later?",
        a: "Yes, under Sign-In and Security on account.apple.com or in your device settings. Apple insists that a two-factor account keeps at least one trusted number, so add the new one first, then remove the rented one.",
      },
      {
        q: "Can I create an Apple Account for another country’s App Store?",
        a: "You can pick a number from any of 150+ countries, and matching it to the account’s region keeps things tidy. Just know that the storefront follows the account’s country and payment settings, not the phone — the number verifies you, it doesn’t relocate the store.",
      },
      {
        q: "Why didn’t my Apple code arrive?",
        a: "Most often the country selected on Apple’s form doesn’t match the number, or the flow switched to a phone call — pick “text message” explicitly. Cancel the pending activation in SMS Code (numbers that received nothing are free) and try a fresh one.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Apple — аккаунт без вашей SIM",
    metaDescription:
      "Подтвердите новый Apple Account настоящим виртуальным номером: код придёт за секунды. Создайте аккаунт и перенесите коды 2FA на устройства под вашим контролем.",
    hero: {
      title: "Виртуальный номер для Apple",
      intro: [
        "Новый Apple Account не создать без телефона: при регистрации Apple просит номер, отправляет на него шестизначный код, чтобы убедиться, что номер под вашим контролем, — и с этого момента хранит его как «доверенный номер телефона», канал двухфакторной аутентификации.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 150+ стран, получаете код Apple в приложении за считанные секунды и завершаете регистрацию. Личный номер в аккаунт не попадает — а какими доверенными номерами и устройствами аккаунт будет жить дальше, решаете вы.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Apple?",
      body: [
        "Apple Account тянется дальше, чем обычная регистрация: это ключ к App Store, iCloud, iMessage и каждому вашему устройству Apple. Войдите с номером на iPhone — и все, у кого этот номер записан, смогут найти вас в iMessage и FaceTime. Если аккаунт задуман именно отдельным — для тестового устройства, другого региона App Store, рабочего профиля, — подтверждение личной SIM-картой сразу вшивает в него вашу личность.",
        "К тому же Apple включает двухфакторную аутентификацию каждому новому аккаунту и требует хотя бы один доверенный номер. Виртуальный номер честно закрывает саму регистрацию; важно, что вы сделаете дальше. Как только вы вошли на устройстве Apple, коды подтверждения появляются прямо на нём — без всяких SMS, — а рядом с арендованным номером (или вместо него) можно добавить доверенный номер, который действительно ваш.",
      ],
    },
    howTo: {
      title: "Как подтвердить Apple Account виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Выберите сервис Apple, страну — и одним касанием зарезервируйте настоящий мобильный номер. Если аккаунт нужен под конкретный регион App Store, берите номер той же страны: так данные аккаунта останутся согласованными.",
        },
        {
          title: "Введите его при регистрации Apple",
          body: "Создайте аккаунт на account.apple.com или прямо с экрана настройки iPhone. Когда Apple попросит номер телефона, выберите подтверждение текстовым сообщением и введите арендованный номер с правильно указанной страной.",
        },
        {
          title: "Введите код",
          body: "SMS выглядит так: «Your Apple Account code is: 617402. Don't share it with anyone.» — и приходит в приложение SMS Code за секунды. Введите шесть цифр, и аккаунт подтверждён.",
        },
        {
          title: "Добавьте доверенные факторы под вашим контролем",
          body: "Войдите на собственном устройстве Apple — с этого момента коды двухфакторной аутентификации появляются прямо на нём, без SMS. Затем откройте раздел «Вход и безопасность» и добавьте второй доверенный номер, который принадлежит именно вам.",
        },
      ],
    },
    tips: [
      {
        title: "Доверенное устройство важнее доверенного номера",
        body: "Как только вы вошли на iPhone, iPad или Mac, Apple показывает коды 2FA прямо на устройстве — SMS становится запасным каналом, а не основным. Держите хотя бы одно доверенное устройство в системе, и арендованный номер останется тем, чем должен быть: разовым инструментом регистрации.",
      },
      {
        title: "Apple хранит номер как якорь 2FA",
        body: "У каждого аккаунта с двухфакторной аутентификацией Apple должен оставаться хотя бы один доверенный номер. Не оставляйте арендованный номер единственным: сначала добавьте свой, а потом удалите арендованный в разделе «Вход и безопасность».",
      },
      {
        title: "Страна номера — под регион аккаунта",
        body: "Сам по себе номер регион App Store не задаёт: регион определяется страной аккаунта и способом оплаты. Но номер из той же страны избавляет от лишних нестыковок — берите его там, где аккаунт будет жить.",
      },
    ],
    faqs: [
      {
        q: "Apple требует номер телефона при создании аккаунта?",
        a: "Да — при регистрации Apple просит номер, на который может отправить SMS или позвонить, а новые аккаунты получают двухфакторную аутентификацию с этим номером в доверенных. Виртуальный номер проходит этот шаг так же, как SIM-карта: код приходит в приложение SMS Code, аккаунт создаётся.",
      },
      {
        q: "Аккаунт продолжит работать после окончания аренды номера?",
        a: "Да. Номер проверяется в момент отправки кода; дальше аккаунт живёт на ваших доверенных устройствах. Сделайте четвёртый шаг сразу — войдите на своём устройстве и добавьте доверенный номер под вашим контролем, — и от арендованного номера в аккаунте больше ничего не зависит.",
      },
      {
        q: "Можно ли потом поменять доверенный номер?",
        a: "Да — в разделе «Вход и безопасность» на account.apple.com или в настройках устройства. Apple требует, чтобы у аккаунта с 2FA оставался хотя бы один доверенный номер, поэтому сначала добавьте новый, а уже потом удаляйте арендованный.",
      },
      {
        q: "Можно ли создать Apple Account для App Store другой страны?",
        a: "Номер можно взять в любой из 150+ стран, и совпадение с регионом аккаунта делает картину аккуратнее. Но помните: витрина App Store определяется страной аккаунта и настройками оплаты, а не телефоном — номер подтверждает вас, а не переносит магазин.",
      },
      {
        q: "Почему не пришёл код Apple?",
        a: "Чаще всего страна в форме Apple не совпадает с номером, либо вместо SMS выбран звонок — укажите именно текстовое сообщение. Отмените ожидающую активацию в SMS Code (номера, на которые ничего не пришло, бесплатны) и возьмите свежий номер.",
      },
    ],
  },
};
