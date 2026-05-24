import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/** Session couturière avec profil atelier lié — pour l'espace /dashboard. */
export async function requireTailorSession() {
  const session = await requireSession();
  const { user } = session;

  if (user.role !== "TAILOR" || !user.tailorProfileId) {
    redirect("/dashboard");
  }

  return session;
}
