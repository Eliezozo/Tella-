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
