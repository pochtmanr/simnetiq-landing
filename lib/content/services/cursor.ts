import type { ServiceEntry } from "./types";

export const cursor: ServiceEntry = {
  slug: "cursor",
  name: "Cursor",
  logo: "/services/cursor.svg",
  category: "dev",
  relatedSlugs: ["google", "discord", "apple", "telegram", "steam"],
  popularCountries: [
    "united-states",
    "germany",
    "united-kingdom",
    "netherlands",
    "canada",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Cursor",
    message: "Your Cursor verification code is 812750",
    code: "812750",
  },
  en: {
    metaTitle: "Virtual Number for Cursor — Verify Your Dev Account",
    metaDescription:
      "Verify Cursor sign-up with a real virtual number. The SMS code arrives in the SMS Activate app in seconds — keep your personal number out of dev-tool accounts.",
    hero: {
      title: "A virtual number for Cursor",
      intro: [
        "Cursor — the AI-powered code editor — sits on the same treadmill as every dev tool that gives compute away: free tiers attract abuse, so sign-ups get gated. Alongside email confirmation, Cursor can ask to verify a phone number by SMS before an account or trial goes live, precisely because a working mobile number is harder to mass-produce than an inbox.",
        "SMS Activate rents you a real number in one of 50+ countries. When Cursor's sign-up asks for a phone, enter the rented one — the six-digit code appears in the SMS Activate app within seconds, and your personal number stays out of one more SaaS database.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Cursor?",
      body: [
        "Developers accumulate accounts the way workbenches accumulate screwdrivers — editors, clouds, APIs, CI services — and each one increasingly wants a phone number. Wiring your personal number into all of them means every vendor breach, marketing list and account-linkage graph includes it. Keeping a rented number between your dev-tool identities and your real one is the same instinct as using a work email: separation by default, with your actual number reserved for people, not platforms.",
        "There's also a legitimately technical use case. If you're building or QA-testing a sign-up flow — your own product's, or evaluating how Cursor's onboarding behaves for a clean user — you need a real number that genuinely receives SMS, not your own number burned on a test account. A rented activation gives you exactly that: one real receiving number, used once, no SIM drawer required.",
      ],
    },
    howTo: {
      title: "How to verify Cursor with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Activate",
          body: "Open the SMS Activate app, choose Cursor as the service and pick a country — the US, Germany or the Netherlands are typical picks for dev tools. The number is reserved for you instantly.",
        },
        {
          title: "Sign up and enter the number",
          body: "Create your Cursor account with an email you control. When the flow asks to verify a phone number, type in the rented one with its matching country code.",
        },
        {
          title: "Enter the code from SMS Activate",
          body: "The SMS lands in the SMS Activate app within seconds — “Your Cursor verification code is 812750”. Paste the six digits into Cursor's verification field and you're through.",
        },
        {
          title: "Secure the account itself",
          body: "Finish with the basics: a strong unique password and a confirmed email. Cursor's day-to-day login runs on those, not on SMS — the phone check was a one-time gate, not a recurring one.",
        },
      ],
    },
    tips: [
      {
        title: "Have the sign-up open before you rent",
        body: "Verification codes are short-lived and the activation window is finite. Get Cursor's phone-verification screen in front of you first, then rent the number and request the code — the SMS arrives in seconds when you're ready for it.",
      },
      {
        title: "The email is the account; the phone is the gate",
        body: "Cursor identifies you by your email login, and license or subscription questions go through it. Use a mailbox you'll keep, and the account outlives the rented number's activation window without a hiccup.",
      },
      {
        title: "One account, within the rules",
        body: "Phone gates exist because free tiers get farmed. Use a virtual number to keep your personal number private on your genuine account — not to stack trial accounts, which violates Cursor's terms and tends to end in banned accounts.",
      },
    ],
    faqs: [
      {
        q: "Does Cursor always ask for a phone number?",
        a: "Not necessarily — like many dev tools, Cursor applies phone verification selectively, often depending on sign-up signals and abuse pressure. If and when the prompt appears, a rented virtual number satisfies it in seconds.",
      },
      {
        q: "Will my Cursor account keep working after the number expires?",
        a: "Yes. The SMS check happens at sign-up; afterwards you log in with email and password. The rented number ending its activation window changes nothing about an account you're already using.",
      },
      {
        q: "Can I use a virtual number to test my own product's SMS sign-up flow?",
        a: "Yes — that's a genuinely useful dev pattern. A rented number is a real receiving number on a real carrier, so you can walk through an OTP flow end-to-end as a fresh user without burning your personal number on a test account.",
      },
      {
        q: "Why didn't my Cursor verification code arrive?",
        a: "Most often a country-code mismatch, or the service rejected that particular range of numbers. Cancel the activation in SMS Activate — no SMS received means no charge — and retry with a different number or country.",
      },
      {
        q: "Is it allowed to verify Cursor with a virtual number?",
        a: "The check confirms you control a real number, and a rented one is exactly that. What matters is what you do next: one genuine account used within Cursor's terms is fine; farming multiple free trials is not, virtual number or no.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Cursor — подтвердите аккаунт разработчика",
    metaDescription:
      "Подтвердите регистрацию в Cursor настоящим виртуальным номером. SMS с кодом придёт в приложение SMS Activate за секунды — личный номер останется при вас.",
    hero: {
      title: "Виртуальный номер для Cursor",
      intro: [
        "Cursor — редактор кода с ИИ — крутится в том же колесе, что и любой инструмент разработчика, раздающий вычисления бесплатно: бесплатные тарифы притягивают злоупотребления, и регистрацию начинают закрывать шлагбаумами. Помимо подтверждения почты Cursor может запросить проверку номера телефона по SMS, прежде чем аккаунт или триал заработает: живой мобильный номер штамповать сложнее, чем почтовый ящик.",
        "SMS Activate сдаёт вам настоящий номер в одной из 50+ стран. Когда регистрация Cursor спросит телефон, введите арендованный — шестизначный код появится в приложении SMS Activate за секунды, а ваш личный номер минует ещё одну базу очередного SaaS.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Cursor?",
      body: [
        "Аккаунты у разработчика копятся, как отвёртки на верстаке: редакторы, облака, API, CI-сервисы — и каждый всё настойчивее просит номер телефона. Вшить личный номер во все подряд — значит включить его в каждую утечку у вендора, каждую маркетинговую рассылку и каждый граф связей между аккаунтами. Держать арендованный номер между рабочими идентичностями и настоящей — тот же инстинкт, что и рабочая почта: разделение по умолчанию, а собственный номер — для людей, а не для платформ.",
        "Есть и по-настоящему технический сценарий. Если вы разрабатываете или тестируете флоу регистрации — в своём продукте или проверяете, как онбординг Cursor выглядит для чистого пользователя, — нужен настоящий номер, реально принимающий SMS, а не собственный номер, сожжённый на тестовом аккаунте. Арендованная активация даёт ровно это: один живой принимающий номер, один раз, и никакого ящика с SIM-картами.",
      ],
    },
    howTo: {
      title: "Как подтвердить Cursor виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Activate",
          body: "Откройте приложение SMS Activate, выберите сервис Cursor и страну — для инструментов разработки обычно берут США, Германию или Нидерланды. Номер резервируется за вами мгновенно.",
        },
        {
          title: "Зарегистрируйтесь и введите номер",
          body: "Создайте аккаунт Cursor на почту, которая под вашим контролем. Когда флоу попросит подтвердить телефон, введите арендованный номер с соответствующим кодом страны.",
        },
        {
          title: "Введите код из SMS Activate",
          body: "SMS придёт в приложение SMS Activate за секунды: «Your Cursor verification code is 812750». Вставьте шесть цифр в поле подтверждения Cursor — и вы внутри.",
        },
        {
          title: "Защитите сам аккаунт",
          body: "Завершите базовыми вещами: надёжный уникальный пароль и подтверждённая почта. Повседневный вход в Cursor держится на них, а не на SMS — проверка телефона была разовым шлагбаумом, а не постоянным.",
        },
      ],
    },
    tips: [
      {
        title: "Сначала откройте регистрацию, потом арендуйте",
        body: "Коды подтверждения живут недолго, и окно активации не бесконечно. Сначала выведите перед собой экран проверки телефона в Cursor, затем арендуйте номер и запрашивайте код — SMS придёт за секунды, когда вы к ней готовы.",
      },
      {
        title: "Почта — это аккаунт, телефон — только шлагбаум",
        body: "Cursor опознаёт вас по почтовому логину, и вопросы лицензий и подписок решаются через него. Используйте ящик, который останется с вами, — и аккаунт переживёт окно активации арендованного номера без единой заминки.",
      },
      {
        title: "Один аккаунт — и по правилам",
        body: "Телефонные шлагбаумы появились потому, что бесплатные тарифы «фармят». Виртуальный номер нужен, чтобы личный номер не светился в вашем настоящем аккаунте, а не чтобы плодить триалы — это нарушает правила Cursor и обычно кончается баном.",
      },
    ],
    faqs: [
      {
        q: "Cursor всегда спрашивает номер телефона?",
        a: "Не обязательно: как многие инструменты разработки, Cursor включает проверку телефона выборочно — в зависимости от сигналов при регистрации и наплыва злоупотреблений. Если запрос появится, арендованный виртуальный номер закроет его за секунды.",
      },
      {
        q: "Будет ли аккаунт Cursor работать после окончания аренды номера?",
        a: "Да. SMS-проверка происходит при регистрации; дальше вы входите по почте и паролю. Закрытие окна активации арендованного номера ничего не меняет для аккаунта, которым вы уже пользуетесь.",
      },
      {
        q: "Можно ли тестировать SMS-регистрацию своего продукта через виртуальный номер?",
        a: "Да — это по-настоящему полезный приём разработчика. Арендованный номер — реальный принимающий номер в сети настоящего оператора, так что OTP-флоу можно пройти от начала до конца глазами нового пользователя, не сжигая личный номер на тестовом аккаунте.",
      },
      {
        q: "Почему не пришёл код подтверждения Cursor?",
        a: "Чаще всего не совпал код страны либо сервис отклонил конкретный диапазон номеров. Отмените активацию в SMS Activate — нет SMS, нет и списания — и повторите с другим номером или другой страной.",
      },
      {
        q: "Разрешено ли подтверждать Cursor виртуальным номером?",
        a: "Проверка удостоверяет, что настоящий номер под вашим контролем, — арендованный номер именно таков. Важно, что вы делаете дальше: один настоящий аккаунт в рамках правил Cursor — нормально; фарм бесплатных триалов — нет, с виртуальным номером или без.",
      },
    ],
  },
};
