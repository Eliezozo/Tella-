import { getDataSourceMode } from "@/lib/data-source";
import {
  isPrismaConnectionError,
  shouldFallbackToMockOnDbError,
} from "@/lib/prisma-errors";

/**
 * Exécute une requête Prisma ; en dev (ou PRISMA_FALLBACK_MOCK=true),
 * retombe sur le mock si la base est injoignable (Neon en pause, etc.).
 */
export async function withPrismaFallback<T>(
  prismaCall: () => Promise<T>,
  mockCall: () => Promise<T>,
): Promise<T> {
  if (getDataSourceMode() !== "prisma") {
    return mockCall();
  }

  try {
    return await prismaCall();
  } catch (error) {
    // Neon (tier gratuit) : la base peut être en pause — une 2e tentative après 2s suffit souvent.
    if (isPrismaConnectionError(error)) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        return await prismaCall();
      } catch (retryError) {
        if (
          isPrismaConnectionError(retryError) &&
          shouldFallbackToMockOnDbError()
        ) {
          console.warn(
            "[withPrismaFallback] Base toujours injoignable après retry — mock.",
            retryError instanceof Error ? retryError.message : retryError,
          );
          return mockCall();
        }
        throw retryError;
      }
    }

    throw error;
  }
}
