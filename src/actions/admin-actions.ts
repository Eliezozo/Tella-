"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  approveTailorProfile,
  publishTailorProfile,
} from "@/services/admin-service";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Accès réservé à l'administration Tella.");
  }
  return session;
}

export async function approveTailorAction(tailorProfileId: string) {
  await requireAdmin();
  await approveTailorProfile(tailorProfileId);
  revalidatePath("/dashboard/demandes");
  revalidatePath("/explore");
}

export async function publishTailorAction(tailorProfileId: string) {
  await requireAdmin();
  await publishTailorProfile(tailorProfileId);
  revalidatePath("/dashboard/demandes");
  revalidatePath("/explore");
}
