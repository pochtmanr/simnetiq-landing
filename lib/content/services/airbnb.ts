import type { ServiceEntry } from "./types";

export const airbnb: ServiceEntry = {
  slug: "airbnb",
  name: "Airbnb",
  logo: "/services/airbnb.svg",
  category: "travel",
  relatedSlugs: ["uber", "grab", "paypal", "google", "apple"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "france",
    "spain",
    "italy",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Airbnb",
    message: "Your Airbnb verification code is: 517203.",
    code: "517203",
  },
  en: {
    metaTitle: "Virtual Number for Airbnb — Book Stays, Keep Your Number",
    metaDescription:
      "Verify your Airbnb account with a real virtual number. The SMS code arrives in the SMS Activate app in seconds — book stays without sharing your personal number.",
    hero: {
      title: "A virtual number for Airbnb",
      intro: [
        "Airbnb runs on trust between strangers, and a verified phone number is one of the first bricks in that wall. Before you can book a stay — and often before a host will even reply to a request — Airbnb wants to confirm you're reachable, and it does that with an SMS code sent to the number on your account.",
        "With SMS Activate you rent a real mobile number in one of 50+ countries, enter it during Airbnb sign-up, and the six-digit code appears in the SMS Activate app within seconds. You get a verified account; your personal number stays your own.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Airbnb?",
      body: [
        "Here's the odd part: once a booking is confirmed, you barely use your phone number on Airbnb at all. Guests and hosts message through the app, and even calls go through Airbnb's masked relay numbers precisely so that neither side sees the other's real contact details. Yet sign-up still demands a number that can receive an SMS — the verification exists for the platform, not for the person on the other end of your booking.",
        "That makes a virtual number a natural fit for travelers who care about privacy. Your account is verified and books stays like any other, but the number attached to your profile isn't the one that follows you through your daily life — it can't end up in a host's contact list, a marketing database, or anywhere else you didn't plan for.",
      ],
    },
    howTo: {
      title: "How to verify Airbnb with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Activate",
          body: "Open the SMS Activate app, select Airbnb as the service and pick a country — many travelers choose the country they actually book from, like the US, France or Spain. The number is reserved for you instantly.",
        },
        {
          title: "Add it during Airbnb sign-up",
          body: "Create your Airbnb account (email or social login both work) and enter the rented number when Airbnb asks to verify your phone. Make sure the country code you select matches the number's country.",
        },
        {
          title: "Type in the SMS code",
          body: "The text lands in the SMS Activate app in seconds — “Your Airbnb verification code is: 517203.” Enter it on Airbnb's verification screen and your phone is confirmed.",
        },
        {
          title: "Finish your profile",
          body: "Add a photo, confirm your email and complete any identity steps Airbnb asks for. A filled-out profile matters on Airbnb — hosts accept requests from complete profiles far more readily than from blank ones.",
        },
      ],
    },
    tips: [
      {
        title: "Book with the account you verified",
        body: "Airbnb links your phone verification to the account, not the device. Do the verification on the same account you'll actually book with, and keep the login session alive — day-to-day you'll sign in with email or social login, not SMS.",
      },
      {
        title: "Messages stay inside the app",
        body: "Hosts contact you through Airbnb's own messaging, and phone calls are routed through masked relay numbers. Turn on push notifications in the Airbnb app so you never depend on SMS to hear back about a booking.",
      },
      {
        title: "Identity checks are separate",
        body: "For some bookings Airbnb also asks to verify a government ID. That's an independent step from phone verification — a virtual number doesn't affect it either way, and the ID must genuinely be yours. Airbnb accounts are personal and non-transferable under its terms.",
      },
    ],
    faqs: [
      {
        q: "Will hosts see the virtual number I verified with?",
        a: "No. Hosts and guests communicate through Airbnb's messaging, and calls go through masked relay numbers on both sides. The number on your account is for Airbnb's verification, not something displayed to hosts.",
      },
      {
        q: "Can I still book stays normally after verifying with a virtual number?",
        a: "Yes. It's a real mobile number on a real carrier, and once the code is confirmed your account is verified like any other. Booking, messaging and reviews all work the same.",
      },
      {
        q: "What happens when the rented number's activation window ends?",
        a: "Your account keeps working — the number is checked at verification, not continuously. Stay logged in and keep your email confirmed, since email is your everyday way back into the account. If Airbnb ever asks to re-verify the phone, you can update the number on file to a fresh one.",
      },
      {
        q: "Why didn't my Airbnb code arrive?",
        a: "The usual suspects: the country code chosen on Airbnb doesn't match the rented number, or the request timed out. Cancel the activation in SMS Activate — numbers that received nothing are never charged — and try again with a new number, double-checking the country.",
      },
      {
        q: "Is verifying Airbnb with a virtual number allowed?",
        a: "Airbnb's check confirms you control a working number; renting one for that purpose is fine for normal personal use. What Airbnb does insist on is that the account represents the real you — use your real name, your own ID when asked, and one account per person.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Airbnb — бронируйте без личного номера",
    metaDescription:
      "Подтвердите аккаунт Airbnb настоящим виртуальным номером. SMS с кодом придёт в приложение SMS Activate за секунды — бронируйте жильё, не раскрывая свой номер.",
    hero: {
      title: "Виртуальный номер для Airbnb",
      intro: [
        "Airbnb держится на доверии между незнакомыми людьми, и подтверждённый номер телефона — один из первых кирпичей в этой стене. Прежде чем вы забронируете жильё — а нередко и прежде чем хозяин вообще ответит на запрос, — Airbnb хочет убедиться, что с вами можно связаться, и делает это через SMS-код на номер в аккаунте.",
        "С SMS Activate вы арендуете настоящий мобильный номер в одной из 50+ стран, вводите его при регистрации на Airbnb — и шестизначный код появляется в приложении SMS Activate за секунды. Аккаунт подтверждён, а личный номер остаётся при вас.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Airbnb?",
      body: [
        "Вот что любопытно: после подтверждения брони номер телефона на Airbnb почти не нужен. Гости и хозяева переписываются внутри приложения, а звонки идут через маскирующие подменные номера Airbnb — как раз для того, чтобы ни одна сторона не видела настоящих контактов другой. При этом регистрация всё равно требует номер, способный принять SMS: проверка нужна платформе, а не человеку по ту сторону вашей брони.",
        "Поэтому виртуальный номер — естественный выбор для путешественника, которому небезразлична приватность. Аккаунт подтверждён и бронирует жильё как любой другой, но номер в профиле — не тот, что сопровождает вас в повседневной жизни: он не осядет в контактах хозяина, в маркетинговой базе или ещё где-нибудь, где вы его не ждали.",
      ],
    },
    howTo: {
      title: "Как подтвердить Airbnb виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Activate",
          body: "Откройте приложение SMS Activate, выберите сервис Airbnb и страну — многие берут ту, откуда реально бронируют: США, Францию, Испанию. Номер резервируется за вами мгновенно.",
        },
        {
          title: "Укажите его при регистрации на Airbnb",
          body: "Создайте аккаунт Airbnb (подойдёт почта или вход через соцсети) и введите арендованный номер, когда Airbnb попросит подтвердить телефон. Проследите, чтобы код страны совпадал со страной номера.",
        },
        {
          title: "Введите код из SMS",
          body: "Сообщение придёт в приложение SMS Activate за секунды: «Your Airbnb verification code is: 517203.» Введите его на экране подтверждения Airbnb — телефон подтверждён.",
        },
        {
          title: "Доведите профиль до конца",
          body: "Добавьте фото, подтвердите почту и пройдите проверки личности, если Airbnb их запросит. Заполненный профиль на Airbnb решает: хозяева принимают запросы от живых профилей куда охотнее, чем от пустых.",
        },
      ],
    },
    tips: [
      {
        title: "Бронируйте с того же аккаунта",
        body: "Подтверждение телефона Airbnb привязывает к аккаунту, а не к устройству. Проходите проверку на том аккаунте, с которого будете бронировать, и не выходите из него — в повседневной жизни вы входите по почте или через соцсети, а не по SMS.",
      },
      {
        title: "Вся переписка — внутри приложения",
        body: "Хозяева связываются с вами через встроенные сообщения Airbnb, а звонки идут через подменные номера с обеих сторон. Включите push-уведомления в приложении Airbnb — тогда ответ по брони никогда не будет зависеть от SMS.",
      },
      {
        title: "Проверка документов — отдельная история",
        body: "Для некоторых броней Airbnb дополнительно просит подтвердить личность документом. Это независимый от телефона шаг: виртуальный номер на него никак не влияет, а документ должен быть действительно вашим. По правилам Airbnb аккаунт персональный и передаче не подлежит.",
      },
    ],
    faqs: [
      {
        q: "Увидит ли хозяин виртуальный номер, которым я подтверждался?",
        a: "Нет. Гости и хозяева общаются через сообщения Airbnb, а звонки с обеих сторон идут через маскирующие подменные номера. Номер в аккаунте нужен Airbnb для проверки — хозяевам он не показывается.",
      },
      {
        q: "Смогу ли я нормально бронировать после подтверждения виртуальным номером?",
        a: "Да. Это настоящий мобильный номер в сети реального оператора, и после ввода кода аккаунт считается подтверждённым, как любой другой. Бронирования, переписка и отзывы работают без отличий.",
      },
      {
        q: "Что будет, когда окно активации арендованного номера закончится?",
        a: "Аккаунт продолжит работать: номер проверяется в момент подтверждения, а не постоянно. Не выходите из аккаунта и держите почту подтверждённой — именно через неё вы входите каждый день. Если Airbnb когда-нибудь попросит подтвердить телефон заново, номер в профиле можно заменить на свежий.",
      },
      {
        q: "Почему не пришёл код Airbnb?",
        a: "Классические причины: код страны на Airbnb не совпадает с арендованным номером либо запрос просто истёк. Отмените активацию в SMS Activate — за номера без единой SMS деньги не списываются — и попробуйте с новым номером, внимательно сверив страну.",
      },
      {
        q: "Разрешено ли подтверждать Airbnb виртуальным номером?",
        a: "Проверка Airbnb подтверждает, что рабочий номер под вашим контролем; аренда номера для этого — нормальная практика личного использования. На чём Airbnb настаивает всерьёз — аккаунт должен представлять именно вас: настоящее имя, собственный документ по запросу и один аккаунт на человека.",
      },
    ],
  },
};
