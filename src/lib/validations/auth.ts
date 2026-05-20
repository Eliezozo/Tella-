import { z } from "zod";

export const registerTailorSchema = z.object({
  atelierName: z
    .string()
    .min(2, "Le nom de l'atelier doit contenir au moins 2 caractères.")
    .max(80),
  city: z.string().min(2, "Indiquez votre ville.").max(60),
  whatsapp: z
    .string()
    .min(8, "Numéro WhatsApp invalide.")
    .max(20)
    .regex(/^\+?[0-9\s-]+$/, "Format de numéro invalide."),
  specialties: z.string().min(2, "Indiquez au moins une spécialité."),
  description: z
    .string()
    .min(20, "Décrivez votre atelier en au moins 20 caractères.")
    .max(500),
  email: z.string().email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(72),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "Saisissez votre email ou téléphone."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export type RegisterTailorInput = z.infer<typeof registerTailorSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
