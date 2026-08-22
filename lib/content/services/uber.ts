import type { ServiceEntry } from "./types";

export const uber: ServiceEntry = {
  slug: "uber",
  name: "Uber",
  logo: "/services/uber.svg",
  category: "travel",
  relatedSlugs: ["grab", "airbnb", "aliexpress", "google", "paypal"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "france",
    "brazil",
    "india",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Uber",
    message: "Your Uber code is 7204. Never share this code.",
    code: "7204",
  },
  en: {
    metaTitle: "Virtual Number for Uber — Sign Up and Ride Privately",
    metaDescription:
      "Uber logs you in with an SMS code. Rent a real virtual number, get the four-digit code usually within seconds and keep your personal phone out of your ride history.",
    hero: {
      title: "A virtual number for Uber",
      intro: [
        "Uber doesn’t treat the phone number as a detail — it is the account. You type a number, Uber texts “Your Uber code is 7204. Never share this code.”, and that’s the whole login: no username, and for many riders no password either. Whoever receives codes on that number effectively holds the account.",
        "With SMS Code you rent a real mobile number in one of 100+ countries and Uber’s code shows up in the app usually within seconds. Your rides, receipts and pickup history get tied to a rented number instead of the one your friends and your bank use.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Uber?",
      body: [
        "A ride-hailing account quietly accumulates a map of your life — home, work, the airport at 6 a.m. Keeping your personal number off that record is plain privacy hygiene. Drivers already reach you through Uber’s masked relay and never see the real number; the copy that matters is the one stored in your account, and that’s exactly the one a virtual number replaces.",
        "Because Uber signs you in by SMS, the number here isn’t a one-time prop — be honest with yourself about that. The app keeps you logged in for months, but a fresh install or a new phone will ask for a code again. The setup works fine with a rented number as long as you plan for it: stay signed in, add an email to the account, and if Uber becomes a daily tool, move the account to a number you’ll always control.",
      ],
    },
    howTo: {
      title: "How to verify Uber with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Choose Uber as the service and pick a country. For everyday use take your own country — the account’s region shapes payment options and local features.",
        },
        {
          title: "Enter it in the Uber app",
          body: "On the sign-up screen select the number’s country code and type it in. Uber may offer to send the code by WhatsApp or a voice call — pick SMS.",
        },
        {
          title: "Type in the four digits",
          body: "“Your Uber code is 7204. Never share this code.” arrives in the SMS Code app usually within seconds. Enter it and you’re signed in.",
        },
        {
          title: "Give the account a second channel",
          body: "Add your email in Uber’s settings and finish the profile. The email gives Uber a way to verify you that doesn’t depend on the rented number — and keeps receipts somewhere you’ll actually read them.",
        },
      ],
    },
    tips: [
      {
        title: "Uber will ask for SMS again — plan for it",
        body: "Logins on new devices and reinstalls are confirmed by a code to the account’s number. Don’t log out casually, add an email, and if you use Uber every week, change the account’s phone in settings to one you carry — you can do that anytime while signed in.",
      },
      {
        title: "Drivers never see your number anyway",
        body: "Calls and messages between you and the driver go through Uber’s masked relay. The privacy question isn’t the driver — it’s the number sitting in your account record, your receipts and whatever that database feeds. That’s the copy a virtual number keeps clean.",
      },
      {
        title: "Abroad, your account already travels",
        body: "An existing Uber account works in other countries — you don’t need a local number to hail a ride in Paris. Where a virtual number genuinely helps: your home SIM can’t receive roaming texts when a login check hits mid-trip, or you want a separate local account for a long stay.",
      },
    ],
    faqs: [
      {
        q: "Will my Uber account keep working after the rented number expires?",
        a: "While you stay signed in — yes, everything works. The catch is the next fresh login: Uber confirms it with an SMS to the account’s number. So either keep the session alive, or — better — change the phone in account settings to one you control while you’re still logged in. That option is always available from inside the app.",
      },
      {
        q: "Do drivers see my real phone number?",
        a: "No. Uber connects you and the driver through masked relay numbers, so neither side sees the other’s real one. A virtual number protects the other copy — the one stored in your account profile and attached to every receipt.",
      },
      {
        q: "Can I use a virtual number for Uber while traveling?",
        a: "Yes, and it solves a real travel problem: login checks that arrive as SMS your roaming SIM can’t receive. Codes to a rented number land in the SMS Code app over the internet, wherever you are. Note that you don’t need a local number just to ride abroad — your normal account works internationally.",
      },
      {
        q: "Why didn’t the Uber code arrive?",
        a: "First check that the country code matches the rented number. Then make sure the code is coming by SMS — Uber sometimes defaults to WhatsApp or a voice call. If nothing arrived, cancel the activation in SMS Code at no cost and take another number.",
      },
      {
        q: "Is signing up for Uber with a virtual number allowed?",
        a: "Uber verifies that you control the number and expects one account per rider with truthful details — that’s its terms, and safety features depend on it. Using a rented number to keep your personal one private is fine; using numbers to farm sign-up promos or run duplicate accounts is what gets riders banned.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Uber — поездки без личного номера",
    metaDescription:
      "Uber впускает вас по коду из SMS. Арендуйте настоящий виртуальный номер, получите четырёхзначный код обычно за секунды — и не отдавайте личный телефон истории поездок.",
    hero: {
      title: "Виртуальный номер для Uber",
      intro: [
        "Для Uber номер телефона — не деталь, а сам аккаунт. Вы вводите номер, Uber присылает «Your Uber code is 7204. Never share this code.» — и это весь вход: без логина, а у многих пассажиров и без пароля. Кто получает коды на этот номер, тот фактически и владеет аккаунтом.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 100+ стран, и код Uber появляется в приложении обычно за считанные секунды. Ваши поездки, чеки и адреса посадки привязываются к арендованному номеру, а не к тому, которым пользуются ваши друзья и ваш банк.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Uber?",
      body: [
        "Аккаунт такси незаметно собирает карту вашей жизни: дом, работа, аэропорт в шесть утра. Держать личный номер подальше от этой записи — обычная гигиена приватности. С водителями вы и так связываетесь через маскирующий релей Uber, настоящий номер они не видят; важна та копия, что хранится в аккаунте, — и именно её заменяет виртуальный номер.",
        "Поскольку Uber впускает по SMS, номер здесь — не разовый реквизит, и честнее признать это сразу. Приложение держит сессию месяцами, но переустановка или новый телефон снова попросят код. С арендованным номером схема прекрасно работает, если её спланировать: не выходите из аккаунта, добавьте почту, а если Uber станет ежедневным инструментом — переведите аккаунт на номер, который всегда будет при вас.",
      ],
    },
    howTo: {
      title: "Как подтвердить Uber виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Выберите сервис Uber и страну. Для повседневного использования берите свою: регион аккаунта влияет на способы оплаты и локальные функции.",
        },
        {
          title: "Введите его в приложении Uber",
          body: "На экране регистрации выберите код страны номера и введите его. Uber может предложить прислать код в WhatsApp или голосовым звонком — выбирайте SMS.",
        },
        {
          title: "Введите четыре цифры",
          body: "«Your Uber code is 7204. Never share this code.» приходит в приложение SMS Code обычно за секунды. Введите код — и вы в аккаунте.",
        },
        {
          title: "Дайте аккаунту второй канал",
          body: "Добавьте почту в настройках Uber и заполните профиль. Почта даёт Uber способ подтвердить вас, не зависящий от арендованного номера, а чеки будут приходить туда, где вы их действительно читаете.",
        },
      ],
    },
    tips: [
      {
        title: "Uber ещё попросит SMS — спланируйте это",
        body: "Входы с новых устройств и после переустановки подтверждаются кодом на номер аккаунта. Не выходите из аккаунта без нужды, добавьте почту, а если ездите каждую неделю — смените телефон аккаунта в настройках на тот, что носите с собой: это можно сделать в любой момент, пока вы в системе.",
      },
      {
        title: "Водители всё равно не видят ваш номер",
        body: "Звонки и сообщения между вами и водителем идут через маскирующий релей Uber. Вопрос приватности не в водителе, а в номере, который лежит в записи аккаунта, в чеках и во всём, что питается этой базой. Именно эту копию виртуальный номер и оставляет чистой.",
      },
      {
        title: "За границей ваш аккаунт и так работает",
        body: "Существующий аккаунт Uber действует в других странах — локальный номер не нужен, чтобы поймать машину в Париже. Где виртуальный номер помогает по-настоящему: когда домашняя SIM в роуминге не принимает SMS, а проверка входа настигла посреди поездки, — или когда на долгое пребывание нужен отдельный локальный аккаунт.",
      },
    ],
    faqs: [
      {
        q: "Аккаунт Uber продолжит работать после окончания аренды номера?",
        a: "Пока вы в системе — да, всё работает. Подвох в следующем «свежем» входе: Uber подтверждает его SMS на номер аккаунта. Поэтому либо берегите сессию, либо — лучше — смените телефон в настройках аккаунта на свой, пока вы ещё в системе. Эта возможность всегда доступна прямо из приложения.",
      },
      {
        q: "Видит ли водитель мой настоящий номер?",
        a: "Нет. Uber соединяет вас с водителем через маскирующие номера-посредники, так что настоящих номеров не видит ни одна сторона. Виртуальный номер защищает другую копию — ту, что хранится в профиле аккаунта и прикреплена к каждому чеку.",
      },
      {
        q: "Можно ли пользоваться виртуальным номером для Uber в путешествии?",
        a: "Да, и это решает реальную дорожную проблему: проверки входа приходят по SMS, которые роуминговая SIM может не принять. Коды на арендованный номер попадают в приложение SMS Code через интернет, где бы вы ни были. Учтите: локальный номер не нужен просто чтобы ездить за границей — обычный аккаунт работает по всему миру.",
      },
      {
        q: "Почему не пришёл код Uber?",
        a: "Сначала проверьте, совпадает ли код страны с арендованным номером. Затем убедитесь, что код идёт именно по SMS: Uber иногда по умолчанию выбирает WhatsApp или звонок. Если ничего не пришло, отмените активацию в SMS Code бесплатно и возьмите другой номер.",
      },
      {
        q: "Разрешено ли регистрироваться в Uber с виртуальным номером?",
        a: "Uber проверяет, что номер под вашим контролем, и ожидает один аккаунт на пассажира с достоверными данными — таковы его правила, на них держатся функции безопасности. Арендовать номер, чтобы сохранить личный в тайне, — нормально; собирать промокоды на номера и плодить дубли аккаунтов — то, за что пассажиров банят.",
      },
    ],
  },
};
