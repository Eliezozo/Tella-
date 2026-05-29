export function slugifyText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function ensureUniqueSlug(baseSlug: string, existing: string[]): string {
  if (!existing.includes(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  while (existing.includes(`${baseSlug}-${index}`)) {
    index += 1;
  }
  return `${baseSlug}-${index}`;
}
