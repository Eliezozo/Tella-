"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { isNextNavigationError } from "@/lib/next-errors";
import type { AuthFormState } from "@/lib/auth-form-state";
import { REGISTER_SUCCESS_MESSAGE } from "@/lib/auth-messages";
import { getDataSourceMode } from "@/lib/data-source";
import { notifyAdminNewAtelier } from "@/lib/notifications/notify-admin-new-atelier";
import { parseRegisterFormData } from "@/lib/parse-register-form";
import { toUserFacingDatabaseMessage } from "@/lib/prisma-errors";
import { sanitizeCallbackUrl } from "@/lib/safe-redirect";
import {
  ACCOUNT_PENDING_MESSAGE,
  AuthServiceError,
  authenticateUser,
  registerTailor,
} from "@/services/auth-service";

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
  const parsed = parseRegisterFormData(formData);

  try {
    const created = await registerTailor(parsed);

    console.info(
      "[registerTailorAction] inscription OK",
      { email: created.email, handle: created.handle, source: getDataSourceMode() },
    );

    // Notification admin (fire-and-forget : ne doit jamais bloquer l'inscription).
    void notifyAdminNewAtelier({
      atelierName: created.atelierName,
      handle: created.handle,
      city: parsed.city,
      email: created.email,
      whatsapp: parsed.whatsapp,
      specialties: parsed.specialties,
      description: parsed.description,
    }).catch((error) => {
      console.warn("[registerTailorAction] notification admin échouée:", error);
    });

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
      if (error.code === "VALIDATION") {
        console.warn("[registerTailorAction] validation:", error.fieldErrors);
      }
      return {
        ok: false,
        message: error.message,
        fieldErrors: flattenFieldErrors(error.fieldErrors),
      };
    }
    // Log côté serveur pour diagnostic Vercel (erreur réelle de Prisma, etc.).
    if (error instanceof Error) {
      console.error("[registerTailorAction] erreur inattendue:", error.message);
    } else {
      console.error("[registerTailorAction] erreur inattendue inconnue:", error);
    }
    return {
      ok: false,
      message: toUserFacingDatabaseMessage(error),
    };
  }
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl"));

  try {
    const user = await authenticateUser({ identifier, password });

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
      console.error("[loginAction] signIn error:", signInResult.error);
      return {
        ok: false,
        message: "Email ou mot de passe incorrect.",
      };
    }

    redirect(
      user.role === "ADMIN" && callbackUrl === "/dashboard"
        ? "/dashboard/demandes"
        : callbackUrl,
    );
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
      console.error("[loginAction] AuthError:", error.message);
      return {
        ok: false,
        message: "Email ou mot de passe incorrect.",
      };
    }
    if (error instanceof Error) {
      console.error("[loginAction] erreur inattendue:", error.message);
    } else {
      console.error("[loginAction] erreur inattendue inconnue:", error);
    }
    return {
      ok: false,
      message: toUserFacingDatabaseMessage(error),
    };
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
