"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { isNextNavigationError } from "@/lib/next-errors";
import type { AuthFormState } from "@/lib/auth-form-state";
import { parseRegisterFormData } from "@/lib/parse-register-form";
import {
  ACCOUNT_PENDING_MESSAGE,
  AuthServiceError,
  authenticateUser,
  registerTailor,
} from "@/services/auth-service";

const REGISTER_SUCCESS_MESSAGE =
  "Inscription enregistrée. Votre compte sera activé après validation par l'équipe Tella — vous pourrez alors vous connecter.";

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
    const created = await registerTailor(parseRegisterFormData(formData));

    return {
      ok: true,
      pendingApproval: true,
      message: REGISTER_SUCCESS_MESSAGE,
      registeredHandle: created.handle,
      registeredEmail: created.email,
      registeredAtelierName: created.atelierName,
    };
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
    await authenticateUser({ identifier, password });

    const signInResult = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (
      signInResult &&
      typeof signInResult === "object" &&
      "error" in signInResult &&
      signInResult.error
    ) {
      return {
        ok: false,
        message: "Email ou mot de passe incorrect.",
      };
    }

    redirect(callbackUrl);
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    if (error instanceof AuthServiceError) {
      if (error.code === "ACCOUNT_PENDING") {
        return { ok: false, message: ACCOUNT_PENDING_MESSAGE };
      }
      return {
        ok: false,
        message: error.message,
        fieldErrors: flattenFieldErrors(error.fieldErrors),
      };
    }
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "Email ou mot de passe incorrect.",
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
