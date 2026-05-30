/**
 * Configuration des notifications (Nodemailer SMTP + WhatsApp).
 *
 * Les notifications sont fail-safe : si une variable manque, l'envoi est
 * simplement ignoré (warning serveur), l'inscription continue normalement.
 */
export type NotificationsConfig = {
  email: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
    to: string;
  };
  whatsapp: {
    enabled: boolean;
    apiKey: string;
    phone: string;
  };
};

const DEFAULT_FROM_EMAIL = "Tella <noreply@tella.tg>";

export function getNotificationsConfig(): NotificationsConfig {
  const smtpHost = process.env.SMTP_HOST ?? "";
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER ?? "";
  const smtpPass = process.env.SMTP_PASS ?? "";
  const fromEmail = process.env.SMTP_FROM ?? DEFAULT_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL ?? "";

  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY ?? "";
  const adminWhatsapp = process.env.ADMIN_WHATSAPP_PHONE ?? "";

  const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass && adminEmail);

  return {
    email: {
      enabled: smtpConfigured,
      host: smtpHost,
      port: Number.isFinite(smtpPort) ? smtpPort : 587,
      secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
      user: smtpUser,
      pass: smtpPass,
      from: fromEmail,
      to: adminEmail,
    },
    whatsapp: {
      enabled: Boolean(callMeBotApiKey && adminWhatsapp),
      apiKey: callMeBotApiKey,
      phone: adminWhatsapp,
    },
  };
}
