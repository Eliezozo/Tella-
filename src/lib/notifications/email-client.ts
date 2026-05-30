import nodemailer from "nodemailer";

import { getNotificationsConfig } from "@/lib/notifications/config";

type MailTransporter = ReturnType<typeof nodemailer.createTransport>;

let transporter: MailTransporter | null = null;

function getTransporter(): MailTransporter | null {
  const { email } = getNotificationsConfig();
  if (!email.enabled) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: email.host,
      port: email.port,
      secure: email.secure,
      auth: {
        user: email.user,
        pass: email.pass,
      },
    });
  }

  return transporter;
}

export type EmailMessage = {
  subject: string;
  html: string;
  text: string;
  to?: string;
};

export type EmailSendResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Envoie un email via Nodemailer (SMTP).
 * Retourne un résultat structuré ; ne throw jamais (fail-safe).
 */
export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const { email } = getNotificationsConfig();
  const transport = getTransporter();

  if (!email.enabled || !transport) {
    console.warn(
      "[notifications/email] désactivé (SMTP_HOST, SMTP_USER, SMTP_PASS ou ADMIN_EMAIL manquant)",
    );
    return { ok: false, error: "EMAIL_DISABLED" };
  }

  try {
    const result = await transport.sendMail({
      from: email.from,
      to: message.to ?? email.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });

    return { ok: true, id: result.messageId ?? "sent" };
  } catch (error) {
    console.error("[notifications/email] exception Nodemailer", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    };
  }
}

/** Notification admin (alias historique Resend). */
export async function sendAdminEmail(message: EmailMessage): Promise<EmailSendResult> {
  return sendEmail(message);
}

/** Email transactionnel vers une couturière ou une cliente. */
export async function sendUserEmail(
  to: string,
  message: Omit<EmailMessage, "to">,
): Promise<EmailSendResult> {
  return sendEmail({ ...message, to });
}
