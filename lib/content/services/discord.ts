import type { ServiceEntry } from "./types";

export const discord: ServiceEntry = {
  slug: "discord",
  name: "Discord",
  logo: "/services/discord.svg",
  category: "messaging",
  relatedSlugs: ["telegram", "steam", "google", "twitter", "signal"],
  popularCountries: [
    "united-states",
    "united-kingdom",
    "germany",
    "canada",
    "netherlands",
  ],
  updatedAt: "2026-07-07",
  smsExample: {
    sender: "Discord",
    message: "Your Discord verification code is: 274918",
    code: "274918",
  },
  en: {
    metaTitle: "Virtual Number for Discord — Verify Without Your Real Number",
    metaDescription:
      "Get a real mobile number for Discord phone verification in seconds. Unlock phone-gated servers and locked accounts without linking your personal number.",
    hero: {
      title: "A virtual number for Discord",
      intro: [
        "Discord only asks for an email at sign-up — until the day it doesn't. Try to post in a server with a high verification level, join several servers in quick succession, or connect through a VPN, and Discord's anti-abuse system demands a verified phone number before you can go any further.",
        "With SMS Code you rent a real mobile number in one of 50+ countries, enter it in Discord, and the six-digit code from sender “Discord” appears in the app within seconds. Your personal number stays out of it — and out of Discord's database.",
      ],
    },
    whyVirtual: {
      title: "Why use a virtual number for Discord?",
      body: [
        "Discord lets a phone number be verified on exactly one account at a time: verify it on a new account and it silently unlinks from the old one. That single rule is why people rent numbers for Discord. If you run a moderation account, a dev account for bot testing, or a separate identity for a community you help manage, each account needs its own number — and a virtual number gives every one a dedicated line without a drawer full of SIM cards.",
        "The other half is that Discord is picky. It's known to reject numbers it classifies as VoIP, which is why the free “temp SMS” sites so often fail at this exact step. SMS Code issues real mobile numbers on real carrier networks, which Discord normally accepts — and on the honest occasions when a particular number is still refused, you cancel the pending activation without being charged and try a number from a different country.",
      ],
    },
    howTo: {
      title: "How to verify Discord with a virtual number",
      steps: [
        {
          title: "Get a number in SMS Code",
          body: "Open the SMS Code app, choose Discord as the service, pick a country and tap once. The number is a real mobile line, reserved for you alone — which matters, because Discord ties each number to a single account.",
        },
        {
          title: "Enter it in Discord",
          body: "Type the number into whichever prompt Discord is showing — the verification wall on a locked account, a phone-gated server's gate, or Settings → My Account → Add Phone. Select the matching country code; a mismatch is the most common reason a code never arrives.",
        },
        {
          title: "Grab the six-digit code",
          body: "The SMS lands in the SMS Code app within seconds, from sender “Discord”: “Your Discord verification code is: 274918”. Enter it and the checkmark appears — the account is verified and any phone gate lifts.",
        },
        {
          title: "Secure the account properly",
          body: "The number stays linked in Settings → My Account, and the account keeps working normally from here on. Add authenticator-app 2FA and save the backup codes right away — that, not the phone, is what actually protects the account long term.",
        },
      ],
    },
    tips: [
      {
        title: "One number verifies one account — period",
        body: "If you verify the same number on a second Discord account, Discord moves it there and unlinks it from the first, which can push the first account straight back behind a verification wall. Rent a separate number for each account you want to keep verified.",
      },
      {
        title: "If Discord rejects the number, don't fight it",
        body: "Discord filters out numbers it flags as VoIP, and occasionally a legitimate mobile range gets caught too. Cancel the pending activation in SMS Code — nothing is charged for a number that received no code — and take a fresh number, ideally from a different country.",
      },
      {
        title: "Phone-gated servers check the link, not the history",
        body: "Servers on the highest verification level require a phone that is currently linked to your account. You can remove the number in Settings once authenticator 2FA and backup codes are in place, but do it after you've joined the gated servers you care about — or keep it linked while you're active there.",
      },
    ],
    faqs: [
      {
        q: "Why is Discord suddenly asking me for a phone number?",
        a: "Two main triggers. Servers with a high verification level require a verified phone before you can post in them at all. And Discord's anti-abuse system locks accounts pending phone verification when it sees signals it dislikes — a VPN connection, joining many servers rapidly, a fresh account acting too fast. In both cases entering a number and the six-digit code clears the block.",
      },
      {
        q: "Can I verify two Discord accounts with one virtual number?",
        a: "No — and this isn't our limit, it's Discord's. A number can be verified on only one Discord account at a time; verifying it on a second unlinks it from the first. Rent a dedicated number per account instead, so a moderation profile or bot-testing account never knocks your main one out of verified status.",
      },
      {
        q: "Will Discord accept a virtual number? I've heard it blocks them.",
        a: "Discord blocks numbers it classifies as VoIP, which is what most free “temp SMS” sites hand out. SMS Code numbers are real mobile numbers on carrier networks, and Discord normally accepts them. No service can promise every number passes — if one is refused, cancel the activation free of charge and try a different country.",
      },
      {
        q: "What happens to my Discord account when the rented number expires?",
        a: "It keeps working normally. The verification is a one-time check; the number simply remains listed in Settings → My Account, and Discord doesn't re-verify it by SMS in day-to-day use. Add authenticator 2FA with backup codes and the account doesn't depend on that number at all — you can even remove it, unless you need it linked for phone-gated servers.",
      },
      {
        q: "The code from Discord never arrived — what should I do?",
        a: "First check that the country code you selected in Discord matches the number — that mismatch causes most silent failures. If it's correct and nothing comes within a few minutes, Discord likely refused that number. Cancel the pending activation in SMS Code — numbers that received nothing are never charged — and request a new one from another country.",
      },
    ],
  },
  ru: {
    metaTitle:
      "Виртуальный номер для Discord — верификация без личного номера",
    metaDescription:
      "Настоящий мобильный номер для подтверждения телефона в Discord за секунды. Откройте серверы с проверкой телефона, не привязывая личный номер.",
    hero: {
      title: "Виртуальный номер для Discord",
      intro: [
        "При регистрации Discord просит только почту — до поры до времени. Стоит попытаться написать на сервере с высоким уровнем проверки, вступить в несколько серверов подряд или зайти через VPN — и антиспам-система Discord требует подтверждённый номер телефона, прежде чем пустить дальше.",
        "С SMS Code вы арендуете настоящий мобильный номер в одной из 50+ стран, вводите его в Discord — и шестизначный код от отправителя «Discord» появляется в приложении за считанные секунды. Ваш личный номер остаётся в стороне — и не попадает в базу Discord.",
      ],
    },
    whyVirtual: {
      title: "Зачем виртуальный номер для Discord?",
      body: [
        "В Discord один номер телефона может быть подтверждён только на одном аккаунте: привяжете его к новому аккаунту — и он молча отвяжется от старого. Именно из-за этого правила номера для Discord и арендуют. Если у вас есть аккаунт модератора, аккаунт разработчика для тестирования ботов или отдельная личность для сообщества, которым вы помогаете управлять, — каждому аккаунту нужен свой номер. Виртуальный номер даёт каждому из них отдельную линию без ящика, набитого SIM-картами.",
        "Вторая половина истории — Discord привередлив. Он известен тем, что отклоняет номера, которые считает VoIP, — поэтому бесплатные сайты «временных SMS» так часто проваливаются именно на этом шаге. SMS Code выдаёт настоящие мобильные номера в реальных сетях операторов, и Discord их, как правило, принимает. А если конкретный номер всё же отклонён — честно скажем, такое бывает, — вы отменяете ожидающую активацию без списания и берёте номер другой страны.",
      ],
    },
    howTo: {
      title: "Как подтвердить Discord виртуальным номером",
      steps: [
        {
          title: "Получите номер в SMS Code",
          body: "Откройте приложение SMS Code, выберите сервис Discord, страну — и нажмите один раз. Номер — настоящая мобильная линия, зарезервированная только для вас. Это важно: Discord привязывает каждый номер к единственному аккаунту.",
        },
        {
          title: "Введите его в Discord",
          body: "Впишите номер в тот запрос, который показывает Discord: окно верификации на заблокированном аккаунте, проверку телефона на сервере или Настройки → Моя учётная запись → Добавить телефон. Выберите соответствующий код страны — несовпадение чаще всего и есть причина, почему код не приходит.",
        },
        {
          title: "Заберите шестизначный код",
          body: "SMS придёт в приложение SMS Code за секунды, от отправителя «Discord»: «Your Discord verification code is: 274918». Введите код — появится галочка: аккаунт подтверждён, и любая проверка телефона снимается.",
        },
        {
          title: "Защитите аккаунт как следует",
          body: "Номер остаётся привязанным в Настройки → Моя учётная запись, и дальше аккаунт работает как обычно. Сразу включите 2FA через приложение-аутентификатор и сохраните резервные коды — именно они, а не телефон, по-настоящему защищают аккаунт в долгую.",
        },
      ],
    },
    tips: [
      {
        title: "Один номер — один аккаунт, без исключений",
        body: "Подтвердите тот же номер на втором аккаунте Discord — и он переедет туда, отвязавшись от первого; первый аккаунт может тут же снова упереться в стену верификации. Арендуйте отдельный номер под каждый аккаунт, который хотите держать подтверждённым.",
      },
      {
        title: "Если Discord отклонил номер — не воюйте с ним",
        body: "Discord отсекает номера, которые помечает как VoIP, и иногда под раздачу попадает и вполне обычный мобильный диапазон. Отмените ожидающую активацию в SMS Code — за номер, на который не пришёл код, деньги не списываются, — и возьмите свежий номер, лучше из другой страны.",
      },
      {
        title: "Серверам с проверкой телефона важна привязка, а не история",
        body: "Серверы с наивысшим уровнем проверки требуют телефон, привязанный к аккаунту прямо сейчас. Удалить номер в настройках можно после включения 2FA с резервными кодами — но сделайте это уже после вступления в нужные закрытые серверы. Или оставьте привязку, пока вы там активны.",
      },
    ],
    faqs: [
      {
        q: "Почему Discord вдруг требует у меня номер телефона?",
        a: "Два главных повода. Серверы с высоким уровнем проверки не дают писать без подтверждённого телефона. А антиспам-система Discord блокирует аккаунт до подтверждения номера, если видит подозрительные сигналы: подключение через VPN, быстрое вступление во много серверов, слишком активный свежий аккаунт. В обоих случаях ввод номера и шестизначного кода снимает блок.",
      },
      {
        q: "Можно ли подтвердить два аккаунта Discord одним виртуальным номером?",
        a: "Нет — и это ограничение не наше, а самого Discord. Номер может быть подтверждён только на одном аккаунте одновременно; привязка ко второму отвязывает его от первого. Арендуйте отдельный номер на каждый аккаунт — тогда профиль модератора или аккаунт для тестирования ботов не выбьет основной из подтверждённого статуса.",
      },
      {
        q: "Примет ли Discord виртуальный номер? Говорят, он их блокирует.",
        a: "Discord блокирует номера, которые классифицирует как VoIP, — именно такие раздают большинство бесплатных сайтов «временных SMS». Номера SMS Code — настоящие мобильные номера в сетях операторов, и Discord их, как правило, принимает. Гарантировать прохождение каждого номера не может никто: если номер отклонён, отмените активацию без списания и попробуйте другую страну.",
      },
      {
        q: "Что будет с аккаунтом Discord, когда аренда номера закончится?",
        a: "Он продолжит работать как обычно. Верификация — разовая проверка; номер просто остаётся в списке в Настройки → Моя учётная запись, и в повседневной работе Discord не перепроверяет его по SMS. Включите 2FA через аутентификатор с резервными кодами — и аккаунт вообще не будет зависеть от этого номера. Его можно даже удалить, если только он не нужен привязанным для серверов с проверкой телефона.",
      },
      {
        q: "Код от Discord так и не пришёл — что делать?",
        a: "Сначала проверьте, что код страны, выбранный в Discord, совпадает с номером, — это самая частая причина тихих сбоев. Если всё верно, а код не приходит несколько минут, скорее всего, Discord отклонил этот номер. Отмените ожидающую активацию в SMS Code — за номера, на которые ничего не пришло, деньги не списываются, — и запросите новый номер из другой страны.",
      },
    ],
  },
};
