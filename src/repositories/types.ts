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

export interface CreationRepository {
  findAll(): Promise<Creation[]>;
  findRecent(limit: number): Promise<Creation[]>;
  findBySlug(slug: string): Promise<Creation | null>;
  findByTailorId(tailorId: string): Promise<Creation[]>;
  search(filters: CreationSearchFilters): Promise<Creation[]>;
}

export interface ReviewRepository {
  findByTailorId(tailorId: string): Promise<Review[]>;
  findFeatured(limit: number): Promise<Review[]>;
}
