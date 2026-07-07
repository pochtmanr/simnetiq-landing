import type { BlogPost } from "./types";

export const esimVsVirtualNumber: BlogPost = {
  slug: "esim-vs-virtual-number",
  publishedAt: "2026-07-07",
  updatedAt: "2026-07-07",
  tags: ["Guide", "eSIM"],
  relatedServiceSlugs: ["telegram", "whatsapp"],
  en: {
    title: "eSIM vs Virtual Number: Which One Do You Actually Need?",
    description:
      "They sound alike and get sold side by side — but an eSIM and a virtual number solve completely different problems. A plain-language guide to picking the right one.",
    excerpt:
      "One is a carrier plan living inside your phone; the other is a number you rent for a verification code. Confusing them costs real money — here’s how to tell which one your problem needs.",
    blocks: [
      {
        type: "p",
        text: "“Do I need an eSIM or a virtual number?” is one of those questions where the asker usually has a specific problem — a trip next week, a sign-up form demanding a phone number — and the internet answers with marketing for both. The two products sound alike, live in similar app-store categories, and are regularly sold by the same companies. They are not the same thing.",
      },
      {
        type: "p",
        text: "Mixing them up isn’t just a vocabulary slip; it costs money. People buy a travel eSIM expecting to receive verification texts on it and discover — mid-trip, at the exact moment a bank or messenger wants a code — that their eSIM can’t receive SMS at all. Others rent virtual numbers month after month when all they wanted was mobile data.",
      },
      {
        type: "p",
        text: "This guide draws the line clearly: what each one actually is, a side-by-side comparison, a decision rule you can apply in ten seconds, and the edge cases where the two worlds genuinely overlap.",
      },
      {
        type: "h2",
        id: "two-different-tools",
        text: "Two different tools that happen to share a shelf",
      },
      {
        type: "p",
        text: "An eSIM is a real carrier plan embedded in your device. It’s the same thing as the plastic SIM card in your tray, minus the plastic: a profile downloaded into your phone’s hardware that connects it to a mobile network. With it come the things a network connection provides — mobile data first and foremost, and depending on the plan, calls and texts. You install it in your phone’s settings, and your phone is what carries it.",
      },
      {
        type: "p",
        text: "A virtual number is a number you rent to receive SMS, and it never touches your device’s hardware. The number lives on the provider’s side; incoming messages show up in an app. Nothing is installed in your settings, no network profile changes, your existing SIM and data plan aren’t involved. You use it for the moment a service wants to text you a code — and that’s the whole job.",
      },
      {
        type: "p",
        text: "In short: an eSIM connects your device to a network. A virtual number receives a message on your behalf. One is infrastructure, the other is an errand.",
      },
      { type: "h2", id: "side-by-side", text: "Side by side" },
      {
        type: "list",
        items: [
          "Cost model — an eSIM is a plan: you pay for a bundle of data (and sometimes minutes/texts) that runs for days or weeks. A virtual number is pay-per-use: one activation, one code received, paid from a credit pack. For a single verification code, a plan is overkill; for two weeks of maps and messengers abroad, per-SMS pricing is the wrong shape entirely.",
          "Setup — an eSIM is provisioned into the phone: QR code or app, a new line appears in your cellular settings, and your device must support eSIM at all. A virtual number needs no provisioning: open the app, pick a service and country, the number is on screen in seconds.",
          "What you get — an eSIM gives connectivity: data, a network indicator, often a phone line. A virtual number gives exactly one capability: receiving the SMS sent to it, shown in the app.",
          "How long you keep it — an eSIM lasts as long as the plan does, and a local one can be topped up indefinitely. A virtual number is rented for an activation window — long enough for a sign-up code, not meant to be your number for years.",
          "What it’s for — eSIM: being online abroad, a data line for a tablet, a local plan without hunting for a SIM kiosk. Virtual number: keeping your personal number out of sign-ups, verifying a second account, receiving one code without buying a whole plan.",
        ],
      },
      {
        type: "h2",
        id: "which-one-do-you-need",
        text: "The ten-second decision rule",
      },
      {
        type: "p",
        text: "Almost every real situation resolves with three questions:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Do you need internet on your device — travel data, a connected tablet, a backup line? That’s connectivity. Get an eSIM; a virtual number cannot put your phone online, full stop.",
          "Do you need to receive a verification code — for Telegram, WhatsApp, Google, a marketplace — without giving out your personal number? That’s one SMS doing one job. Rent a virtual number; buying a carrier plan to receive a single text is paying for a truck to deliver an envelope.",
          "Do you need a long-term second line — a number you’ll give to clients and answer calls on for years? Then you genuinely need a phone plan (eSIM or plastic). A rented virtual number isn’t built to be your permanent identity — and honest providers say so.",
        ],
      },
      { type: "cta", serviceSlug: "telegram" },
      {
        type: "h2",
        id: "the-data-only-esim-trap",
        text: "The trap: data-only eSIMs and verification codes",
      },
      {
        type: "p",
        text: "Here’s the edge case that catches the most people. The majority of cheap travel eSIMs are data-only: they connect you to the internet but come with no phone number at all — nothing for an SMS to be addressed to. The product page says it plainly, but it’s easy to miss between the gigabyte counts.",
      },
      {
        type: "p",
        text: "The failure plays out on the road: you land, your travel eSIM works beautifully, then your bank — or Telegram on a reinstalled app — wants to text a code to confirm it’s you. The code goes to your home SIM, which is either out of the phone or roaming at painful rates. The data-only eSIM you’re actually using can’t receive it, because there’s no number to receive it on.",
      },
      {
        type: "callout",
        text: "The combination that works: a data-only eSIM for internet, plus your home SIM kept active for the services already tied to it — and a virtual number for new sign-ups you don’t want on your personal number anyway. Each tool does the one thing it’s actually built for.",
      },
      {
        type: "h2",
        id: "virtual-number-step-by-step",
        text: "If your answer is “just one code”: the virtual-number path",
      },
      {
        type: "p",
        text: "For the verification-code scenario, here’s the entire process — it takes about a minute:",
      },
      {
        type: "steps",
        items: [
          {
            title: "Pick the service and country",
            body: "In the SMS Activate app, choose what you’re verifying — Telegram, WhatsApp, Google, 35+ services — and which country the number should be from. One tap reserves a real mobile number for you.",
          },
          {
            title: "Use the number in the sign-up",
            body: "Type it into the verification form like any phone number, with the matching country code. The service sends its SMS as usual — it’s a real number on a real carrier network.",
          },
          {
            title: "Read the code in the app",
            body: "The SMS appears on the activation screen within seconds. Copy the code, finish the sign-up. If no code ever arrives, cancel the activation free and take another number — you only pay for delivered codes.",
          },
        ],
      },
      {
        type: "p",
        text: "No profiles installed, no plan started, nothing to cancel later. That asymmetry in commitment is really the whole comparison in miniature: an eSIM is something you set up and live with; a virtual number is something you use and are done with.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          {
            q: "Can a travel eSIM receive verification SMS?",
            a: "Only if it comes with a phone number — and most budget travel eSIMs are data-only, meaning no number and no SMS, ever. Check the product page for “voice and SMS” before relying on one for codes. If it’s data-only, a virtual number covers the verification side.",
          },
          {
            q: "Is a virtual number a SIM card?",
            a: "No. Nothing is installed in your device — no plastic, no eSIM profile, no change to your cellular settings. The number exists on the provider’s network, and the messages it receives are shown to you in the app. Your phone could be in airplane mode and the code would still arrive.",
          },
          {
            q: "Can I keep a virtual number forever?",
            a: "Rented activation numbers aren’t designed for that — you hold the number for the activation window, long enough to receive the code. Accounts you verified keep working afterwards (stay logged in and set up account recovery), but if you need a number to publish and answer for years, that’s a phone-plan problem, not a virtual-number one.",
          },
          {
            q: "Which is cheaper for receiving a single code?",
            a: "A virtual number, by a wide margin. It’s one activation from a one-time credit pack, priced for exactly that job. The cheapest eSIM plan still sells you days of service and gigabytes of data you don’t need for one SMS.",
          },
          {
            q: "Do I ever need both at once?",
            a: "Travel is the classic case: a data-only eSIM keeps you online, and a virtual number handles any new sign-ups along the way — while your home SIM stays reserved for the accounts already attached to it. They don’t compete; they cover different failure points.",
          },
        ],
      },
      { type: "cta", serviceSlug: "whatsapp" },
    ],
  },
  ru: {
    title: "eSIM или виртуальный номер: что вам нужно на самом деле?",
    description:
      "Звучат похоже и продаются рядом — но eSIM и виртуальный номер решают совершенно разные задачи. Простой разбор, как выбрать правильный инструмент.",
    excerpt:
      "Одно — тариф оператора внутри вашего телефона, другое — номер, который арендуют ради кода подтверждения. Путаница между ними стоит реальных денег — рассказываем, как понять, что нужно именно вам.",
    blocks: [
      {
        type: "p",
        text: "«Мне нужна eSIM или виртуальный номер?» — из тех вопросов, где у спрашивающего обычно есть конкретная проблема: поездка на следующей неделе или форма регистрации, требующая телефон. А интернет отвечает рекламой и того и другого. Продукты звучат похоже, живут в соседних категориях магазинов приложений, и их нередко продают одни и те же компании. Но это не одно и то же.",
      },
      {
        type: "p",
        text: "Перепутать их — не просто оговорка, это стоит денег. Люди покупают туристическую eSIM в расчёте принимать на неё SMS с кодами и обнаруживают — посреди поездки, ровно в момент, когда банк или мессенджер просит код, — что их eSIM вообще не умеет принимать SMS. Другие месяцами арендуют виртуальные номера, хотя всё, что им было нужно, — мобильный интернет.",
      },
      {
        type: "p",
        text: "Этот гид проводит границу чётко: что каждый из инструментов собой представляет, сравнение бок о бок, правило выбора на десять секунд — и пограничные случаи, где эти два мира действительно пересекаются.",
      },
      {
        type: "h2",
        id: "dva-raznykh-instrumenta",
        text: "Два разных инструмента, которым досталась одна полка",
      },
      {
        type: "p",
        text: "eSIM — это настоящий тариф оператора, встроенный в ваше устройство. То же самое, что пластиковая SIM-карта в лотке, только без пластика: профиль, загружаемый в железо телефона и подключающий его к мобильной сети. Вместе с ним приходит всё, что даёт подключение к сети: прежде всего мобильный интернет, а в зависимости от тарифа — звонки и SMS. Устанавливается в настройках телефона, и носитель у него — сам телефон.",
      },
      {
        type: "p",
        text: "Виртуальный номер — это номер, который арендуют для приёма SMS, и железа вашего устройства он не касается вовсе. Номер живёт на стороне провайдера; входящие сообщения появляются в приложении. Ничего не устанавливается в настройки, сетевой профиль не меняется, ваша SIM-карта и тариф не участвуют. Он нужен на тот момент, когда сервис хочет прислать вам код, — и это вся его работа.",
      },
      {
        type: "p",
        text: "Коротко: eSIM подключает устройство к сети. Виртуальный номер принимает сообщение вместо вас. Первое — инфраструктура, второе — поручение.",
      },
      { type: "h2", id: "bok-o-bok", text: "Бок о бок" },
      {
        type: "list",
        items: [
          "Модель оплаты — eSIM это тариф: вы платите за пакет трафика (иногда с минутами и SMS) на дни или недели. Виртуальный номер — оплата за использование: одна активация, один принятый код, из пакета кредитов. Ради одного кода тариф избыточен; для двух недель карт и мессенджеров за границей поштучная оплата SMS — вообще не та форма.",
          "Настройка — eSIM прошивается в телефон: QR-код или приложение, в сотовых настройках появляется новая линия, и само устройство должно поддерживать eSIM. Виртуальному номеру настройка не нужна: открыли приложение, выбрали сервис и страну — номер на экране через секунды.",
          "Что вы получаете — eSIM даёт связь: интернет, индикатор сети, часто телефонную линию. Виртуальный номер даёт ровно одну способность: принять адресованную ему SMS и показать её в приложении.",
          "Насколько это ваше — eSIM живёт, пока действует тариф, а локальную можно продлевать бесконечно. Виртуальный номер арендуется на окно активации: достаточно, чтобы получить код регистрации, но он не задуман вашим номером на годы.",
          "Для чего это — eSIM: интернет за границей, линия для планшета, местный тариф без поисков киоска с SIM-картами. Виртуальный номер: личный телефон не попадает в регистрации, верификация второго аккаунта, один код без покупки целого тарифа.",
        ],
      },
      {
        type: "h2",
        id: "pravilo-desyati-sekund",
        text: "Правило выбора на десять секунд",
      },
      {
        type: "p",
        text: "Почти любая реальная ситуация раскладывается тремя вопросами:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Нужен интернет на устройстве — трафик в поездке, подключённый планшет, резервная линия? Это задача связи. Берите eSIM: виртуальный номер не выведет ваш телефон в сеть, точка.",
          "Нужно принять код подтверждения — для Telegram, WhatsApp, Google, маркетплейса — не отдавая личный номер? Это одна SMS с одной работой. Арендуйте виртуальный номер: покупать тариф оператора ради одного сообщения — всё равно что заказывать грузовик для доставки конверта.",
          "Нужна вторая линия надолго — номер, который вы раздадите клиентам и на который будете отвечать годами? Тогда вам действительно нужен телефонный тариф (eSIM или пластик). Арендованный виртуальный номер не создан быть вашей постоянной личностью — и честные провайдеры так и говорят.",
        ],
      },
      { type: "cta", serviceSlug: "telegram" },
      {
        type: "h2",
        id: "lovushka-data-only",
        text: "Ловушка: eSIM «только интернет» и коды подтверждения",
      },
      {
        type: "p",
        text: "Вот пограничный случай, на котором спотыкаются чаще всего. Большинство недорогих туристических eSIM — data-only: они подключают к интернету, но телефонного номера у них нет вовсе — SMS просто некуда адресовать. На странице продукта это написано прямо, но между цифрами гигабайтов легко не заметить.",
      },
      {
        type: "p",
        text: "Сбой случается уже в дороге: вы приземлились, туристическая eSIM работает отлично — и тут банк или Telegram на переустановленном приложении хочет прислать код, чтобы убедиться, что это вы. Код уходит на домашнюю SIM, которая либо вынута из телефона, либо в роуминге по болезненным ценам. А data-only eSIM, которой вы пользуетесь, принять его не может — принимать не на что.",
      },
      {
        type: "callout",
        text: "Рабочая связка: data-only eSIM для интернета, домашняя SIM остаётся активной для сервисов, которые уже к ней привязаны, — и виртуальный номер для новых регистраций, которым ваш личный номер всё равно ни к чему. Каждый инструмент делает ровно то, для чего построен.",
      },
      {
        type: "h2",
        id: "put-virtualnogo-nomera",
        text: "Если ваш ответ — «только один код»: путь виртуального номера",
      },
      {
        type: "p",
        text: "Для сценария с кодом подтверждения — вот весь процесс, он занимает около минуты:",
      },
      {
        type: "steps",
        items: [
          {
            title: "Выберите сервис и страну",
            body: "В приложении SMS Activate укажите, что подтверждаете — Telegram, WhatsApp, Google, 35+ сервисов, — и из какой страны нужен номер. Одно касание — и настоящий мобильный номер зарезервирован за вами.",
          },
          {
            title: "Введите номер в регистрации",
            body: "Впишите его в форму подтверждения как обычный телефон, с совпадающим кодом страны. Сервис отправит SMS как всегда — это настоящий номер в сети реального оператора.",
          },
          {
            title: "Прочитайте код в приложении",
            body: "SMS появится на экране активации за считанные секунды. Скопируйте код и завершите регистрацию. Если код так и не пришёл — отмените активацию бесплатно и возьмите другой номер: вы платите только за доставленные коды.",
          },
        ],
      },
      {
        type: "p",
        text: "Никаких профилей, никаких начатых тарифов, нечего потом отменять. Эта разница в обязательствах — по сути всё сравнение в миниатюре: eSIM — то, что настраивают и с чем живут; виртуальный номер — то, чем воспользовались и закончили.",
      },
      { type: "h2", id: "faq", text: "Частые вопросы" },
      {
        type: "faq",
        items: [
          {
            q: "Может ли туристическая eSIM принимать SMS с кодами?",
            a: "Только если у неё есть телефонный номер — а большинство бюджетных туристических eSIM работают в режиме data-only: без номера и без SMS вообще. Перед тем как рассчитывать на неё для кодов, проверьте на странице продукта слова «звонки и SMS». Если тариф data-only, сторону верификации закроет виртуальный номер.",
          },
          {
            q: "Виртуальный номер — это SIM-карта?",
            a: "Нет. В ваше устройство ничего не устанавливается — ни пластика, ни профиля eSIM, ни изменений в сотовых настройках. Номер существует в сети провайдера, а принятые им сообщения показываются вам в приложении. Ваш телефон может быть в авиарежиме — код всё равно придёт.",
          },
          {
            q: "Можно ли оставить виртуальный номер себе навсегда?",
            a: "Арендные номера для активаций не для этого — номер ваш на окно активации, достаточное, чтобы принять код. Подтверждённые аккаунты продолжают работать и после (не выходите из них и настройте восстановление), но если номер нужен, чтобы публиковать его и отвечать по нему годами, — это задача телефонного тарифа, а не виртуального номера.",
          },
          {
            q: "Что дешевле для приёма одного кода?",
            a: "Виртуальный номер, с большим отрывом. Это одна активация из разового пакета кредитов, и цена рассчитана ровно на эту работу. Даже самый дешёвый тариф eSIM продаёт вам дни обслуживания и гигабайты трафика, которые для одной SMS не нужны.",
          },
          {
            q: "Бывает ли, что нужны оба сразу?",
            a: "Классический случай — путешествие: data-only eSIM держит вас онлайн, виртуальный номер закрывает новые регистрации по пути, а домашняя SIM остаётся за аккаунтами, которые уже к ней привязаны. Они не конкурируют — они закрывают разные точки отказа.",
          },
        ],
      },
      { type: "cta", serviceSlug: "whatsapp" },
    ],
  },
};
