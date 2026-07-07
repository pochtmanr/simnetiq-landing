import type { BlogPost } from "./types";

export const whatIsAVirtualPhoneNumber: BlogPost = {
  slug: "what-is-a-virtual-phone-number",
  publishedAt: "2026-07-07",
  updatedAt: "2026-07-07",
  tags: ["Basics", "Privacy"],
  relatedServiceSlugs: ["telegram", "google", "whatsapp"],
  en: {
    title: "What Is a Virtual Phone Number and How Does It Work?",
    description:
      "A plain-language explainer: how virtual numbers work, how they differ from VoIP, eSIM and burners, how SMS verification flows, and what makes a good provider.",
    excerpt:
      "A virtual number is a real mobile number that reaches you through an app instead of a SIM card in your pocket. Here’s how that actually works — and when it’s the right tool.",
    blocks: [
      {
        type: "p",
        text: "A virtual phone number is a real number on a real mobile network — it can receive calls or texts like any other — except no physical SIM card sits in your phone to answer for it. Instead, whatever arrives at the number is routed to you over the internet: into an app, a dashboard or an API. To the person (or service) on the other end, it is indistinguishable from any ordinary mobile number.",
      },
      {
        type: "p",
        text: "That one-sentence definition raises the questions this guide answers: where do these numbers physically live if not in a SIM? How is a virtual number different from VoIP, an eSIM or a burner phone? Why do sign-up codes reach it just fine? Is any of this legal? And if you decide you need one, what separates a good provider from a shared free site that never delivers a code?",
      },
      {
        type: "h2",
        id: "how-phone-numbers-actually-work",
        text: "How phone numbers actually work",
      },
      {
        type: "p",
        text: "The key insight is that a phone number never lived “inside” your SIM card. Numbers belong to carrier networks: national regulators allocate ranges to mobile operators, and the operator’s core network keeps a register mapping each number to a subscriber. Your SIM is just a cryptographic key card proving to the network that your device is that subscriber, so calls and texts addressed to the number get delivered to it.",
      },
      {
        type: "p",
        text: "A virtual number simply changes the last hop. The number is still allocated by a carrier and still lives in a real mobile network — but the SIM answering for it sits in a provider’s infrastructure rather than in your pocket. When an SMS arrives, the provider’s system reads it and forwards it to you over the internet, typically into an app, within seconds. Nothing about the sending side changes, which is exactly why verification systems treat these numbers as ordinary mobile numbers: from the network’s point of view, they are.",
      },
      {
        type: "h2",
        id: "virtual-vs-voip-esim-burner",
        text: "Virtual number vs VoIP vs eSIM vs burner phone",
      },
      {
        type: "p",
        text: "These four terms get mixed up constantly, and the differences matter — especially for SMS verification, where some of them routinely fail.",
      },
      {
        type: "list",
        items: [
          "Virtual mobile number: a real carrier-network mobile number whose messages are forwarded to you online. Best fit for receiving SMS verification codes, because services see a normal mobile number.",
          "VoIP number (Google Voice, Skype and similar): a number that exists in an internet-telephony service rather than a mobile network. Great for calls, but many services detect VoIP number ranges and refuse to send verification codes to them — VoIP numbers are cheap to mass-register, so sign-up systems distrust them.",
          "eSIM: not a different kind of number at all, just a SIM without the plastic — a carrier profile downloaded into your device. The number is fully yours and fully mobile, but you’re buying a real line with a real contract or plan, which is overkill if all you need is to receive one verification code.",
          "Burner phone: a cheap prepaid handset plus SIM bought for temporary use. It works, but it’s the most expensive and slowest option — hardware, a trip to a shop, ID requirements for SIM registration in many countries — to accomplish what a virtual number does in seconds.",
        ],
      },
      {
        type: "p",
        text: "Rule of thumb: if your goal is receiving an SMS code without involving your personal number, you want a virtual mobile number. If your goal is a permanent second line for calls, you want an eSIM or a VoIP plan.",
      },
      {
        type: "h2",
        id: "how-sms-verification-works",
        text: "How SMS verification actually flows",
      },
      {
        type: "p",
        text: "Understanding the pipeline explains both why virtual numbers work and why codes occasionally don’t arrive — from any number, virtual or not.",
      },
      {
        type: "steps",
        items: [
          {
            title: "The service generates a one-time password (OTP)",
            body: "When you type a number into a sign-up form, the service creates a short-lived code — usually 4 to 8 digits, valid for a few minutes — and stores it against your pending registration.",
          },
          {
            title: "The message enters the SMS network",
            body: "The service hands the code to an SMS gateway, often with an alphanumeric sender ID (“Telegram”, “Google”) instead of a phone number. The gateway routes it across carrier networks toward the destination number’s operator.",
          },
          {
            title: "The carrier delivers to whoever holds the number",
            body: "The destination operator delivers the SMS to the subscriber registered for that number. For a virtual number, that’s the provider’s SIM infrastructure — which reads the message and pushes it to your app, typically within seconds.",
          },
          {
            title: "You type the code back, closing the loop",
            body: "The service compares what you entered with what it generated. Match — and it now trusts that you control that number. That’s all SMS verification ever proves: control of a number at one moment in time.",
          },
        ],
      },
      { type: "cta" },
      {
        type: "h2",
        id: "is-it-legal",
        text: "Is using a virtual number legal?",
      },
      {
        type: "p",
        text: "Yes — renting and using virtual numbers is legal in the overwhelming majority of jurisdictions; it’s the same regulated numbering infrastructure businesses have used for decades for hotlines and delivery notifications. What the law (and each service’s terms) cares about is what you do with the account afterwards: fraud is illegal from any number, and each platform’s own rules apply equally to every account. A virtual number is a privacy tool, not a permission slip.",
      },
      {
        type: "p",
        text: "The legitimate uses are broader than most people expect:",
      },
      {
        type: "list",
        items: [
          "Privacy: signing up for apps and sites without feeding your real number into one more database that may leak, be sold, or be scraped for spam calls.",
          "Separation: a second messenger account for work, a project, or selling on marketplaces — reachable without exposing your personal line.",
          "QA and development: engineers testing sign-up flows, SMS delivery and localisation across many countries without maintaining a drawer of SIM cards.",
          "Travel and geography: registering for a service that expects a local number in a country where you don’t hold a SIM.",
          "Damage control: when a number is required by a service you fundamentally don’t trust, giving it a rented one caps the downside.",
        ],
      },
      {
        type: "h2",
        id: "choosing-a-provider",
        text: "What to look for in a provider",
      },
      {
        type: "p",
        text: "Providers differ far more than their landing pages suggest, and the differences show up exactly at the moment you’re waiting for a code. Four things are worth checking before you pay anyone:",
      },
      {
        type: "list",
        items: [
          "Real, dedicated mobile numbers — not the shared numbers on free “receive SMS online” sites. Those are used by thousands of people, so services blocklist them or find them already registered; and anyone else viewing the same page can read your code.",
          "A fair cancellation policy: if no SMS arrives, you shouldn’t pay. With SMS Activate, an activation that received nothing cancels free.",
          "Country coverage that matches your needs — SMS Activate offers numbers in 50+ countries, which also gives you alternatives when one route is slow.",
          "Pricing you can reason about: pay-per-activation from a one-time credit pack beats a subscription if your need is occasional — you shouldn’t rent a monthly line to receive one code.",
        ],
      },
      {
        type: "callout",
        text: "The quickest quality test of any provider: what happens when a code doesn’t arrive? If the answer is “you’ve paid anyway”, keep looking. Verification is probabilistic at the edges — a serious provider prices that in rather than passing it to you.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          {
            q: "Is a virtual phone number a real number?",
            a: "Yes. It’s allocated by a real carrier and lives in a real mobile network — the only difference from the number in your pocket is that inbound messages are forwarded to you over the internet instead of ringing a SIM in your own device.",
          },
          {
            q: "Can a virtual number receive SMS verification codes?",
            a: "Yes — that’s the primary use. Because it’s a genuine mobile number, services deliver OTP codes to it normally, and a good provider shows you the message within seconds. VoIP numbers, by contrast, are often refused by sign-up systems.",
          },
          {
            q: "Do I need a SIM card or new hardware for a virtual number?",
            a: "No. The SIM answering for the number sits in the provider’s infrastructure. You just see incoming messages in an app — nothing is installed in your phone’s SIM tray and no eSIM profile is added.",
          },
          {
            q: "What’s the difference between a virtual number and a burner phone?",
            a: "A burner is physical: a cheap prepaid handset and SIM you buy, carry and eventually discard. A virtual number achieves the same separation with no hardware, no shop visit and no SIM-registration paperwork — you rent the number for the verification and receive the code in an app.",
          },
          {
            q: "Are free “receive SMS online” sites good enough?",
            a: "For anything you care about, no. Their numbers are shared and publicly visible: services blocklist them, the number is often already registered, and anyone on the same page can read the codes you receive — including a code that could reset the account you just created.",
          },
        ],
      },
      { type: "cta" },
    ],
  },
  ru: {
    title: "Что такое виртуальный номер телефона и как он работает",
    description:
      "Как устроены виртуальные номера, чем они отличаются от VoIP, eSIM и «одноразовых» телефонов, как проходит SMS-верификация и как выбрать провайдера.",
    excerpt:
      "Виртуальный номер — это настоящий мобильный номер, который приходит к вам через приложение, а не через SIM-карту в кармане. Разбираем, как это устроено — и когда это правильный инструмент.",
    blocks: [
      {
        type: "p",
        text: "Виртуальный номер телефона — это настоящий номер в реальной мобильной сети: он принимает звонки и сообщения, как любой другой, — только в вашем телефоне нет физической SIM-карты, которая бы за него отвечала. Всё, что приходит на номер, доставляется вам через интернет: в приложение, личный кабинет или по API. Для собеседника — или сервиса — на другом конце он неотличим от обычного мобильного номера.",
      },
      {
        type: "p",
        text: "Из этого определения в одну фразу вырастают вопросы, на которые отвечает этот гид. Где физически «живут» такие номера, если не в SIM-карте? Чем виртуальный номер отличается от VoIP, eSIM и «одноразового» телефона? Почему коды регистрации на него исправно приходят? Законно ли всё это? И если номер вам действительно нужен — чем хороший провайдер отличается от бесплатного сайта с общими номерами, на который код так и не придёт?",
      },
      {
        type: "h2",
        id: "kak-ustroeny-nomera",
        text: "Как на самом деле устроены телефонные номера",
      },
      {
        type: "p",
        text: "Главное, что нужно понять: номер телефона никогда не жил «внутри» вашей SIM-карты. Номера принадлежат сетям операторов: национальные регуляторы выделяют операторам диапазоны, а ядро сети оператора ведёт реестр, сопоставляющий каждый номер с абонентом. SIM-карта — лишь криптографический ключ, доказывающий сети, что ваше устройство и есть этот абонент, поэтому звонки и SMS на номер доставляются именно ему.",
      },
      {
        type: "p",
        text: "Виртуальный номер меняет только последний участок пути. Номер по-прежнему выделен оператором и по-прежнему живёт в реальной мобильной сети — просто SIM-карта, отвечающая за него, стоит в инфраструктуре провайдера, а не лежит у вас в кармане. Когда приходит SMS, система провайдера считывает её и пересылает вам через интернет — как правило, в приложение и за считанные секунды. Со стороны отправителя не меняется ничего — именно поэтому системы верификации воспринимают такие номера как обычные мобильные: с точки зрения сети они такими и являются.",
      },
      {
        type: "h2",
        id: "virtualnyy-voip-esim-odnorazovyy",
        text: "Виртуальный номер, VoIP, eSIM и «одноразовый» телефон",
      },
      {
        type: "p",
        text: "Эти четыре понятия постоянно путают, а разница существенна — особенно для SMS-верификации, где часть из них регулярно не срабатывает.",
      },
      {
        type: "list",
        items: [
          "Виртуальный мобильный номер: настоящий номер в сети оператора, сообщения с которого пересылаются вам онлайн. Лучший вариант для приёма кодов подтверждения — сервисы видят обычный мобильный номер.",
          "VoIP-номер (Google Voice, Skype и подобные): номер, существующий в сервисе интернет-телефонии, а не в мобильной сети. Отлично подходит для звонков, но многие сервисы распознают диапазоны VoIP-номеров и отказываются отправлять на них коды: такие номера легко регистрировать массово, поэтому системы регистрации им не доверяют.",
          "eSIM: вовсе не другой вид номера, а просто SIM без пластика — профиль оператора, загруженный в устройство. Номер полностью ваш и полностью мобильный, но вы покупаете настоящую линию с настоящим тарифом — избыточно, если нужно лишь принять один код подтверждения.",
          "«Одноразовый» телефон: дешёвый кнопочный аппарат с предоплаченной SIM-картой, купленный на время. Работает, но это самый дорогой и медленный путь — техника, поход в магазин, а во многих странах ещё и регистрация SIM по паспорту — ради того, что виртуальный номер делает за секунды.",
        ],
      },
      {
        type: "p",
        text: "Простое правило: если цель — принять SMS-код, не привлекая личный номер, вам нужен виртуальный мобильный номер. Если цель — постоянная вторая линия для звонков, смотрите в сторону eSIM или тарифа VoIP.",
      },
      {
        type: "h2",
        id: "kak-prokhodit-sms-verifikatsiya",
        text: "Как на самом деле проходит SMS-верификация",
      },
      {
        type: "p",
        text: "Понимание всей цепочки объясняет и почему виртуальные номера работают, и почему коды иногда не доходят — на любой номер, виртуальный или нет.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Сервис генерирует одноразовый пароль (OTP)",
            body: "Когда вы вводите номер в форму регистрации, сервис создаёт короткоживущий код — обычно от 4 до 8 цифр, действующий несколько минут — и привязывает его к вашей незавершённой регистрации.",
          },
          {
            title: "Сообщение уходит в SMS-сеть",
            body: "Сервис передаёт код SMS-шлюзу, часто с буквенным именем отправителя («Telegram», «Google») вместо номера. Шлюз маршрутизирует сообщение через сети операторов к оператору номера-получателя.",
          },
          {
            title: "Оператор доставляет SMS владельцу номера",
            body: "Оператор назначения доставляет сообщение абоненту, зарегистрированному за этим номером. Для виртуального номера это SIM-инфраструктура провайдера — она считывает SMS и отправляет её в ваше приложение, как правило, за считанные секунды.",
          },
          {
            title: "Вы вводите код обратно — круг замкнулся",
            body: "Сервис сравнивает введённое с тем, что сгенерировал. Совпало — значит, он убедился, что номер под вашим контролем. Это всё, что вообще доказывает SMS-верификация: контроль над номером в конкретный момент времени.",
          },
        ],
      },
      { type: "cta" },
      {
        type: "h2",
        id: "zakonno-li-eto",
        text: "Законно ли пользоваться виртуальным номером?",
      },
      {
        type: "p",
        text: "Да — аренда и использование виртуальных номеров легальны в подавляющем большинстве юрисдикций: это та же регулируемая номерная инфраструктура, которой бизнес десятилетиями пользуется для горячих линий и уведомлений о доставке. Закон — и правила каждого сервиса — интересует то, что вы делаете с аккаунтом дальше: мошенничество незаконно с любого номера, а правила площадок одинаково действуют для всех аккаунтов. Виртуальный номер — инструмент приватности, а не индульгенция.",
      },
      {
        type: "p",
        text: "Законных сценариев больше, чем принято думать:",
      },
      {
        type: "list",
        items: [
          "Приватность: регистрация в приложениях и на сайтах без передачи настоящего номера в очередную базу, которая может утечь, быть проданной или попасть к спам-обзвонщикам.",
          "Разделение: второй аккаунт мессенджера для работы, проекта или продаж на маркетплейсах — на связи, но без раскрытия личной линии.",
          "Тестирование и разработка: инженеры проверяют формы регистрации, доставку SMS и локализацию в десятках стран, не держа ящик с SIM-картами.",
          "Путешествия и география: регистрация в сервисе, который ждёт местный номер страны, где у вас нет SIM-карты.",
          "Минимизация ущерба: если номер требует сервис, которому вы принципиально не доверяете, арендованный номер ограничивает возможные потери.",
        ],
      },
      {
        type: "h2",
        id: "kak-vybrat-provaydera",
        text: "На что смотреть при выборе провайдера",
      },
      {
        type: "p",
        text: "Провайдеры различаются куда сильнее, чем обещают их лендинги, и разница проявляется ровно в тот момент, когда вы ждёте код. Четыре вещи стоит проверить, прежде чем платить кому-либо:",
      },
      {
        type: "list",
        items: [
          "Настоящие выделенные мобильные номера — а не общие номера с бесплатных сайтов «приёма SMS онлайн». Теми пользуются тысячи людей: сервисы вносят их в чёрные списки или находят уже зарегистрированными, а ваш код может прочитать любой посетитель той же страницы.",
          "Честная политика отмены: если SMS не пришла, платить вы не должны. В SMS Activate активация, на которую ничего не пришло, отменяется бесплатно.",
          "Покрытие стран под ваши задачи — в SMS Activate номера доступны в 50+ странах, а это ещё и запасные варианты, когда какое-то направление работает медленно.",
          "Понятная модель оплаты: оплата за активацию из разового пакета кредитов выгоднее подписки, если номера нужны от случая к случаю, — не стоит арендовать линию на месяц ради одного кода.",
        ],
      },
      {
        type: "callout",
        text: "Самый быстрый тест качества любого провайдера: что происходит, когда код не пришёл? Если ответ — «деньги всё равно списаны», ищите дальше. На краях верификация — вещь вероятностная, и серьёзный провайдер закладывает это в свою модель, а не перекладывает на вас.",
      },
      { type: "h2", id: "faq", text: "Частые вопросы" },
      {
        type: "faq",
        items: [
          {
            q: "Виртуальный номер — это настоящий номер?",
            a: "Да. Его выделяет реальный оператор, и живёт он в реальной мобильной сети. Единственное отличие от номера у вас в кармане — входящие сообщения пересылаются вам через интернет, а не приходят на SIM-карту в вашем устройстве.",
          },
          {
            q: "Придёт ли на виртуальный номер код подтверждения из SMS?",
            a: "Да — это основной сценарий. Поскольку номер — настоящий мобильный, сервисы доставляют на него OTP-коды в обычном порядке, а хороший провайдер показывает сообщение за считанные секунды. VoIP-номера, напротив, системы регистрации часто отклоняют.",
          },
          {
            q: "Нужна ли SIM-карта или новое устройство для виртуального номера?",
            a: "Нет. SIM-карта, отвечающая за номер, стоит в инфраструктуре провайдера. Вы просто видите входящие сообщения в приложении — в лоток вашего телефона ничего не вставляется, и профиль eSIM не добавляется.",
          },
          {
            q: "Чем виртуальный номер отличается от «одноразового» телефона?",
            a: "«Одноразовый» телефон — это физика: дешёвый аппарат и предоплаченная SIM, которые нужно купить, носить и потом выбросить. Виртуальный номер даёт то же разделение без техники, походов в магазин и оформления SIM-карты: вы арендуете номер на время верификации и получаете код в приложении.",
          },
          {
            q: "Хватит ли бесплатных сайтов «приёма SMS онлайн»?",
            a: "Для всего, что вам дорого, — нет. Их номера общие и публично видимые: сервисы вносят их в чёрные списки, номер часто уже занят чужим аккаунтом, а коды на той же странице читает кто угодно — включая код, которым можно сбросить только что созданный вами аккаунт.",
          },
        ],
      },
      { type: "cta" },
    ],
  },
};
