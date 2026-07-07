import type { ServiceEntry } from "./types";

export const facebook: ServiceEntry = {
  slug: "facebook",
  name: "Facebook",
  logo: "/services/facebook.svg",
  category: "social",
  relatedSlugs: ["instagram", "twitter", "tiktok", "snapchat", "google"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "france",
    "brazil",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Facebook",
    message: "285103 is your Facebook confirmation code",
    code: "285103",
  },
  en: {
    metaTitle: "Virtual Number for Facebook — Sign Up Without a SIM",
    metaDescription:
      "Verify Facebook with a real virtual number from 50+ countries. The confirmation code arrives in seconds — pay per activation, no subscription, free cancel if no SMS.",
    hero: {
      title: "A virtual number for Facebook",
      intro: [
        "On paper, Facebook lets you sign up with just an email. In practice, a phone number rarely stays out of the picture: the registration form often asks for one, and fresh accounts routinely land in a security checkpoint within their first days — where a code sent by SMS is the quickest way to prove there's a real person behind the profile.",
        "With SMS Activate you rent a real mobile number in one of 50+ countries, hand it to Facebook, and the confirmation code appears in the app within seconds. You pay per activation from a one-time credit pack — no subscription — and if a number receives nothing, you cancel it without being charged.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Facebook?",
      body: [
        "A Facebook profile already carries your name, your face and your friend list. Adding your personal phone number to that pile ties it to everything else in your life — and numbers attached to Facebook accounts have been scraped and leaked at enormous scale in the past. A leaked number works like a search key: it connects your profile to messengers, marketplaces and data-broker records. A virtual number gives Facebook a real, working number that simply isn't that key.",
        "There are everyday reasons too: you're signing up while abroad and your home SIM can't receive SMS, or you sell on Marketplace and would rather strangers didn't hold a number that rings in your pocket. One thing a virtual number is not for — Facebook's terms allow one personal account per person, so treat this as privacy for your account, not a way to run several.",
      ],
    },
    howTo: {
      title: "How to verify Facebook with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Activate",
          body: "Open the SMS Activate app, choose Facebook as the service, pick a country and tap once. A real mobile number is reserved just for you for the length of the activation.",
        },
        {
          title: "Enter it when Facebook asks",
          body: "That may be on the sign-up form itself or at a checkpoint shortly after. Select the country code that matches the number you rented — a mismatch is the most common reason a code never arrives.",
        },
        {
          title: "Type in the confirmation code",
          body: "The SMS lands in the SMS Activate app within seconds, from sender “Facebook”, formatted like “285103 is your Facebook confirmation code”. Enter the digits and the check clears.",
        },
        {
          title: "Anchor the account to things you control",
          body: "Straight away, add an email you own and switch on two-factor authentication with an authenticator app in Accounts Center → Password and security. From then on, logins and recovery never depend on the rented number.",
        },
      ],
    },
    tips: [
      {
        title: "Expect the checkpoint — it's routine",
        body: "Facebook challenges fresh accounts more aggressively than almost any other social network. A profile photo, a few real details and a human pace go a long way; a half-empty account that adds fifty friends in an hour is exactly what trips the filters.",
      },
      {
        title: "Move recovery off the number on day one",
        body: "The rented number is for the verification moment, not for life. Once you're in, confirm an email address and set up an authenticator app — then no future login or recovery flow ever routes through SMS.",
      },
      {
        title: "One person, one account",
        body: "Facebook's terms are explicit: one personal account per person. A virtual number keeps your real number private on the account you have — using it to multiply accounts puts all of them at risk.",
      },
    ],
    faqs: [
      {
        q: "Will my Facebook account keep working after the number expires?",
        a: "Yes. The number is checked at the verification moment, not on an ongoing basis. Add an email and authenticator-app 2FA right after signing up, and nothing about the account will ever depend on that number again.",
      },
      {
        q: "Can I sign up for Facebook without any phone number?",
        a: "Sometimes — email-only sign-up does exist. But many new accounts are asked for a phone during registration or shortly after, at a checkpoint. The practical approach is to rent a number at the moment Facebook actually demands one.",
      },
      {
        q: "Why did Facebook lock my brand-new account?",
        a: "Checkpoints on fresh accounts are normal, not a sign you did something wrong. Facebook periodically asks new profiles to confirm a phone number, and occasionally a photo. Complete the SMS step, keep filling in the profile at a human pace, and the account settles down.",
      },
      {
        q: "Why didn't my Facebook code arrive?",
        a: "Usually one of two things: the country code entered on Facebook doesn't match the rented number, or Facebook declined to text that particular number. Cancel the pending activation in SMS Activate — numbers that received nothing are never charged — and try a fresh one, ideally from another country.",
      },
      {
        q: "Is verifying Facebook with a rented number against the rules?",
        a: "Facebook's checks exist to confirm a reachable person, and a virtual number is a real, reachable number. What the platform actually enforces is behaviour and authenticity: one genuine account, no impersonation, no spam. Keep to that and the origin of the number is a non-issue.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Facebook — регистрация без SIM-карты",
    metaDescription:
      "Подтвердите Facebook настоящим виртуальным номером из 50+ стран. Код приходит в приложение за секунды — оплата за активацию, без подписки, отмена без списания.",
    hero: {
      title: "Виртуальный номер для Facebook",
      intro: [
        "Формально Facebook разрешает регистрацию по одной почте. На деле без телефона обходится редко: форма регистрации часто просит номер сама, а свежие аккаунты в первые же дни попадают в проверку безопасности — и код из SMS оказывается самым быстрым способом доказать, что за профилем стоит живой человек.",
        "С SMS Activate вы арендуете настоящий мобильный номер в одной из 50+ стран, отдаёте его Facebook — и код подтверждения появляется в приложении за считанные секунды. Платите за активацию из разового пакета кредитов, без подписки, а если на номер ничего не пришло — отменяете его без списания.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Facebook?",
      body: [
        "Профиль в Facebook и так несёт ваше имя, лицо и список друзей. Добавить к этому личный номер телефона — значит связать профиль со всей остальной жизнью, а номера, привязанные к аккаунтам Facebook, в прошлом уже утекали в огромных масштабах. Утёкший номер работает как поисковый ключ: по нему профиль сшивается с мессенджерами, досками объявлений и базами брокеров данных. Виртуальный номер даёт Facebook настоящий рабочий номер, который таким ключом просто не является.",
        "Есть и бытовые причины: вы регистрируетесь из-за границы, и домашняя SIM-карта не принимает SMS, или продаёте на Marketplace и не хотите, чтобы у незнакомцев оказался номер, который звонит у вас в кармане. Для чего виртуальный номер не подходит: правила Facebook разрешают один личный аккаунт на человека, так что это про приватность вашего аккаунта, а не про то, чтобы завести несколько.",
      ],
    },
    howTo: {
      title: "Как подтвердить Facebook виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Activate",
          body: "Откройте приложение SMS Activate, выберите сервис Facebook, страну — и нажмите один раз. Настоящий мобильный номер резервируется только за вами на время активации.",
        },
        {
          title: "Введите его, когда Facebook попросит",
          body: "Это может случиться прямо в форме регистрации или чуть позже, на проверке безопасности. Выберите код страны, совпадающий с арендованным номером, — несовпадение чаще всего и есть причина, почему код не приходит.",
        },
        {
          title: "Введите код подтверждения",
          body: "SMS придёт в приложение SMS Activate за секунды, от отправителя «Facebook», в формате «285103 is your Facebook confirmation code». Введите цифры — и проверка пройдена.",
        },
        {
          title: "Привяжите аккаунт к тому, что контролируете вы",
          body: "Сразу добавьте свою почту и включите двухфакторную аутентификацию через приложение-аутентификатор: Центр аккаунтов → Пароль и безопасность. После этого ни вход, ни восстановление больше не зависят от арендованного номера.",
        },
      ],
    },
    tips: [
      {
        title: "Ждите проверку — это нормально",
        body: "Facebook проверяет свежие аккаунты жёстче почти любой другой соцсети. Фото профиля, пара настоящих деталей и человеческий темп сильно помогают; полупустой аккаунт, добавляющий полсотни друзей за час, — ровно то, на что срабатывают фильтры.",
      },
      {
        title: "Уберите восстановление с номера в первый же день",
        body: "Арендованный номер нужен на момент подтверждения, а не навсегда. Как только вошли — подтвердите почту и настройте приложение-аутентификатор: тогда ни один будущий вход или сброс пароля не пойдёт через SMS.",
      },
      {
        title: "Один человек — один аккаунт",
        body: "Правила Facebook прямо говорят: один личный аккаунт на человека. Виртуальный номер прячет ваш настоящий номер на том аккаунте, который у вас есть; попытка размножить аккаунты ставит под удар их все.",
      },
    ],
    faqs: [
      {
        q: "Аккаунт Facebook продолжит работать после окончания аренды номера?",
        a: "Да. Номер проверяется в момент подтверждения, а не постоянно. Добавьте почту и 2FA через приложение-аутентификатор сразу после регистрации — и аккаунт больше никогда не будет зависеть от этого номера.",
      },
      {
        q: "Можно ли зарегистрироваться в Facebook вообще без телефона?",
        a: "Иногда — регистрация только по почте существует. Но у многих новых аккаунтов телефон спрашивают прямо при регистрации или вскоре после, на проверке. Практичный подход — арендовать номер в тот момент, когда Facebook его действительно потребует.",
      },
      {
        q: "Почему Facebook заблокировал мой совсем новый аккаунт?",
        a: "Проверки свежих аккаунтов — обычное дело, а не признак того, что вы что-то нарушили. Facebook периодически просит новые профили подтвердить номер телефона, иногда — фото. Пройдите шаг с SMS, заполняйте профиль в человеческом темпе — и аккаунт успокоится.",
      },
      {
        q: "Почему не пришёл код Facebook?",
        a: "Обычно одно из двух: код страны в Facebook не совпадает с арендованным номером, либо Facebook отказался отправлять SMS на этот конкретный номер. Отмените ожидающую активацию в SMS Activate — за номера, на которые ничего не пришло, деньги не списываются, — и возьмите новый, лучше из другой страны.",
      },
      {
        q: "Подтверждать Facebook арендованным номером — это против правил?",
        a: "Проверки Facebook нужны, чтобы убедиться в досягаемости живого человека, а виртуальный номер — настоящий и досягаемый. На деле платформа следит за поведением и подлинностью: один настоящий аккаунт, без выдачи себя за других, без спама. Соблюдайте это — и происхождение номера никого не волнует.",
      },
    ],
  },
};
