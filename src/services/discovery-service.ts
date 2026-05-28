import {
  getCreationRepository,
  getTailorRepository,
} from "@/repositories";
import { mockCreationRepository } from "@/repositories/mock/creation-repository.mock";
import { mockTailorRepository } from "@/repositories/mock/tailor-repository.mock";
import { withPrismaFallback } from "@/lib/with-prisma-fallback";
import type { CreationSearchFilters, TailorSearchFilters } from "@/repositories/types";

const tailorRepo = () => getTailorRepository();
const creationRepo = () => getCreationRepository();

export async function getFeaturedTailors(limit = 3) {
  return withPrismaFallback(
    () => tailorRepo().findFeatured(limit),
    () => mockTailorRepository.findFeatured(limit),
  );
}

export async function getRecentCreations(limit = 6) {
  return withPrismaFallback(
    () => creationRepo().findRecent(limit),
    () => mockCreationRepository.findRecent(limit),
  );
}

export async function getAllTailors() {
  return withPrismaFallback(
    () => tailorRepo().findAll(),
    () => mockTailorRepository.findAll(),
  );
}

export async function getAllCreations() {
  return withPrismaFallback(
    () => creationRepo().findAll(),
    () => mockCreationRepository.findAll(),
  );
}

export async function getAllCities() {
  return withPrismaFallback(
    () => tailorRepo().getCities(),
    () => mockTailorRepository.getCities(),
  );
}

export async function searchTailors(filters: TailorSearchFilters = {}) {
  return withPrismaFallback(
    () => tailorRepo().search(filters),
    () => mockTailorRepository.search(filters),
  );
}

export async function searchCreations(filters: CreationSearchFilters = {}) {
  return withPrismaFallback(
    () => creationRepo().search(filters),
    () => mockCreationRepository.search(filters),
  );
}
