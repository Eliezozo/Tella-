import { tailorProfiles } from "@/lib/mock-data";
import type { TailorProfile } from "@/types";
import type { AuthRepository } from "@/repositories/types";

type MockAuthRecord = {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  passwordHash: string;
  role: "TAILOR" | "CLIENT" | "ADMIN";
  tailorProfileId: string | null;
  handle: string | null;
  isApproved: boolean;
};

function toAuthRecord(user: MockAuthRecord) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    passwordHash: user.passwordHash,
    role: user.role,
    tailorProfileId: user.tailorProfileId,
    handle: user.handle,
    isApproved: user.role !== "TAILOR" || user.isApproved,
  };
}

/** Compte démo : ama@tella.tg / TellaDemo2026 — lié à @atelier-ama */
const DEMO_PASSWORD_HASH =
  "$2b$12$Q53qfBzfD.fPRA2JIE.0VOEDR2fTcYsohuRzXrikMGgnBdK0kLgwC";

const mockUsers: MockAuthRecord[] = [
  {
    id: "u-demo-ama",
    email: "ama@tella.tg",
    phone: "+22890000001",
    name: "Atelier Ama",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "TAILOR",
    tailorProfileId: "t1",
    handle: "@atelier-ama",
    isApproved: true,
  },
];

const dynamicTailors: TailorProfile[] = [];

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function findUser(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  return (
    mockUsers.find(
      (user) =>
        user.email.toLowerCase() === normalized ||
        (user.phone && user.phone.replace(/\s/g, "") === identifier.replace(/\s/g, "")),
    ) ?? null
  );
}

export const mockAuthRepository: AuthRepository = {
  async findByIdentifier(identifier) {
    const user = findUser(identifier);
    return user ? toAuthRecord(user) : null;
  },

  async findByEmail(email) {
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user ? { id: user.id } : null;
  },

  async getAllHandles() {
    return [
      ...tailorProfiles.map((t) => t.handle),
      ...dynamicTailors.map((t) => t.handle),
    ];
  },

  async registerTailor(payload) {
    const userId = `u-${Date.now()}`;
    const tailorProfileId = `t-${Date.now()}`;

    mockUsers.push({
      id: userId,
      email: payload.email,
      phone: payload.whatsapp,
      name: payload.atelierName,
      passwordHash: payload.passwordHash,
      role: "TAILOR",
      tailorProfileId,
      handle: payload.handle,
      isApproved: false,
    });

    dynamicTailors.push({
      id: tailorProfileId,
      handle: payload.handle,
      atelierName: payload.atelierName,
      city: payload.city,
      description: payload.description,
      whatsapp: payload.whatsapp,
      specialties: payload.specialties,
      rating: 0,
      reviewsCount: 0,
      completedOrders: 0,
      responseRate: 0,
      heroLabel: payload.heroLabel ?? `Découvrez ${payload.atelierName}`,
      isApproved: false,
      isPublished: false,
    });

    return { userId, tailorProfileId, handle: payload.handle };
  },
};

export function getDynamicTailors() {
  return dynamicTailors;
}
