import { getDataSourceMode } from "@/lib/data-source";
import { ensureUniqueHandle, slugifyHandle } from "@/lib/handle";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  loginSchema,
  registerTailorSchema,
  type LoginInput,
  type RegisterTailorInput,
} from "@/lib/validations/auth";
import { getAuthRepository } from "@/repositories/index";
import type {
  AuthUser,
  RegisterTailorPayload,
  RegisterTailorResult,
  UserRole,
} from "@/types/auth";

export type AuthErrorCode =
  | "VALIDATION"
  | "EMAIL_EXISTS"
  | "INVALID_CREDENTIALS"
  | "NO_PASSWORD"
  | "ACCOUNT_PENDING";

export const ACCOUNT_PENDING_MESSAGE =
  "Votre compte est en attente de validation par l'équipe Tella. Vous pourrez vous connecter une fois votre atelier approuvé.";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function mapRole(role: string): UserRole {
  if (role === "ADMIN" || role === "CLIENT" || role === "TAILOR") {
    return role;
  }
  return "TAILOR";
}

function toAuthUser(record: {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: string;
  tailorProfileId: string | null;
  handle: string | null;
  isApproved: boolean;
}): AuthUser {
  return {
    id: record.id,
    email: record.email,
    phone: record.phone,
    name: record.name,
    role: mapRole(record.role),
    tailorProfileId: record.tailorProfileId,
    handle: record.handle,
  };
}

export async function registerTailor(
  input: RegisterTailorInput,
): Promise<RegisterTailorResult> {
  const parsed = registerTailorSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError(
      "Vérifiez les champs du formulaire.",
      "VALIDATION",
      parsed.error.flatten().fieldErrors,
    );
  }

  const repo = getAuthRepository();
  const existing = await repo.findByEmail(parsed.data.email);
  if (existing) {
    throw new AuthServiceError(
      "Cette adresse email est déjà utilisée.",
      "EMAIL_EXISTS",
      { email: ["Compte existant avec cet email."] },
    );
  }

  const handles = await repo.getAllHandles();
  const baseHandle = slugifyHandle(parsed.data.atelierName);
  const handle = ensureUniqueHandle(baseHandle, handles);
  const passwordHash = await hashPassword(parsed.data.password);

  const heroLabel =
    parsed.data.heroLabel?.trim() ||
    `Découvrez ${parsed.data.atelierName.trim()}`;

  const payload: RegisterTailorPayload = {
    atelierName: parsed.data.atelierName.trim(),
    city: parsed.data.city,
    whatsapp: parsed.data.whatsapp.trim(),
    specialties: parsed.data.specialties,
    description: parsed.data.description.trim(),
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
    heroLabel,
  };

  const created = await repo.registerTailor({
    ...payload,
    passwordHash,
    handle,
  });

  return {
    userId: created.userId,
    tailorProfileId: created.tailorProfileId,
    handle: created.handle,
    email: payload.email,
    atelierName: payload.atelierName,
  };
}

export async function authenticateUser(
  input: LoginInput,
): Promise<AuthUser> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    throw new AuthServiceError(
      "Identifiants invalides.",
      "VALIDATION",
      parsed.error.flatten().fieldErrors,
    );
  }

  const repo = getAuthRepository();
  const record = await repo.findByIdentifier(parsed.data.identifier);

  if (!record?.passwordHash) {
    throw new AuthServiceError(
      "Email ou mot de passe incorrect.",
      "INVALID_CREDENTIALS",
    );
  }

  const valid = await verifyPassword(parsed.data.password, record.passwordHash);
  if (!valid) {
    throw new AuthServiceError(
      "Email ou mot de passe incorrect.",
      "INVALID_CREDENTIALS",
    );
  }

  if (record.role === "TAILOR" && !record.isApproved) {
    throw new AuthServiceError(ACCOUNT_PENDING_MESSAGE, "ACCOUNT_PENDING");
  }

  return toAuthUser(record);
}

export function getDemoCredentialsHint(): string | null {
  if (getDataSourceMode() === "prisma") {
    return null;
  }
  return "Compte démo : ama@tella.tg / TellaDemo2026";
}
