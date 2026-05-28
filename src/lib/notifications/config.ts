/**
 * Configuration des notifications admin (email + WhatsApp).
 *
 * Les notifications sont fail-safe : si une variable manque, l'envoi est
 * simplement ignoré (warning serveur), l'inscription continue normalement.
 */
export type NotificationsConfig = {
  email: {
    enabled: boolean;
    apiKey: string;
    from: string;
    to: string;
  };
  whatsapp: {
    enabled: boolean;
    apiKey: string;
    phone: string;
  };
};

const DEFAULT_FROM_EMAIL = "Tella <onboarding@resend.dev>";

export function getNotificationsConfig(): NotificationsConfig {
  const resendApiKey = process.env.RESEND_API_KEY ?? "";
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM_EMAIL;

  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY ?? "";
  const adminWhatsapp = process.env.ADMIN_WHATSAPP_PHONE ?? "";

  return {
    email: {
      enabled: Boolean(resendApiKey && adminEmail),
      apiKey: resendApiKey,
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
