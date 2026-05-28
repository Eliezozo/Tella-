import { getNotificationsConfig } from "@/lib/notifications/config";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";

export type WhatsappSendResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Envoie un message WhatsApp via CallMeBot (gratuit pour alertes admin).
 *
 * Pré-requis (côté admin, une seule fois) :
 *  1. Ajouter le contact "+34 644 91 95 11" sur WhatsApp
 *  2. Envoyer "I allow callmebot to send me messages" depuis ton WhatsApp
 *  3. Tu reçois en retour une API key à mettre dans CALLMEBOT_API_KEY
 *
 * Le numéro doit être au format international SANS le `+` ni espaces (ex: 22892878037).
 */
export async function sendAdminWhatsapp(text: string): Promise<WhatsappSendResult> {
  const { whatsapp } = getNotificationsConfig();

  if (!whatsapp.enabled) {
    console.warn(
      "[notifications/whatsapp] désactivé (CALLMEBOT_API_KEY ou ADMIN_WHATSAPP_PHONE manquant)",
    );
    return { ok: false, error: "WHATSAPP_DISABLED" };
  }

  const phone = whatsapp.phone.replace(/[^0-9]/g, "");

  if (!phone) {
    return { ok: false, error: "INVALID_PHONE" };
  }

  const url = new URL(CALLMEBOT_API_URL);
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", whatsapp.apiKey);

  try {
    const response = await fetch(url.toString(), { method: "GET" });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        "[notifications/whatsapp] échec envoi CallMeBot",
        response.status,
        body,
      );
      return { ok: false, error: `CALLMEBOT_HTTP_${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    console.error("[notifications/whatsapp] exception", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    };
  }
}
