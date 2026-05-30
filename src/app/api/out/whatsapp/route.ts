import { NextResponse } from "next/server";

import { buildWhatsappLink } from "@/hooks/build-whatsapp-link";
import { incrementTailorWhatsappClick } from "@/services/tailor-stats-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tailorId = searchParams.get("tailorId");
  const phone = searchParams.get("phone");
  const message = searchParams.get("message") ?? "";

  if (!tailorId || !phone) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  try {
    await incrementTailorWhatsappClick(tailorId);
  } catch (error) {
    console.warn("[api/out/whatsapp] compteur non mis à jour:", error);
  }

  const target = buildWhatsappLink(phone, message);
  return NextResponse.redirect(target);
}
