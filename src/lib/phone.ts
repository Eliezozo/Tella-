/**
 * Normalise un numéro pour comparaison/persistance.
 * - garde uniquement chiffres et `+` initial
 * - retire espaces, tirets, points, parenthèses
 *
 * Exemple : `+228 92 87 80 37` → `+22892878037`
 */
export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^0-9]/g, "");
  return hasPlus ? `+${digits}` : digits;
}
