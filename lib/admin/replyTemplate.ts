/* ---------------------------------------------------------------------------
 * The email a customer receives when an operator answers their ticket.
 *
 * Pure string building, no Node or browser APIs, so the reply route renders
 * it for sending and the admin panel renders the very same thing for its
 * "Preview email" view.
 *
 * Everything the operator or the customer typed is HTML-escaped. Layout is
 * table-based with inline styles because that is what mail clients (Gmail,
 * Outlook, Apple Mail) render consistently; there is a plain-text part too.
 * ------------------------------------------------------------------------ */

const SITE = "https://simnetiq.xyz";
const LOGO = `${SITE}/brand/logo.png`;

type Strings = {
  hello: string;
  /** Punctuation between greeting and name, and after it. */
  comma: string;
  end: string;
  team: string;
  yourMessage: string;
  replyHint: string;
  help: string;
};

/* Written per language, not machine-translated. Keys are the site locales
   (content/locales); anything else falls back to English. */
const STRINGS: Record<string, Strings> = {
  en: {
    hello: "Hello",
    comma: ", ",
    end: ",",
    team: "SMS Code Support",
    yourMessage: "Your message",
    replyHint: "If you need anything else, just reply to this email.",
    help: "Help center",
  },
  ru: {
    hello: "Здравствуйте",
    comma: ", ",
    end: "!",
    team: "Поддержка SMS Code",
    yourMessage: "Ваше сообщение",
    replyHint: "Если понадобится что-то ещё, просто ответьте на это письмо.",
    help: "Центр помощи",
  },
  es: {
    hello: "Hola",
    comma: ", ",
    end: ":",
    team: "Soporte de SMS Code",
    yourMessage: "Tu mensaje",
    replyHint: "Si necesitas algo más, simplemente responde a este correo.",
    help: "Centro de ayuda",
  },
  pt: {
    hello: "Olá",
    comma: ", ",
    end: ",",
    team: "Suporte SMS Code",
    yourMessage: "Sua mensagem",
    replyHint: "Se precisar de mais alguma coisa, é só responder a este e-mail.",
    help: "Central de ajuda",
  },
  fr: {
    hello: "Bonjour",
    comma: " ",
    end: ",",
    team: "Assistance SMS Code",
    yourMessage: "Votre message",
    replyHint: "Si vous avez besoin d’autre chose, répondez simplement à cet e-mail.",
    help: "Centre d’aide",
  },
  tr: {
    hello: "Merhaba",
    comma: " ",
    end: ",",
    team: "SMS Code Destek",
    yourMessage: "Mesajınız",
    replyHint: "Başka bir konuda yardıma ihtiyacınız olursa bu e-postayı yanıtlamanız yeterli.",
    help: "Yardım merkezi",
  },
  id: {
    hello: "Halo",
    comma: " ",
    end: ",",
    team: "Tim Dukungan SMS Code",
    yourMessage: "Pesan Anda",
    replyHint: "Jika Anda membutuhkan bantuan lain, cukup balas email ini.",
    help: "Pusat bantuan",
  },
  hi: {
    hello: "नमस्ते",
    comma: " ",
    end: ",",
    team: "SMS Code सहायता टीम",
    yourMessage: "आपका संदेश",
    replyHint: "अगर आपको किसी और मदद की ज़रूरत हो, तो बस इस ईमेल का जवाब दें।",
    help: "सहायता केंद्र",
  },
  zh: {
    hello: "您好",
    comma: "，",
    end: "：",
    team: "SMS Code 客服团队",
    yourMessage: "您的留言",
    replyHint: "如需其他帮助，直接回复此邮件即可。",
    help: "帮助中心",
  },
  ar: {
    hello: "مرحبًا",
    comma: " ",
    end: "،",
    team: "فريق دعم SMS Code",
    yourMessage: "رسالتك",
    replyHint: "إذا احتجت إلى أي مساعدة أخرى، ما عليك سوى الرد على هذه الرسالة.",
    help: "مركز المساعدة",
  },
};

export type ReplyEmailInput = {
  name: string | null | undefined;
  locale: string | null | undefined;
  /** The operator's answer, plain text. */
  body: string;
  /** What the customer wrote, quoted under the answer. */
  originalMessage: string | null | undefined;
};

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Escaped, with line breaks kept. */
function paragraphs(s: string): string {
  return esc(s.trim()).replace(/\r?\n/g, "<br>");
}

function strings(locale: string | null | undefined): { t: Strings; lang: string; rtl: boolean } {
  const lang = locale && STRINGS[locale] ? locale : "en";
  return { t: STRINGS[lang], lang, rtl: lang === "ar" };
}

function greeting(t: Strings, name: string | null | undefined): string {
  const n = name?.trim();
  return n ? `${t.hello}${t.comma}${n}${t.end}` : `${t.hello}${t.end}`;
}

export function renderReplyText(input: ReplyEmailInput): string {
  const { t } = strings(input.locale);
  const quoted = (input.originalMessage ?? "").trim();
  return [
    greeting(t, input.name),
    "",
    input.body.trim(),
    "",
    t.replyHint,
    "",
    "—",
    t.team,
    `${SITE}/support`,
    ...(quoted ? ["", `${t.yourMessage}:`, ...quoted.split(/\r?\n/).map((l) => `> ${l}`)] : []),
  ].join("\n");
}

export function renderReplyHtml(input: ReplyEmailInput): string {
  const { t, lang, rtl } = strings(input.locale);
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";
  const quoted = (input.originalMessage ?? "").trim();
  const preheader = esc(input.body.trim().replace(/\s+/g, " ").slice(0, 110));
  const font =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Noto Sans Arabic','Noto Sans Devanagari','PingFang SC',sans-serif";

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(t.team)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f7;">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
    <tr><td dir="${dir}" style="padding:0 6px 16px;text-align:${align};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;"><img src="${LOGO}" width="32" height="32" alt="" style="display:block;border:0;border-radius:8px;"></td>
        <td style="vertical-align:middle;padding:0 10px;font-family:${font};font-size:17px;font-weight:700;color:#1c1f25;letter-spacing:-0.02em;">SMS Code</td>
      </tr></table>
    </td></tr>
    <tr><td dir="${dir}" style="background:#ffffff;border:1px solid #dce0e7;border-radius:16px;padding:28px 26px;text-align:${align};font-family:${font};color:#1c1f25;">
      <p style="margin:0 0 16px;font-size:16px;line-height:1.5;font-weight:600;">${esc(greeting(t, input.name))}</p>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">${paragraphs(input.body)}</p>
      <p style="margin:0 0 22px;font-size:14px;line-height:1.55;color:#5f6775;">${esc(t.replyHint)}</p>
      <p style="margin:0;font-size:14px;line-height:1.5;">
        <span style="font-weight:600;">${esc(t.team)}</span><br>
        <a href="${SITE}/support" style="color:#1e5aa8;text-decoration:none;">simnetiq.xyz/support</a>
      </p>
      ${
        quoted
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
        <tr><td style="background:#f3f4f7;border-radius:10px;padding:14px 16px;font-family:${font};text-align:${align};">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#5f6775;">${esc(t.yourMessage)}</p>
          <p style="margin:0;font-size:13px;line-height:1.55;color:#5f6775;">${paragraphs(quoted)}</p>
        </td></tr>
      </table>`
          : ""
      }
    </td></tr>
    <tr><td dir="${dir}" style="padding:16px 6px 0;text-align:center;font-family:${font};font-size:12px;line-height:1.5;color:#8a919e;">
      <a href="${SITE}" style="color:#8a919e;text-decoration:none;">simnetiq.xyz</a> · <a href="${SITE}/support" style="color:#8a919e;text-decoration:none;">${esc(t.help)}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
