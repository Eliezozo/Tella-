"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isNextNavigationError } from "@/lib/next-errors";
import type { CreationFormState } from "@/lib/creation-form-state";
import { parseCreationFormData } from "@/lib/parse-creation-form";
import { saveCreationImageFile } from "@/lib/save-creation-image";
import { toUserFacingDatabaseMessage } from "@/lib/prisma-errors";
import {
  CreationServiceError,
  createCreationForTailor,
} from "@/services/creation-service";

function flattenFieldErrors(
  errors?: Record<string, string[] | undefined>,
): Record<string, string[]> | undefined {
  if (!errors) return undefined;
  const entries = Object.entries(errors).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].length > 0,
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

async function requireTailorProfileId(): Promise<string> {
  const session = await auth();
  const profileId = session?.user?.tailorProfileId;

  if (session?.user?.role !== "TAILOR" || !profileId) {
    throw new Error("Accès réservé aux ateliers connectés.");
  }

  return profileId;
}

export async function createCreationAction(
  _prevState: CreationFormState,
  formData: FormData,
): Promise<CreationFormState> {
  try {
    const tailorProfileId = await requireTailorProfileId();
    const parsed = parseCreationFormData(formData);

    let mediaUrl = parsed.imageUrl?.trim() ?? "";
    const imageFile = formData.get("imageFile");

    if (imageFile instanceof File && imageFile.size > 0) {
      mediaUrl = await saveCreationImageFile(imageFile);
    }

    const creation = await createCreationForTailor(tailorProfileId, parsed, mediaUrl);

    revalidatePath("/dashboard/creations");
    revalidatePath("/explore");
    revalidatePath(`/boutique/${creation.slug}`);

    redirect("/dashboard/creations?created=1");
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    if (error instanceof CreationServiceError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: flattenFieldErrors(error.fieldErrors),
      };
    }
    if (error instanceof Error && error.message.includes("Format accepté")) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: { imageUrl: [error.message] },
      };
    }
    return {
      ok: false,
      message: toUserFacingDatabaseMessage(error),
    };
  }
}
