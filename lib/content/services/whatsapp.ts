import type { ServiceEntry } from "./types";

export const whatsapp: ServiceEntry = {
  slug: "whatsapp",
  name: "WhatsApp",
  logo: "/services/whatsapp.svg",
  category: "messaging",
  relatedSlugs: ["telegram", "viber", "signal", "facebook", "instagram"],
  popularCountries: [
    "united-kingdom",
    "poland",
    "netherlands",
    "indonesia",
    "philippines",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "WhatsApp",
    message: "WhatsApp code 305-921",
    code: "305-921",
  },
  en: {
    metaTitle: "Virtual Number for WhatsApp — Verify Without a SIM Card",
    metaDescription:
      "Verify WhatsApp with a real virtual number from 50+ countries. The 6-digit code lands in the app in seconds — no SIM, no subscription, free cancel if no SMS.",
    hero: {
      title: "A virtual number for WhatsApp",
      intro: [
        "In WhatsApp, the phone number isn't just a login — it is the account. Every contact who has your number saved sees your profile, and moving to a different number means walking through the official Change Number flow. Whatever number you register with, you're wearing it in public.",
        "With SMS Activate you rent a real mobile number in one of 50+ countries, enter it on WhatsApp's sign-up screen, and the 6-digit verification code appears in the app within seconds. You pay per activation from a one-time credit pack — and if a number receives nothing, you cancel it without being charged.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for WhatsApp?",
      body: [
        "Because your number is your WhatsApp identity, giving it out is a bigger decision than on most apps: sellers on marketplaces, group chats full of strangers and one-off business contacts all end up with a direct line to you. A virtual number gives that public-facing identity a firewall — the account behaves exactly like any other, but the number behind it isn't the one your bank and family use.",
        "It's also the clean way to run a second, separate WhatsApp. A work profile through WhatsApp Business can live on the same phone as your personal app, but it needs its own number. The same goes for signing up while abroad, when your home SIM is out of reach or roaming makes receiving SMS unreliable — a rented local number gets you verified without swapping cards.",
      ],
    },
    howTo: {
      title: "How to verify WhatsApp with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Activate",
          body: "Open the SMS Activate app, choose WhatsApp as the service, pick a country and tap once. A real mobile number is reserved just for you for the length of the activation.",
        },
        {
          title: "Enter it in WhatsApp",
          body: "On WhatsApp's registration screen, select the matching country and type the number exactly as issued. WhatsApp reads the country from the code you pick, so a mismatch here is the classic reason a code never shows up.",
        },
        {
          title: "Grab the 6-digit code",
          body: "The SMS arrives in the SMS Activate app, usually within seconds, from sender “WhatsApp” and formatted like “WhatsApp code 305-921”. Type the six digits into WhatsApp — the dash is just formatting.",
        },
        {
          title: "Set a two-step verification PIN",
          body: "Straight after signing up, go to Settings → Account → Two-step verification and set a PIN. WhatsApp re-verifies the number when you reinstall or switch phones, and the PIN is what proves the account is yours at that moment.",
        },
      ],
    },
    tips: [
      {
        title: "WhatsApp is picky about numbers — plan for a retry",
        body: "WhatsApp screens incoming registrations harder than most services and can refuse to send a code to a number it suspects is temporary. That's normal: cancel the pending activation in SMS Activate — you're not charged for numbers that received nothing — and try again, ideally with a different country.",
      },
      {
        title: "Warm the account up",
        body: "A brand-new account that instantly blasts messages to strangers is exactly the pattern WhatsApp's anti-spam systems flag. Set a name and photo, message a contact who knows you, join a group you were invited to — and let the account age a little before anything high-volume. Slow is safe.",
      },
      {
        title: "Stay signed in and the account stays yours",
        body: "WhatsApp only asks for the number again when you re-register — reinstalling the app or moving to a new phone. As long as you stay logged in on your device, the account keeps working after the rented number's activation window ends. The two-step PIN is your safety net for that future re-verification.",
      },
    ],
    faqs: [
      {
        q: "Will my WhatsApp keep working after the number expires?",
        a: "Yes. The number is checked at registration, not on an ongoing basis. Stay logged in on your phone and the account works normally. Re-verification only happens when you reinstall WhatsApp or switch devices — which is why setting the two-step verification PIN right after signup matters.",
      },
      {
        q: "Why didn't my WhatsApp code arrive?",
        a: "Two common causes: the country selected in WhatsApp doesn't match the number, or WhatsApp declined to send a code to that particular number — it's stricter than most services about ones it suspects are temporary. Cancel the pending activation in SMS Activate free of charge and take a fresh number, ideally in another country. WhatsApp may also offer to call the number with the code, or on re-registration send it to an existing WhatsApp session instead of by SMS.",
      },
      {
        q: "Can I run a second WhatsApp account this way?",
        a: "Yes — that's one of the most common uses. Install WhatsApp Business alongside the regular app on the same phone and register it with your virtual number. You get a fully separate work identity: its own profile, its own chats, its own number your clients see.",
      },
      {
        q: "Will my contacts see that the number is virtual?",
        a: "No. It's a real mobile number on a real carrier network, and to everyone else the account looks entirely ordinary. What contacts do see is the number itself — that's how WhatsApp works — so the point of a virtual number is precisely that the number they see isn't your personal one.",
      },
      {
        q: "Can my account get banned for using a virtual number?",
        a: "WhatsApp doesn't ban accounts for how the number was obtained — it bans behaviour: bulk messaging, spam, automation. A new account on any number that immediately mass-messages strangers is at risk. Use the account like a person, not a broadcast tool, and it's no different from one registered on a SIM.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для WhatsApp — регистрация без SIM-карты",
    metaDescription:
      "Подтвердите WhatsApp настоящим виртуальным номером из 50+ стран. 6-значный код приходит в приложение за секунды — без SIM и подписки, отмена без списания.",
    hero: {
      title: "Виртуальный номер для WhatsApp",
      intro: [
        "В WhatsApp номер телефона — не просто логин, а сам аккаунт. Каждый, у кого ваш номер записан в контактах, видит ваш профиль, а переезд на другой номер — это отдельная официальная процедура «Изменить номер». С каким номером зарегистрировались, с тем и живёте на виду.",
        "С SMS Activate вы арендуете настоящий мобильный номер в одной из 50+ стран, вводите его на экране регистрации WhatsApp — и 6-значный код подтверждения появляется в приложении за считанные секунды. Платите за активацию из разового пакета кредитов, без подписки, а если на номер ничего не пришло — отменяете его без списания.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для WhatsApp?",
      body: [
        "Раз номер — это и есть ваша личность в WhatsApp, раздавать его — решение серьёзнее, чем в большинстве приложений: продавцы с досок объявлений, групповые чаты с незнакомцами и разовые деловые контакты получают прямую линию к вам. Виртуальный номер ставит между вами и публикой заслон: аккаунт работает как обычный, но за ним стоит номер, которым не пользуются ни ваш банк, ни ваша семья.",
        "Это же — аккуратный способ завести второй, отдельный WhatsApp. Рабочий профиль через WhatsApp Business может жить на том же телефоне, что и личное приложение, но ему нужен собственный номер. То же с регистрацией за границей, когда домашняя SIM-карта недоступна или в роуминге SMS доходят через раз: арендованный местный номер решает вопрос без замены карты.",
      ],
    },
    howTo: {
      title: "Как подтвердить WhatsApp виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Activate",
          body: "Откройте приложение SMS Activate, выберите сервис WhatsApp, страну — и нажмите один раз. Настоящий мобильный номер резервируется только за вами на время активации.",
        },
        {
          title: "Введите его в WhatsApp",
          body: "На экране регистрации WhatsApp выберите соответствующую страну и введите номер ровно так, как он выдан. Код страны WhatsApp берёт из вашего выбора, поэтому несовпадение здесь — классическая причина, по которой код так и не приходит.",
        },
        {
          title: "Заберите 6-значный код",
          body: "SMS придёт в приложение SMS Activate, обычно за секунды, от отправителя «WhatsApp» в формате «WhatsApp code 305-921». Введите шесть цифр в WhatsApp — дефис только для читаемости.",
        },
        {
          title: "Установите PIN двухшаговой проверки",
          body: "Сразу после регистрации откройте Настройки → Аккаунт → Двухшаговая проверка и задайте PIN-код. WhatsApp повторно проверяет номер при переустановке или смене телефона, и именно PIN в этот момент докажет, что аккаунт ваш.",
        },
      ],
    },
    tips: [
      {
        title: "WhatsApp придирчив к номерам — закладывайте попытку про запас",
        body: "WhatsApp проверяет новые регистрации строже большинства сервисов и может не отправить код на номер, который сочтёт временным. Это нормально: отмените ожидающую активацию в SMS Activate — за номера, на которые ничего не пришло, деньги не списываются, — и попробуйте снова, лучше с другой страной.",
      },
      {
        title: "Дайте аккаунту «прогреться»",
        body: "Свежий аккаунт, который сразу рассылает сообщения незнакомцам, — ровно тот сценарий, на который реагируют антиспам-системы WhatsApp. Поставьте имя и фото, напишите знакомому, вступите в группу по приглашению — и дайте аккаунту немного пожить, прежде чем нагружать его. Медленно — значит надёжно.",
      },
      {
        title: "Не выходите из аккаунта — и он останется вашим",
        body: "WhatsApp запрашивает номер заново только при повторной регистрации: после переустановки приложения или переезда на новый телефон. Пока вы залогинены на своём устройстве, аккаунт продолжает работать и после окончания окна активации арендованного номера. PIN двухшаговой проверки — ваша страховка на случай той самой будущей проверки.",
      },
    ],
    faqs: [
      {
        q: "WhatsApp продолжит работать после окончания аренды номера?",
        a: "Да. Номер проверяется при регистрации, а не постоянно. Оставайтесь залогинены на телефоне — и аккаунт работает как обычно. Повторная проверка случается только при переустановке WhatsApp или смене устройства, поэтому так важно сразу после регистрации задать PIN двухшаговой проверки.",
      },
      {
        q: "Почему не пришёл код WhatsApp?",
        a: "Две частые причины: страна, выбранная в WhatsApp, не совпадает с номером, либо WhatsApp отказался отправлять код на этот конкретный номер — к подозрительным на «временность» номерам он строже большинства сервисов. Отмените ожидающую активацию в SMS Activate без списания и возьмите новый номер, лучше в другой стране. WhatsApp также может предложить продиктовать код звонком, а при повторной регистрации — отправить его в существующую сессию WhatsApp вместо SMS.",
      },
      {
        q: "Можно ли так завести второй аккаунт WhatsApp?",
        a: "Да — это один из самых частых сценариев. Установите WhatsApp Business рядом с обычным приложением на том же телефоне и зарегистрируйте его на виртуальный номер. Получится полностью отдельная рабочая личность: свой профиль, свои чаты и свой номер, который видят клиенты.",
      },
      {
        q: "Увидят ли контакты, что номер виртуальный?",
        a: "Нет. Это настоящий мобильный номер в реальной сети оператора, и со стороны аккаунт выглядит совершенно обычно. Сам номер контакты видят — так устроен WhatsApp, — и в этом весь смысл виртуального номера: они видят не ваш личный.",
      },
      {
        q: "Могут ли забанить аккаунт за виртуальный номер?",
        a: "WhatsApp банит не за происхождение номера, а за поведение: массовые рассылки, спам, автоматизацию. Новый аккаунт на любом номере, который сразу пишет толпе незнакомцев, рискует одинаково. Пользуйтесь аккаунтом как человек, а не как рупор для рассылок — и он ничем не отличается от зарегистрированного на SIM-карту.",
      },
    ],
  },
};
