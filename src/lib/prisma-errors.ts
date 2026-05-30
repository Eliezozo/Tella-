import { Prisma } from "@prisma/client";

/** Erreurs réseau / base injoignable (Neon en pause, mauvaise URL, firewall…). */
export function isPrismaConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1001: Can't reach database server
    // P1002: Database server timed out
    // P1017: Server has closed the connection
    return ["P1001", "P1002", "P1017"].includes(error.code);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("can't reach database server") ||
      message.includes("connection") ||
      message.includes("timed out") ||
      message.includes("econnrefused") ||
      message.includes("enotfound")
    );
  }

  return false;
}

export function shouldFallbackToMockOnDbError(): boolean {
  if (process.env.USE_PRISMA === "true") return false;
  if (process.env.PRISMA_FALLBACK_MOCK === "true") return true;
  return process.env.NODE_ENV === "development";
}

/** Message utilisateur pour les erreurs Prisma (inscription, connexion…). */
export function toUserFacingDatabaseMessage(error: unknown): string {
  if (isPrismaConnectionError(error)) {
    return "La base de données est momentanément indisponible. Attendez quelques secondes et réessayez.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Cette adresse email ou ce numéro est déjà utilisé.";
    }
  }

  return "Une erreur est survenue. Réessayez dans un instant.";
}
