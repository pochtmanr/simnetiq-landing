import type { ServiceEntry } from "./types";

export const tiktok: ServiceEntry = {
  slug: "tiktok",
  name: "TikTok",
  logo: "/services/tiktok.svg",
  category: "social",
  relatedSlugs: ["instagram", "snapchat", "twitter", "facebook", "discord"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "indonesia",
    "philippines",
    "brazil",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "TikTok",
    message: "[TikTok] 604812 is your verification code, valid for 5 minutes.",
    code: "604812",
  },
  en: {
    metaTitle: "Virtual Number for TikTok — Sign Up Without a SIM Card",
    metaDescription:
      "Get a real virtual number for TikTok verification in seconds. Register extra creator accounts, pick the country you want, and keep your personal number off the app.",
    hero: {
      title: "A virtual number for TikTok",
      intro: [
        "TikTok lets you sign up with a phone number or an email, but the phone route is the one it keeps coming back to: a 4–6 digit SMS code confirms the sign-up, and the same number is later used for login-by-code and account recovery. Whatever number you enter on day one quietly becomes part of the account's identity.",
        "With SMS Code you rent a real number in one of 50+ countries, enter it on TikTok's sign-up screen, and the verification code lands in the app within seconds. Your personal number stays out of it — useful whether you're protecting your privacy or building out a roster of creator accounts.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for TikTok?",
      body: [
        "For creators, the country of the number is more than a formality. TikTok localizes the feed and some features using region signals — the phone number among them, alongside your IP and device locale. A number from the market you want to reach won't override the other signals on its own, but it's one lever you actually control, and it's the cheapest one to pull when you're setting up an account aimed at, say, US or Indonesian audiences.",
        "The other reason is separation. Creators routinely run one account per niche or per brand, and each phone-verified account needs its own number — TikTok won't let a single number anchor them all. Agencies face the same problem from the client side: managing someone's brand account shouldn't mean wiring it to your personal SIM. A rented number gives every account its own contact identity without a drawer full of SIM cards.",
      ],
    },
    howTo: {
      title: "How to verify TikTok with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose TikTok as the service and pick a country — ideally the market your content is aimed at. One tap reserves a real mobile number just for you.",
        },
        {
          title: "Enter it on TikTok's sign-up screen",
          body: "Choose “Use phone or email”, stay on the phone tab, select the matching country code and type the number. A country-code mismatch is the most common reason a code never shows up.",
        },
        {
          title: "Grab the code from SMS Code",
          body: "TikTok sends a 4–6 digit code — something like “[TikTok] 604812 is your verification code, valid for 5 minutes.” It appears in the SMS Code app within seconds; enter it before it expires and finish creating the account.",
        },
        {
          title: "Bind an email straight away",
          body: "In Settings and privacy → Account, add an email address and verify it, then move two-step verification onto email or an authenticator where possible. That way the account doesn't depend on the rented number once its activation window ends.",
        },
      ],
    },
    tips: [
      {
        title: "Don't hammer the “Resend code” button",
        body: "TikTok throttles repeated SMS requests from the same number. If nothing arrives in a couple of minutes, wait before re-requesting — or cancel the activation in SMS Code (free when no SMS came through) and take a fresh number instead of retrying the same one.",
      },
      {
        title: "Match the number to your app region",
        body: "The number is one region signal among several — TikTok also looks at your IP and device locale. If you're taking a number to target a specific market, keep the rest consistent: a Brazilian number with everything else pointing elsewhere sends TikTok mixed messages.",
      },
      {
        title: "One number per account",
        body: "Each phone-verified TikTok account needs its own number, and a number already tied to an account can't verify a new one. Running several niches or client brands? Rent a separate activation for each and keep a note of which number opened which account.",
      },
    ],
    faqs: [
      {
        q: "Will my TikTok account keep working after the number expires?",
        a: "Yes. The number is needed at the verification step, not for day-to-day use. Bind and verify an email right after signing up and move two-step verification off SMS — then logins and recovery run through channels you still control.",
      },
      {
        q: "Does the number's country change what TikTok shows me?",
        a: "It's one of the signals. TikTok localizes content and some features by region, reading your phone number's country alongside your IP address and device locale. A number from your target market nudges the account that way, but it doesn't override the other signals by itself.",
      },
      {
        q: "Can I run several TikTok accounts with virtual numbers?",
        a: "Yes — that's the standard setup for creators with one account per niche and for agencies handling client brands. Each phone-verified account needs its own number, so rent a separate activation per account rather than reusing one.",
      },
      {
        q: "Why didn't my TikTok code arrive?",
        a: "Check the country code first — a mismatch is the usual culprit. TikTok also throttles repeated SMS requests, so rapid resends can silence the code entirely. Wait a couple of minutes, or cancel the pending activation in SMS Code — you're not charged for numbers that received nothing — and take a fresh number.",
      },
      {
        q: "Can an agency verify a client's TikTok account this way?",
        a: "Yes, and it's cleaner than the alternative: the account gets its own contact identity instead of being anchored to an employee's personal SIM. Set up email recovery on an address the client controls, so the account isn't tied to the rented number — or to your team — long-term.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для TikTok — регистрация без SIM-карты",
    metaDescription:
      "Настоящий виртуальный номер для подтверждения TikTok за секунды. Заводите дополнительные аккаунты, выбирайте нужную страну и не светите личный номер в приложении.",
    hero: {
      title: "Виртуальный номер для TikTok",
      intro: [
        "В TikTok можно зарегистрироваться по номеру телефона или по почте, но именно к телефону сервис возвращается снова и снова: SMS-код из 4–6 цифр подтверждает регистрацию, а дальше тот же номер используется для входа по коду и восстановления аккаунта. Какой номер вы ввели в первый день — тот незаметно и становится частью личности аккаунта.",
        "С SMS Code вы арендуете настоящий номер в одной из 50+ стран, вводите его на экране регистрации TikTok — и код подтверждения появляется в приложении за считанные секунды. Ваш личный номер остаётся в стороне: и когда вы бережёте приватность, и когда выстраиваете целую сетку авторских аккаунтов.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для TikTok?",
      body: [
        "Для авторов страна номера — не просто формальность. TikTok локализует ленту и часть функций по региональным сигналам, и номер телефона — один из них, наряду с IP-адресом и языком устройства. Номер из нужного рынка сам по себе не перевесит остальные сигналы, но это тот рычаг, который действительно в ваших руках, — и самый дешёвый, когда вы заводите аккаунт под, скажем, американскую или индонезийскую аудиторию.",
        "Вторая причина — разделение. Авторы обычно ведут по аккаунту на нишу или на бренд, и каждому аккаунту с подтверждением по телефону нужен собственный номер — один номер на всех TikTok не разрешит. У агентств та же проблема с другой стороны: вести аккаунт клиентского бренда — не повод привязывать его к личной SIM-карте сотрудника. Арендованный номер даёт каждому аккаунту отдельную контактную личность без ящика, набитого симками.",
      ],
    },
    howTo: {
      title: "Как подтвердить TikTok виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис TikTok и страну — в идеале тот рынок, на который рассчитан контент. Одно касание — и настоящий мобильный номер зарезервирован за вами.",
        },
        {
          title: "Введите его на экране регистрации TikTok",
          body: "Выберите «Телефон или почта», останьтесь на вкладке телефона, укажите соответствующий код страны и введите номер. Несовпадение кода страны с номером — самая частая причина, почему код так и не приходит.",
        },
        {
          title: "Заберите код из SMS Code",
          body: "TikTok пришлёт код из 4–6 цифр — что-то вроде «[TikTok] 604812 is your verification code, valid for 5 minutes.» Он появится в приложении SMS Code за секунды; введите его до истечения срока и завершите создание аккаунта.",
        },
        {
          title: "Сразу привяжите почту",
          body: "В «Настройки и конфиденциальность» → «Аккаунт» добавьте адрес электронной почты и подтвердите его, а двухэтапную проверку по возможности переведите на почту или приложение-аутентификатор. Тогда аккаунт не будет зависеть от арендованного номера после окончания окна активации.",
        },
      ],
    },
    tips: [
      {
        title: "Не долбите кнопку «Отправить код ещё раз»",
        body: "TikTok ограничивает частые запросы SMS на один номер. Если код не пришёл за пару минут, выждите паузу перед повторным запросом — или отмените активацию в SMS Code (бесплатно, если SMS не поступила) и возьмите свежий номер вместо того, чтобы дёргать тот же самый.",
      },
      {
        title: "Подбирайте номер под регион приложения",
        body: "Номер — лишь один из региональных сигналов: TikTok смотрит ещё на IP и язык устройства. Если берёте номер под конкретный рынок, держите остальное в согласии с ним: бразильский номер при всём прочем, указывающем в другую сторону, посылает TikTok противоречивые сигналы.",
      },
      {
        title: "Один номер — один аккаунт",
        body: "Каждому аккаунту TikTok с подтверждением по телефону нужен свой номер, а номер, уже привязанный к аккаунту, новый не подтвердит. Ведёте несколько ниш или клиентских брендов? Арендуйте отдельную активацию под каждый и записывайте, какой номер открыл какой аккаунт.",
      },
    ],
    faqs: [
      {
        q: "Аккаунт TikTok продолжит работать после окончания аренды номера?",
        a: "Да. Номер нужен на шаге подтверждения, а не в повседневной работе. Сразу после регистрации привяжите и подтвердите почту, а двухэтапную проверку переведите с SMS на другой способ — тогда вход и восстановление пойдут через каналы, которые остаются под вашим контролем.",
      },
      {
        q: "Влияет ли страна номера на то, что TikTok мне показывает?",
        a: "Это один из сигналов. TikTok локализует контент и часть функций по региону, учитывая страну номера телефона наряду с IP-адресом и языком устройства. Номер из целевого рынка подталкивает аккаунт в нужную сторону, но сам по себе остальные сигналы не перевешивает.",
      },
      {
        q: "Можно ли вести несколько аккаунтов TikTok на виртуальных номерах?",
        a: "Да — это стандартная схема и для авторов с аккаунтом на каждую нишу, и для агентств с клиентскими брендами. Каждому аккаунту с подтверждением по телефону нужен собственный номер, поэтому берите отдельную активацию под каждый, а не используйте один повторно.",
      },
      {
        q: "Почему не пришёл код TikTok?",
        a: "Сначала проверьте код страны — несовпадение и есть обычный виновник. Кроме того, TikTok ограничивает частые запросы SMS: серия быстрых повторов может заглушить код совсем. Подождите пару минут или отмените ожидающую активацию в SMS Code — за номера, на которые ничего не пришло, деньги не списываются, — и возьмите новый номер.",
      },
      {
        q: "Может ли агентство подтвердить клиентский аккаунт TikTok таким способом?",
        a: "Да, и это чище альтернативы: аккаунт получает собственную контактную личность вместо привязки к личной SIM-карте сотрудника. Настройте восстановление через почту, которой владеет клиент, — тогда аккаунт в долгую не будет зависеть ни от арендованного номера, ни от вашей команды.",
      },
    ],
  },
};
