import { sendAdminEmail } from "@/lib/notifications/email-client";
import { sendAdminWhatsapp } from "@/lib/notifications/whatsapp-client";

export type NewAtelierNotification = {
  atelierName: string;
  handle: string;
  city: string;
  email: string;
  whatsapp: string;
  specialties: string[];
  description: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailMessage(payload: NewAtelierNotification) {
  const safeName = escapeHtml(payload.atelierName);
  const safeHandle = escapeHtml(payload.handle);
  const safeCity = escapeHtml(payload.city);
  const safeEmail = escapeHtml(payload.email);
  const safeWa = escapeHtml(payload.whatsapp);
  const safeSpec = payload.specialties.map(escapeHtml).join(", ");
  const safeDesc = escapeHtml(payload.description).slice(0, 600);

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1f2937; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #C4522A;">Nouvelle inscription atelier sur Tella</h2>
      <p>Une nouvelle couturière vient de s'inscrire et attend votre validation.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; color: #6b7280;">Atelier</td><td style="padding: 6px 0; font-weight: 600;">${safeName}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Handle</td><td style="padding: 6px 0;">${safeHandle}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Ville</td><td style="padding: 6px 0;">${safeCity}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;">${safeEmail}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">WhatsApp</td><td style="padding: 6px 0;">${safeWa}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Spécialités</td><td style="padding: 6px 0;">${safeSpec}</td></tr>
      </table>
      <p style="white-space: pre-wrap; padding: 12px; background: #f3f4f6; border-radius: 6px;">${safeDesc}</p>
      <p style="margin-top: 24px;">
        <a href="https://tella.tg/dashboard/demandes" style="background: #C4522A; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Voir les demandes
        </a>
      </p>
    </div>
  `;

  const text = [
    `Nouvelle inscription atelier sur Tella`,
    ``,
    `Atelier : ${payload.atelierName}`,
    `Handle  : ${payload.handle}`,
    `Ville   : ${payload.city}`,
    `Email   : ${payload.email}`,
    `WhatsApp: ${payload.whatsapp}`,
    `Spécialités: ${payload.specialties.join(", ")}`,
    ``,
    `Description :`,
    payload.description.slice(0, 600),
    ``,
    `Valider ici : https://tella.tg/dashboard/demandes`,
  ].join("\n");

  return {
    subject: `[Tella] Nouvelle inscription : ${payload.atelierName}`,
    html,
    text,
  };
}

function buildWhatsappMessage(payload: NewAtelierNotification): string {
  return [
    `🪡 *Nouvelle inscription Tella*`,
    ``,
    `*Atelier* : ${payload.atelierName}`,
    `*Handle*  : ${payload.handle}`,
    `*Ville*   : ${payload.city}`,
    `*Email*   : ${payload.email}`,
    `*WhatsApp*: ${payload.whatsapp}`,
    `*Spécialités* : ${payload.specialties.join(", ")}`,
    ``,
    `Valider : https://tella.tg/dashboard/demandes`,
  ].join("\n");
}

/**
 * Notifie l'admin Tella d'une nouvelle inscription atelier.
 * - Envois en parallèle (email + WhatsApp).
 * - Aucune erreur ne remonte : on log seulement, pour ne jamais bloquer l'inscription.
 */
export async function notifyAdminNewAtelier(
  payload: NewAtelierNotification,
): Promise<void> {
  const email = buildEmailMessage(payload);
  const waText = buildWhatsappMessage(payload);

  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendAdminEmail(email),
    sendAdminWhatsapp(waText),
  ]);

  if (emailResult.status === "fulfilled" && !emailResult.value.ok) {
    console.warn("[notifyAdminNewAtelier] email non envoyé:", emailResult.value.error);
  } else if (emailResult.status === "rejected") {
    console.warn("[notifyAdminNewAtelier] email rejected:", emailResult.reason);
  }

  if (whatsappResult.status === "fulfilled" && !whatsappResult.value.ok) {
    console.warn(
      "[notifyAdminNewAtelier] whatsapp non envoyé:",
      whatsappResult.value.error,
    );
  } else if (whatsappResult.status === "rejected") {
    console.warn("[notifyAdminNewAtelier] whatsapp rejected:", whatsappResult.reason);
  }
}
