import type { Creation, Review, TailorProfile } from "@/types";
import type { CategoryKey } from "@/types";

export type TailorSearchFilters = {
  query?: string;
  city?: string;
};

export type CreationSearchFilters = {
  query?: string;
  category?: CategoryKey;
};

export interface TailorRepository {
  findAll(): Promise<TailorProfile[]>;
  findFeatured(limit: number): Promise<TailorProfile[]>;
  findByHandle(handle: string): Promise<TailorProfile | null>;
  findById(id: string): Promise<TailorProfile | null>;
  search(filters: TailorSearchFilters): Promise<TailorProfile[]>;
  getCities(): Promise<string[]>;
}

export type CreateCreationPayload = {
  tailorProfileId: string;
  slug: string;
  title: string;
  description: string;
  category: CategoryKey;
  mediaUrl: string;
  priceFrom?: number;
  turnaroundLabel: string;
  availableSizes: string[];
  details: string[];
};

export interface CreationRepository {
  findAll(): Promise<Creation[]>;
  findRecent(limit: number): Promise<Creation[]>;
  findBySlug(slug: string): Promise<Creation | null>;
  findByTailorId(tailorId: string): Promise<Creation[]>;
  findByTailorIdForOwner(tailorId: string): Promise<Creation[]>;
  getSlugsForTailor(tailorId: string): Promise<string[]>;
  create(payload: CreateCreationPayload): Promise<Creation>;
  search(filters: CreationSearchFilters): Promise<Creation[]>;
}

export interface ReviewRepository {
  findByTailorId(tailorId: string): Promise<Review[]>;
  findFeatured(limit: number): Promise<Review[]>;
}

export interface AuthRepository {
  findByIdentifier(identifier: string): Promise<{
    id: string;
    email: string | null;
    phone: string | null;
    name: string | null;
    passwordHash: string | null;
    role: string;
    tailorProfileId: string | null;
    handle: string | null;
    isApproved: boolean;
  } | null>;
  findByEmail(email: string): Promise<{ id: string } | null>;
  findByPhone(phone: string): Promise<{ id: string } | null>;
  getAllHandles(): Promise<string[]>;
  registerTailor(payload: {
    atelierName: string;
    city: string;
    whatsapp: string;
    specialties: string[];
    description: string;
    email: string;
    passwordHash: string;
    handle: string;
    heroLabel?: string;
  }): Promise<{
    userId: string;
    tailorProfileId: string;
    handle: string;
  }>;
}
