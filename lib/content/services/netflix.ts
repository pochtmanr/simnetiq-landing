import type { ServiceEntry } from "./types";

export const netflix: ServiceEntry = {
  slug: "netflix",
  name: "Netflix",
  logo: "/services/netflix.svg",
  category: "entertainment",
  relatedSlugs: ["steam", "apple", "google", "paypal", "aliexpress"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "france",
    "poland",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Netflix",
    message: "Your Netflix verification code is 428916",
    code: "428916",
  },
  en: {
    metaTitle: "Virtual Number for Netflix — Verify Without Your Own Phone",
    metaDescription:
      "Receive Netflix’s verification code on a real virtual number in seconds. Keep trials and subscriptions separate from your personal phone — honestly explained.",
    hero: {
      title: "A virtual number for Netflix",
      intro: [
        "Netflix is an email-first service — but the phone step keeps creeping in. Some regions and sign-up flows verify a number right away, mobile plans in several countries are built around one, and the app texts a code like “Your Netflix verification code is 428916” whenever it wants to double-check it’s really you.",
        "With SMS Activate you rent a real mobile number in one of 50+ countries and the code lands in the app within seconds. The subscription gets verified — and your personal number stays out of yet another customer database.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Netflix?",
      body: [
        "A streaming account is a strangely personal thing: it knows what you watch, when you fall asleep and who shares your couch. Add your personal number as the recovery contact and you’ve tied that profile to your real-world identity — and handed one more company a number that password-reset texts can be aimed at. If the account is a household one, or a trial you might not keep, there’s no reason your SIM should be its anchor.",
        "The honest flip side: because Netflix leans on email, the phone here is rarely the account’s foundation — it’s a checkpoint. That’s exactly what makes a virtual number a good fit. It absorbs the verification moment (sign-up, a new-device check, a recovery prompt), while the email you control stays the thing the account actually depends on.",
      ],
    },
    howTo: {
      title: "How to verify Netflix with a virtual number",
      steps: [
        {
          title: "Rent a number in SMS Activate",
          body: "Pick Netflix as the service and choose a country — ideally the one matching where you’re signing up and paying. One tap reserves a real mobile number for you.",
        },
        {
          title: "Enter it when Netflix asks",
          body: "The phone prompt appears at sign-up in some flows, or later under account settings when you add a phone. Select the number’s country code and type it in carefully.",
        },
        {
          title: "Type in the code",
          body: "The SMS reads “Your Netflix verification code is 428916” and appears in the SMS Activate app within seconds. Enter it and the number is confirmed.",
        },
        {
          title: "Keep email as the anchor",
          body: "Make sure the account’s email is one you control and the password is strong. If you don’t plan to keep the rented number, remove or replace the phone in account settings afterwards — Netflix should never have a reason to text a number you no longer read.",
        },
      ],
    },
    tips: [
      {
        title: "You might not need a number at all",
        body: "Plenty of Netflix sign-ups never ask for a phone — email and payment are enough. Check your flow first and rent a number only when the phone screen actually appears. An activation you cancel before any SMS arrives costs nothing.",
      },
      {
        title: "Don’t leave a dead number as recovery",
        body: "If a phone stays on the account, Netflix may send sign-in codes or reset links there. After verification, swap it for a number you control or remove it entirely, so a forgotten-password moment never depends on a number that’s gone.",
      },
      {
        title: "A number won’t bend the rules",
        body: "Household checks, regional catalogs and one-per-customer offers are enforced by Netflix through its own signals, not through your phone. A virtual number is a privacy tool for the SMS step — it doesn’t reroute your region or multiply promos, and trying that mostly gets accounts flagged.",
      },
    ],
    faqs: [
      {
        q: "Does Netflix always ask for a phone number?",
        a: "No. Most sign-ups run on email and payment alone. A phone appears in certain regions and flows — mobile-focused plans, extra security checks, recovery setup. When your flow does ask, a virtual number receives the code exactly like a SIM would.",
      },
      {
        q: "Will my Netflix account work after the rented number expires?",
        a: "Yes. Netflix accounts are anchored to email and password; the phone is a checkpoint, not the foundation. Confirm your email, set a strong password and remove or replace the rented number in account settings — after that, nothing depends on it.",
      },
      {
        q: "Can I start a Netflix trial or promo with a virtual number?",
        a: "Where Netflix runs trials or intro offers, its terms make them one per customer. A virtual number keeps your personal phone out of the sign-up — it isn’t a way to collect the same offer twice, and duplicate-account tricks tend to end in cancelled promos.",
      },
      {
        q: "Will this change my Netflix region or catalog?",
        a: "No. What you can watch follows where you are and how the account is billed, under Netflix’s own rules — the phone number plays no part in it. Choose a number from your own country to keep the account’s details consistent.",
      },
      {
        q: "Why didn’t the Netflix code arrive?",
        a: "Check that the country code you picked matches the rented number, and look at the account’s email — Netflix sometimes verifies there instead. If the SMS never came, cancel the activation in SMS Activate free of charge and take a fresh number.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Netflix — подтверждение без своей SIM",
    metaDescription:
      "Код подтверждения Netflix на настоящий виртуальный номер за секунды. Подписки и пробные периоды — отдельно от личного телефона. Честно о том, как это работает.",
    hero: {
      title: "Виртуальный номер для Netflix",
      intro: [
        "Netflix построен вокруг почты, но телефонный шаг встречается всё чаще: в отдельных странах и сценариях номер проверяют прямо при регистрации, мобильные тарифы в ряде регионов вообще на него завязаны, а приложение присылает код вида «Your Netflix verification code is 428916», когда хочет убедиться, что это действительно вы.",
        "С SMS Activate вы арендуете настоящий мобильный номер в одной из 50+ стран, и код приходит в приложение за считанные секунды. Подписка подтверждена — а ваш личный номер не пополнил ещё одну клиентскую базу.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Netflix?",
      body: [
        "Стриминговый аккаунт — вещь на удивление личная: он знает, что вы смотрите, когда засыпаете и кто сидит рядом на диване. Добавьте личный номер как контакт для восстановления — и этот профиль привязан к вашей реальной личности, а у ещё одной компании появился номер, на который можно нацелить SMS для сброса пароля. Если аккаунт семейный или это пробный период, который вы, может, и не оставите, вашей SIM-карте нечего делать в его фундаменте.",
        "Честная обратная сторона: раз Netflix опирается на почту, телефон здесь редко бывает фундаментом аккаунта — это контрольная точка. Именно поэтому виртуальный номер сюда так хорошо ложится: он принимает на себя момент проверки (регистрацию, вход с нового устройства, запрос восстановления), а якорем аккаунта остаётся почта, которую контролируете вы.",
      ],
    },
    howTo: {
      title: "Как подтвердить Netflix виртуальным номером",
      steps: [
        {
          title: "Арендуйте номер в SMS Activate",
          body: "Выберите сервис Netflix и страну — лучше ту, где вы регистрируетесь и платите. Одно касание — и настоящий мобильный номер зарезервирован для вас.",
        },
        {
          title: "Введите его, когда Netflix попросит",
          body: "Запрос телефона появляется при регистрации в части сценариев или позже — в настройках аккаунта, когда вы добавляете номер. Выберите код страны номера и введите его внимательно.",
        },
        {
          title: "Введите код",
          body: "SMS выглядит так: «Your Netflix verification code is 428916» — и появляется в приложении SMS Activate за секунды. Введите код, и номер подтверждён.",
        },
        {
          title: "Оставьте почту якорем аккаунта",
          body: "Убедитесь, что почта аккаунта под вашим контролем, а пароль надёжный. Если оставлять арендованный номер не собираетесь, удалите или замените телефон в настройках аккаунта: у Netflix не должно быть повода писать на номер, который вы больше не читаете.",
        },
      ],
    },
    tips: [
      {
        title: "Возможно, номер вам вообще не нужен",
        body: "Многие регистрации Netflix телефон не спрашивают — хватает почты и оплаты. Сначала проверьте свой сценарий и арендуйте номер, только когда телефонный экран действительно появился. Активация, отменённая до прихода SMS, не стоит ничего.",
      },
      {
        title: "Не оставляйте мёртвый номер способом восстановления",
        body: "Пока телефон висит в аккаунте, Netflix может слать туда коды входа и ссылки для сброса пароля. После подтверждения замените его номером под вашим контролем или удалите совсем — чтобы забытый пароль никогда не упирался в номер, которого больше нет.",
      },
      {
        title: "Номер не обходит правила",
        body: "Проверки домохозяйства, региональные каталоги и акции «одна на клиента» Netflix обеспечивает собственными сигналами, а не вашим телефоном. Виртуальный номер — инструмент приватности на шаге SMS: он не переносит регион и не размножает промо, а попытки этого добиться обычно заканчиваются пометкой аккаунта.",
      },
    ],
    faqs: [
      {
        q: "Netflix всегда просит номер телефона?",
        a: "Нет. Большинство регистраций обходятся почтой и оплатой. Телефон появляется в отдельных странах и сценариях: мобильные тарифы, дополнительные проверки безопасности, настройка восстановления. Если ваш сценарий номер просит, виртуальный примет код так же, как SIM-карта.",
      },
      {
        q: "Аккаунт Netflix продолжит работать после окончания аренды номера?",
        a: "Да. Аккаунты Netflix держатся на почте и пароле; телефон — контрольная точка, а не фундамент. Подтвердите почту, поставьте надёжный пароль и удалите или замените арендованный номер в настройках — после этого от него ничего не зависит.",
      },
      {
        q: "Можно ли оформить пробный период или промо с виртуальным номером?",
        a: "Там, где Netflix предлагает пробные периоды и стартовые акции, его правила отводят их по одной на клиента. Виртуальный номер убирает ваш личный телефон из регистрации — но это не способ получить одно и то же предложение дважды: трюки с дублями аккаунтов обычно заканчиваются отменой промо.",
      },
      {
        q: "Изменится ли мой регион или каталог Netflix?",
        a: "Нет. Что вам доступно, определяется тем, где вы находитесь и как оплачивается аккаунт, — по правилам самого Netflix; номер телефона здесь ни при чём. Берите номер своей страны, чтобы данные аккаунта оставались согласованными.",
      },
      {
        q: "Почему не пришёл код Netflix?",
        a: "Проверьте, совпадает ли выбранный код страны с арендованным номером, и загляните в почту аккаунта — иногда Netflix подтверждает там. Если SMS так и не пришла, отмените активацию в SMS Activate бесплатно и возьмите свежий номер.",
      },
    ],
  },
};
