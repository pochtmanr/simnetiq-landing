import type { ServiceEntry } from "./types";

export const tinder: ServiceEntry = {
  slug: "tinder",
  name: "Tinder",
  logo: "/services/tinder.svg",
  category: "social",
  relatedSlugs: ["snapchat", "instagram", "whatsapp", "telegram", "facebook"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "spain",
    "france",
    "brazil",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Tinder",
    message: "Your Tinder code is 402318 dwEzWOx6XSV",
    code: "402318",
  },
  en: {
    metaTitle: "Virtual Number for Tinder — Sign Up Without Your Number",
    metaDescription:
      "Tinder won't start without a phone number. Verify it with a real virtual number from 150+ countries — the SMS code arrives in seconds, free cancel if nothing comes.",
    hero: {
      title: "A virtual number for Tinder",
      intro: [
        "There's no way around it: Tinder requires a phone number to create an account. The very first screen asks for one, sends an SMS code and won't show you a single profile until it's entered. Email, Apple or Google sign-in can be attached later — the number is what the account hangs on.",
        "With SMS Code you rent a real mobile number in one of 150+ countries, type it into Tinder, and the code appears in the app within seconds. You pay per activation from a one-time coin pack — no subscription — and if a number receives nothing, you cancel it without being charged.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Tinder?",
      body: [
        "Dating apps are, by design, where you talk to strangers — and your phone number is the one piece of contact data you can't take back once it's out. Tinder never shows your number to matches, but it still sits on the account: in the event of a breach, or simply as the thread that connects your dating profile to the rest of your digital life. A virtual number cuts that thread — the flirting happens in the app, and the number behind the profile isn't the one your family and bank use.",
        "It's also the honest way to start over. If you deleted an old profile and want a genuinely blank slate — new photos, new bio, none of the old history — Tinder remembers numbers, so signing up on the one you used before quietly ties you back to the past. A fresh number gives a fresh start. That's about accounts you closed yourself, not about slipping past a ban.",
      ],
    },
    howTo: {
      title: "How to verify Tinder with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose Tinder as the service, pick a country and tap once. A real mobile number is reserved just for you for the length of the activation.",
        },
        {
          title: "Enter it on Tinder's first screen",
          body: "Choose “Log in with phone number”, select the country code that matches the rented number and type it in. A country mismatch is the classic reason a code never turns up.",
        },
        {
          title: "Type in the code — digits only",
          body: "The SMS lands in the SMS Code app within seconds and looks like “Your Tinder code is 402318 dwEzWOx6XSV”. The trailing letters are a technical app hash — ignore them, the code is just the six digits.",
        },
        {
          title: "Attach a backup and stay signed in",
          body: "In Settings, connect an email address to the account. Tinder re-verifies by SMS more readily than most apps — a linked email plus an unbroken session is what keeps the account comfortably yours.",
        },
      ],
    },
    tips: [
      {
        title: "Treat logging out as a real decision",
        body: "Tinder is quick to ask for a fresh SMS when you sign in again on a new device or after a logout. While you stay logged in, it rarely bothers you. So don't log out casually — on Tinder, an active session is worth more than on almost any other app.",
      },
      {
        title: "The number's country doesn't move your matches",
        body: "Your card stack comes from where you actually are — GPS and your distance settings — not from the number's dialling code. A number from another country verifies the account just fine and has no effect on who you see or who sees you.",
      },
      {
        title: "A fresh number is for a fresh start",
        body: "If you deleted your old account, a new number is what makes the new profile genuinely new. If the old account was banned, a new number isn't a workaround — Tinder's rules on returning after a ban still apply, and the platform has more signals than the phone number alone.",
      },
    ],
    faqs: [
      {
        q: "Will my matches see my phone number?",
        a: "No, never. Tinder shows matches your name, photos and bio — the phone number stays invisible and all chat happens inside the app. The number's job is verification, and a virtual number does that job while keeping your real one out of the system entirely.",
      },
      {
        q: "Does the number's country change who I'm shown?",
        a: "No. Tinder builds your stack from your actual location, not your dialling code — a foreign number in Madrid still gets you Madrid. Pick whichever country's numbers are available and cheap; it's purely a verification detail.",
      },
      {
        q: "What happens to my account when the rented number expires?",
        a: "Nothing, as long as you stay signed in — the number was needed for the code, not for daily use. The honest caveat: Tinder sometimes asks for SMS re-verification at a new login, so link an email in Settings and don't log out without a reason.",
      },
      {
        q: "Can I create a Tinder account without any phone number?",
        a: "No. Phone verification is mandatory at sign-up — Apple, Google and email can supplement the account, but none of them replaces the SMS step. That's precisely the situation a rented number is for.",
      },
      {
        q: "Why didn't my Tinder code arrive?",
        a: "Most often the country code picked in Tinder doesn't match the number, or Tinder declined to text that particular number. Cancel the pending activation in SMS Code — numbers that received nothing are never charged — and take a fresh one, ideally from a different country.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Tinder — регистрация без своего номера",
    metaDescription:
      "Tinder не запустится без номера телефона. Подтвердите его настоящим виртуальным номером из 150+ стран — SMS с кодом за секунды, отмена без списания, если код не пришёл.",
    hero: {
      title: "Виртуальный номер для Tinder",
      intro: [
        "Обойти это не получится: для аккаунта Tinder номер телефона обязателен. Самый первый экран просит его, присылает SMS с кодом и не покажет ни одной анкеты, пока код не введён. Почту, Apple или Google можно привязать потом — держится аккаунт именно на номере.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 150+ стран, вводите его в Tinder — и код появляется в приложении за считанные секунды. Платите за активацию из разового пакета монет, без подписки, а если на номер ничего не пришло — отменяете его без списания.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Tinder?",
      body: [
        "Приложения для знакомств по определению устроены как разговоры с незнакомцами, а номер телефона — тот единственный контакт, который нельзя забрать обратно, если он утёк. Своим собеседникам Tinder номер не показывает, но на аккаунте он всё равно висит: на случай утечки — или просто как ниточка, связывающая анкету со всей остальной вашей цифровой жизнью. Виртуальный номер эту ниточку обрезает: флирт остаётся в приложении, а за анкетой стоит номер, которым не пользуются ни ваша семья, ни ваш банк.",
        "Это же — честный способ начать заново. Если вы удалили старую анкету и хотите по-настоящему чистый лист — новые фото, новое описание, ничего из прежней истории, — помните: Tinder запоминает номера, и регистрация на прежний тихо пришьёт вас к прошлому. Свежий номер даёт свежий старт. Речь об аккаунтах, которые вы закрыли сами, а не об обходе бана.",
      ],
    },
    howTo: {
      title: "Как подтвердить Tinder виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Tinder, страну — и нажмите один раз. Настоящий мобильный номер резервируется только за вами на время активации.",
        },
        {
          title: "Введите его на первом экране Tinder",
          body: "Выберите вход по номеру телефона, укажите код страны, совпадающий с арендованным номером, и введите его. Несовпадение страны — классическая причина, по которой код так и не приходит.",
        },
        {
          title: "Введите код — только цифры",
          body: "SMS придёт в приложение SMS Code за секунды и выглядит так: «Your Tinder code is 402318 dwEzWOx6XSV». Буквы в конце — технический хеш приложения, не обращайте внимания: код — это шесть цифр.",
        },
        {
          title: "Привяжите запасной вход и не выходите",
          body: "В настройках привяжите к аккаунту почту. Tinder запрашивает повторную SMS-проверку охотнее большинства приложений — привязанная почта плюс непрерывная сессия и делают аккаунт спокойно вашим.",
        },
      ],
    },
    tips: [
      {
        title: "Выход из аккаунта — это настоящее решение",
        body: "Tinder легко просит свежую SMS при новом входе — на другом устройстве или после выхода. Пока вы залогинены, он почти не беспокоит. Поэтому не выходите из аккаунта без причины: в Tinder живая сессия ценнее, чем почти в любом другом приложении.",
      },
      {
        title: "Страна номера не двигает вашу ленту",
        body: "Анкеты вам подбираются по тому, где вы находитесь на самом деле, — GPS и настройки расстояния, — а не по телефонному коду. Номер другой страны прекрасно подтверждает аккаунт и никак не влияет на то, кого видите вы и кто видит вас.",
      },
      {
        title: "Свежий номер — для свежего старта",
        body: "Если старый аккаунт вы удалили сами, новый номер делает новую анкету по-настоящему новой. Если же старый аккаунт забанили, новый номер — не лазейка: правила Tinder о возвращении после бана никуда не деваются, а сигналов у платформы больше, чем один только номер телефона.",
      },
    ],
    faqs: [
      {
        q: "Увидят ли мои собеседники мой номер телефона?",
        a: "Нет, никогда. Совпадениям Tinder показывает имя, фото и описание — номер остаётся невидимым, а вся переписка идёт внутри приложения. Задача номера — верификация, и виртуальный номер решает её, вообще не впуская ваш настоящий в систему.",
      },
      {
        q: "Влияет ли страна номера на то, кого мне показывают?",
        a: "Нет. Ленту Tinder собирает по вашему реальному местоположению, а не по телефонному коду: с иностранным номером в Мадриде вы всё равно увидите Мадрид. Берите номера той страны, где они доступны и недороги, — это чисто техническая деталь верификации.",
      },
      {
        q: "Что будет с аккаунтом, когда аренда номера закончится?",
        a: "Ничего — пока вы не выходите из аккаунта: номер был нужен для кода, а не для повседневной работы. Честная оговорка: при новом входе Tinder иногда просит повторную SMS-проверку, поэтому привяжите почту в настройках и не выходите из аккаунта без причины.",
      },
      {
        q: "Можно ли создать аккаунт Tinder вообще без телефона?",
        a: "Нет. Проверка по телефону при регистрации обязательна: Apple, Google и почта дополняют аккаунт, но шаг с SMS не заменяет ни один из них. Ровно для этой ситуации арендованный номер и существует.",
      },
      {
        q: "Почему не пришёл код Tinder?",
        a: "Чаще всего код страны в Tinder не совпадает с номером, либо Tinder отказался отправлять SMS на этот конкретный номер. Отмените ожидающую активацию в SMS Code — за номера, на которые ничего не пришло, деньги не списываются, — и возьмите свежий, лучше из другой страны.",
      },
    ],
  },
};
