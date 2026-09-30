export const HELP_ARTICLES = [
  {
    "slug": "activation-issues",
    "en": {
      "title": "Activation issues: missing or rejected SMS",
      "sections": [
        {
          "title": "Check the service and number",
          "paragraphs": [
            "Choose the exact service you want to verify. Enter the assigned number with its country code and check for duplicated prefixes. Request SMS verification in that service; a voice call or a code sent to another device cannot be received here.",
            "Keep the activation open and check its status in the app. Notifications can help, but the activation screen is the place to check for the code. Avoid repeated resend requests: the target service may impose its own cooldown."
          ]
        },
        {
          "title": "Two-minute cancellation and the activation window",
          "paragraphs": [
            "If no SMS has arrived, you can cancel two minutes after the number is assigned. The timer starts at assignment, not when you open the app or buy coins. Use the cancellation countdown shown in the app.",
            "Cancel returns the activation’s coins to your in-app balance. Try another number also returns the old activation’s coins before buying a new activation; check the new price. These are coin returns, not payment refunds.",
            "The current activation window is 15 minutes after assignment. Follow the countdown in your app. If the window ends without an SMS, the activation closes and its coins are returned. If the return remains pending or the balance is wrong, contact support rather than repeatedly buying numbers.",
            "Cancellation is unavailable once an SMS is received, even if the target service rejects the code. An SMS arriving during cancellation can change eligibility."
          ]
        },
        {
          "title": "Rejected code or already-used number",
          "paragraphs": [
            "Use the latest code for the correct account and service, without extra spaces. The target service controls code validity, number acceptance and account restrictions. A delivered SMS does not guarantee successful registration.",
            "If the number is already registered, do not access someone else’s account. If a code is rejected, stop repeated paid attempts and contact support for a review. There is no automatic coin return after an SMS has arrived; this does not limit any applicable consumer rights."
          ]
        },
        {
          "title": "What to send support",
          "paragraphs": [
            "Include the activation ID, selected service and country, approximate time and timezone, status, and the exact error message. A screenshot of the error helps. Do not send passwords, verification codes or full card details."
          ]
        }
      ]
    },
    "ru": {
      "title": "Проблемы активации: SMS не приходит или код отклонён",
      "sections": [
        {
          "title": "Проверьте сервис и номер",
          "paragraphs": [
            "Выберите именно тот сервис, в котором проходит проверка. Введите выданный номер с кодом страны без повторяющегося префикса. Запросите SMS: звонки и коды на другом устройстве здесь не принимаются.",
            "Проверяйте статус и код на экране активации. Не запрашивайте отправку много раз подряд: у стороннего сервиса могут быть ограничения."
          ]
        },
        {
          "title": "Отмена через две минуты и срок активации",
          "paragraphs": [
            "Если SMS ещё нет, отмена доступна через две минуты после выдачи номера, а не после запуска приложения или покупки монет. Ориентируйтесь на таймер в приложении.",
            "При отмене монеты за активацию возвращаются на баланс. При выборе другого номера сначала возвращаются монеты за старую активацию, затем оплачивается новая — проверьте её цену. Это возврат монет, а не денег.",
            "Текущее окно активации — 15 минут после выдачи номера. Следите за таймером. Если SMS не пришло до окончания окна, активация закрывается и монеты возвращаются. Если возврат завис или баланс неверный, обратитесь в поддержку.",
            "После получения SMS отмена недоступна, даже если код отклонён сервисом. SMS, пришедшее во время отмены, может изменить доступность возврата."
          ]
        },
        {
          "title": "Код отклонён или номер уже зарегистрирован",
          "paragraphs": [
            "Используйте последний код для нужного аккаунта и сервиса без лишних пробелов. Сторонний сервис определяет срок действия кода и допустимость номера. Доставка SMS не гарантирует регистрацию.",
            "Если номер уже зарегистрирован, не входите в чужой аккаунт. При отклонённом коде прекратите повторные платные попытки и напишите в поддержку. После получения SMS автоматического возврата монет нет; это не ограничивает применимые права потребителя."
          ]
        },
        {
          "title": "Что сообщить поддержке",
          "paragraphs": [
            "Укажите ID активации, сервис, страну, примерное время и часовой пояс, статус и текст ошибки. Можно приложить снимок ошибки. Не отправляйте пароли, SMS-коды или полные данные карты."
          ]
        }
      ]
    }
  },
  {
    "slug": "choosing-country",
    "en": {
      "title": "Choosing a country and using temporary numbers safely",
      "sections": [
        {
          "title": "Choose for the target service",
          "paragraphs": [
            "Select your service first, then a country it accepts for your legitimate use. If the service requires a local number, follow that requirement. Confirm that its signup form accepts the country’s dialing code before purchasing.",
            "Recommended is a convenience suggestion based on your device region setting, not a promise of SMS delivery or number acceptance. Your physical location and the number’s country are different. No country guarantees delivery. Compare availability and the coin price shown before confirming."
          ]
        },
        {
          "title": "When delivery fails",
          "paragraphs": [
            "Check for an SMS option and any service cooldown. Some platforms reject temporary or virtual numbers. After the two-minute wait, cancel a number with no received SMS; consider another supported country only if the service permits it. Do not use country selection to bypass legal, identity or platform restrictions."
          ]
        },
        {
          "title": "Protect your account",
          "paragraphs": [
            "Numbers are temporary and may be reassigned. You do not own the number or retain access after the activation ends. Do not rely on it for banking, emergency services, long-term two-factor authentication or account recovery.",
            "Where the platform permits it, add an email, passkey, authenticator or your own permanent recovery number before losing access. Never use a recycled number to enter another person’s account."
          ]
        }
      ]
    },
    "ru": {
      "title": "Выбор страны и безопасное использование временных номеров",
      "sections": [
        {
          "title": "Выбирайте страну под сервис",
          "paragraphs": [
            "Сначала выберите сервис, затем страну, номера которой он принимает для вашего законного использования. Если требуется местный номер, соблюдайте это требование. До покупки проверьте, что форма регистрации принимает код выбранной страны.",
            "Метка «Рекомендуем» основана на регионе устройства и не гарантирует доставку SMS или принятие номера. Страна номера и ваше местоположение — разные вещи. Ни одна страна не гарантирует доставку. Проверяйте наличие номеров и цену."
          ]
        },
        {
          "title": "Если SMS не приходит",
          "paragraphs": [
            "Проверьте выбор SMS и ограничения повторной отправки. Некоторые платформы не принимают временные номера. Через две минуты можно отменить активацию без SMS. Другую страну выбирайте только если сервис это допускает, а не для обхода закона или правил платформы."
          ]
        },
        {
          "title": "Защитите аккаунт",
          "paragraphs": [
            "Номера временные и могут быть выданы другому пользователю. После окончания активации доступ не сохраняется. Не используйте их для банков, экстренных служб, постоянной двухфакторной защиты или восстановления аккаунта.",
            "Если платформа допускает, заранее добавьте почту, ключ доступа, приложение-аутентификатор или свой постоянный номер для восстановления. Не входите в чужие аккаунты через повторно выданный номер."
          ]
        }
      ]
    }
  },
  {
    "slug": "billing-coins-refunds",
    "en": {
      "title": "Billing, coins and Apple refunds",
      "sections": [
        {
          "title": "How coins work",
          "paragraphs": [
            "Coin packs are one-time App Store purchases, not subscriptions. There is no automatic renewal. Coins do not expire, cannot be transferred and are not a cash wallet. The activation price depends on the service and country and is shown before confirmation.",
            "An eligible cancellation, number replacement, expiry without SMS or failed number assignment returns the activation’s coins. Once an SMS has arrived, cancellation does not automatically return coins. Report delivery or billing faults to support for review."
          ]
        },
        {
          "title": "Missing coins or an unfamiliar charge",
          "paragraphs": [
            "Check that you are signed into the same SMS Code account used for the purchase. Allow a pending Apple payment to complete and reopen the app. Avoid buying another pack just to fix a missing balance.",
            "Send support the Apple order ID or receipt, pack, purchase date and your app account identifier if available. Redact unrelated purchases and payment details. For a charge you do not recognize, check your Apple purchase history and Family Sharing purchases, then contact Apple."
          ]
        },
        {
          "title": "Unused coins and payment refunds",
          "paragraphs": [
            "Returning coins to the app does not reverse an Apple payment. For money back on an Apple-billed coin purchase, request a refund from Apple for the purchase and explain accurately whether coins are unused, partly used, missing or faulty. An unused balance does not automatically entitle you to a refund or a partial cash withdrawal.",
            "Apple assesses refund eligibility under its regional terms and applicable law. We cannot promise approval or issue a refund through Apple’s payment system ourselves. Contact us about service defects or unused coins if you need purchase or balance records. Your mandatory consumer rights remain unaffected.",
            "If Apple approves a refund, the related coin credit may be removed from your balance. Do not continue spending coins for a purchase you are asking to have refunded. Deleting your account or uninstalling does not submit a refund request."
          ]
        },
        {
          "title": "Request a refund from Apple",
          "paragraphs": [
            "1. Open reportaproblem.apple.com and sign in with the Apple Account that paid for the pack.",
            "2. In the request menu, select the refund option, then choose the reason that describes what happened.",
            "3. Continue, select the SMS Code coin purchase and submit the request.",
            "4. Apple normally provides an update within 24–48 hours. Check the claim status on the same site. This is an update timeframe; the request may still be pending, and returning money takes additional time."
          ]
        },
        {
          "title": "If the purchase is missing or the refund is delayed",
          "paragraphs": [
            "Pending charges cannot be requested until Apple issues a receipt; unpaid orders must be settled first. Check the Apple Account shown on your receipt. If the purchase is unavailable or you cannot submit a request, contact Apple Support.",
            "After approval, Apple says store-credit returns can take up to 48 hours, card and most other payment-method returns up to 30 days, and mobile billing up to 60 days. SIMNETIQ cannot speed up Apple or bank processing."
          ]
        }
      ]
    },
    "ru": {
      "title": "Оплата, монеты и возврат через Apple",
      "sections": [
        {
          "title": "Как работают монеты",
          "paragraphs": [
            "Наборы монет — разовые покупки App Store, а не подписка. Автопродления нет. Монеты не сгорают, не передаются и не являются денежным кошельком. Цена активации зависит от сервиса и страны и видна до подтверждения.",
            "При доступной отмене, замене номера, завершении окна без SMS или неудачной выдаче номера монеты за активацию возвращаются. После получения SMS автоматического возврата при отмене нет. О проблемах доставки или оплаты напишите в поддержку."
          ]
        },
        {
          "title": "Монеты не появились или списание незнакомо",
          "paragraphs": [
            "Проверьте, что вошли в тот же аккаунт SMS Code, в котором покупали монеты. Дождитесь завершения платежа Apple и откройте приложение снова. Не покупайте ещё один набор для исправления баланса.",
            "Сообщите поддержке номер заказа Apple или чек, набор, дату и доступный идентификатор аккаунта приложения. Скройте посторонние покупки и платёжные данные. При незнакомом списании проверьте историю покупок Apple и семейные покупки, затем обратитесь в Apple."
          ]
        },
        {
          "title": "Неиспользованные монеты и возврат денег",
          "paragraphs": [
            "Возврат монет в приложение не отменяет платёж Apple. Для возврата денег запросите возврат покупки у Apple и правдиво укажите, остались ли монеты неиспользованными, потрачены частично, не получены или связаны с неисправностью. Остаток монет не гарантирует возврат или частичное снятие денег.",
            "Apple оценивает запрос по региональным условиям и применимому закону. Мы не можем гарантировать одобрение или самостоятельно вернуть платёж через систему Apple. Для подтверждения покупки или баланса напишите нам. Обязательные права потребителя сохраняются.",
            "При одобренном возврате связанные с покупкой монеты могут быть списаны с баланса. Не тратьте монеты из покупки, возврат которой запрашиваете. Удаление аккаунта или приложения не подаёт запрос на возврат."
          ]
        },
        {
          "title": "Как запросить возврат у Apple",
          "paragraphs": [
            "1. Откройте reportaproblem.apple.com и войдите в Apple Account, которым оплачивали набор.",
            "2. В меню запроса выберите возврат средств и правдивую причину.",
            "3. Продолжите, выберите покупку монет SMS Code и отправьте запрос.",
            "4. Apple обычно сообщает обновление за 24–48 часов. Проверяйте статус на том же сайте. Это срок обновления статуса: запрос может оставаться на рассмотрении, а возврат денег занимает дополнительное время."
          ]
        },
        {
          "title": "Покупка не найдена или деньги ещё не вернулись",
          "paragraphs": [
            "Для ожидающего платежа дождитесь чека Apple; неоплаченный заказ сначала нужно оплатить. Проверьте Apple Account в чеке. Если покупка недоступна или запрос не подаётся, обратитесь в поддержку Apple.",
            "После одобрения Apple указывает до 48 часов для баланса Apple, до 30 дней для карт и большинства других способов оплаты, до 60 дней для оплаты через оператора. SIMNETIQ не может ускорить обработку Apple или банка."
          ]
        }
      ]
    }
  },
  {
    "slug": "account-balance",
    "en": {
      "title": "Keep your balance, recover access and delete your account",
      "sections": [
        {
          "title": "Sign in before reinstalling",
          "paragraphs": [
            "Coins belong to your SMS Code account. Sign in with Apple, Google or an email code while you still have access to the balance, then use the same login on another device. Your Apple purchase account and your SMS Code login are separate.",
            "Reinstalling while using an anonymous account can create a different account. App Store purchase restoration does not by itself recreate an anonymous coin balance. If you lost access, contact support with your Apple order ID and the account details you still have; recovery requires verification."
          ]
        },
        {
          "title": "Before deleting an account",
          "paragraphs": [
            "Account deletion and payment refunds are separate actions. Save the purchase details you need, resolve any pending activation and contact support about remaining coins before deleting. Request any Apple payment refund separately.",
            "Use the account-deletion option in the app’s settings. If you cannot access it, contact support. Deletion does not cancel an Apple payment, and records needed for legal obligations or dispute handling may be retained as described in our Privacy Policy."
          ]
        },
        {
          "title": "Contact us safely",
          "paragraphs": [
            "Use the support form or support@simnetiq.store. Send service, country, timing and activation or order identifiers, but never a password, verification code or full payment-card details. Review screenshots for sensitive information before sharing."
          ]
        }
      ]
    },
    "ru": {
      "title": "Сохранение баланса, восстановление доступа и удаление аккаунта",
      "sections": [
        {
          "title": "Войдите до переустановки",
          "paragraphs": [
            "Монеты привязаны к аккаунту SMS Code. Пока баланс доступен, войдите через Apple, Google или код на почту; на другом устройстве используйте тот же способ входа. Apple Account для оплаты и вход в SMS Code — разные аккаунты.",
            "Переустановка при анонимном использовании может создать другой аккаунт. Восстановление покупок App Store само по себе не восстанавливает анонимный баланс. При потере доступа сообщите поддержке номер заказа Apple и сохранившиеся данные аккаунта; потребуется проверка."
          ]
        },
        {
          "title": "Перед удалением аккаунта",
          "paragraphs": [
            "Удаление аккаунта и возврат денег — разные действия. Сохраните необходимые данные покупки, завершите ожидающую активацию и свяжитесь с поддержкой по поводу оставшихся монет до удаления. Возврат платежа Apple запрашивается отдельно.",
            "Используйте удаление аккаунта в настройках приложения. Если доступа нет, напишите в поддержку. Удаление не отменяет платёж Apple; записи, необходимые по закону или для разрешения споров, могут сохраняться согласно Политике конфиденциальности."
          ]
        },
        {
          "title": "Безопасное обращение",
          "paragraphs": [
            "Используйте форму или support@simnetiq.store. Укажите сервис, страну, время и ID активации или заказа. Не передавайте пароль, SMS-код или полные данные карты. Проверьте снимки экрана на наличие секретных данных."
          ]
        }
      ]
    }
  }
] as const;
