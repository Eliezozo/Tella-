import { sendUserEmail } from "@/lib/notifications/email-client";

type TailorApprovedPayload = {
  email: string;
  atelierName: string;
  handle: string;
  isPublished: boolean;
};

export async function notifyTailorAccountApproved(payload: TailorApprovedPayload) {
  const loginUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const profilePath = payload.handle.startsWith("@") ? payload.handle : `@${payload.handle}`;

  const subject = payload.isPublished
    ? "Votre atelier Tella est en ligne"
    : "Votre compte Tella est approuvé";

  const text = payload.isPublished
    ? [
        `Bonjour ${payload.atelierName},`,
        "",
        "Bonne nouvelle : votre compte et votre vitrine sont maintenant actifs sur Tella.",
        "",
        `Connectez-vous : ${loginUrl}/login`,
        `Vitrine publique : ${loginUrl}/${profilePath}`,
      ].join("\n")
    : [
        `Bonjour ${payload.atelierName},`,
        "",
        "Votre compte Tella a été approuvé. Vous pouvez vous connecter et compléter votre vitrine.",
        "",
        `Connectez-vous : ${loginUrl}/login`,
      ].join("\n");

  const html = text.replace(/\n/g, "<br />");

  return sendUserEmail(payload.email, { subject, html, text });
}
