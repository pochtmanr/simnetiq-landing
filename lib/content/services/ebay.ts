import type { ServiceEntry } from "./types";

export const ebay: ServiceEntry = {
  slug: "ebay",
  name: "eBay",
  logo: "/services/ebay.svg",
  category: "shopping",
  relatedSlugs: ["aliexpress", "paypal", "shopee", "google"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "italy",
    "spain",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "eBay",
    message: "Your eBay security code is 271846. Do not share this code.",
    code: "271846",
  },
  en: {
    metaTitle: "Virtual Number for eBay — Verify Buying and Selling Privately",
    metaDescription:
      "Receive eBay’s security code on a real virtual number usually within seconds. Register, sell and pass sign-in checks without wiring your personal phone to a marketplace.",
    hero: {
      title: "A virtual number for eBay",
      intro: [
        "eBay wants a phone number early and checks it often. Registration asks for one, opening a seller account insists on one, and its sign-in protection loves to pause a login until a text like “Your eBay security code is 271846” gets typed back in. For a marketplace where you mostly wanted to buy a camera lens, that’s a lot of connection to your personal phone.",
        "With SMS Code you rent a real mobile number in one of 100+ countries and the code shows up in the app usually within seconds. The account gets verified, the listing goes live — and the number in eBay’s contact records isn’t the one in your pocket.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for eBay?",
      body: [
        "A marketplace account gathers an unusual amount of you in one place: your buying history, your address, your card, and — if the phone is yours — a direct line that outlives every transaction. eBay has decades of accumulated customer data and a long history as a phishing target; “your eBay account has a problem, click here” is a whole genre of scam SMS. A rented number takes the verification step so that genre plays out on a number that was never really yours.",
        "The honest flip side: eBay uses the phone for more than sign-up. Security codes at login, seller identity checks, and buyer-seller contact features can all reach for it later. That’s why the pattern that works is: verify with the rented number, then keep your email as the account anchor and update the phone in account settings if you stop renting it. An eBay account that can’t receive its own security codes locks its owner out at the worst moment — don’t let that number go stale silently.",
      ],
    },
    howTo: {
      title: "How to verify eBay with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Pick eBay as the service and choose the country of the eBay site you actually use — ebay.com, ebay.co.uk, ebay.de and the rest share one account, but a matching number keeps your registration details consistent.",
        },
        {
          title: "Enter it where eBay asks",
          body: "At registration, in the seller-account setup, or when sign-in protection prompts you to confirm a phone. Select the number’s country code and type it carefully.",
        },
        {
          title: "Type in the code",
          body: "The SMS reads “Your eBay security code is 271846” and appears in the SMS Code app usually within seconds. Enter it on eBay and the number is confirmed.",
        },
        {
          title: "Anchor the account to email",
          body: "Confirm your email address, set a strong password, and treat the phone as a checkpoint rather than the foundation. If you won’t keep the rented number, replace it in Account Settings → Personal Info once you’re set up, so future security codes go somewhere you actually read.",
        },
      ],
    },
    tips: [
      {
        title: "Selling raises the bar",
        body: "A buyer account may sail through with minimal checks, but registering as a seller triggers real identity and payout verification — bank details, sometimes documents. The virtual number handles the SMS step of that process; the rest is between you and eBay’s seller onboarding, and it’s not optional.",
      },
      {
        title: "Sign-in checks come back",
        body: "eBay’s login protection re-texts the phone on new devices and unusual activity, sometimes months later. If the rented number has lapsed and the phone on file is dead, account recovery becomes a support ticket. Update the number in settings before that happens, not after.",
      },
      {
        title: "One account is the right number of accounts",
        body: "eBay links accounts through far more than phone numbers — addresses, payment methods, devices. A virtual number won’t resurrect a suspended account or stack promotional vouchers, and trying tends to end all the linked accounts at once. Use it for privacy on the account you keep.",
      },
    ],
    faqs: [
      {
        q: "Does eBay accept virtual numbers?",
        a: "eBay verifies that a number can receive its SMS — and a rented number from SMS Code is a real mobile number on a carrier network, so the code arrives like any other text. Numbers from free SMS sites, by contrast, are usually recognized and refused.",
      },
      {
        q: "Can I sell on eBay with a virtual number?",
        a: "The phone-verification step, yes — seller sign-up texts a code and the rented number receives it. But selling also involves payout and identity verification through eBay’s own process, which a phone number doesn’t influence. Expect to complete that with real details.",
      },
      {
        q: "Will my eBay account survive the rented number expiring?",
        a: "Yes — the account anchors to your email and password. Just don’t leave a dead number as the security contact: replace or update the phone in Account Settings so sign-in confirmations and alerts reach a number you still read.",
      },
      {
        q: "Which country should the number be from?",
        a: "The country you actually shop or sell from. Your address, payment method and phone tell eBay one consistent story; a number from a different continent than your delivery address invites extra verification instead of less.",
      },
      {
        q: "The eBay code didn’t arrive — what now?",
        a: "Double-check the country code matches the rented number and give it a minute; eBay sometimes offers a voice call as an alternative, which won’t reach a rented SMS number — request the text again instead. If nothing arrives, cancel the activation free in SMS Code and take a fresh number.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для eBay — покупки и продажи без вашей SIM",
    metaDescription:
      "Код безопасности eBay на настоящий виртуальный номер обычно за секунды. Регистрируйтесь, продавайте и проходите проверки входа, не отдавая маркетплейсу личный телефон.",
    hero: {
      title: "Виртуальный номер для eBay",
      intro: [
        "eBay просит номер телефона рано и проверяет его часто. Регистрация спрашивает номер, аккаунт продавца без него не открыть, а защита входа обожает остановить логин, пока вы не введёте текст вида «Your eBay security code is 271846». Многовато привязки к личному телефону для площадки, где вы всего лишь хотели купить объектив.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 100+ стран, и код появляется в приложении обычно за считанные секунды. Аккаунт подтверждён, объявление опубликовано — а номер в контактных данных eBay не тот, что лежит у вас в кармане.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для eBay?",
      body: [
        "Аккаунт маркетплейса собирает необычно много вас в одном месте: историю покупок, адрес, карту — и, если телефон ваш, прямую линию, которая переживает любую сделку. У eBay десятилетия накопленных данных о клиентах и долгая история жизни в роли мишени фишинга; «с вашим аккаунтом eBay проблема, перейдите по ссылке» — целый жанр мошеннических SMS. Арендованный номер берёт на себя шаг верификации, и весь этот жанр разыгрывается на номере, который никогда по-настоящему вашим не был.",
        "Честная обратная сторона: телефон нужен eBay не только при регистрации. Коды безопасности при входе, проверки личности продавца, контакты покупателя с продавцом — всё это может позже потянуться к номеру. Поэтому рабочая схема такая: подтвердитесь арендованным номером, держите почту якорем аккаунта, а если перестаёте арендовать номер — обновите телефон в настройках. Аккаунт eBay, не способный получить собственный код безопасности, запирает хозяина снаружи в самый неудачный момент; не давайте номеру устареть молча.",
      ],
    },
    howTo: {
      title: "Как подтвердить eBay виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Выберите сервис eBay и страну того сайта eBay, которым реально пользуетесь: ebay.com, ebay.co.uk, ebay.de и остальные делят один аккаунт, но совпадающий номер сохраняет данные регистрации согласованными.",
        },
        {
          title: "Введите его там, где eBay просит",
          body: "При регистрации, при оформлении аккаунта продавца или когда защита входа просит подтвердить телефон. Выберите код страны номера и введите его внимательно.",
        },
        {
          title: "Введите код",
          body: "SMS выглядит так: «Your eBay security code is 271846» — и появляется в приложении SMS Code обычно за секунды. Введите код на eBay, и номер подтверждён.",
        },
        {
          title: "Сделайте почту якорем аккаунта",
          body: "Подтвердите адрес почты, поставьте надёжный пароль и относитесь к телефону как к контрольной точке, а не фундаменту. Если арендованный номер оставлять не планируете, замените его в «Настройки аккаунта → Личные данные», когда всё настроено, — чтобы будущие коды безопасности приходили туда, где вы их прочтёте.",
        },
      ],
    },
    tips: [
      {
        title: "Продажи поднимают планку",
        body: "Покупательский аккаунт может проскочить с минимальными проверками, но регистрация продавца включает настоящую проверку личности и выплат — банковские реквизиты, иногда документы. Виртуальный номер закрывает SMS-шаг этого процесса; остальное — между вами и онбордингом продавцов eBay, и оно не опционально.",
      },
      {
        title: "Проверки входа возвращаются",
        body: "Защита логина eBay снова шлёт SMS на телефон при новых устройствах и необычной активности — порой спустя месяцы. Если аренда закончилась и номер в профиле мёртв, восстановление аккаунта превращается в переписку с поддержкой. Обновите номер в настройках до того, как это случится, а не после.",
      },
      {
        title: "Правильное количество аккаунтов — один",
        body: "eBay связывает аккаунты далеко не только по номеру телефона: адреса, способы оплаты, устройства. Виртуальный номер не воскресит заблокированный аккаунт и не умножит промокоды — такие попытки обычно заканчиваются закрытием всех связанных аккаунтов разом. Используйте его для приватности того аккаунта, который останется с вами.",
      },
    ],
    faqs: [
      {
        q: "Принимает ли eBay виртуальные номера?",
        a: "eBay проверяет, что номер способен получить его SMS, — а арендованный номер из SMS Code это настоящий мобильный номер в сети оператора, и код приходит как обычная SMS. Номера с бесплатных сайтов приёма SMS, напротив, обычно распознаются и отклоняются.",
      },
      {
        q: "Можно ли продавать на eBay с виртуальным номером?",
        a: "Шаг проверки телефона — да: при регистрации продавца приходит код, и арендованный номер его получает. Но продажи включают ещё проверку личности и выплат по собственной процедуре eBay, на которую номер телефона не влияет. Её придётся пройти с настоящими данными.",
      },
      {
        q: "Переживёт ли аккаунт eBay окончание аренды номера?",
        a: "Да — аккаунт держится на почте и пароле. Только не оставляйте мёртвый номер контактом безопасности: замените или обновите телефон в настройках, чтобы подтверждения входа и уведомления доходили до номера, который вы читаете.",
      },
      {
        q: "Из какой страны брать номер?",
        a: "Из той, где вы реально покупаете или продаёте. Адрес, способ оплаты и телефон рассказывают eBay одну согласованную историю; номер с другого континента, чем адрес доставки, приводит к дополнительным проверкам, а не избавляет от них.",
      },
      {
        q: "Код eBay не пришёл — что делать?",
        a: "Проверьте, совпадает ли код страны с арендованным номером, и подождите минуту. Иногда eBay предлагает голосовой звонок вместо SMS — до арендованного номера он не дойдёт, запросите именно повторную SMS. Если так ничего и нет, отмените активацию в SMS Code бесплатно и возьмите свежий номер.",
      },
    ],
  },
};
