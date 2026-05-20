import { z } from "zod";

import { togoCities } from "@/lib/constants/cities";

export const registerTailorSchema = z
  .object({
    atelierName: z
      .string()
      .min(2, "Le nom de l'atelier doit contenir au moins 2 caractères.")
      .max(80),
    city: z.string().min(2, "Sélectionnez votre ville."),
    whatsapp: z
      .string()
      .min(8, "Numéro WhatsApp invalide.")
      .max(20)
      .regex(/^\+?[0-9\s-]+$/, "Format de numéro invalide."),
    email: z.string().email("Adresse email invalide."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(72),
    passwordConfirm: z.string().min(1, "Confirmez votre mot de passe."),
    heroLabel: z.string().max(120).optional(),
    specialties: z
      .array(z.string().min(1))
      .min(1, "Choisissez au moins une spécialité."),
    description: z
      .string()
      .min(20, "Décrivez votre atelier en au moins 20 caractères.")
      .max(500),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "Vous devez accepter les conditions pour créer votre atelier.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirm"],
  })
  .refine((data) => togoCities.includes(data.city as (typeof togoCities)[number]), {
    message: "Ville non reconnue.",
    path: ["city"],
  });

export const loginSchema = z.object({
  identifier: z.string().min(3, "Saisissez votre email ou téléphone."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export type RegisterTailorInput = z.infer<typeof registerTailorSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
