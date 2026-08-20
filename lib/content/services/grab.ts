import type { ServiceEntry } from "./types";

export const grab: ServiceEntry = {
  slug: "grab",
  name: "Grab",
  logo: "/services/grab.svg",
  category: "travel",
  relatedSlugs: ["uber", "line", "airbnb", "aliexpress", "google"],
  popularCountries: [
    "indonesia",
    "philippines",
    "united-states",
    "united-kingdom",
    "canada",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Grab",
    message:
      "702415 is your Grab activation code. For your account safety, do not share this code.",
    code: "702415",
  },
  en: {
    metaTitle: "Virtual Number for Grab — Sign Up for Southeast Asia's App",
    metaDescription:
      "Verify Grab with a real virtual number. The activation code arrives in the SMS Code app in seconds — set up rides, food and more without your personal number.",
    hero: {
      title: "A virtual number for Grab",
      intro: [
        "Land anywhere in Southeast Asia and Grab is the first app you'll need: rides from the airport, food to the hotel, payments at the street stall. It's the region's super-app — and it's phone-first. There's no email login to fall back on at sign-up; Grab starts by asking for a mobile number and texting an activation code to it.",
        "SMS Code hands you a real number from one of 50+ countries. Enter it on Grab's welcome screen, and the six-digit code appears in the SMS Code app within seconds — your account is live before your luggage hits the carousel, and your personal number was never part of the deal.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Grab?",
      body: [
        "Grab is built around local numbers. Its sign-up flow expects a number from a country where it operates, and travelers arriving with a European or American SIM often find that awkward — roaming SMS can be slow or blocked, and some carriers charge for the privilege of receiving a code. A virtual number from Indonesia or the Philippines slots straight into what Grab expects, without hunting for a SIM kiosk on day one.",
        "There's a privacy angle too. Because Grab is phone-first, your number becomes the key to everything inside it — ride history, food orders, the wallet. Keeping that key separate from the number your bank, family and employer use is simply sensible compartmentalization: if you stop using Grab after the trip, nothing about your everyday number went with it.",
      ],
    },
    howTo: {
      title: "How to verify Grab with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Code",
          body: "Open the SMS Code app, choose Grab as the service and pick a country — a Southeast Asian country like Indonesia or the Philippines fits Grab's home turf best. The number is reserved instantly.",
        },
        {
          title: "Enter it on Grab's sign-up screen",
          body: "Grab asks for your mobile number on the very first screen. Select the country code that matches your rented number and type it in — Grab sends the activation code by SMS right away.",
        },
        {
          title: "Type in the activation code",
          body: "Watch the SMS Code app: the text arrives in seconds and reads “702415 is your Grab activation code. For your account safety, do not share this code.” Enter the six digits in Grab.",
        },
        {
          title: "Add email and payment details",
          body: "Once inside, attach an email address in your profile and set up how you'll pay — card or the in-app wallet. The email gives your account a second anchor beyond the phone number.",
        },
      ],
    },
    tips: [
      {
        title: "Pick a country where Grab actually operates",
        body: "Grab serves Southeast Asia — Singapore, Indonesia, Malaysia, Thailand, Vietnam, the Philippines and neighbors. A number from one of those markets matches what the sign-up flow expects; that's why Indonesian and Philippine numbers are the popular choice for Grab activations.",
      },
      {
        title: "Do the sign-up before your trip",
        body: "Verify the account while you're still on comfortable Wi-Fi, not in an arrivals hall. The phone check happens once at registration — after that you log in on the same device without needing another SMS, so your account is ready the moment you land.",
      },
      {
        title: "Drivers call through the app",
        body: "When a driver needs to reach you, Grab routes the contact through in-app chat and internet calls rather than dialing your raw number. Keep notifications on for the Grab app so you catch the “I'm outside” message even though no SMS is involved.",
      },
    ],
    faqs: [
      {
        q: "Can I use Grab as a tourist with a virtual number?",
        a: "Yes — that's the classic case. Verify the account with a number from a country Grab operates in, add a payment method, and order rides and food during your trip like any local user. The account isn't tied to the SIM in your phone.",
      },
      {
        q: "Which country should I choose for a Grab number?",
        a: "One of Grab's home markets. Indonesia and the Philippines are the most popular picks in SMS Code for Grab, since the sign-up flow is built around numbers from countries where the service runs.",
      },
      {
        q: "Will my Grab account keep working after the number's rental window ends?",
        a: "The activation code is a one-time check at sign-up. As long as you stay logged in on your device, the account works normally. If you later log out and Grab asks to re-verify, you can rent a fresh number and update the one on your profile.",
      },
      {
        q: "Why didn't my Grab activation code arrive?",
        a: "Check that the country code selected in Grab matches the rented number — that mismatch is the most frequent cause. If nothing comes, cancel the activation in SMS Code (numbers that received no SMS are free) and try another number.",
      },
      {
        q: "Do I need a local number to pay with GrabPay?",
        a: "The wallet lives inside your verified account, not inside your SIM. Once the account is activated, payment features follow the rules of the country your account is set to — top-up options and card support vary by market, which is a Grab policy, not a number issue.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Grab — регистрация в супераппе Азии",
    metaDescription:
      "Подтвердите Grab настоящим виртуальным номером. Код активации придёт в приложение SMS Code за секунды — такси, еда и оплата без вашего личного номера.",
    hero: {
      title: "Виртуальный номер для Grab",
      intro: [
        "Прилетаете в Юго-Восточную Азию — и Grab оказывается первым нужным приложением: такси из аэропорта, еда в отель, оплата у уличного лотка. Это суперапп региона, и он устроен по принципу «сначала телефон»: входа по почте при регистрации попросту нет — Grab с порога просит мобильный номер и шлёт на него код активации.",
        "SMS Code выдаёт настоящий номер из одной из 50+ стран. Введите его на приветственном экране Grab — и шестизначный код появится в приложении SMS Code за секунды. Аккаунт готов раньше, чем приедет багаж, а ваш личный номер в этой сделке не участвовал.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Grab?",
      body: [
        "Grab заточен под местные номера: регистрация рассчитана на номер страны, где сервис работает. Путешественнику с европейской или американской SIM-картой от этого неудобно — SMS в роуминге идут медленно или не доходят вовсе, а некоторые операторы ещё и берут деньги за само удовольствие принять код. Виртуальный номер из Индонезии или с Филиппин ложится ровно в то, чего Grab ждёт, — и не надо в первый же день искать киоск с SIM-картами.",
        "Есть и соображение приватности. Раз Grab держится на телефоне, номер становится ключом ко всему внутри: истории поездок, заказам еды, кошельку. Держать этот ключ отдельно от номера, которым пользуются ваш банк, семья и работодатель, — просто разумное разделение: если после поездки вы забросите Grab, ваш повседневный номер туда так и не попал.",
      ],
    },
    howTo: {
      title: "Как подтвердить Grab виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Grab и страну — лучше всего подходит Юго-Восточная Азия, например Индонезия или Филиппины: это родные рынки Grab. Номер резервируется мгновенно.",
        },
        {
          title: "Введите его на экране регистрации Grab",
          body: "Grab запрашивает мобильный номер на самом первом экране. Выберите код страны, совпадающий с арендованным номером, введите его — и Grab сразу отправит код активации по SMS.",
        },
        {
          title: "Введите код активации",
          body: "Следите за приложением SMS Code: сообщение приходит за секунды и выглядит так — «702415 is your Grab activation code. For your account safety, do not share this code.» Введите шесть цифр в Grab.",
        },
        {
          title: "Добавьте почту и способ оплаты",
          body: "Внутри привяжите к профилю электронную почту и настройте оплату — карту или встроенный кошелёк. Почта даст аккаунту вторую точку опоры помимо номера телефона.",
        },
      ],
    },
    tips: [
      {
        title: "Берите страну, где Grab реально работает",
        body: "Grab обслуживает Юго-Восточную Азию: Сингапур, Индонезию, Малайзию, Таиланд, Вьетнам, Филиппины и соседей. Номер одного из этих рынков совпадает с ожиданиями формы регистрации — потому для активаций Grab чаще всего берут индонезийские и филиппинские номера.",
      },
      {
        title: "Регистрируйтесь до поездки",
        body: "Подтвердите аккаунт заранее, на спокойном Wi-Fi, а не в зале прилёта. Проверка телефона происходит один раз при регистрации — дальше вы входите на том же устройстве без новых SMS, и аккаунт готов к работе в момент посадки.",
      },
      {
        title: "Водители звонят через приложение",
        body: "Когда водителю нужно с вами связаться, Grab ведёт общение через встроенный чат и интернет-звонки, а не набирает ваш номер напрямую. Включите уведомления приложения Grab, чтобы не пропустить «я на месте» — SMS в этом уже не участвуют.",
      },
    ],
    faqs: [
      {
        q: "Могу ли я пользоваться Grab как турист с виртуальным номером?",
        a: "Да — это самый типичный сценарий. Подтвердите аккаунт номером страны, где Grab работает, добавьте способ оплаты — и заказывайте такси и еду в поездке наравне с местными. Аккаунт не привязан к SIM-карте в вашем телефоне.",
      },
      {
        q: "Какую страну выбрать для номера под Grab?",
        a: "Один из домашних рынков Grab. В SMS Code для Grab чаще всего берут Индонезию и Филиппины: форма регистрации рассчитана на номера стран, где сервис действительно работает.",
      },
      {
        q: "Продолжит ли аккаунт Grab работать после окончания аренды номера?",
        a: "Код активации — одноразовая проверка при регистрации. Пока вы не выходите из аккаунта на своём устройстве, всё работает как обычно. Если позже вы выйдете и Grab попросит подтверждение заново, арендуйте свежий номер и обновите его в профиле.",
      },
      {
        q: "Почему не пришёл код активации Grab?",
        a: "Проверьте, совпадает ли код страны в Grab с арендованным номером — это самая частая причина. Если SMS так и нет, отмените активацию в SMS Code (номера без входящих сообщений бесплатны) и возьмите другой номер.",
      },
      {
        q: "Нужен ли местный номер, чтобы платить через GrabPay?",
        a: "Кошелёк живёт внутри подтверждённого аккаунта, а не внутри SIM-карты. После активации платёжные функции подчиняются правилам страны аккаунта: способы пополнения и поддержка карт различаются по рынкам — это политика Grab, а не вопрос номера.",
      },
    ],
  },
};
