import type { ServiceEntry } from "./types";

export const telegram: ServiceEntry = {
  slug: "telegram",
  name: "Telegram",
  logo: "/services/telegram.svg",
  category: "messaging",
  relatedSlugs: ["whatsapp", "signal", "viber", "discord", "google"],
  popularCountries: [
    "netherlands",
    "united-kingdom",
    "poland",
    "kazakhstan",
    "indonesia",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Telegram",
    message: "Telegram code: 48329",
    code: "48329",
  },
  en: {
    metaTitle: "Virtual Number for Telegram — Sign Up Without Your Real Number",
    metaDescription:
      "Get a real virtual number for Telegram verification in seconds. Register a new or second Telegram account without a SIM card and keep your personal number private.",
    hero: {
      title: "A virtual number for Telegram",
      intro: [
        "Telegram asks for a phone number on its very first screen — before you can pick a username, join a group or send a single message. That number becomes the permanent anchor of your account, and by default your contacts can see it.",
        "With SMS Code you rent a real number in one of 50+ countries, type it into Telegram, and the verification code appears in the app within seconds. Your personal number never touches Telegram's servers.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Telegram?",
      body: [
        "Telegram is built around the phone number: it's your login, your recovery method and — unless you change the privacy settings — what strangers in group chats can use to find you. Using a virtual number cuts that link entirely, so the account works exactly the same but points back to a number that isn't yours.",
        "It's also the practical way to run a second account. Telegram officially supports multiple accounts in one app, but each one needs its own number. A virtual number gives your work profile, project channel or test account a separate identity without buying a second SIM.",
      ],
    },
    howTo: {
      title: "How to verify Telegram with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose Telegram as the service, pick a country and tap once. You get a real mobile number reserved just for you.",
        },
        {
          title: "Enter it in Telegram",
          body: "On Telegram's sign-up screen, select the matching country code and type the number. Double-check the country — a mismatch is the most common reason a code never arrives.",
        },
        {
          title: "Grab the code from SMS Code",
          body: "The SMS lands in the SMS Code app, usually within seconds. It looks like “Telegram code: 48329”. Type it into Telegram and you're in.",
        },
        {
          title: "Lock the account down",
          body: "Straight after signing in, set a cloud password in Settings → Privacy and Security → Two-Step Verification. With 2FA on, future logins don't depend on receiving another SMS.",
        },
      ],
    },
    tips: [
      {
        title: "Codes can go to an existing session",
        body: "If a number was ever used for Telegram before, Telegram sends the login code to the existing session instead of SMS. SMS Code issues you a fresh number, but if you re-verify later, remember the code may appear inside Telegram itself.",
      },
      {
        title: "Keep your session logged in",
        body: "Telegram rarely asks you to re-verify while a session stays active. Don't log out of your only device, and add the cloud password — then the account survives even after the rented number's activation window ends.",
      },
      {
        title: "Hide your number either way",
        body: "In Settings → Privacy and Security → Phone Number, set “Who can see my number” to Nobody. Even with a virtual number, it's good hygiene — group members will see only your username.",
      },
    ],
    faqs: [
      {
        q: "Will my Telegram account keep working after the number expires?",
        a: "Yes. The number is only needed at the verification step. As long as you stay logged in and enable Two-Step Verification (a cloud password), the account keeps working normally — Telegram sends future login codes to your active session, not by SMS.",
      },
      {
        q: "Can I make a second Telegram account with a virtual number?",
        a: "Yes — that's one of the most common uses. Telegram supports multiple accounts in one app; add your virtual number as the second account and switch between profiles with one tap.",
      },
      {
        q: "Why didn't my Telegram code arrive?",
        a: "The usual causes: the country code entered in Telegram doesn't match the number, or Telegram decided to deliver the code to a previous session. Cancel the pending activation in SMS Code — you're not charged for numbers that received nothing — and try a fresh number.",
      },
      {
        q: "Will people see that I'm using a virtual number?",
        a: "No. It's a real mobile number on a real carrier network. To other users it looks like any other account — and if you hide your number in privacy settings, they only ever see your username.",
      },
      {
        q: "Is signing up for Telegram with a virtual number allowed?",
        a: "Telegram verifies that you control a number, not whose name it's registered in. Renting a number for the sign-up is fine for normal personal use; what matters is that you follow Telegram's own terms of service once you're in.",
      },
    ],
  },
  ru: {
    metaTitle:
      "Виртуальный номер для Telegram — регистрация без личного номера",
    metaDescription:
      "Настоящий виртуальный номер для подтверждения Telegram за секунды. Зарегистрируйте новый или второй аккаунт Telegram без SIM-карты и сохраните личный номер в тайне.",
    hero: {
      title: "Виртуальный номер для Telegram",
      intro: [
        "Telegram запрашивает номер телефона на самом первом экране — ещё до того, как вы выберете имя пользователя, вступите в группу или отправите первое сообщение. Этот номер навсегда привязывается к аккаунту, и по умолчанию его видят ваши контакты.",
        "С SMS Code вы арендуете настоящий номер в одной из 50+ стран, вводите его в Telegram — и код подтверждения появляется в приложении за считанные секунды. Ваш личный номер вообще не попадает на серверы Telegram.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Telegram?",
      body: [
        "Telegram построен вокруг номера телефона: это ваш логин, способ восстановления и — если не поменять настройки приватности — то, по чему незнакомцы из групповых чатов могут вас найти. Виртуальный номер полностью разрывает эту связь: аккаунт работает как обычно, но ведёт к номеру, который вам не принадлежит.",
        "Это же — практичный способ завести второй аккаунт. Telegram официально поддерживает несколько аккаунтов в одном приложении, но каждому нужен свой номер. Виртуальный номер даёт рабочему профилю, каналу проекта или тестовому аккаунту отдельную личность без покупки второй SIM-карты.",
      ],
    },
    howTo: {
      title: "Как подтвердить Telegram виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Telegram, страну — и нажмите один раз. Вы получите настоящий мобильный номер, зарезервированный только для вас.",
        },
        {
          title: "Введите его в Telegram",
          body: "На экране регистрации Telegram выберите соответствующий код страны и введите номер. Проверьте страну дважды — несовпадение кода страны с номером чаще всего и есть причина, почему код не приходит.",
        },
        {
          title: "Заберите код из SMS Code",
          body: "SMS придёт в приложение SMS Code, обычно за секунды. Выглядит так: «Telegram code: 48329». Введите код в Telegram — и готово.",
        },
        {
          title: "Защитите аккаунт",
          body: "Сразу после входа установите облачный пароль: Настройки → Конфиденциальность → Двухэтапная аутентификация. С включённой 2FA будущие входы не зависят от получения новой SMS.",
        },
      ],
    },
    tips: [
      {
        title: "Код может уйти в существующую сессию",
        body: "Если номер когда-то уже использовался в Telegram, код входа отправится в активную сессию, а не по SMS. SMS Code выдаёт вам свежий номер, но при повторной верификации позже помните: код может появиться внутри самого Telegram.",
      },
      {
        title: "Не выходите из аккаунта",
        body: "Telegram редко просит повторное подтверждение, пока сессия активна. Не выходите с единственного устройства и добавьте облачный пароль — тогда аккаунт продолжит работать и после окончания окна активации арендованного номера.",
      },
      {
        title: "Скройте номер в любом случае",
        body: "В Настройки → Конфиденциальность → Номер телефона выберите «Кто видит мой номер» → Никто. Даже с виртуальным номером это правильная привычка: участники групп увидят только ваше имя пользователя.",
      },
    ],
    faqs: [
      {
        q: "Аккаунт Telegram продолжит работать после окончания аренды номера?",
        a: "Да. Номер нужен только на шаге подтверждения. Пока вы не выходите из аккаунта и включили двухэтапную аутентификацию (облачный пароль), всё работает как обычно: коды входа Telegram отправляет в активную сессию, а не по SMS.",
      },
      {
        q: "Можно ли создать второй аккаунт Telegram на виртуальный номер?",
        a: "Да — это один из самых частых сценариев. Telegram поддерживает несколько аккаунтов в одном приложении: добавьте виртуальный номер как второй аккаунт и переключайтесь между профилями одним касанием.",
      },
      {
        q: "Почему не пришёл код Telegram?",
        a: "Обычные причины: код страны в Telegram не совпадает с номером, либо Telegram отправил код в предыдущую сессию. Отмените ожидающую активацию в SMS Code — за номера, на которые ничего не пришло, деньги не списываются, — и возьмите новый номер.",
      },
      {
        q: "Увидят ли другие, что у меня виртуальный номер?",
        a: "Нет. Это настоящий мобильный номер в реальной сети оператора. Для других пользователей аккаунт выглядит как любой другой, а если скрыть номер в настройках приватности, будет виден только ваш юзернейм.",
      },
      {
        q: "Разрешено ли регистрироваться в Telegram с виртуальным номером?",
        a: "Telegram проверяет, что номер под вашим контролем, а не на чьё имя он оформлен. Аренда номера для регистрации — нормальная практика для личного использования; главное — соблюдать правила самого Telegram после входа.",
      },
    ],
  },
};
