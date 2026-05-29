import { isPrismaConnectionError } from "@/lib/prisma-errors";

const RETRY_DELAY_MS = 2000;

/**
 * Réessaie une fois après pause (Neon free tier en veille).
 * Pas de fallback mock — réservé aux lectures publiques.
 */
export async function withPrismaRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isPrismaConnectionError(error)) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    return await operation();
  }
}
