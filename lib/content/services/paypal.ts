import type { ServiceEntry } from "./types";

export const paypal: ServiceEntry = {
  slug: "paypal",
  name: "PayPal",
  logo: "/services/paypal.svg",
  category: "finance",
  relatedSlugs: ["aliexpress", "uber", "apple", "google", "steam"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "france",
    "netherlands",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "PayPal",
    message: "Your PayPal security code is: 305174. It expires in 10 minutes.",
    code: "305174",
  },
  en: {
    metaTitle: "Virtual Number for PayPal — Read This Before You Verify",
    metaDescription:
      "PayPal texts a security code at sign-up, and a virtual number can receive it. But on a money account the number is a security anchor — here’s the honest trade-off.",
    hero: {
      title: "A virtual number for PayPal",
      intro: [
        "PayPal confirms a phone number early: during sign-up it texts “Your PayPal security code is: 305174. It expires in 10 minutes.” and won’t move on until the code is entered. From that moment the number isn’t a formality — it becomes part of how PayPal decides whether a login, a payment or a limit change is really you.",
        "A virtual number from SMS Code receives that code in seconds, like any real mobile number. But PayPal is a money account, and we’d rather be straight with you than sell you a shortcut: read the trade-offs below before you verify, and decide where the number should — and shouldn’t — sit in your account’s security.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for PayPal?",
      body: [
        "The privacy case is real. A payment company’s database is a magnet for marketing lists and, occasionally, leaks; your phone number is the piece that links a payment profile to the rest of your life. Renting a number for the one-time sign-up SMS keeps your personal number out of that record while still proving to PayPal that a real phone answered.",
        "Now the honest part. PayPal keeps using the verified number for step-up checks — a login from a new device, a security review, a limit checkpoint. If one of those checks fires after your rented number’s activation window has closed, you’re locked out of an account with money in it, and recovery means support tickets and identity documents rather than a tap. So our actual recommendation: use the virtual number for the sign-up code, then move ongoing security onto channels you’ll always control — your email, an authenticator app, and, if you keep real balances there, a phone number that lives in your pocket.",
      ],
    },
    howTo: {
      title: "How to verify PayPal with a virtual number",
      steps: [
        {
          title: "Rent a number in the right country",
          body: "In SMS Code choose PayPal and pick the country your PayPal account is registered in. PayPal accounts are country-specific, and a number from a different country than the account is a mismatch its risk checks notice.",
        },
        {
          title: "Enter it at the phone step",
          body: "During sign-up — or in settings, when PayPal asks to confirm a phone — select the matching country code and type the number exactly.",
        },
        {
          title: "Type in the code quickly",
          body: "The SMS says “Your PayPal security code is: 305174. It expires in 10 minutes.” It reaches the SMS Code app in seconds — enter it before the ten minutes run out.",
        },
        {
          title: "Move security onto channels you control",
          body: "Straight away, confirm your email, set a strong unique password and add an authenticator app in PayPal’s security settings. If you’ll hold real money in the account, replace the rented number with one you can always reach — an unreachable security number on a money account is a risk, not a convenience.",
        },
      ],
    },
    tips: [
      {
        title: "Country consistency is not optional",
        body: "PayPal ties the account to a country at sign-up — address, bank, cards and phone are expected to agree. A number from the same country as the account keeps checks quiet; a mismatched one invites reviews. Pick the country deliberately.",
      },
      {
        title: "Treat the number as a one-time tool",
        body: "The rented number is excellent at one job: receiving the sign-up code without exposing your own. It is a poor permanent 2FA anchor for an account that holds money — its activation window ends, PayPal’s security prompts don’t. Swap it out as soon as the account is set up.",
      },
      {
        title: "Stay inside PayPal’s rules",
        body: "PayPal’s terms require accurate account information, and its checks get stricter as money moves. Use a virtual number to keep your personal phone private — not to pretend to be someone or somewhere you’re not. Misrepresented accounts are the ones that end up limited.",
      },
    ],
    faqs: [
      {
        q: "Can a virtual number receive PayPal’s verification SMS?",
        a: "Yes — it’s a real mobile number on a real network, and PayPal’s sign-up code arrives in the SMS Code app within seconds. The code expires in ten minutes, so have the sign-up screen open when you request it.",
      },
      {
        q: "Is it safe to leave the rented number on my PayPal account?",
        a: "As a permanent security contact — no, and we won’t pretend otherwise. PayPal texts that number when it doubts a login or reviews the account; if the number’s activation window has ended, those checks fail. Keep it for the sign-up step, then replace it with your email, an authenticator app and a number you control.",
      },
      {
        q: "What if PayPal asks for an SMS after my number expired?",
        a: "That’s exactly the scenario to plan around. Expect a slower path: proving your identity to PayPal support with documents, which can take days and may limit the account meanwhile. Doing step four on day one — moving security onto channels you own — means this situation simply never comes up.",
      },
      {
        q: "Does the number’s country have to match my PayPal country?",
        a: "Yes, make them match. PayPal accounts are opened for a specific country, and the phone is part of that picture. A same-country number keeps verification smooth; a foreign one is a flag that can trigger extra review even when everything else is in order.",
      },
      {
        q: "Is signing up for PayPal with a virtual number allowed?",
        a: "PayPal verifies that you control a working number; renting one for privacy at the SMS step does that honestly. What PayPal’s terms do demand is truthful account information — your real name, your real country. Use the virtual number to protect your privacy, not to disguise your identity, and you’re using it the way it’s meant to be used.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для PayPal — прочитайте до подтверждения",
    metaDescription:
      "PayPal присылает код безопасности при регистрации — виртуальный номер его примет. Но у денежного аккаунта номер — якорь безопасности. Честно о компромиссах.",
    hero: {
      title: "Виртуальный номер для PayPal",
      intro: [
        "PayPal проверяет телефон с самого начала: при регистрации приходит SMS «Your PayPal security code is: 305174. It expires in 10 minutes.», и дальше без кода не пройти. С этого момента номер — не формальность: он становится частью того, как PayPal решает, действительно ли это вы входите, платите или меняете лимиты.",
        "Виртуальный номер из SMS Code примет этот код за секунды, как любой настоящий мобильный. Но PayPal — это счёт с деньгами, и мы предпочитаем честность продаже коротких путей: прочитайте о компромиссах ниже, прежде чем подтверждать, и решите, какое место номеру можно — а какое нельзя — занимать в безопасности аккаунта.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для PayPal?",
      body: [
        "Довод приватности реален. База платёжной компании притягивает маркетинговые списки, а иногда и утечки; именно телефон связывает платёжный профиль с остальной вашей жизнью. Аренда номера ради разовой регистрационной SMS оставляет личный номер за пределами этой записи — а PayPal при этом честно убеждается, что на настоящий телефон ответили.",
        "Теперь честная часть. PayPal продолжает использовать подтверждённый номер для усиленных проверок: вход с нового устройства, проверка безопасности, контрольная точка лимитов. Если такая проверка случится после окончания окна активации арендованного номера, вы окажетесь отрезаны от аккаунта, где лежат деньги, — а восстановление означает обращения в поддержку и документы, а не одно касание. Поэтому наша настоящая рекомендация: используйте виртуальный номер для кода регистрации, а постоянную безопасность перенесите на каналы, которые всегда под вашим контролем, — почту, приложение-аутентификатор и, если держите там реальные суммы, номер из собственного кармана.",
      ],
    },
    howTo: {
      title: "Как подтвердить PayPal виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в правильной стране",
          body: "В SMS Code выберите PayPal и страну, в которой зарегистрирован ваш аккаунт PayPal. Аккаунты PayPal привязаны к стране, и номер из другой страны — несоответствие, которое его антифрод-проверки замечают.",
        },
        {
          title: "Введите его на телефонном шаге",
          body: "При регистрации — или в настройках, когда PayPal попросит подтвердить телефон, — выберите соответствующий код страны и введите номер без ошибок.",
        },
        {
          title: "Введите код быстро",
          body: "SMS гласит: «Your PayPal security code is: 305174. It expires in 10 minutes.» Она доходит до приложения SMS Code за секунды — введите код, пока не истекли десять минут.",
        },
        {
          title: "Перенесите безопасность на свои каналы",
          body: "Сразу же подтвердите почту, поставьте надёжный уникальный пароль и добавьте приложение-аутентификатор в настройках безопасности PayPal. Если будете держать в аккаунте реальные деньги, замените арендованный номер тем, до которого всегда дотянетесь: недоступный номер безопасности на денежном счёте — это риск, а не удобство.",
        },
      ],
    },
    tips: [
      {
        title: "Совпадение стран — не пожелание",
        body: "PayPal привязывает аккаунт к стране при регистрации: адрес, банк, карты и телефон должны сходиться. Номер той же страны, что и аккаунт, оставляет проверки тихими; чужой — приглашает разбирательства. Выбирайте страну осознанно.",
      },
      {
        title: "Относитесь к номеру как к разовому инструменту",
        body: "Арендованный номер отлично справляется с одной задачей: принять регистрационный код, не раскрывая ваш собственный. Но как постоянный якорь 2FA для счёта с деньгами он плох: окно активации заканчивается, а проверки PayPal — нет. Замените его, как только аккаунт настроен.",
      },
      {
        title: "Оставайтесь в рамках правил PayPal",
        body: "Правила PayPal требуют достоверных данных аккаунта, и чем активнее движутся деньги, тем строже проверки. Используйте виртуальный номер, чтобы сохранить личный телефон в тайне, а не чтобы выдавать себя за кого-то или откуда-то ещё. Ограничивают именно аккаунты с искажёнными данными.",
      },
    ],
    faqs: [
      {
        q: "Виртуальный номер примет проверочную SMS от PayPal?",
        a: "Да — это настоящий мобильный номер в реальной сети, и регистрационный код PayPal приходит в приложение SMS Code за секунды. Код действует десять минут, поэтому запрашивайте его с открытым экраном регистрации.",
      },
      {
        q: "Безопасно ли оставить арендованный номер в аккаунте PayPal?",
        a: "Как постоянный контакт безопасности — нет, и делать вид, что иначе, мы не будем. PayPal пишет на этот номер, когда сомневается во входе или проверяет аккаунт; если окно активации номера закончилось, такие проверки проваливаются. Используйте его на шаге регистрации, а затем замените почтой, приложением-аутентификатором и номером под вашим контролем.",
      },
      {
        q: "Что если PayPal попросит SMS после окончания аренды номера?",
        a: "Именно этот сценарий и нужно планировать заранее. Готовьтесь к долгому пути: подтверждение личности через поддержку PayPal с документами, которое может занять дни, а аккаунт тем временем могут ограничить. Четвёртый шаг, сделанный в первый же день, — перенос безопасности на свои каналы — означает, что эта ситуация просто не наступит.",
      },
      {
        q: "Страна номера должна совпадать со страной моего PayPal?",
        a: "Да, добейтесь совпадения. Аккаунт PayPal открывается для конкретной страны, и телефон — часть этой картины. Номер той же страны делает проверку гладкой; иностранный — флажок, из-за которого дополнительная проверка возможна, даже когда всё остальное в порядке.",
      },
      {
        q: "Разрешено ли регистрироваться в PayPal с виртуальным номером?",
        a: "PayPal проверяет, что вы контролируете работающий номер; аренда номера ради приватности на шаге SMS делает это честно. А вот чего правила PayPal требуют строго — достоверных данных: настоящего имени, настоящей страны. Используйте виртуальный номер, чтобы защитить приватность, а не чтобы скрыть личность, — и вы используете его по назначению.",
      },
    ],
  },
};
