/** Villes principales au Togo pour l'inscription atelier. */
export const togoCities = [
  "Lomé",
  "Kara",
  "Tsévié",
  "Sokodé",
  "Kpalimé",
  "Atakpamé",
  "Dapaong",
  "Aného",
  "Mango",
] as const;

export type TogoCity = (typeof togoCities)[number];
