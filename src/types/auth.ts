export type UserRole = "CLIENT" | "TAILOR" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: UserRole;
  tailorProfileId: string | null;
  handle: string | null;
};

export type RegisterTailorPayload = {
  atelierName: string;
  city: string;
  whatsapp: string;
  specialties: string[];
  description: string;
  email: string;
  password: string;
  heroLabel?: string;
};

export type RegisterTailorResult = {
  userId: string;
  tailorProfileId: string;
  handle: string;
  email: string;
  atelierName: string;
};
