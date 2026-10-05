import nodemailer from "nodemailer";
import { renderReplyHtml, renderReplyText, type ReplyEmailInput } from "./replyTemplate";

/* ---------------------------------------------------------------------------
 * Sends a support reply from the business mailbox over SMTP (Hostinger).
 *
 * Server-only: imported by app/api/admin/support/reply/route.ts, never by a
 * client component — it reads the mailbox password from the environment.
 *
 *   SMTP_PASSWORD  required — the support@simnetiq.com mailbox password
 *   SMTP_USER      default support@simnetiq.com (also the From address)
 *   SMTP_HOST      default smtp.hostinger.com
 *   SMTP_PORT      default 465 (implicit TLS); 587 uses STARTTLS
 *
 * Every reply is BCC'd to the mailbox itself, so the conversation is in the
 * support inbox too and a customer's answer threads under it.
 * ------------------------------------------------------------------------ */

const FROM_NAME = "SMS Code Support";

export type SendResult = { ok: true; messageId: string } | { ok: false; error: string };

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_PASSWORD);
}

export async function sendReplyEmail(
  input: ReplyEmailInput & { to: string; subject: string },
): Promise<SendResult> {
  const pass = process.env.SMTP_PASSWORD;
  if (!pass) return { ok: false, error: "SMTP is not configured (SMTP_PASSWORD)" };
  const user = process.env.SMTP_USER || "support@simnetiq.com";
  const port = Number(process.env.SMTP_PORT || 465);

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    const info = await transport.sendMail({
      from: { name: FROM_NAME, address: user },
      to: input.to,
      bcc: user,
      replyTo: user,
      subject: input.subject,
      text: renderReplyText(input),
      html: renderReplyHtml(input),
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    transport.close();
  }
}
