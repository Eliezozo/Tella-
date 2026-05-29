import { z } from "zod";

import { categoryKeys } from "@/lib/constants/categories";
import type { CategoryKey } from "@/types";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const createCreationSchema = z
  .object({
    title: z
      .string()
      .min(3, "Le titre doit contenir au moins 3 caractères.")
      .max(120),
    description: z
      .string()
      .min(10, "Décrivez la pièce en au moins 10 caractères.")
      .max(1000),
    category: z
      .string()
      .refine((value): value is CategoryKey => categoryKeys.includes(value as CategoryKey), {
        message: "Choisissez une catégorie.",
      }),
    priceFrom: z
      .number({ invalid_type_error: "Indiquez un prix valide en FCFA." })
      .int()
      .positive("Indiquez un prix valide en FCFA.")
      .optional(),
    turnaroundLabel: z
      .string()
      .min(2, "Indiquez un délai (ex. 7 jours).")
      .max(40),
    imageUrl: z.string().max(500).optional(),
    sizes: z.array(z.enum(sizeOptions)).min(1, "Choisissez au moins une taille."),
    detailsText: z.string().max(800).optional(),
  });

export type CreateCreationInput = z.infer<typeof createCreationSchema>;

export const creationSizeOptions = sizeOptions;
