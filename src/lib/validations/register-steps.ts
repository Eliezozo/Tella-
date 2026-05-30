import { registerTailorBaseSchema } from "@/lib/validations/auth";
import { togoCities } from "@/lib/constants/cities";

export const registerStep1Schema = registerTailorBaseSchema
  .pick({
    handle: true,
    atelierName: true,
    city: true,
    heroLabel: true,
  })
  .refine((data) => togoCities.includes(data.city as (typeof togoCities)[number]), {
    message: "Ville non reconnue.",
    path: ["city"],
  });

export const registerStep2Schema = registerTailorBaseSchema
  .pick({
    email: true,
    whatsapp: true,
    password: true,
    passwordConfirm: true,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirm"],
  });

export const registerStep3Schema = registerTailorBaseSchema.pick({
  specialties: true,
  description: true,
  acceptTerms: true,
});
