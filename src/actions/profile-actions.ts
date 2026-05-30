"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isNextNavigationError } from "@/lib/next-errors";
import type { ProfileFormState } from "@/lib/profile-form-state";
import { toUserFacingDatabaseMessage } from "@/lib/prisma-errors";
import { saveProfileImageFile } from "@/lib/save-profile-image";
import { toTailorProfilePath } from "@/lib/handle";
import {
  TailorProfileServiceError,
  updateTailorProfileImages,
} from "@/services/tailor-profile-service";

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

async function requireTailorProfileId(): Promise<{
  profileId: string;
  handle: string | null;
}> {
  const session = await auth();
  const profileId = session?.user?.tailorProfileId;
  const handle = session?.user?.handle ?? null;

  if (session?.user?.role !== "TAILOR" || !profileId) {
    throw new Error("Accès réservé aux ateliers connectés.");
  }

  return { profileId, handle };
}

export async function updateProfileImagesAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  try {
    const { profileId, handle } = await requireTailorProfileId();

    const avatarFile = formData.get("avatarFile");
    const bannerFile = formData.get("bannerFile");

    const payload: { avatarUrl?: string; bannerUrl?: string } = {};

    if (avatarFile instanceof File && avatarFile.size > 0) {
      payload.avatarUrl = await saveProfileImageFile(avatarFile, "avatar");
    }

    if (bannerFile instanceof File && bannerFile.size > 0) {
      payload.bannerUrl = await saveProfileImageFile(bannerFile, "banner");
    }

    await updateTailorProfileImages(profileId, payload);

    revalidatePath("/dashboard/parametres");
    if (handle) {
      revalidatePath(toTailorProfilePath(handle));
    }

    return {
      ok: true,
      message: "Vos images de profil ont été mises à jour.",
    };
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    if (error instanceof TailorProfileServiceError) {
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
        fieldErrors: { avatarFile: [error.message] },
      };
    }
    return {
      ok: false,
      message: toUserFacingDatabaseMessage(error),
    };
  }
}
