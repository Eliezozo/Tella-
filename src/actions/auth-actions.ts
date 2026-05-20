"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import {
  AuthServiceError,
  registerTailor,
} from "@/services/auth-service";

export type AuthFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const initialState: AuthFormState = { ok: false };

function flattenFieldErrors(
  errors?: Record<string, string[] | undefined>,
): Record<string, string[]> | undefined {
  if (!errors) return undefined;
  const entries = Object.entries(errors).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].length > 0,
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export async function registerTailorAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    const user = await registerTailor({
      atelierName: String(formData.get("atelierName") ?? ""),
      city: String(formData.get("city") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      specialties: String(formData.get("specialties") ?? ""),
      description: String(formData.get("description") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    await signIn("credentials", {
      identifier: user.email ?? "",
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    });

    return { ok: true };
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: flattenFieldErrors(error.fieldErrors),
      };
    }
    return {
      ok: false,
      message: "Une erreur est survenue. Réessayez dans un instant.",
    };
  }
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/dashboard");

  try {
    await signIn("credentials", {
      identifier,
      password,
      redirectTo: callbackUrl,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "Email ou mot de passe incorrect.",
      };
    }
    if (error instanceof AuthServiceError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: flattenFieldErrors(error.fieldErrors),
      };
    }
    return {
      ok: false,
      message: "Connexion impossible pour le moment.",
    };
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export { initialState as authFormInitialState };
