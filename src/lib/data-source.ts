export type DataSourceMode = "mock" | "prisma";

/**
 * Utilise Prisma si DATABASE_URL est défini et :
 * - USE_PRISMA=true, ou
 * - NODE_ENV=production (évite les inscriptions perdues en mock sur Vercel).
 * Sinon : couche mock (développement sans base).
 */
export function getDataSourceMode(): DataSourceMode {
  if (!process.env.DATABASE_URL) {
    return "mock";
  }

  if (process.env.USE_PRISMA === "true") {
    return "prisma";
  }

  if (process.env.NODE_ENV === "production") {
    return "prisma";
  }

  return "mock";
}
