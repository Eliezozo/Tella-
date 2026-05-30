import { getDataSourceMode } from "@/lib/data-source";
import { normalizeHandle } from "@/lib/handle";
import { hashPassword, verifyPassword } from "@/lib/password";
import { normalizePhone } from "@/lib/phone";
import { withPrismaRetry } from "@/lib/prisma-retry";
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
  | "PHONE_EXISTS"
  | "HANDLE_EXISTS"
  | "ATELIER_NAME_EXISTS"
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
  const usePrisma = getDataSourceMode() === "prisma";

  const runAuthDb = <T>(operation: () => Promise<T>) =>
    usePrisma ? withPrismaRetry(operation) : operation();

  if (getDataSourceMode() === "mock" && process.env.DATABASE_URL) {
    console.warn(
      "[registerTailor] MODE MOCK actif — l'inscription ne sera pas enregistrée en base. Ajoutez USE_PRISMA=true dans .env puis redémarrez le serveur.",
    );
  }

  const normalizedWhatsapp = normalizePhone(parsed.data.whatsapp);

  const existingEmail = await runAuthDb(() => repo.findByEmail(parsed.data.email));
  if (existingEmail) {
    throw new AuthServiceError(
      "Cette adresse email est déjà utilisée.",
      "EMAIL_EXISTS",
      { email: ["Compte existant avec cet email."] },
    );
  }

  const existingPhone = await runAuthDb(() => repo.findByPhone(normalizedWhatsapp));
  if (existingPhone) {
    throw new AuthServiceError(
      "Ce numéro WhatsApp est déjà utilisé.",
      "PHONE_EXISTS",
      { whatsapp: ["Compte existant avec ce numéro WhatsApp."] },
    );
  }

  const handles = await runAuthDb(() => repo.getAllHandles());
  const handle = normalizeHandle(parsed.data.handle);
  if (handles.includes(handle)) {
    throw new AuthServiceError(
      "Cet identifiant public est déjà utilisé. Choisissez-en un autre.",
      "HANDLE_EXISTS",
      { handle: ["Identifiant déjà pris."] },
    );
  }

  const existingAtelier = await runAuthDb(() =>
    repo.findByAtelierName(parsed.data.atelierName),
  );
  if (existingAtelier) {
    throw new AuthServiceError(
      "Ce nom d'atelier est déjà utilisé. Choisissez un nom distinct.",
      "ATELIER_NAME_EXISTS",
      { atelierName: ["Nom d'atelier déjà enregistré."] },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const heroLabel =
    parsed.data.heroLabel?.trim() ||
    `Découvrez ${parsed.data.atelierName.trim()}`;

  const payload: RegisterTailorPayload = {
    atelierName: parsed.data.atelierName.trim(),
    city: parsed.data.city,
    whatsapp: normalizedWhatsapp,
    specialties: parsed.data.specialties,
    description: parsed.data.description.trim(),
    email: parsed.data.email.toLowerCase().trim(),
    password: parsed.data.password,
    heroLabel,
  };

  const created = await runAuthDb(() =>
    repo.registerTailor({
      ...payload,
      passwordHash,
      handle,
    }),
  );

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
  const record =
    getDataSourceMode() === "prisma"
      ? await withPrismaRetry(() => repo.findByIdentifier(parsed.data.identifier))
      : await repo.findByIdentifier(parsed.data.identifier);

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
  return null;
}
