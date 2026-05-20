import type { CategoryKey } from "@/types";

export const categoryLabels: Record<CategoryKey, string> = {
  robes: "Robes",
  homme: "Homme",
  mariage: "Mariage",
  enfant: "Enfant",
  uniformes: "Uniformes",
  traditionnel: "Traditionnel",
};

export const categoryKeys = Object.keys(categoryLabels) as CategoryKey[];
