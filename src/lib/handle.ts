const HANDLE_PATTERN = /^@[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyHandle(atelierName: string): string {
  const base = atelierName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `@${base || "atelier"}`;
}

/** Normalise la saisie utilisateur en identifiant public (@atelier-ama). */
export function parseHandleInput(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  const withoutAt = trimmed.replace(/^@+/, "");
  const slug = withoutAt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `@${slug || "atelier"}`;
}

export function isValidHandle(handle: string): boolean {
  return HANDLE_PATTERN.test(handle);
}

export function ensureUniqueHandle(baseHandle: string, existing: string[]): string {
  if (!existing.includes(baseHandle)) {
    return baseHandle;
  }

  const stem = baseHandle.replace(/^@/, "");
  let index = 2;
  while (existing.includes(`@${stem}-${index}`)) {
    index += 1;
  }
  return `@${stem}-${index}`;
}

/** Normalise un handle (@atelier-ama) pour comparaison et routes. */
export function normalizeHandle(handle: string): string {
  return handle.startsWith("@") ? handle : `@${handle}`;
}

/** Chemin public du profil atelier (ex. /@atelier-ama). */
export function toTailorProfilePath(handle: string): string {
  return `/${normalizeHandle(handle)}`;
}
