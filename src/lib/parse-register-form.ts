import { registerTailorSchema } from "@/lib/validations/auth";
import type { z } from "zod";

export function parseRegisterFormData(
  formData: FormData,
): z.input<typeof registerTailorSchema> {
  const specialties = formData
    .getAll("specialties")
    .map((value) => String(value).trim())
    .filter(Boolean);

  return {
    atelierName: String(formData.get("atelierName") ?? ""),
    city: String(formData.get("city") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
    heroLabel: String(formData.get("heroLabel") ?? ""),
    specialties,
    description: String(formData.get("description") ?? ""),
    acceptTerms: formData.get("acceptTerms") === "on",
  };
}
