import type { ServiceEntry } from "./types";

export const signal: ServiceEntry = {
  slug: "signal",
  name: "Signal",
  logo: "/services/signal.svg",
  category: "messaging",
  relatedSlugs: ["telegram", "whatsapp", "viber", "discord", "google"],
  popularCountries: [
    "united-states",
    "germany",
    "netherlands",
    "canada",
    "united-kingdom",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Signal",
    message: "SIGNAL: Your code is: 613904",
    code: "613904",
  },
  en: {
    metaTitle: "Virtual Number for Signal — Private Sign-Up Without a SIM",
    metaDescription:
      "Register Signal with a real virtual number from 150+ countries. The code arrives in the app in seconds — pay per activation, no subscription, free cancel if no SMS.",
    hero: {
      title: "A virtual number for Signal",
      intro: [
        "Here's the irony of Signal: the messenger that encrypts everything, stores almost nothing and gets recommended by every privacy researcher still asks for a phone number before you can send your first message. Registration is built on the SMS code — even though usernames now mean nobody ever has to see that number afterwards.",
        "With SMS Code you close that last gap: rent a real mobile number in one of 150+ countries, register Signal with it, and the code appears in the app within seconds. You pay per activation from a one-time coin pack — no subscription — and an activation that received no SMS is cancelled without charge.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Signal?",
      body: [
        "If you chose Signal, you chose it for the metadata it doesn't keep — and the phone number is the one identifier that registration still requires. Registering with your personal number quietly undermines the rest of the design: the messenger reveals nothing, but the number on file is the same one tied to your bank, your employer and every data broker's records. A rented number completes the picture Signal started.",
        "Since usernames arrived, the number's only remaining job is registration. Contacts can find you by username, and the privacy settings let you make the number invisible and unsearchable: “Who can see my number” — Nobody, “Who can find me by number” — Nobody. Pair those settings with a virtual number and the account isn't discoverable through your real number for the simple reason that your real number was never involved.",
      ],
    },
    howTo: {
      title: "How to register Signal with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose Signal as the service, pick a country and tap once. A real mobile number is reserved just for you for the length of the activation.",
        },
        {
          title: "Enter it in Signal",
          body: "On the registration screen, select the matching country code and type the number. Signal sometimes shows a captcha before sending the code — that's its anti-abuse check, just complete it.",
        },
        {
          title: "Grab the code",
          body: "The SMS lands in the SMS Code app within seconds, formatted like “SIGNAL: Your code is: 613904”. Enter the digits and registration completes.",
        },
        {
          title: "Set the PIN and claim a username",
          body: "Create your Signal PIN, then enable Registration Lock in Settings → Account. Next, set a username and switch “Who can see my number” and “Who can find me by number” to Nobody. Now the number has done its one job and disappears from view.",
        },
      ],
    },
    tips: [
      {
        title: "Registration Lock is your safety net",
        body: "With Registration Lock on, re-registering your number requires the Signal PIN — so nobody who later holds that number can take the account over. One caveat straight from Signal's design: the lock stays armed only while the account is in use, so open the app at least once a week.",
      },
      {
        title: "Let the username do the talking",
        body: "Share your username, not the number — that's the whole point of the feature. You can change the username at any time, and with the phone-number privacy switches set to Nobody, even people who somehow learn the rented number can't find the account through it.",
      },
      {
        title: "Your account lives on your device",
        body: "True to its philosophy, Signal keeps no cloud copy of your chats — the account and history exist on your phone. Moving to a new phone works via the built-in transfer while the old one is alive. Plan around that: with the rented number's window closed, the device itself is the account.",
      },
    ],
    faqs: [
      {
        q: "Doesn't the most private messenger requiring a phone number defeat the purpose?",
        a: "It's a real tension, and Signal knows it — that's why usernames and the phone-number privacy settings exist. The number is required once, at registration, as an anti-spam measure. A virtual number satisfies that requirement without linking the account to you, which is arguably the most Signal-spirited way to sign up.",
      },
      {
        q: "Will anyone see the number I registered with?",
        a: "Not if you flip the switches: set “Who can see my number” and “Who can find me by number” to Nobody, and share your username instead. From then on the number appears nowhere — not on your profile, not in search.",
      },
      {
        q: "What happens to my Signal account when the rented number expires?",
        a: "The account keeps working on your device — the number was needed for the one-time registration. Enable Registration Lock so the number can't be re-registered by anyone without your PIN, and keep using the app so the lock stays active.",
      },
      {
        q: "What if I lose my phone or reinstall Signal?",
        a: "This is the honest limitation: re-registering requires receiving a code on the number again, and an expired rental can't do that. Transfer to a new phone while the old one still works, and treat the device as the home of the account. For a privacy-first setup that trade-off is usually acceptable — just make it knowingly.",
      },
      {
        q: "Why didn't my Signal code arrive?",
        a: "Signal is careful about registrations it finds suspicious: you may get a captcha first, and some numbers are declined outright. Check that the country code matches, complete any captcha, and if the SMS still doesn't come, cancel the activation in SMS Code — no charge for numbers that received nothing — and try a different number or country.",
      },
    ],
  },
  ru: {
    metaTitle: "Виртуальный номер для Signal — приватная регистрация без SIM",
    metaDescription:
      "Зарегистрируйте Signal настоящим виртуальным номером из 150+ стран. Код приходит в приложение за секунды — оплата за активацию, без подписки, отмена без списания.",
    hero: {
      title: "Виртуальный номер для Signal",
      intro: [
        "Ирония Signal в том, что мессенджер, который шифрует всё, почти ничего не хранит и рекомендован каждым исследователем приватности, всё равно просит номер телефона до первого сообщения. Регистрация построена на SMS-коде — хотя с появлением юзернеймов этот номер потом можно вообще никому не показывать.",
        "С SMS Code вы закрываете эту последнюю брешь: арендуете настоящий мобильный номер в одной из 150+ стран, регистрируете на него Signal — и код появляется в приложении за считанные секунды. Платите за активацию из разового пакета монет, без подписки, а активация, на которую SMS не пришла, отменяется без списания.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Signal?",
      body: [
        "Если вы выбрали Signal, вы выбрали его за метаданные, которых он не хранит, — а номер телефона остаётся единственным идентификатором, который регистрация всё ещё требует. Регистрация на личный номер тихо подтачивает весь замысел: мессенджер не выдаёт ничего, но в его записи лежит тот же номер, что привязан к вашему банку, работодателю и базам всех брокеров данных. Арендованный номер дорисовывает картину, которую Signal начал.",
        "С появлением юзернеймов у номера осталась одна-единственная работа — регистрация. Контакты находят вас по юзернейму, а настройки приватности делают номер невидимым и непоисковым: «Кто видит мой номер» — Никто, «Кто может найти меня по номеру» — Никто. Сложите эти настройки с виртуальным номером — и аккаунт нельзя найти по вашему настоящему номеру по той простой причине, что настоящий номер вообще не участвовал.",
      ],
    },
    howTo: {
      title: "Как зарегистрировать Signal виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Signal, страну — и нажмите один раз. Настоящий мобильный номер резервируется только за вами на время активации.",
        },
        {
          title: "Введите его в Signal",
          body: "На экране регистрации выберите соответствующий код страны и введите номер. Иногда Signal показывает капчу до отправки кода — это его защита от злоупотреблений, просто пройдите её.",
        },
        {
          title: "Заберите код",
          body: "SMS придёт в приложение SMS Code за секунды, в формате «SIGNAL: Your code is: 613904». Введите цифры — регистрация завершена.",
        },
        {
          title: "Задайте PIN и займите юзернейм",
          body: "Создайте PIN-код Signal, затем включите блокировку регистрации: Настройки → Учётная запись. После этого задайте юзернейм и переключите «Кто видит мой номер» и «Кто может найти меня по номеру» на «Никто». Всё — номер сделал свою единственную работу и исчез из виду.",
        },
      ],
    },
    tips: [
      {
        title: "Блокировка регистрации — ваша страховка",
        body: "С включённой блокировкой регистрации перерегистрировать ваш номер можно только с PIN-кодом Signal — так что никто, к кому этот номер попадёт позже, не заберёт аккаунт. Одна оговорка из устройства самого Signal: блокировка держится, только пока аккаунтом пользуются, — открывайте приложение хотя бы раз в неделю.",
      },
      {
        title: "Пусть говорит юзернейм",
        body: "Делитесь юзернеймом, а не номером — в этом весь смысл функции. Юзернейм можно поменять в любой момент, а с переключателями приватности номера в положении «Никто» даже тот, кто как-то узнает арендованный номер, не найдёт по нему аккаунт.",
      },
      {
        title: "Ваш аккаунт живёт на устройстве",
        body: "Верный своей философии, Signal не хранит облачной копии переписки: аккаунт и история существуют на вашем телефоне. Переезд на новый телефон делается встроенным переносом, пока жив старый. Планируйте с учётом этого: когда окно арендованного номера закрыто, устройство и есть аккаунт.",
      },
    ],
    faqs: [
      {
        q: "Самый приватный мессенджер требует номер телефона — разве это не подрывает саму идею?",
        a: "Противоречие настоящее, и Signal о нём знает — потому и появились юзернеймы и настройки приватности номера. Номер нужен один раз, при регистрации, как защита от спама. Виртуальный номер закрывает это требование, не связывая аккаунт с вами, — пожалуй, самый «сигнальный» по духу способ зарегистрироваться.",
      },
      {
        q: "Кто-нибудь увидит номер, на который я зарегистрировался?",
        a: "Нет, если щёлкнуть переключатели: «Кто видит мой номер» и «Кто может найти меня по номеру» — на «Никто», а вместо номера делиться юзернеймом. После этого номер не появляется нигде — ни в профиле, ни в поиске.",
      },
      {
        q: "Что станет с аккаунтом Signal, когда аренда номера закончится?",
        a: "Аккаунт продолжит работать на вашем устройстве — номер был нужен для разовой регистрации. Включите блокировку регистрации, чтобы без вашего PIN-кода номер нельзя было зарегистрировать заново, и пользуйтесь приложением, чтобы блокировка оставалась активной.",
      },
      {
        q: "А если я потеряю телефон или переустановлю Signal?",
        a: "Вот честное ограничение: для повторной регистрации нужно снова получить код на номер, а истёкшая аренда этого не позволит. Переносите аккаунт на новый телефон, пока работает старый, и относитесь к устройству как к дому аккаунта. Для приватной конфигурации этот компромисс обычно приемлем — главное, идти на него осознанно.",
      },
      {
        q: "Почему не пришёл код Signal?",
        a: "Signal осторожен с регистрациями, которые кажутся ему подозрительными: сначала может прийти капча, а некоторым номерам он отказывает сразу. Проверьте совпадение кода страны, пройдите капчу, а если SMS так и нет — отмените активацию в SMS Code (за номера, на которые ничего не пришло, деньги не списываются) и попробуйте другой номер или страну.",
      },
    ],
  },
};
