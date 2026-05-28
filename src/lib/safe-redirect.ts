/**
 * Empêche les open redirects via callbackUrl :
 * n'accepte qu'un chemin interne (`/...`) qui ne ressemble pas à une URL externe.
 */
export function sanitizeCallbackUrl(
  value: unknown,
  fallback: string = "/dashboard",
): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();

  if (trimmed.length === 0) return fallback;
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.startsWith("/\\")) return fallback;
  if (/[\r\n]/.test(trimmed)) return fallback;
  if (/^\/[a-z]+:/i.test(trimmed)) return fallback;

  return trimmed;
}
