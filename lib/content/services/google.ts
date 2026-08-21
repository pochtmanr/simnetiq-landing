import type { ServiceEntry } from "./types";

export const google: ServiceEntry = {
  slug: "google",
  name: "Google",
  logo: "/services/google.svg",
  category: "other",
  relatedSlugs: ["apple", "facebook", "twitter", "discord", "telegram"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "netherlands",
    "poland",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Google",
    message: "G-482915 is your Google verification code.",
    code: "G-482915",
  },
  en: {
    metaTitle: "Virtual Number for Google — Create a Gmail Without Your SIM",
    metaDescription:
      "Verify a new Google account with a real virtual number. Get the G-code in seconds, create a Gmail without your personal number, and keep it out of your Google profile.",
    hero: {
      title: "A virtual number for Google",
      intro: [
        "Creating a Google account is supposed to take a minute — until the sign-up form asks for a phone number. Google decides dynamically whether to require verification, and once it does, there's no way past that screen without receiving a real SMS. The code arrives from “Google” and looks like “G-482915”.",
        "With SMS Code you rent a real mobile number in one of 150+ countries, enter it on Google's verification screen, and the G-code appears in the app within seconds. Your new Gmail gets created — and your personal number stays out of it.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Google?",
      body: [
        "The number you verify with doesn't just unlock the sign-up — by default Google also saves it as a recovery method and a 2FA channel, quietly wiring your new account to your personal phone. If the whole point of the account is separation — a Gmail for one project, a developer test account, a sign-up address for newsletters — verifying with your own SIM defeats it before you've sent a single email. A virtual number keeps the new identity genuinely separate.",
        "There's a practical ceiling too: Google limits how many accounts a single phone number can verify. If your own number has already vouched for a Gmail or two, it may simply stop working for new ones. A fresh virtual number arrives without that history, so the verification goes through on the first try.",
      ],
    },
    howTo: {
      title: "How to verify a Google account with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose Google as the service and pick a country — the United States, United Kingdom or Germany are popular choices. One tap reserves a real mobile number just for you.",
        },
        {
          title: "Enter it on Google's verification screen",
          body: "Start the sign-up at accounts.google.com and fill in the basics. When Google asks to verify your phone number, select the number's country and type it in exactly — a wrong country code is the most common reason the SMS never arrives.",
        },
        {
          title: "Type in the G-code",
          body: "The SMS lands in the SMS Code app within seconds and reads “G-482915 is your Google verification code.” Enter the six digits (without the “G-” prefix if Google's field asks for digits only) and the account is created.",
        },
        {
          title: "Unhook the account from the rented number",
          body: "Right after signing in, open Google Account → Security. Remove or replace the phone number under recovery options, add an authenticator app and download backup codes, and set a recovery email. Done right, the account never depends on the rented number again.",
        },
      ],
    },
    tips: [
      {
        title: "“This phone number cannot be used for verification”",
        body: "Google actively screens out numbers it believes are VoIP or already overused, and rejects them with exactly this message. It happens; don't fight it. Cancel the pending activation in SMS Code — numbers that received nothing cost nothing — and try a fresh number, ideally from a different country.",
      },
      {
        title: "Don't leave the number as your recovery method",
        body: "Google auto-saves the verified number as account recovery and a 2FA channel. That's fine for a SIM in your pocket, not for a rented number. Swap it out in Google Account → Security straight after sign-up: an authenticator app plus backup codes and a recovery email cover every situation an SMS would.",
      },
      {
        title: "One number, limited accounts",
        body: "Google caps how many accounts a single number can verify over its lifetime — and it counts everyone who used that number before you. If a code arrives but Google still refuses the number, it has likely hit that ceiling. A fresh number from SMS Code starts the count from your activation.",
      },
    ],
    faqs: [
      {
        q: "Does Google always ask for a phone number at sign-up?",
        a: "No — Google decides case by case, based on signals like your IP, device and how the sign-up looks to its risk systems. Many sign-ups skip the phone step entirely; many others can't proceed without it. If your form does demand a number, a virtual one satisfies it the same way a SIM would.",
      },
      {
        q: "Will my Gmail keep working after the rented number expires?",
        a: "Yes. Google checks the number once, at verification. The account is not tied to the number staying active — especially if you follow our step four and replace it with an authenticator app, backup codes and a recovery email. After that, nothing about the account depends on the rented number.",
      },
      {
        q: "Google says the number can't be used for verification. Now what?",
        a: "That's Google's filter for numbers it suspects are VoIP or already linked to too many accounts. Cancel the activation in SMS Code — you aren't charged for a number that received nothing — and take a new one. Switching to a different country often gets a cleaner range.",
      },
      {
        q: "Can I create more than one Google account this way?",
        a: "Each account needs its own verification, and Google limits how many accounts one number can vouch for — so use a fresh number per account rather than reusing one. Keep it within Google's terms of service: separate accounts for a project, a team inbox or testing are normal use.",
      },
      {
        q: "What happens if Google asks to re-verify the number later?",
        a: "Re-verification prompts usually appear when Google doubts a login — new device, unusual location. If you've already replaced the rented number with an authenticator app, backup codes and a recovery email, you can pass those checks without any SMS. That's exactly why we recommend doing it on day one.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Google — создайте Gmail без своей SIM",
    metaDescription:
      "Подтвердите новый аккаунт Google настоящим виртуальным номером. Код G- придёт за секунды: создайте Gmail без личного номера и не привязывайте его к профилю.",
    hero: {
      title: "Виртуальный номер для Google",
      intro: [
        "Создание аккаунта Google должно занимать минуту — пока форма регистрации не попросит номер телефона. Google решает динамически, требовать ли подтверждение, и если потребовал, мимо этого экрана не пройти без настоящей SMS. Код приходит от отправителя «Google» и выглядит как «G-482915».",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 150+ стран, вводите его на экране подтверждения Google — и код G- появляется в приложении за считанные секунды. Новый Gmail создан, а ваш личный номер к нему не привязан.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Google?",
      body: [
        "Номер, которым вы подтверждаете регистрацию, не просто открывает дверь: по умолчанию Google сохраняет его как способ восстановления и канал 2FA, незаметно привязывая новый аккаунт к вашему личному телефону. Если смысл аккаунта именно в разделении — Gmail под отдельный проект, тестовый аккаунт разработчика, адрес для подписок на рассылки, — подтверждение своей SIM-картой перечёркивает затею ещё до первого письма. Виртуальный номер сохраняет новую личность по-настоящему отдельной.",
        "Есть и практический потолок: Google ограничивает, сколько аккаунтов может подтвердить один номер телефона. Если ваш собственный номер уже поручился за пару Gmail, для новых он может просто перестать работать. Свежий виртуальный номер приходит без этой истории — и подтверждение проходит с первого раза.",
      ],
    },
    howTo: {
      title: "Как подтвердить аккаунт Google виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Google и страну — часто берут США, Великобританию или Германию. Одно касание — и настоящий мобильный номер зарезервирован только для вас.",
        },
        {
          title: "Введите его на экране подтверждения Google",
          body: "Начните регистрацию на accounts.google.com и заполните основные поля. Когда Google попросит подтвердить номер телефона, выберите страну номера и введите его без ошибок: неверный код страны — самая частая причина, почему SMS так и не приходит.",
        },
        {
          title: "Введите код G-",
          body: "SMS придёт в приложение SMS Code за секунды и будет выглядеть так: «G-482915 is your Google verification code.» Введите шесть цифр (без префикса «G-», если поле Google принимает только цифры) — аккаунт создан.",
        },
        {
          title: "Отвяжите аккаунт от арендованного номера",
          body: "Сразу после входа откройте Аккаунт Google → Безопасность. Удалите или замените телефон в способах восстановления, добавьте приложение-аутентификатор и скачайте резервные коды, укажите резервную почту. После этого аккаунт больше никогда не зависит от арендованного номера.",
        },
      ],
    },
    tips: [
      {
        title: "«Этот номер телефона нельзя использовать для подтверждения»",
        body: "Google активно отсеивает номера, которые считает виртуальными (VoIP) или уже заезженными, и отклоняет их ровно с таким сообщением. Такое случается — не спорьте с системой. Отмените ожидающую активацию в SMS Code (номера, на которые ничего не пришло, ничего не стоят) и возьмите свежий номер, лучше из другой страны.",
      },
      {
        title: "Не оставляйте номер способом восстановления",
        body: "Google автоматически сохраняет подтверждённый номер как способ восстановления и канал 2FA. Для SIM-карты в вашем кармане это нормально, для арендованного номера — нет. Замените его в Аккаунт Google → Безопасность сразу после регистрации: приложение-аутентификатор, резервные коды и резервная почта закрывают все ситуации, где понадобилась бы SMS.",
      },
      {
        title: "Один номер — ограниченное число аккаунтов",
        body: "Google ограничивает, сколько аккаунтов один номер может подтвердить за всю свою историю, — и считает всех, кто пользовался этим номером до вас. Если код пришёл, а Google всё равно отказывает номеру, скорее всего, потолок достигнут. Свежий номер из SMS Code начинает отсчёт с вашей активации.",
      },
    ],
    faqs: [
      {
        q: "Google всегда просит номер телефона при регистрации?",
        a: "Нет — Google решает в каждом случае отдельно, опираясь на сигналы вроде IP-адреса, устройства и того, как регистрация выглядит для его антифрод-систем. Многие регистрации обходятся вообще без телефона; многие другие без него не продолжаются. Если ваша форма номер требует, виртуальный подойдёт так же, как SIM-карта.",
      },
      {
        q: "Gmail продолжит работать после окончания аренды номера?",
        a: "Да. Google проверяет номер один раз — на шаге подтверждения. Аккаунт не привязан к тому, чтобы номер оставался активным, особенно если вы выполнили наш четвёртый шаг и заменили его аутентификатором, резервными кодами и резервной почтой. После этого от арендованного номера в аккаунте не зависит ничего.",
      },
      {
        q: "Google пишет, что номер нельзя использовать для подтверждения. Что делать?",
        a: "Это фильтр Google для номеров, которые он подозревает в VoIP-происхождении или в привязке к слишком многим аккаунтам. Отмените активацию в SMS Code — за номер, на который ничего не пришло, деньги не списываются, — и возьмите новый. Смена страны часто даёт более «чистый» диапазон номеров.",
      },
      {
        q: "Можно ли так создать несколько аккаунтов Google?",
        a: "Каждому аккаунту нужно своё подтверждение, а Google ограничивает, за сколько аккаунтов может поручиться один номер, — поэтому берите свежий номер на каждый аккаунт, а не переиспользуйте один. И оставайтесь в рамках правил Google: отдельные аккаунты для проекта, командной почты или тестирования — нормальная практика.",
      },
      {
        q: "Что будет, если Google позже попросит подтвердить номер повторно?",
        a: "Запросы повторной проверки обычно появляются, когда Google сомневается во входе: новое устройство, необычное местоположение. Если вы уже заменили арендованный номер аутентификатором, резервными кодами и резервной почтой, эти проверки проходятся без всяких SMS. Именно поэтому мы советуем сделать замену в первый же день.",
      },
    ],
  },
};
