import type { ServiceEntry } from "./types";

export const viber: ServiceEntry = {
  slug: "viber",
  name: "Viber",
  logo: "/services/viber.svg",
  category: "messaging",
  relatedSlugs: ["whatsapp", "telegram", "signal", "line", "wechat"],
  popularCountries: [
    "ukraine",
    "kazakhstan",
    "poland",
    "philippines",
    "germany",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Viber",
    message: "Your Viber code: 528114",
    code: "528114",
  },
  en: {
    metaTitle: "Virtual Number for Viber — Register Without a SIM Card",
    metaDescription:
      "Activate Viber with a real virtual number from 100+ countries. The code arrives in the app usually within seconds — pay per activation, no subscription, free cancel if no SMS.",
    hero: {
      title: "A virtual number for Viber",
      intro: [
        "Viber plays by the same rule as WhatsApp: your phone number is the account. It's what you register with, what your contacts see, and what every chat is anchored to. Across Eastern Europe, the Balkans and the Philippines it's simply where the family group chat lives — so sooner or later you need a number to join in.",
        "With SMS Code you rent a real mobile number in one of 100+ countries, enter it on Viber's activation screen, and the code appears in the app usually within seconds. You pay per activation from a one-time coin pack — no subscription — and a number that received nothing can be cancelled without charge.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Viber?",
      body: [
        "Because the number is the identity, everyone you chat with on Viber sees it — community members, marketplace sellers, the building's residents chat. Handing all of them the number your bank calls is a bigger concession than it looks. A virtual number keeps the account fully functional while the number on display isn't the one wired into the rest of your life.",
        "There's a regional angle too. Viber is often the messenger of one particular circle — relatives in Ukraine, business contacts in Manila, a neighbourhood group in Warsaw — and Viber ties one account to one number on one primary phone. A rented number lets you spin up a dedicated identity for that circle, without a second SIM and without merging it into the number you use everywhere else.",
      ],
    },
    howTo: {
      title: "How to activate Viber with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose Viber as the service, pick a country and tap once. A real mobile number is reserved just for you for the length of the activation.",
        },
        {
          title: "Enter it on Viber's activation screen",
          body: "Select the matching country and type the number exactly as issued. If Viber offers to verify by phone call instead, stick with SMS — that's what lands in the SMS Code app.",
        },
        {
          title: "Grab the code",
          body: "The SMS arrives usually within seconds, from sender “Viber”, formatted like “Your Viber code: 528114”. Type the digits into Viber and the account activates.",
        },
        {
          title: "Back up and settle in",
          body: "Set your name and photo, then create a chat backup in Settings → Account → Backup (Google Drive or iCloud). Viber asks for the number again only at re-activation — so a backup plus an unbroken session is all the insurance you need.",
        },
      ],
    },
    tips: [
      {
        title: "Don't reinstall on a whim",
        body: "Viber re-verifies the number whenever the app is reinstalled or moved to a new phone. While you stay logged in, the account just works — long after the activation window ends. Treat reinstalling as something you do deliberately, with a backup in place, not as a quick fix.",
      },
      {
        title: "Your phone is the primary device",
        body: "Viber on desktop and tablet only mirrors the account that lives on your phone — they're linked to it, not independent. Keep the phone app installed and signed in; if it goes, the linked devices go with it.",
      },
      {
        title: "Trim what strangers can see",
        body: "In Settings → Privacy you can hide your online status and photo from people outside your contacts. In public communities Viber already shows a nickname rather than a number — but tightening these switches is good hygiene on any account.",
      },
    ],
    faqs: [
      {
        q: "Will Viber keep working after the rented number expires?",
        a: "Yes. The number is checked at activation, not continuously. Stay signed in on your phone and everything works as normal; the number would only be needed again if you reinstall or switch devices — so make a backup and don't do that casually.",
      },
      {
        q: "Will my contacts see that the number is virtual?",
        a: "They'll see the number itself — that's how Viber works, same as WhatsApp — but it looks like any ordinary mobile number, because it is one. And that's the point: the number they see isn't your personal one.",
      },
      {
        q: "Can I run a second Viber account on the same phone?",
        a: "Not within Viber itself — the app supports one account per phone as the primary device. In practice a second account needs either a second device or the app-cloning feature some Android phones offer. Each account, wherever it lives, needs its own number.",
      },
      {
        q: "Why didn't my Viber code arrive?",
        a: "Check the basics first: the country selected in Viber has to match the rented number. If it does and the SMS still doesn't come, cancel the pending activation in SMS Code — the coins come back for numbers that received nothing — and take a fresh number. Choose SMS rather than a callback when Viber offers both.",
      },
      {
        q: "Is activating Viber with a rented number allowed?",
        a: "Viber verifies that you control the number at activation — which you do, for the duration of the rental. For ordinary personal use that's all there is to it; what matters afterwards is following Viber's own rules, which are about behaviour, not about whose name the number is in.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Viber — регистрация без SIM-карты",
    metaDescription:
      "Активируйте Viber настоящим виртуальным номером из 100+ стран. Код приходит в приложение обычно за секунды — оплата за активацию, без подписки, отмена с возвратом монет.",
    hero: {
      title: "Виртуальный номер для Viber",
      intro: [
        "Viber играет по тому же правилу, что и WhatsApp: номер телефона — это и есть аккаунт. На него вы регистрируетесь, его видят собеседники, к нему привязан каждый чат. В Восточной Европе, на Балканах и на Филиппинах именно здесь живёт семейный чат — так что рано или поздно номер понадобится, чтобы к нему присоединиться.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 100+ стран, вводите его на экране активации Viber — и код появляется в приложении обычно за считанные секунды. Платите за активацию из разового пакета монет, без подписки, а номер, на который ничего не пришло, отменяется с возвратом монет.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Viber?",
      body: [
        "Раз номер — это личность, его видят все, с кем вы переписываетесь в Viber: участники сообществ, продавцы с досок объявлений, домовой чат. Раздать им всем номер, на который звонит ваш банк, — уступка серьёзнее, чем кажется. Виртуальный номер оставляет аккаунт полностью рабочим, но на виду оказывается номер, не вплетённый в остальную вашу жизнь.",
        "Есть и региональный поворот. Viber часто оказывается мессенджером одного конкретного круга — родственники в Украине, деловые контакты в Маниле, соседский чат в Варшаве, — а один аккаунт Viber привязан к одному номеру на одном основном телефоне. Арендованный номер позволяет завести отдельную личность именно для этого круга — без второй SIM-карты и без смешивания с номером, которым вы пользуетесь везде.",
      ],
    },
    howTo: {
      title: "Как активировать Viber виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Viber, страну — и нажмите один раз. Настоящий мобильный номер резервируется только за вами на время активации.",
        },
        {
          title: "Введите его на экране активации Viber",
          body: "Выберите соответствующую страну и введите номер ровно так, как он выдан. Если Viber предложит подтверждение звонком — выбирайте SMS: именно она придёт в приложение SMS Code.",
        },
        {
          title: "Заберите код",
          body: "SMS придёт обычно за секунды, от отправителя «Viber», в формате «Your Viber code: 528114». Введите цифры в Viber — аккаунт активирован.",
        },
        {
          title: "Сделайте бэкап и обживайтесь",
          body: "Поставьте имя и фото, затем создайте резервную копию чатов: Настройки → Учётная запись → Резервное копирование (Google Диск или iCloud). Номер Viber запросит снова только при повторной активации — так что бэкап плюс непрерывная сессия и есть вся нужная страховка.",
        },
      ],
    },
    tips: [
      {
        title: "Не переустанавливайте приложение просто так",
        body: "Viber заново проверяет номер при каждой переустановке или переезде на новый телефон. Пока вы залогинены, аккаунт просто работает — и долго после окончания окна активации. Переустановка — осознанный шаг с готовым бэкапом, а не быстрый способ «полечить» приложение.",
      },
      {
        title: "Телефон — основное устройство",
        body: "Viber на компьютере и планшете лишь отражает аккаунт с вашего телефона: они привязаны к нему, а не самостоятельны. Держите приложение на телефоне установленным и залогиненным; исчезнет оно — отвалятся и привязанные устройства.",
      },
      {
        title: "Урежьте то, что видят посторонние",
        body: "В Настройки → Конфиденциальность можно скрыть статус «в сети» и фото от людей вне ваших контактов. В публичных сообществах Viber и так показывает псевдоним вместо номера — но подтянуть эти переключатели полезно на любом аккаунте.",
      },
    ],
    faqs: [
      {
        q: "Viber продолжит работать после окончания аренды номера?",
        a: "Да. Номер проверяется при активации, а не постоянно. Оставайтесь залогинены на телефоне — и всё работает как обычно; номер понадобился бы снова только при переустановке или смене устройства, поэтому сделайте бэкап и не делайте этого без нужды.",
      },
      {
        q: "Увидят ли контакты, что номер виртуальный?",
        a: "Сам номер они увидят — так устроен Viber, как и WhatsApp, — но выглядит он как самый обычный мобильный, потому что им и является. В этом и смысл: номер, который видят собеседники, — не ваш личный.",
      },
      {
        q: "Можно ли завести второй аккаунт Viber на том же телефоне?",
        a: "Внутри самого Viber — нет: приложение поддерживает один аккаунт на телефон как основное устройство. На практике второй аккаунт живёт либо на втором устройстве, либо через клонирование приложений, которое умеют некоторые Android-телефоны. И каждому аккаунту, где бы он ни жил, нужен свой номер.",
      },
      {
        q: "Почему не пришёл код Viber?",
        a: "Сначала проверьте очевидное: страна, выбранная в Viber, должна совпадать с арендованным номером. Если совпадает, а SMS всё нет — отмените ожидающую активацию в SMS Code (монеты за номера, на которые ничего не пришло, возвращаются на баланс) и возьмите новый номер. Когда Viber предлагает на выбор SMS или звонок — выбирайте SMS.",
      },
      {
        q: "Разрешено ли активировать Viber арендованным номером?",
        a: "Viber проверяет, что номер под вашим контролем в момент активации, — а на время аренды так и есть. Для обычного личного использования этим всё и исчерпывается; дальше важно соблюдать правила самого Viber, а они про поведение, а не про то, на чьё имя оформлен номер.",
      },
    ],
  },
};
