import type { BlogPost } from "./types";

export const secondWhatsappAccount: BlogPost = {
  slug: "second-whatsapp-account",
  publishedAt: "2026-07-07",
  updatedAt: "2026-07-07",
  tags: ["WhatsApp", "How-to"],
  relatedServiceSlugs: ["whatsapp", "telegram", "viber"],
  en: {
    title: "Second WhatsApp Account Without a Second SIM: How-To",
    description:
      "You don’t need a second SIM for a second WhatsApp — just a second number and an app to run it in. WhatsApp Business, multi-account and virtual numbers.",
    excerpt:
      "WhatsApp ties every account to exactly one number — but that number doesn’t require a SIM slot. The official dual-app paths, the verification walkthrough, and the honest caveats.",
    blocks: [
      {
        type: "p",
        text: "You want one WhatsApp for friends and family and another for work, a side project or marketplace sales — without buying a second SIM card or carrying a second phone. Plenty of guides promise a trick. Here’s the honest version: there is no trick, because the problem isn’t what you think it is.",
      },
      {
        type: "p",
        text: "WhatsApp’s model is strict — one phone number, one account, and the number is the account’s identity. But nothing in that model says the number must live in a SIM slot of your phone. What you actually need are two things: a second number that can receive one verification code, and a place on your phone to run the second account. WhatsApp itself provides the second part officially; a virtual number covers the first. This guide walks through both, then the verification itself, the two-step PIN, and the caveats WhatsApp guides usually skip.",
      },
      {
        type: "h2",
        id: "one-number-one-account",
        text: "Why WhatsApp insists on one number per account",
      },
      {
        type: "p",
        text: "Unlike services that let you register with an email, WhatsApp uses the phone number as the account’s primary key. Your contacts find you because your number is in their address book; your encryption keys, chat backups and group memberships all hang off it. Register the same number on a new account and the old one is displaced — which is also why you can’t “clone” an account and why every second account genuinely needs its own number.",
      },
      {
        type: "p",
        text: "The good news is that WhatsApp has accepted that people legitimately need more than one account, and now offers two official ways to run them on a single phone.",
      },
      {
        type: "h2",
        id: "official-ways-to-run-two-accounts",
        text: "The official ways to run two accounts on one phone",
      },
      {
        type: "list",
        items: [
          "WhatsApp Business — the official dual-app path on both iPhone and Android. It’s a separate app by Meta that installs alongside regular WhatsApp, designed for exactly the work/personal split: same chats and calls, plus business profile, catalog and auto-replies. It still needs its own number, and its terms expect genuinely business-flavoured use.",
          "Multi-account on Android — newer versions of regular WhatsApp on Android let you add a second account inside the same app and switch between them from settings, no second app needed. Each account still requires its own number to verify. iPhones don’t have this in-app switcher, which is why the Business app is the usual iOS route.",
          "A second phone or dual-SIM slot — mentioned for completeness: it works, but it’s exactly the hardware cost this article exists to avoid.",
        ],
      },
      {
        type: "p",
        text: "Notice what all the options have in common: the container is solved, the number is not. Whichever path you pick, at some point a screen asks for a phone number that isn’t already tied to your main account. That’s where a virtual number comes in.",
      },
      {
        type: "h2",
        id: "virtual-number-as-the-second-number",
        text: "A virtual number as your second number",
      },
      {
        type: "p",
        text: "A virtual number is a real mobile number on a real carrier network — you rent it for the verification, the SMS code appears in the SMS Code app within seconds, and your second WhatsApp gets an identity of its own. No SIM card, no new contract, no monthly line you’ll forget to cancel: you pay per activation from a one-time coin pack, and if no code arrives, the activation cancels free. With numbers available in 150+ countries, you can even give your work account a local number for the market you serve.",
      },
      {
        type: "h2",
        id: "verification-walkthrough",
        text: "Verification walkthrough, step by step",
      },
      {
        type: "steps",
        items: [
          {
            title: "Prepare the container first",
            body: "Install WhatsApp Business (iPhone or Android), or on Android open WhatsApp → Settings → tap the arrow next to your name → “Add account”. Get to the screen that asks for a phone number before you rent one — activations have a time window, and there’s no point spending it on app setup.",
          },
          {
            title: "Rent a number for WhatsApp",
            body: "In the SMS Code app, choose WhatsApp as the service and pick a country. One tap reserves a real mobile number for you alone.",
          },
          {
            title: "Enter the number and request the code",
            body: "Type the number into WhatsApp with the matching country selected — a mismatched country code is the most common reason a code never arrives. Choose SMS delivery when asked.",
          },
          {
            title: "Grab the code from SMS Code",
            body: "The verification SMS appears in the SMS Code app, usually within seconds. Enter the 6-digit code in WhatsApp, set your profile name, and the second account is live.",
          },
          {
            title: "Set the two-step PIN immediately",
            body: "In the new account: Settings → Account → Two-step verification → enable, choose a PIN and add a recovery email. Do this before anything else — the section below explains why it matters even more on a rented number.",
          },
        ],
      },
      { type: "cta", serviceSlug: "whatsapp" },
      {
        type: "h2",
        id: "two-step-pin",
        text: "The two-step PIN: small setting, does the heavy lifting",
      },
      {
        type: "p",
        text: "WhatsApp’s two-step verification PIN is asked whenever someone tries to register your number on WhatsApp again. On a rented number this is your safety net: even if that number is later rented by someone else for a different service, they cannot re-register your WhatsApp account without the PIN. Combined with an active session on your phone, it keeps the account firmly yours. Add the recovery email too — it’s the only way back if you forget the PIN.",
      },
      {
        type: "h2",
        id: "honest-caveats",
        text: "The honest caveats",
      },
      {
        type: "p",
        text: "This is the part most guides skip. WhatsApp is noticeably stricter than Telegram about new registrations, and it’s better to know that going in.",
      },
      {
        type: "callout",
        text: "WhatsApp actively dislikes numbers it suspects are temporary, and a brand-new account that immediately behaves like a spam bot can be restricted quickly. Give a new account a normal warm-up: fill in the profile name and photo, message a few people who know you and will reply, and let it live quietly for a few days before any heavier use. Don’t mass-message strangers or join dozens of groups on day one — that isn’t a workaround tip, it’s simply what WhatsApp’s terms expect from any account, and a new number gets less benefit of the doubt.",
      },
      {
        type: "p",
        text: "Two more things to know. First, re-verification: WhatsApp asks for a fresh code when you reinstall the app or move to a new phone, so treat the installed, logged-in app as the thing you preserve — don’t log out or delete it casually. Second, pick the right container for the job: if the second account is genuinely commercial, WhatsApp Business is both the official tool and the safer fit for its terms; if it’s simply a second personal identity, Android’s multi-account does the job.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          {
            q: "Can I have two WhatsApp accounts on one phone?",
            a: "Yes, officially. On Android, recent WhatsApp versions support a second account inside the same app; on any phone you can run WhatsApp and WhatsApp Business side by side. Each account needs its own phone number to verify.",
          },
          {
            q: "Do I need a second SIM card for a second WhatsApp?",
            a: "No. WhatsApp needs a number that can receive one verification code — it doesn’t care whether that number lives in your SIM tray. A rented virtual number verifies the account, and the code arrives in the SMS Code app in seconds.",
          },
          {
            q: "Will WhatsApp ban an account made with a virtual number?",
            a: "A virtual number is a real mobile number, and verifying with it is not itself a violation — WhatsApp checks that you control the number, not whose name it’s in. What gets accounts restricted is behaviour: spam-like messaging, mass outreach to strangers, breaking WhatsApp’s terms. Use the account like a normal person and warm it up gently.",
          },
          {
            q: "What happens to my WhatsApp when the virtual number expires?",
            a: "The account keeps working — the number is checked at registration, and day-to-day use relies on your logged-in app. The caveat: reinstalling or switching phones triggers re-verification with a fresh code. Keep the app installed and logged in, and set the two-step PIN so nobody else can re-register the number.",
          },
          {
            q: "Should I use WhatsApp Business or the multi-account feature?",
            a: "If the second account is for actual business — clients, sales, support — use WhatsApp Business: it’s the official tool, adds profile and catalog features, and matches its terms of use. If you just want a second personal account and you’re on Android, the in-app multi-account switch is the lighter option. On iPhone, Business is the practical dual-app path.",
          },
        ],
      },
      { type: "cta", serviceSlug: "whatsapp" },
    ],
  },
  ru: {
    title: "Второй аккаунт WhatsApp без второй SIM-карты: гид",
    description:
      "Для второго WhatsApp не нужна вторая SIM — нужен второй номер и приложение, где он будет жить. WhatsApp Business, мультиаккаунт и виртуальные номера — честно.",
    excerpt:
      "WhatsApp привязывает каждый аккаунт ровно к одному номеру — но этому номеру не нужен слот для SIM-карты. Официальные пути для второго приложения, пошаговая верификация и честные оговорки.",
    blocks: [
      {
        type: "p",
        text: "Вам нужен один WhatsApp для друзей и семьи и второй — для работы, подработки или продаж на маркетплейсах. Без покупки второй SIM-карты и без второго телефона в кармане. Куча гидов обещает «хитрый способ». Вот честная версия: никакой хитрости нет, потому что проблема не там, где кажется.",
      },
      {
        type: "p",
        text: "Модель WhatsApp жёсткая: один номер телефона — один аккаунт, и номер и есть личность аккаунта. Но нигде в этой модели не сказано, что номер обязан жить в SIM-слоте вашего телефона. На самом деле нужны две вещи: второй номер, способный принять один код подтверждения, и место на телефоне, где второй аккаунт будет работать. Вторую часть WhatsApp официально даёт сам; первую закрывает виртуальный номер. В этом гиде — оба пункта, затем сама верификация, PIN двухшаговой проверки и оговорки, которые в гидах по WhatsApp обычно опускают.",
      },
      {
        type: "h2",
        id: "odin-nomer-odin-akkaunt",
        text: "Почему WhatsApp настаивает: один номер — один аккаунт",
      },
      {
        type: "p",
        text: "В отличие от сервисов с регистрацией по почте, WhatsApp использует номер телефона как первичный ключ аккаунта. Контакты находят вас потому, что ваш номер есть в их записной книжке; ключи шифрования, резервные копии чатов и членство в группах — всё держится на нём. Зарегистрируйте тот же номер в новом аккаунте — и старый будет вытеснен. Поэтому аккаунт нельзя «клонировать», и поэтому каждому второму аккаунту действительно нужен собственный номер.",
      },
      {
        type: "p",
        text: "Хорошая новость: WhatsApp признал, что людям законно нужен не один аккаунт, и теперь официально предлагает два способа держать их на одном телефоне.",
      },
      {
        type: "h2",
        id: "ofitsialnye-sposoby",
        text: "Официальные способы держать два аккаунта на одном телефоне",
      },
      {
        type: "list",
        items: [
          "WhatsApp Business — официальный путь «второго приложения» и на iPhone, и на Android. Это отдельное приложение от Meta, которое ставится рядом с обычным WhatsApp и создано ровно для разделения «работа/личное»: те же чаты и звонки, плюс бизнес-профиль, каталог и автоответы. Ему всё так же нужен собственный номер, а его условия предполагают действительно рабочее использование.",
          "Мультиаккаунт на Android — свежие версии обычного WhatsApp на Android позволяют добавить второй аккаунт прямо в приложении и переключаться между ними в настройках, без второго приложения. Каждому аккаунту всё равно нужен свой номер для верификации. На iPhone такого переключателя нет — поэтому на iOS обычный путь как раз через Business.",
          "Второй телефон или второй SIM-слот — упоминаем для полноты: работает, но это ровно те траты на железо, ради избежания которых написана эта статья.",
        ],
      },
      {
        type: "p",
        text: "Заметьте, что общего у всех вариантов: вопрос «где жить аккаунту» решён, вопрос номера — нет. Именно поэтому «лайфхаки» без второго номера не работают в принципе. Какой путь ни выберите, в какой-то момент экран попросит номер телефона, ещё не привязанный к вашему основному аккаунту. Здесь и выходит на сцену виртуальный номер.",
      },
      {
        type: "h2",
        id: "virtualnyy-nomer-kak-vtoroy",
        text: "Виртуальный номер в роли второго номера",
      },
      {
        type: "p",
        text: "Виртуальный номер — это настоящий мобильный номер в реальной сети оператора: вы арендуете его на время верификации, SMS с кодом появляется в приложении SMS Code за считанные секунды, и у второго WhatsApp появляется собственная личность. Без SIM-карты, без нового договора, без ежемесячной линии, которую вы забудете отключить: оплата за активацию из разового пакета монет, а если код не пришёл, активация отменяется бесплатно. Номера доступны в 150+ странах — рабочему аккаунту можно даже дать местный номер того рынка, с которым вы работаете.",
      },
      {
        type: "h2",
        id: "poshagovaya-verifikatsiya",
        text: "Верификация по шагам",
      },
      {
        type: "steps",
        items: [
          {
            title: "Сначала подготовьте «контейнер»",
            body: "Установите WhatsApp Business (iPhone или Android) — либо на Android откройте WhatsApp → Настройки → стрелка рядом с вашим именем → «Добавить аккаунт». Дойдите до экрана, запрашивающего номер, до аренды: у активации есть временное окно, и тратить его на настройку приложения незачем.",
          },
          {
            title: "Арендуйте номер для WhatsApp",
            body: "В приложении SMS Code выберите сервис WhatsApp и страну. Одно касание — и настоящий мобильный номер зарезервирован только за вами.",
          },
          {
            title: "Введите номер и запросите код",
            body: "Введите номер в WhatsApp, выбрав совпадающую страну, — несовпадение кода страны чаще всего и есть причина, почему код не приходит. На вопрос о способе доставки выберите SMS.",
          },
          {
            title: "Заберите код из SMS Code",
            body: "SMS с подтверждением появится в приложении SMS Code, обычно за считанные секунды. Введите шестизначный код в WhatsApp, задайте имя профиля — второй аккаунт готов.",
          },
          {
            title: "Сразу включите PIN двухшаговой проверки",
            body: "В новом аккаунте: Настройки → Аккаунт → Двухшаговая проверка → включить, задать PIN и добавить резервную почту. Сделайте это раньше всего остального — ниже объясняем, почему на арендованном номере это особенно важно.",
          },
        ],
      },
      { type: "cta", serviceSlug: "whatsapp" },
      {
        type: "h2",
        id: "pin-dvukhshagovoy-proverki",
        text: "PIN двухшаговой проверки: маленькая настройка, большая работа",
      },
      {
        type: "p",
        text: "PIN двухшаговой проверки WhatsApp запрашивается каждый раз, когда кто-то пытается заново зарегистрировать ваш номер в WhatsApp. На арендованном номере это ваша страховка: даже если этот номер позже арендует кто-то другой под другой сервис, перерегистрировать ваш аккаунт WhatsApp без PIN он не сможет. Вместе с активной сессией на вашем телефоне это надёжно закрепляет аккаунт за вами. Учтите, что PIN спросят и у вас самих при повторной регистрации, — храните его там, где точно найдёте, и добавьте резервную почту: это единственный путь назад, если PIN всё-таки забудется.",
      },
      {
        type: "h2",
        id: "chestnye-ogovorki",
        text: "Честные оговорки",
      },
      {
        type: "p",
        text: "Та часть, которую большинство гидов пропускает. К новым регистрациям WhatsApp относится заметно строже, чем Telegram, и лучше знать это заранее — тогда ни одно из ограничений не станет сюрпризом.",
      },
      {
        type: "callout",
        text: "WhatsApp активно недолюбливает номера, которые кажутся ему временными, и совсем свежий аккаунт, с порога ведущий себя как спам-бот, может быстро попасть под ограничения. Дайте новому аккаунту нормальный «разогрев»: заполните имя и фото профиля, напишите нескольким людям, которые вас знают и ответят, и пусть он несколько дней живёт спокойно, прежде чем нагружать его всерьёз. Не рассылайте сообщения незнакомцам и не вступайте в десятки групп в первый же день — это не «трюк для обхода», это просто то, чего условия WhatsApp ждут от любого аккаунта; новому номеру лишь достаётся меньше презумпции невиновности.",
      },
      {
        type: "p",
        text: "Ещё две вещи, которые нужно знать. Первое — повторная верификация: WhatsApp запрашивает свежий код при переустановке приложения или переезде на новый телефон, поэтому берегите именно установленное приложение с активной сессией — не выходите из аккаунта и не удаляйте его без нужды. Второе — выбирайте правильный «контейнер» под задачу: если второй аккаунт действительно коммерческий, WhatsApp Business — и официальный инструмент, и более безопасное соответствие его условиям; если это просто вторая личная учётка, мультиаккаунта на Android достаточно.",
      },
      { type: "h2", id: "faq", text: "Частые вопросы" },
      {
        type: "faq",
        items: [
          {
            q: "Можно ли держать два аккаунта WhatsApp на одном телефоне?",
            a: "Да, официально. На Android свежие версии WhatsApp поддерживают второй аккаунт внутри одного приложения; на любом телефоне можно поставить WhatsApp и WhatsApp Business рядом. Каждому аккаунту нужен собственный номер для верификации.",
          },
          {
            q: "Нужна ли вторая SIM-карта для второго WhatsApp?",
            a: "Нет. WhatsApp нужен номер, способный принять один код подтверждения, — а лежит ли этот номер в вашем SIM-лотке, ему безразлично. Арендованный виртуальный номер подтверждает аккаунт, и код приходит в приложение SMS Code за секунды.",
          },
          {
            q: "Не забанит ли WhatsApp аккаунт на виртуальном номере?",
            a: "Виртуальный номер — настоящий мобильный номер, и верификация через него сама по себе не нарушение: WhatsApp проверяет, что номер под вашим контролем, а не на чьё имя он оформлен. Под ограничения аккаунты попадают за поведение: рассылки, массовые сообщения незнакомцам, нарушение условий WhatsApp. Пользуйтесь аккаунтом как обычный человек и разогревайте его постепенно.",
          },
          {
            q: "Что будет с WhatsApp, когда виртуальный номер истечёт?",
            a: "Аккаунт продолжит работать: номер проверяется при регистрации, а повседневная работа держится на приложении с активной сессией. Оговорка: переустановка или смена телефона запускает повторную верификацию с новым кодом. Держите приложение установленным, не выходите из аккаунта и включите PIN двухшаговой проверки, чтобы никто другой не смог перерегистрировать номер.",
          },
          {
            q: "Что выбрать: WhatsApp Business или мультиаккаунт?",
            a: "Если второй аккаунт для настоящего дела — клиенты, продажи, поддержка — берите WhatsApp Business: это официальный инструмент с профилем и каталогом, и он соответствует своим условиям использования. Если нужен просто второй личный аккаунт и у вас Android, легче встроенный переключатель мультиаккаунта. На iPhone практичный путь двух приложений — через Business.",
          },
        ],
      },
      { type: "cta", serviceSlug: "whatsapp" },
    ],
  },
};
