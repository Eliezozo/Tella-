import {
  getCreationRepository,
  getTailorRepository,
} from "@/repositories";
import type { CreationSearchFilters, TailorSearchFilters } from "@/repositories/types";

const tailorRepo = () => getTailorRepository();
const creationRepo = () => getCreationRepository();

export async function getFeaturedTailors(limit = 3) {
  return tailorRepo().findFeatured(limit);
}

export async function getRecentCreations(limit = 6) {
  return creationRepo().findRecent(limit);
}

export async function getAllTailors() {
  return tailorRepo().findAll();
}

export async function getAllCreations() {
  return creationRepo().findAll();
}

export async function getAllCities() {
  return tailorRepo().getCities();
}

export async function searchTailors(filters: TailorSearchFilters = {}) {
  return tailorRepo().search(filters);
}

export async function searchCreations(filters: CreationSearchFilters = {}) {
  return creationRepo().search(filters);
}
