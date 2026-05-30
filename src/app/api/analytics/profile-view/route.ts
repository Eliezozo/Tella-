import { NextResponse } from "next/server";

import { incrementTailorProfileView } from "@/services/tailor-stats-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { tailorProfileId?: string };
    const tailorProfileId = body.tailorProfileId?.trim();

    if (!tailorProfileId) {
      return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
    }

    await incrementTailorProfileView(tailorProfileId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn("[api/analytics/profile-view] erreur:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
