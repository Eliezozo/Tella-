export type DataSourceMode = "mock" | "prisma";

/**
 * Utilise Prisma uniquement si DATABASE_URL est défini et USE_PRISMA=true.
 * Sinon : couche mock (développement sans base).
 */
export function getDataSourceMode(): DataSourceMode {
  if (process.env.DATABASE_URL && process.env.USE_PRISMA === "true") {
    return "prisma";
  }
  return "mock";
}
