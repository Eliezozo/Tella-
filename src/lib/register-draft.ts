import type { RegisterTailorInput } from "@/lib/validations/auth";

export type RegisterDraft = {
  handle: string;
  atelierName: string;
  city: string;
  heroLabel: string;
  email: string;
  whatsapp: string;
  password: string;
  passwordConfirm: string;
  specialties: string[];
  description: string;
  acceptTerms: boolean;
};

export const emptyRegisterDraft: RegisterDraft = {
  handle: "",
  atelierName: "",
  city: "",
  heroLabel: "",
  email: "",
  whatsapp: "",
  password: "",
  passwordConfirm: "",
  specialties: [],
  description: "",
  acceptTerms: false,
};

export function mergeRegisterDraft(
  draft: RegisterDraft,
  partial: Partial<RegisterDraft>,
): RegisterDraft {
  return {
    ...draft,
    ...partial,
    specialties: partial.specialties ?? draft.specialties,
  };
}

/** Fusionne le brouillon React et les champs visibles du formulaire. */
export function registerPayloadToFormData(payload: RegisterDraft): FormData {
  const formData = new FormData();
  formData.set("handle", payload.handle);
  formData.set("atelierName", payload.atelierName);
  formData.set("city", payload.city);
  formData.set("heroLabel", payload.heroLabel);
  formData.set("email", payload.email);
  formData.set("whatsapp", payload.whatsapp);
  formData.set("password", payload.password);
  formData.set("passwordConfirm", payload.passwordConfirm);
  formData.set("description", payload.description);
  for (const specialty of payload.specialties) {
    formData.append("specialties", specialty);
  }
  if (payload.acceptTerms) {
    formData.set("acceptTerms", "on");
  }
  return formData;
}

export function toRegisterPayload(
  draft: RegisterDraft,
  formData: FormData,
): RegisterTailorInput {
  const specialties = formData
    .getAll("specialties")
    .map((value) => String(value).trim())
    .filter(Boolean);

  return {
    handle: String(formData.get("handle") ?? draft.handle).trim(),
    atelierName: String(formData.get("atelierName") ?? draft.atelierName).trim(),
    city: String(formData.get("city") ?? draft.city).trim(),
    heroLabel: String(formData.get("heroLabel") ?? draft.heroLabel ?? "").trim(),
    email: String(formData.get("email") ?? draft.email).trim(),
    whatsapp: String(formData.get("whatsapp") ?? draft.whatsapp).trim(),
    password: String(formData.get("password") ?? draft.password),
    passwordConfirm: String(formData.get("passwordConfirm") ?? draft.passwordConfirm),
    specialties: specialties.length > 0 ? specialties : draft.specialties,
    description: String(formData.get("description") ?? draft.description).trim(),
    acceptTerms:
      formData.get("acceptTerms") === "on" || draft.acceptTerms,
  };
}
