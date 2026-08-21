import type { ServiceEntry } from "./types";

export const adidas: ServiceEntry = {
  slug: "adidas",
  name: "adidas",
  logo: "/services/adidas.svg",
  category: "shopping",
  relatedSlugs: ["aliexpress", "paypal", "uber", "google", "apple"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "france",
    "spain",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "adidas",
    message: "Your adidas verification code is 604927",
    code: "604927",
  },
  en: {
    metaTitle: "Virtual Number for adidas — Verify Your Shop Account",
    metaDescription:
      "Verify your adidas account with a real virtual number. The SMS code arrives in the SMS Code app in seconds — shop online without giving out your personal number.",
    hero: {
      title: "A virtual number for adidas",
      intro: [
        "An adidas account is more than a checkout shortcut — it's membership in the adiClub program, order tracking, saved sizes and access to member-only releases. And like most large retailers, adidas increasingly wants a phone number it can verify by SMS, both at sign-up in some regions and as an extra check when something about a login or order looks unusual.",
        "SMS Code rents you a real mobile number in one of 150+ countries. Enter it on the adidas account screen, and the verification code appears in the SMS Code app within seconds — the account is confirmed, and your everyday number stays out of yet another retail database.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for adidas?",
      body: [
        "Retail databases are where phone numbers go to be marketed at. Give a shop your real number and it tends to resurface — promo SMS, “back in stock” pings, and, after the inevitable data leak somewhere in the industry, spam from parties you never dealt with. Verifying adidas with a virtual number gets you the working account without volunteering your personal number into that pipeline: marketing texts land on a rented number, not the one in your pocket.",
        "One honest caveat: if you're eyeing limited releases, know that adidas raffles and hyped drops run under their own rules — typically one entry per person, with anti-bot checks that go well beyond a phone number. A virtual number is for keeping your private number private, not for multiplying raffle entries; that would break adidas's terms and usually gets entries voided anyway. For everyday shopping, adiClub membership and order tracking, it works exactly as a number should.",
      ],
    },
    howTo: {
      title: "How to verify adidas with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, pick adidas as the service and choose a country — the US, UK or Germany are common picks since they're major adidas markets. The number is reserved for you at once.",
        },
        {
          title: "Enter it in your adidas account",
          body: "Create your adidas account with an email, then add the rented number in the profile or when the site prompts for phone verification. Match the country code to the number's country.",
        },
        {
          title: "Confirm with the SMS code",
          body: "The text arrives in the SMS Code app within seconds — “Your adidas verification code is 604927”. Type it into the adidas verification field and the number is confirmed.",
        },
        {
          title: "Set your shipping and size details",
          body: "Fill in your delivery address and size preferences. Order updates arrive by email and app notifications, so day-to-day use of the shop doesn't depend on the phone number at all.",
        },
      ],
    },
    tips: [
      {
        title: "Match the store region to the number",
        body: "adidas runs separate country storefronts, and a US account pairs naturally with a US number. Keeping the store region, delivery country and number country consistent avoids tripping the shop's fraud checks on your first order.",
      },
      {
        title: "Email is your real account anchor",
        body: "adidas logins run on email and password; the phone number is a verification and contact channel. Keep the email confirmed and the password strong, and the account works long after the rented number's activation window has closed.",
      },
      {
        title: "Raffles play by their own rules",
        body: "Limited-edition drops use raffle systems with one-per-person policies and layered anti-bot checks. A virtual number won't — and shouldn't — change your odds there. Use it for privacy on your one genuine account, and enter drops the way the rules describe.",
      },
    ],
    faqs: [
      {
        q: "Do I always need a phone number for an adidas account?",
        a: "It depends on the region — some storefronts let you register with email alone, others ask for SMS verification at sign-up or before certain orders. When the prompt appears, a rented virtual number satisfies it without exposing your own.",
      },
      {
        q: "Will order and delivery updates come by SMS?",
        a: "adidas primarily uses email and app notifications for order status; couriers may send their own texts depending on the carrier and country. Make sure your email is correct — that's where the essentials arrive.",
      },
      {
        q: "Can I enter adidas raffles with multiple accounts on virtual numbers?",
        a: "No — and we don't help with that. Raffles are explicitly one entry per person, and adidas voids entries that break the rule. A virtual number is for keeping your personal number private on your single genuine account.",
      },
      {
        q: "Why didn't my adidas verification code arrive?",
        a: "Check that the country code matches the rented number and that the store region corresponds to the number's country. If no SMS comes, cancel the activation in SMS Code — uncharged, since nothing arrived — and retry with a fresh number.",
      },
      {
        q: "Will my adidas account keep working after the rented number expires?",
        a: "Yes. You log in with email and password; the number was needed for the verification moment. If adidas asks to re-verify the phone later, update the number in your profile to a newly rented one and confirm the new code.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для adidas — подтвердите аккаунт магазина",
    metaDescription:
      "Подтвердите аккаунт adidas настоящим виртуальным номером. SMS с кодом придёт в приложение SMS Code за секунды — покупайте онлайн, не раскрывая личный номер.",
    hero: {
      title: "Виртуальный номер для adidas",
      intro: [
        "Аккаунт adidas — это не просто ускоренное оформление заказа: это членство в программе adiClub, отслеживание посылок, сохранённые размеры и доступ к релизам для участников. И, как большинство крупных ритейлеров, adidas всё чаще хочет номер телефона с подтверждением по SMS — где-то прямо при регистрации, а где-то как дополнительную проверку, если вход или заказ выглядит необычно.",
        "SMS Code сдаёт вам в аренду настоящий мобильный номер в одной из 150+ стран. Введите его на экране аккаунта adidas — и код подтверждения появится в приложении SMS Code за секунды. Аккаунт подтверждён, а ваш повседневный номер не пополнил очередную базу магазина.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для adidas?",
      body: [
        "Базы ритейлеров — то самое место, куда номера попадают, чтобы по ним рассылали рекламу. Отдайте магазину настоящий номер — и он непременно всплывёт: промо-SMS, «товар снова в наличии», а после очередной утечки где-нибудь в отрасли — спам от тех, с кем вы вообще не имели дела. Подтвердив adidas виртуальным номером, вы получаете рабочий аккаунт, не скармливая личный номер этому конвейеру: маркетинговые сообщения падают на арендованный номер, а не на тот, что у вас в кармане.",
        "И честная оговорка: если вы охотитесь за лимитированными релизами, помните — розыгрыши и громкие дропы adidas живут по своим правилам: как правило, одна заявка на человека и антибот-проверки, которые выходят далеко за рамки номера телефона. Виртуальный номер нужен, чтобы личный номер оставался личным, а не чтобы плодить заявки в розыгрышах — это нарушает правила adidas, и такие заявки обычно аннулируют. А для обычных покупок, adiClub и отслеживания заказов он работает ровно так, как номеру и положено.",
      ],
    },
    howTo: {
      title: "Как подтвердить adidas виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис adidas и страну — часто берут США, Великобританию или Германию: это крупные рынки adidas. Номер резервируется за вами сразу.",
        },
        {
          title: "Укажите его в аккаунте adidas",
          body: "Создайте аккаунт adidas на электронную почту, затем добавьте арендованный номер в профиле или когда сайт сам попросит подтвердить телефон. Код страны должен совпадать со страной номера.",
        },
        {
          title: "Подтвердите кодом из SMS",
          body: "Сообщение придёт в приложение SMS Code за секунды: «Your adidas verification code is 604927». Введите его в поле подтверждения adidas — номер подтверждён.",
        },
        {
          title: "Заполните доставку и размеры",
          body: "Укажите адрес доставки и размерные предпочтения. Статусы заказов приходят по почте и через уведомления приложения, так что повседневная работа магазина от номера телефона не зависит.",
        },
      ],
    },
    tips: [
      {
        title: "Согласуйте регион магазина и номер",
        body: "У adidas отдельные витрины по странам, и к американскому аккаунту логично брать американский номер. Когда регион магазина, страна доставки и страна номера совпадают, первый заказ не спотыкается об антифрод-проверки.",
      },
      {
        title: "Почта — настоящий якорь аккаунта",
        body: "Вход в adidas работает по почте и паролю; номер телефона — канал подтверждения и связи. Держите почту подтверждённой, а пароль надёжным — и аккаунт спокойно живёт долго после закрытия окна активации арендованного номера.",
      },
      {
        title: "У розыгрышей свои правила",
        body: "Лимитированные дропы разыгрываются по схеме «одна заявка на человека» с многослойными антибот-проверками. Виртуальный номер не изменит ваши шансы — и не должен. Используйте его для приватности единственного настоящего аккаунта, а в дропах участвуйте так, как написано в правилах.",
      },
    ],
    faqs: [
      {
        q: "Всегда ли аккаунту adidas нужен номер телефона?",
        a: "Зависит от региона: где-то регистрация проходит по одной почте, где-то SMS-подтверждение требуется при создании аккаунта или перед отдельными заказами. Когда запрос появится, арендованный виртуальный номер закроет его, не раскрывая ваш собственный.",
      },
      {
        q: "Придут ли статусы заказа и доставки по SMS?",
        a: "adidas сообщает о статусе заказов в первую очередь по почте и через уведомления приложения; курьерские службы могут слать свои SMS — это зависит от перевозчика и страны. Главное — правильная почта: всё существенное приходит туда.",
      },
      {
        q: "Можно ли участвовать в розыгрышах adidas с нескольких аккаунтов на виртуальных номерах?",
        a: "Нет — и мы в этом не помогаем. В розыгрышах прямо прописано «одна заявка на человека», и adidas аннулирует заявки нарушителей. Виртуальный номер — для приватности вашего единственного настоящего аккаунта.",
      },
      {
        q: "Почему не пришёл код подтверждения adidas?",
        a: "Проверьте, что код страны совпадает с арендованным номером, а регион магазина — со страной номера. Если SMS так и нет, отмените активацию в SMS Code — платить не за что, раз ничего не пришло, — и повторите со свежим номером.",
      },
      {
        q: "Будет ли аккаунт adidas работать после окончания аренды номера?",
        a: "Да. Вы входите по почте и паролю; номер был нужен в момент подтверждения. Если adidas позже попросит подтвердить телефон заново, замените номер в профиле на новый арендованный и введите свежий код.",
      },
    ],
  },
};
