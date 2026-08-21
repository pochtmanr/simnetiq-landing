import type { ServiceEntry } from "./types";

export const steam: ServiceEntry = {
  slug: "steam",
  name: "Steam",
  logo: "/services/steam.svg",
  category: "entertainment",
  relatedSlugs: ["discord", "netflix", "google", "apple", "twitter"],
  popularCountries: [
    "united-states",
    "germany",
    "poland",
    "kazakhstan",
    "brazil",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Steam",
    message: "Your Steam verification code is J4K8P",
    code: "J4K8P",
  },
  en: {
    metaTitle: "Virtual Number for Steam — Add a Phone Without Your SIM",
    metaDescription:
      "Attach a phone to Steam with a real virtual number: the code arrives in seconds. Honest notes on Steam Guard, trade holds and why the authenticator matters.",
    hero: {
      title: "A virtual number for Steam",
      intro: [
        "Steam will happily create an account with just an email — that part is simple and honest. The phone number enters the story later, where it counts: Steam Guard codes by SMS, account recovery, and the verification steps around trading and the Community Market. That’s when “Your Steam verification code is J4K8P” shows up.",
        "With SMS Code you rent a real mobile number in one of 150+ countries and Steam’s code lands in the app within seconds. Your game library — often years of purchases — gets a phone attached without your personal number entering Valve’s records.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Steam?",
      body: [
        "A seasoned Steam account is one of the more valuable things a gamer owns, which is exactly why you might not want your everyday number wired into it. Phishing against Steam users is a cottage industry; the less your account’s contact details overlap with the number everyone knows, the smaller the attack surface. A virtual number lets you pass Steam’s phone steps while keeping that separation.",
        "Here’s the honest architecture, though: on Steam, SMS is the weaker guard. The protection that actually matters for trading and the Market is the Steam Guard Mobile Authenticator in the Steam app — Valve holds trades and listings much longer for accounts without it. Treat the rented number as the key that gets you through the phone-verification door, and the authenticator as the lock you install once inside.",
      ],
    },
    howTo: {
      title: "How to verify Steam with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Choose Steam as the service and pick a country. One tap reserves a real mobile number just for you.",
        },
        {
          title: "Add it to your Steam account",
          body: "Go to Account Details → Contact Info — or follow the prompt Steam shows when trading needs a phone — and enter the number with its country code.",
        },
        {
          title: "Enter the code — letters included",
          body: "Steam’s code looks like “J4K8P”: letters and digits, not the usual six numbers. It arrives in the SMS Code app in seconds; type it exactly as written.",
        },
        {
          title: "Set up the Mobile Authenticator",
          body: "In the Steam mobile app, enable the Steam Guard Mobile Authenticator while the number is still active. That becomes your durable 2FA — and keep the recovery code it gives you somewhere safe.",
        },
      ],
    },
    tips: [
      {
        title: "The code isn’t all digits",
        body: "Unlike most services, Steam sends an alphanumeric code — J4K8P, not 123456. If a code “doesn’t work”, check that you haven’t confused letters and digits (O against 0, I against 1) and enter it in uppercase, exactly as received.",
      },
      {
        title: "The authenticator outranks SMS",
        body: "SMS Steam Guard is the entry level; the Mobile Authenticator is what shortens holds on trades and Market listings — and it survives any number expiring. Enable it right after verifying: it takes minutes and it’s the difference between a protected account and a half-protected one.",
      },
      {
        title: "Changing the phone later has side effects",
        body: "Steam treats phone changes and removals as security events and can apply temporary holds around them. If you plan to swap the rented number for your own or drop it entirely, do it deliberately from Account Details while you can still receive codes — not in a hurry before a trade.",
      },
    ],
    faqs: [
      {
        q: "Do I need a phone number to create a Steam account?",
        a: "No — sign-up runs on email alone, and that’s genuinely all a basic account needs. The phone becomes relevant for Steam Guard by SMS, account recovery and the verification around trading and the Community Market. Rent a number at the point Steam actually asks for one.",
      },
      {
        q: "Will a virtual number remove trade and Market holds?",
        a: "Not by itself — we won’t oversell this. Valve’s holds are tied to the Steam Guard Mobile Authenticator, not to having a phone on file. The number gets you through the phone-verification steps; enabling the authenticator in the Steam app is what actually changes how holds work for you.",
      },
      {
        q: "What happens when the rented number expires?",
        a: "Your account keeps working — you log in with your password and Steam Guard as before. If the authenticator is set up, day-to-day security doesn’t involve SMS at all. If you ever want SMS back as an option, update the phone in Account Details to a number you currently control.",
      },
      {
        q: "Why was my Steam code rejected?",
        a: "Usually it’s the format: Steam codes mix letters and digits, and an O can hide a 0. Enter the code exactly as it appears in the SMS Code app. If no SMS arrived at all, check the country code, cancel the pending activation for free and take a fresh number.",
      },
      {
        q: "Does the number change my Steam store region?",
        a: "No. Your store region follows your location and payment details under Valve’s own rules — the phone number has no say in it. Pick a number from the country where the account actually lives; using numbers to hop regions isn’t what they’re for and isn’t something Steam’s checks reward.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Steam — телефон без вашей SIM",
    metaDescription:
      "Привяжите телефон к Steam настоящим виртуальным номером: код придёт за секунды. Честно о Steam Guard, задержках обменов и почему важнее аутентификатор.",
    hero: {
      title: "Виртуальный номер для Steam",
      intro: [
        "Steam спокойно создаст аккаунт по одной только почте — тут всё просто и честно. Телефон появляется в истории позже, там, где он важен: коды Steam Guard по SMS, восстановление аккаунта и проверки вокруг обменов и Торговой площадки. Вот тогда и приходит «Your Steam verification code is J4K8P».",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 150+ стран, и код Steam оказывается в приложении за считанные секунды. Ваша библиотека игр — зачастую годы покупок — получает привязанный телефон, а личный номер в записи Valve не попадает.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Steam?",
      body: [
        "Прокачанный аккаунт Steam — одна из самых ценных вещей у геймера, и именно поэтому не хочется вшивать в него свой повседневный номер. Фишинг против пользователей Steam — целая индустрия; чем меньше контакты аккаунта пересекаются с номером, который знают все, тем меньше поверхность атаки. Виртуальный номер позволяет пройти телефонные шаги Steam, сохранив это разделение.",
        "Но вот честная архитектура: в Steam SMS — слабая защита. Для обменов и Торговой площадки по-настоящему важен мобильный аутентификатор Steam Guard в приложении Steam — без него Valve удерживает обмены и лоты значительно дольше. Относитесь к арендованному номеру как к ключу от двери телефонной верификации, а к аутентификатору — как к замку, который вы ставите, оказавшись внутри.",
      ],
    },
    howTo: {
      title: "Как подтвердить Steam виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Выберите сервис Steam и страну. Одно касание — и настоящий мобильный номер зарезервирован только для вас.",
        },
        {
          title: "Привяжите его к аккаунту Steam",
          body: "Откройте «Об аккаунте» → контактные данные — или следуйте подсказке, которую Steam показывает, когда для обменов нужен телефон, — и введите номер с кодом страны.",
        },
        {
          title: "Введите код — вместе с буквами",
          body: "Код Steam выглядит как «J4K8P»: буквы и цифры, а не привычные шесть цифр. Он приходит в приложение SMS Code за секунды; вводите его в точности как написано.",
        },
        {
          title: "Настройте мобильный аутентификатор",
          body: "В мобильном приложении Steam включите мобильный аутентификатор Steam Guard, пока номер ещё активен. Это и будет ваша долговечная 2FA — а выданный код восстановления сохраните в надёжном месте.",
        },
      ],
    },
    tips: [
      {
        title: "Код состоит не только из цифр",
        body: "В отличие от большинства сервисов, Steam присылает буквенно-цифровой код: J4K8P, а не 123456. Если код «не подходит», проверьте, не перепутаны ли буквы и цифры (O и 0, I и 1), и вводите его заглавными — ровно как получили.",
      },
      {
        title: "Аутентификатор старше SMS по званию",
        body: "SMS-вариант Steam Guard — начальный уровень; сроки удержания обменов и лотов на Площадке сокращает именно мобильный аутентификатор, и ему не страшно окончание аренды номера. Включите его сразу после подтверждения: это минуты, а разница — между защищённым аккаунтом и полузащищённым.",
      },
      {
        title: "У смены телефона есть побочные эффекты",
        body: "Смену и удаление телефона Steam считает событием безопасности и может сопровождать временными удержаниями. Если собираетесь заменить арендованный номер своим или убрать его совсем, делайте это осознанно из раздела «Об аккаунте», пока ещё можете получать коды, — а не второпях перед обменом.",
      },
    ],
    faqs: [
      {
        q: "Нужен ли телефон, чтобы создать аккаунт Steam?",
        a: "Нет — регистрация проходит по одной почте, и базовому аккаунту этого действительно достаточно. Телефон становится нужен для Steam Guard по SMS, восстановления аккаунта и проверок вокруг обменов и Торговой площадки. Арендуйте номер тогда, когда Steam его действительно попросит.",
      },
      {
        q: "Снимет ли виртуальный номер задержки обменов и Площадки?",
        a: "Сам по себе — нет, и приукрашивать мы не станем. Удержания Valve завязаны на мобильный аутентификатор Steam Guard, а не на наличие телефона в аккаунте. Номер проводит вас через шаги телефонной верификации; а как работают удержания, реально меняет включённый в приложении Steam аутентификатор.",
      },
      {
        q: "Что будет, когда аренда номера закончится?",
        a: "Аккаунт продолжит работать: вы входите по паролю и Steam Guard, как и раньше. Если настроен аутентификатор, повседневная защита вообще не касается SMS. А если захотите вернуть SMS как запасной вариант, обновите телефон в разделе «Об аккаунте» на номер, который контролируете сейчас.",
      },
      {
        q: "Почему Steam не принял мой код?",
        a: "Обычно дело в формате: коды Steam смешивают буквы и цифры, и за O легко спрятаться нулю. Вводите код в точности как он выглядит в приложении SMS Code. Если SMS вовсе не пришла, проверьте код страны, отмените ожидающую активацию бесплатно и возьмите свежий номер.",
      },
      {
        q: "Меняет ли номер регион моего магазина Steam?",
        a: "Нет. Регион магазина определяется вашим местоположением и платёжными данными по правилам самой Valve — телефон здесь права голоса не имеет. Берите номер той страны, где аккаунт действительно живёт; прыгать по регионам с помощью номеров — не их назначение, и проверки Steam такое не поощряют.",
      },
    ],
  },
};
