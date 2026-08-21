import type { ServiceEntry } from "./types";

export const line: ServiceEntry = {
  slug: "line",
  name: "LINE",
  logo: "/services/line.svg",
  category: "messaging",
  relatedSlugs: ["wechat", "viber", "whatsapp", "telegram", "grab"],
  popularCountries: [
    "indonesia",
    "philippines",
    "united-states",
    "united-kingdom",
    "canada",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "LINE",
    message:
      "Your verification code is 4820. Enter it in LINE within the next 30 mins.",
    code: "4820",
  },
  en: {
    metaTitle: "Virtual Number for LINE — Verify Without a Local SIM",
    metaDescription:
      "Rent a real virtual number for LINE verification. Register LINE without your personal number — the SMS code arrives in the SMS Code app in seconds.",
    hero: {
      title: "A virtual number for LINE",
      intro: [
        "If your friends, family or colleagues are in Japan, Taiwan, Thailand or Indonesia, sooner or later someone will say “add me on LINE.” The app is the default messenger across much of Asia — and it won't let you in without a phone number, which it verifies by SMS before you can even set a display name.",
        "SMS Code gives you a real number from one of 150+ countries. Enter it on LINE's sign-up screen, and the four-digit verification code shows up in the SMS Code app within seconds — your own number stays out of it entirely.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for LINE?",
      body: [
        "LINE treats the phone number as your identity: it's how you register, how friends can look you up, and what the account falls back on. If you only need LINE to stay in touch with contacts in Asia — or because a game or service you use gates its login behind a LINE account — handing over your personal number is a big ask for what may be an occasional-use app. A virtual number keeps the account fully functional while your real number stays private.",
        "It also solves a practical problem: LINE binds one account to one number, so anyone wanting a separate profile — say, one for a hobby community or an Asian game that requires LINE login — needs a second number. Renting one for a single activation is far simpler than keeping a spare SIM alive just for a messenger.",
      ],
    },
    howTo: {
      title: "How to verify LINE with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Open the SMS Code app, pick LINE as the service and choose a country — Indonesia and the Philippines are popular picks since LINE is widely used there. One tap reserves a real mobile number for you.",
        },
        {
          title: "Start LINE sign-up with that number",
          body: "In LINE, choose “Sign up”, select the same country as your rented number and type it in. LINE offers to verify by SMS — accept that option rather than a voice call.",
        },
        {
          title: "Enter the code from SMS Code",
          body: "The message arrives in the SMS Code app, usually in seconds: “Your verification code is 4820. Enter it in LINE within the next 30 mins.” Type the four digits into LINE before they expire.",
        },
        {
          title: "Set up email and a password",
          body: "Once you're in, go to Settings → Account and register an email address with a password. That becomes your independent login for moving LINE to a new phone later, so the account never depends on receiving another SMS.",
        },
      ],
    },
    tips: [
      {
        title: "The code has a timer",
        body: "LINE's SMS codes expire — the message itself says within how many minutes. Don't rent the number and walk away: have the LINE sign-up screen open and ready before you request the code, then enter it as soon as it lands in SMS Code.",
      },
      {
        title: "Register an email immediately",
        body: "LINE ties chat history and account transfers to the registered email and password, not just the number. Add them right after sign-up in Settings → Account — it's the single most important step for keeping the account usable long after the rented number's activation window closes.",
      },
      {
        title: "Turn off “Allow others to add by number”",
        body: "In LINE's Friends settings, disable the option that lets people add you by phone number lookup. With a virtual number nobody will find your real identity anyway, but switching it off also stops strangers who cycle through numbers from landing in your friend requests.",
      },
    ],
    faqs: [
      {
        q: "Does LINE work outside Asia with a virtual number?",
        a: "Yes. LINE is available worldwide; it's simply most popular in Japan, Taiwan, Thailand and Indonesia. You can register with a number from any supported country and chat with contacts anywhere — the number's country doesn't restrict who you can talk to.",
      },
      {
        q: "Can I use a LINE account created this way to log in to games?",
        a: "Yes. Many games and services in Asia offer “Log in with LINE.” Once your LINE account is verified and you've registered an email and password, it works as a login method like any other LINE account.",
      },
      {
        q: "Will my LINE account survive after the rented number expires?",
        a: "The number is checked at registration, not on every launch. Stay logged in and — crucially — register an email and password in Settings → Account. With those set, you can even transfer the account to a new phone without receiving another SMS on the old number.",
      },
      {
        q: "Why didn't my LINE verification code arrive?",
        a: "Most often the country selected in LINE doesn't match the rented number, or LINE switched to voice-call verification, which a rented SMS number can't answer. Cancel the activation in SMS Code — nothing is charged when no SMS arrives — then take a fresh number and make sure SMS is the chosen method.",
      },
      {
        q: "Can I have two LINE accounts on one phone?",
        a: "The LINE app holds one account per device, so a second account needs either a second device or LINE's business tools. What a virtual number solves is the number side: each account must be tied to its own number, and renting one avoids buying an extra SIM.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для LINE — регистрация без своей SIM",
    metaDescription:
      "Настоящий виртуальный номер для подтверждения LINE. Зарегистрируйтесь в LINE без личного номера — SMS с кодом придёт в приложение SMS Code за секунды.",
    hero: {
      title: "Виртуальный номер для LINE",
      intro: [
        "Если ваши друзья, родные или коллеги живут в Японии, на Тайване, в Таиланде или Индонезии, рано или поздно кто-нибудь скажет: «Добавь меня в LINE». В значительной части Азии это мессенджер по умолчанию — и без номера телефона он вас не пустит: SMS-подтверждение требуется ещё до того, как вы придумаете имя профиля.",
        "SMS Code выдаёт настоящий номер из одной из 150+ стран. Введите его на экране регистрации LINE — и четырёхзначный код подтверждения появится в приложении SMS Code за секунды. Ваш собственный номер в этом вообще не участвует.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для LINE?",
      body: [
        "Для LINE номер телефона — это и есть ваша личность: по нему вы регистрируетесь, по нему вас находят друзья, к нему привязан аккаунт. Если LINE нужен вам только для связи с людьми в Азии — или потому что игра или сервис пускает внутрь лишь через вход по LINE, — отдавать личный номер ради приложения на пару разговоров в месяц как-то чересчур. Виртуальный номер даёт полноценный аккаунт, а настоящий номер остаётся при вас.",
        "Есть и чисто практический момент: LINE жёстко связывает один аккаунт с одним номером, поэтому для отдельного профиля — например, под сообщество по интересам или азиатскую игру с обязательным входом через LINE — нужен второй номер. Арендовать его на одну активацию куда проще, чем держать запасную SIM-карту ради одного мессенджера.",
      ],
    },
    howTo: {
      title: "Как подтвердить LINE виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис LINE и страну — часто берут Индонезию или Филиппины, там LINE в ходу. Одно нажатие — и настоящий мобильный номер зарезервирован за вами.",
        },
        {
          title: "Начните регистрацию в LINE с этим номером",
          body: "В LINE нажмите «Зарегистрироваться», выберите ту же страну, что и у арендованного номера, и введите его. LINE предложит подтверждение по SMS — выбирайте именно его, а не звонок.",
        },
        {
          title: "Введите код из SMS Code",
          body: "Сообщение придёт в приложение SMS Code, обычно за секунды: «Your verification code is 4820. Enter it in LINE within the next 30 mins.» Введите четыре цифры в LINE, пока код не истёк.",
        },
        {
          title: "Привяжите почту и пароль",
          body: "После входа откройте Настройки → Аккаунт и укажите электронную почту с паролем. Это ваш независимый способ входа при переезде на новый телефон — аккаунт перестаёт зависеть от получения новых SMS.",
        },
      ],
    },
    tips: [
      {
        title: "У кода есть таймер",
        body: "SMS-коды LINE истекают — в самом сообщении написано, через сколько минут. Не арендуйте номер «про запас»: сначала откройте экран регистрации LINE, потом запрашивайте код и вводите его сразу, как только он появится в SMS Code.",
      },
      {
        title: "Сразу укажите почту",
        body: "История переписки и перенос аккаунта в LINE привязаны к почте и паролю, а не только к номеру. Добавьте их сразу после регистрации в Настройки → Аккаунт — это главный шаг, чтобы аккаунт спокойно жил и после окончания окна активации арендованного номера.",
      },
      {
        title: "Отключите поиск по номеру",
        body: "В настройках «Друзья» выключите опцию, позволяющую добавлять вас по номеру телефона. С виртуальным номером вашу настоящую личность так никто не найдёт, но заодно вы избавитесь от незнакомцев, которые перебирают номера и сыплются в заявки в друзья.",
      },
    ],
    faqs: [
      {
        q: "Работает ли LINE за пределами Азии с виртуальным номером?",
        a: "Да. LINE доступен по всему миру — просто популярнее всего он в Японии, на Тайване, в Таиланде и Индонезии. Регистрируйтесь с номером любой поддерживаемой страны и переписывайтесь с кем угодно: страна номера не ограничивает круг собеседников.",
      },
      {
        q: "Можно ли входить в игры через такой аккаунт LINE?",
        a: "Да. Многие азиатские игры и сервисы предлагают «Войти через LINE». Как только аккаунт подтверждён, а почта и пароль привязаны, он работает как способ входа наравне с любым другим аккаунтом LINE.",
      },
      {
        q: "Что будет с аккаунтом LINE после окончания аренды номера?",
        a: "Номер проверяется при регистрации, а не при каждом запуске. Не выходите из аккаунта и — самое главное — привяжите почту и пароль в Настройки → Аккаунт. Тогда аккаунт можно перенести даже на новый телефон, не получая новых SMS на старый номер.",
      },
      {
        q: "Почему не пришёл код подтверждения LINE?",
        a: "Чаще всего страна, выбранная в LINE, не совпадает с арендованным номером, либо LINE переключился на подтверждение звонком, а на арендованный SMS-номер ответить нельзя. Отмените активацию в SMS Code — за номер без входящих SMS деньги не списываются, — возьмите новый и проследите, чтобы способом подтверждения была именно SMS.",
      },
      {
        q: "Можно ли держать два аккаунта LINE на одном телефоне?",
        a: "Приложение LINE хранит один аккаунт на устройство, так что для второго нужен либо второй телефон, либо бизнес-инструменты LINE. Виртуальный номер решает «номерную» часть задачи: каждому аккаунту нужен свой номер, и аренда избавляет от покупки лишней SIM-карты.",
      },
    ],
  },
};
