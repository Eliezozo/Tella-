import { getNotificationsConfig } from "@/lib/notifications/config";

const RESEND_API_URL = "https://api.resend.com/emails";

export type EmailMessage = {
  subject: string;
  html: string;
  text: string;
};

export type EmailSendResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Envoie un email via Resend.
 * Retourne un résultat structuré ; ne throw jamais (fail-safe).
 */
export async function sendAdminEmail(message: EmailMessage): Promise<EmailSendResult> {
  const { email } = getNotificationsConfig();

  if (!email.enabled) {
    console.warn(
      "[notifications/email] désactivé (RESEND_API_KEY ou ADMIN_EMAIL manquant)",
    );
    return { ok: false, error: "EMAIL_DISABLED" };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${email.apiKey}`,
      },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        "[notifications/email] échec envoi Resend",
        response.status,
        errorBody,
      );
      return { ok: false, error: `RESEND_HTTP_${response.status}` };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id ?? "unknown" };
  } catch (error) {
    console.error("[notifications/email] exception", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    };
  }
}
