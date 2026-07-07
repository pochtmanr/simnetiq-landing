import type { BlogPost } from "./types";

export const telegramWithoutPhoneNumber: BlogPost = {
  slug: "telegram-without-phone-number",
  publishedAt: "2026-07-07",
  updatedAt: "2026-07-07",
  tags: ["Telegram", "Privacy"],
  relatedServiceSlugs: ["telegram", "whatsapp", "signal"],
  en: {
    title: "How to Sign Up for Telegram Without a Phone Number",
    description:
      "Telegram always asks for a number — but it doesn’t have to be yours. Real options: virtual numbers, landlines, Fragment — and the privacy settings that matter.",
    excerpt:
      "Telegram won’t let you register without some phone number — but it doesn’t have to be yours. Here are the options that actually work, and the settings that keep your identity out of it.",
    blocks: [
      {
        type: "p",
        text: "You’ve installed Telegram, tapped “Start Messaging” — and the very first screen demands a phone number. No email option, no “skip for now”. If you were hoping to keep your personal number out of yet another database, that screen feels like a wall.",
      },
      {
        type: "p",
        text: "Here’s the honest answer up front: there is no way to create a Telegram account with no phone number at all. Verification by phone is baked into how Telegram identifies accounts, and every workaround you’ll find online still involves a number somewhere. What you can do — easily — is sign up without your number. The account works exactly the same; it just isn’t anchored to the SIM card in your pocket.",
      },
      {
        type: "p",
        text: "This guide walks through the three routes that genuinely exist, then shows the full sign-up with a virtual number, the privacy settings that hide whatever number you used, and the one step — a cloud password — that keeps the account yours for good.",
      },
      {
        type: "h2",
        id: "your-real-options",
        text: "Your real options (and what each one is for)",
      },
      {
        type: "p",
        text: "Strip away the myths — “register with email” hasn’t existed, “no-SIM APK mods” are a malware lottery — and three legitimate paths remain. They serve very different people.",
      },
      {
        type: "list",
        items: [
          "A virtual number. You rent a real mobile number for the length of the verification, receive the code, and sign up. It’s the fastest and cheapest route for most people: your personal number never touches Telegram’s servers, and the account keeps working after the rental ends as long as you stay logged in.",
          "A landline or fixed number. Telegram can deliver the login code by voice call instead of SMS, so a home or office landline can technically verify an account. The limits are real, though: the call option only appears after an SMS attempt times out, plenty of fixed-line and VoIP ranges are rejected outright, and you must keep long-term access to that line for any future re-verification.",
          "An anonymous +888 number from Fragment. Telegram’s own blockchain marketplace auctions virtual +888 numbers that work only inside Telegram and require no SIM at all. It’s the most private option on paper — but it’s aimed at a different audience: you bid in Toncoin, prices float with the collectible market, and you need a TON wallet before you can even start. For “I just want an account without my number”, it’s overkill.",
        ],
      },
      {
        type: "p",
        text: "For most readers the practical choice is the first one. A virtual number is a real number on a real carrier network — Telegram treats it like any other mobile number, no special casing, no waiting on an auction. So let’s do the actual sign-up.",
      },
      {
        type: "h2",
        id: "sign-up-with-a-virtual-number",
        text: "Signing up with a virtual number, step by step",
      },
      {
        type: "p",
        text: "The whole process takes a couple of minutes. You’ll need the Telegram app and the SMS Activate app side by side — the code arrives in the latter and gets typed into the former.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Rent a number for Telegram",
            body: "In the SMS Activate app, pick Telegram as the service and choose a country — there are real mobile numbers in 50+ countries. One tap reserves a number just for you. You pay per activation from a one-time credit pack; there’s no subscription, and if no code ever arrives, the activation cancels free.",
          },
          {
            title: "Enter the number in Telegram",
            body: "On Telegram’s sign-up screen, select the country that matches your rented number, then type the number in. A mismatched country code is the single most common reason a code never shows up, so double-check it before tapping Next.",
          },
          {
            title: "Wait for the code — it lands in seconds",
            body: "Switch back to SMS Activate. The verification SMS appears right in the app, usually within seconds, looking like “Telegram code: 48329”. Copy the code into Telegram.",
          },
          {
            title: "Finish the profile",
            body: "Pick a first name (it doesn’t have to be real) and you’re in. Before you join a single group, spend two minutes on the privacy settings below — they matter more than which number you used.",
          },
        ],
      },
      { type: "cta", serviceSlug: "telegram" },
      {
        type: "h2",
        id: "privacy-settings-that-matter",
        text: "The privacy settings that actually hide you",
      },
      {
        type: "p",
        text: "Whichever route you took, the number you verified with is now attached to the account — and by default, Telegram shows it to your contacts and lets anyone who has it saved find you. Two settings and one habit close those gaps.",
      },
      {
        type: "list",
        items: [
          "Hide the number: Settings → Privacy and Security → Phone Number → “Who can see my phone number” → Nobody. From that moment, group members and message recipients see only your display name.",
          "Control discovery: on the same screen, set “Who can find me by my number” to My Contacts. Otherwise anyone who ever had the number in their address book — including its previous holder’s contacts, if the number was recycled — can match it to your new account.",
          "Live by username: set a @username in Settings and share that instead of a number. Usernames are how Telegram intends people to find each other; the phone number can stay a login credential and nothing more.",
        ],
      },
      {
        type: "h2",
        id: "lock-it-with-a-cloud-password",
        text: "Lock it in: the two-step verification password",
      },
      {
        type: "p",
        text: "This is the step people skip and later regret. In Settings → Privacy and Security → Two-Step Verification, set a cloud password. With it enabled, logging in from a new device requires both a code and the password — so control of the phone number alone is never enough to take the account.",
      },
      {
        type: "callout",
        text: "If you signed up with a rented number, the cloud password is not optional — it’s what makes the account permanently yours. Set it immediately, add a recovery email, and don’t log out of your only active session. Telegram sends future login codes to active sessions rather than by SMS, so day-to-day use never depends on the old number.",
      },
      {
        type: "p",
        text: "That’s the complete picture: an account that behaves like any other Telegram account, discoverable only by username, secured by a password, and pointing at a number that was never yours to begin with.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          {
            q: "Can I use Telegram without any phone number at all?",
            a: "No. Telegram requires a number at sign-up with no email or username-only alternative. The realistic choices are a number that isn’t yours: a rented virtual number, a landline that can take a voice-call code, or an anonymous +888 number from Fragment.",
          },
          {
            q: "Will my account stop working when the virtual number expires?",
            a: "No. The number is only checked at verification. Stay logged in and enable Two-Step Verification, and the account keeps working indefinitely — Telegram delivers future login codes to your active session, not by SMS.",
          },
          {
            q: "Can I sign up for Telegram with a free online number?",
            a: "Usually not. Numbers on free SMS-reception sites are shared by thousands of people, so Telegram has almost always seen them before and refuses to deliver a code — or the number is already tied to someone else’s account. A rented number is reserved for you alone during the activation.",
          },
          {
            q: "Is registering with a virtual number against Telegram’s rules?",
            a: "Telegram verifies that you control a number, not whose name it’s registered under. Signing up with a rented number for normal personal use is fine — what matters is following Telegram’s terms of service once you’re in, same as any account.",
          },
          {
            q: "Can other people tell I used a virtual number?",
            a: "No. It’s a real mobile number on a real carrier network, indistinguishable from any other. And once you set “Who can see my phone number” to Nobody, other users see only your name and username anyway.",
          },
        ],
      },
      { type: "cta", serviceSlug: "telegram" },
    ],
  },
  ru: {
    title: "Как зарегистрироваться в Telegram без номера телефона",
    description:
      "Telegram всегда просит номер — но не обязательно ваш. Реальные варианты: виртуальный номер, городской телефон, Fragment — и важные настройки приватности.",
    excerpt:
      "Совсем без номера Telegram зарегистрироваться не даст — но номер не обязан быть вашим. Разбираем варианты, которые действительно работают, и настройки, которые уберут вашу личность из уравнения.",
    blocks: [
      {
        type: "p",
        text: "Вы установили Telegram, нажали «Начать общение» — и первый же экран требует номер телефона. Ни варианта с почтой, ни кнопки «пропустить». Если вы надеялись не отдавать личный номер в очередную базу данных, этот экран выглядит как стена.",
      },
      {
        type: "p",
        text: "Честный ответ сразу: создать аккаунт Telegram вообще без номера телефона невозможно. Подтверждение по номеру заложено в саму систему идентификации аккаунтов, и любой «обходной путь» из интернета всё равно упирается в какой-то номер. Зато можно легко зарегистрироваться без вашего номера. Аккаунт работает точно так же — просто он не привязан к SIM-карте у вас в кармане.",
      },
      {
        type: "p",
        text: "В этом гиде — три пути, которые действительно существуют, полная регистрация через виртуальный номер, настройки приватности, скрывающие любой использованный номер, и один шаг — облачный пароль, — который навсегда закрепляет аккаунт за вами.",
      },
      {
        type: "h2",
        id: "realnye-varianty",
        text: "Реальные варианты (и для кого каждый из них)",
      },
      {
        type: "p",
        text: "Отбросим мифы — «регистрации по почте» никогда не существовало, а «моды APK без SIM» — это лотерея с вредоносным ПО, хотя и то и другое до сих пор всплывает в поисковой выдаче. Остаются три легальных пути, и рассчитаны они на очень разных людей.",
      },
      {
        type: "list",
        items: [
          "Виртуальный номер. Вы арендуете настоящий мобильный номер на время верификации, получаете код и регистрируетесь. Для большинства это самый быстрый и дешёвый путь: личный номер вообще не попадает на серверы Telegram, а аккаунт продолжает работать после окончания аренды — достаточно не выходить из него.",
          "Городской (стационарный) номер. Telegram умеет продиктовать код входа голосовым звонком вместо SMS, так что домашний или офисный городской телефон технически может подтвердить аккаунт. Но ограничения серьёзные: вариант со звонком появляется только после того, как истечёт время ожидания SMS, многие городские и VoIP-диапазоны отклоняются сразу, и доступ к этой линии нужно сохранять на случай повторной верификации.",
          "Анонимный номер +888 с Fragment. Собственная блокчейн-площадка Telegram продаёт с аукциона виртуальные номера +888, которые работают только внутри Telegram и вовсе не требуют SIM. На бумаге это самый приватный вариант — но рассчитан он на другую аудиторию: ставки делаются в Toncoin, цены плавают вместе с рынком коллекционных номеров, и без кошелька TON даже не начать. Для задачи «просто аккаунт без моего номера» это стрельба из пушки по воробьям.",
        ],
      },
      {
        type: "p",
        text: "Городской телефон осмыслен, только если он у вас уже есть и никуда не денется; Fragment — если вы и так живёте в экосистеме TON. Для большинства читателей практичный выбор — первый. Виртуальный номер — это настоящий номер в реальной сети оператора: Telegram воспринимает его как любой другой мобильный, без особых условий и без ожидания аукциона. Так что перейдём к самой регистрации.",
      },
      {
        type: "h2",
        id: "registratsiya-cherez-virtualnyy-nomer",
        text: "Регистрация через виртуальный номер: по шагам",
      },
      {
        type: "p",
        text: "Весь процесс занимает пару минут. Понадобятся два приложения рядом — Telegram и SMS Activate: код придёт во второе, а ввести его нужно в первое. И запасной план встроен: если на номер так ничего и не пришло, активация отменяется бесплатно — просто возьмите другой номер и повторите.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Арендуйте номер для Telegram",
            body: "В приложении SMS Activate выберите сервис Telegram и страну — настоящие мобильные номера есть в 50+ странах. Одно касание — и номер зарезервирован только для вас. Оплата за активацию из разового пакета кредитов: подписки нет, а если код так и не пришёл, активация отменяется бесплатно.",
          },
          {
            title: "Введите номер в Telegram",
            body: "На экране регистрации Telegram выберите страну, совпадающую с арендованным номером, и введите его. Несовпадение кода страны — самая частая причина, почему код не приходит, поэтому проверьте дважды, прежде чем нажать «Далее».",
          },
          {
            title: "Дождитесь кода — он придёт за секунды",
            body: "Вернитесь в SMS Activate. SMS с подтверждением появится прямо в приложении, обычно за считанные секунды, в виде «Telegram code: 48329». Перенесите код в Telegram.",
          },
          {
            title: "Завершите профиль",
            body: "Укажите имя (настоящее не обязательно) — и вы внутри. Имя всегда можно поменять позже, а вот настройки ниже лучше не откладывать: прежде чем вступать в первую группу, потратьте на них две минуты — они важнее, чем то, какой номер вы использовали.",
          },
        ],
      },
      { type: "cta", serviceSlug: "telegram" },
      {
        type: "h2",
        id: "nastroyki-privatnosti",
        text: "Настройки приватности, которые действительно вас скрывают",
      },
      {
        type: "p",
        text: "Каким бы путём вы ни пошли, номер, использованный для верификации, теперь привязан к аккаунту — и по умолчанию Telegram показывает его вашим контактам и позволяет найти вас всем, у кого он сохранён. Отдельно помните про синхронизацию контактов: стоит кому-то сохранить этот номер в записной книжке, и связь «номер — профиль» восстановится сама, если заранее не закрыть её настройками. Две настройки и одна привычка закрывают эти дыры.",
      },
      {
        type: "list",
        items: [
          "Скройте номер: Настройки → Конфиденциальность → Номер телефона → «Кто видит мой номер» → Никто. С этого момента участники групп и собеседники видят только ваше имя.",
          "Ограничьте поиск: на том же экране выберите «Кто может найти меня по номеру» → Мои контакты. Иначе любой, у кого этот номер когда-либо был в записной книжке — включая контакты его прежнего владельца, если номер выдавался повторно, — сможет сопоставить его с вашим новым аккаунтом.",
          "Живите по юзернейму: задайте @username в настройках и делитесь именно им — а при желании смените его в любой момент. Юзернеймы — это и есть задуманный в Telegram способ находить друг друга; номер телефона может остаться просто логином и ничем больше.",
        ],
      },
      {
        type: "h2",
        id: "oblachnyy-parol",
        text: "Закрепите аккаунт: пароль двухэтапной аутентификации",
      },
      {
        type: "p",
        text: "Вот шаг, который пропускают, а потом жалеют. В Настройки → Конфиденциальность → Двухэтапная аутентификация задайте облачный пароль. С ним вход с нового устройства требует и код, и пароль — так что один лишь контроль над номером телефона никогда не даст забрать аккаунт. И обязательно привяжите резервную почту: без неё забытый пароль восстановить не получится.",
      },
      {
        type: "callout",
        text: "Если вы регистрировались на арендованный номер, облачный пароль — не опция, а обязательный шаг: именно он делает аккаунт навсегда вашим. Установите его сразу, добавьте резервную почту и не выходите из единственной активной сессии. Будущие коды входа Telegram отправляет в активные сессии, а не по SMS, так что повседневная работа от старого номера не зависит.",
      },
      {
        type: "p",
        text: "Вот и вся картина: аккаунт, который ведёт себя как любой другой в Telegram, находится только по юзернейму, защищён паролем — и указывает на номер, который никогда не был вашим. Вся настройка — виртуальный номер для верификации, юзернейм вместо номера, облачный пароль для защиты — занимает минут десять, а закрывает самую неприятную связку: «ваш личный номер — вся ваша переписка».",
      },
      { type: "h2", id: "faq", text: "Частые вопросы" },
      {
        type: "faq",
        items: [
          {
            q: "Можно ли пользоваться Telegram вообще без номера телефона?",
            a: "Нет. При регистрации Telegram требует номер, альтернативы в виде почты или только юзернейма не существует. Реальный выбор — номер, который не ваш: арендованный виртуальный, городской телефон, принимающий код голосовым звонком, или анонимный номер +888 с Fragment.",
          },
          {
            q: "Аккаунт перестанет работать, когда истечёт виртуальный номер?",
            a: "Нет. Номер проверяется только при верификации. Не выходите из аккаунта и включите двухэтапную аутентификацию — и аккаунт будет работать сколько угодно: будущие коды входа Telegram доставляет в активную сессию, а не по SMS. Резервную почту для облачного пароля тоже привяжите заранее — это ваш запасной вход.",
          },
          {
            q: "Можно ли зарегистрироваться на бесплатный номер из интернета?",
            a: "Как правило, нет. Номерами на бесплатных сайтах приёма SMS пользуются тысячи людей, поэтому Telegram почти всегда уже видел их и отказывается присылать код — либо номер уже привязан к чужому аккаунту. Арендованный номер на время активации зарезервирован только за вами.",
          },
          {
            q: "Регистрация с виртуальным номером не нарушает правила Telegram?",
            a: "Telegram проверяет, что номер под вашим контролем, а не на чьё имя он оформлен. Регистрация на арендованный номер для обычного личного использования — нормальная практика; главное — соблюдать условия использования Telegram после входа, как и с любым аккаунтом.",
          },
          {
            q: "Заметят ли другие, что у меня виртуальный номер?",
            a: "Нет. Это настоящий мобильный номер в реальной сети оператора, неотличимый от любого другого. А после настройки «Кто видит мой номер» → Никто собеседники в любом случае видят только имя и юзернейм.",
          },
        ],
      },
      { type: "cta", serviceSlug: "telegram" },
    ],
  },
};
