import { getDataSourceMode } from "@/lib/data-source";
import { withPrismaRetry } from "@/lib/prisma-retry";
import { getTailorRepository } from "@/repositories/index";
import type { TailorProfile } from "@/types";

export class TailorProfileServiceError extends Error {
  constructor(
    message: string,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "TailorProfileServiceError";
  }
}

export async function updateTailorProfileImages(
  tailorProfileId: string,
  data: { avatarUrl?: string; bannerUrl?: string },
): Promise<TailorProfile> {
  if (!data.avatarUrl && !data.bannerUrl) {
    throw new TailorProfileServiceError("Ajoutez au moins une photo à enregistrer.", {
      avatarFile: ["Photo de profil ou bannière requise."],
    });
  }

  const repo = getTailorRepository();
  const usePrisma = getDataSourceMode() === "prisma";

  const runDb = <T>(operation: () => Promise<T>) =>
    usePrisma ? withPrismaRetry(operation) : operation();

  return runDb(() => repo.updateProfileImages(tailorProfileId, data));
}
