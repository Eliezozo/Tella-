import { creations, tailorProfiles } from "@/lib/mock-data";
import type { CreationRepository, CreationSearchFilters } from "@/repositories/types";
import type { Creation } from "@/types";

function filterCreations(filters: CreationSearchFilters): Creation[] {
  const { query, category } = filters;

  return creations.filter((creation) => {
    if (category && creation.category !== category) {
      return false;
    }

    if (query) {
      const normalized = query.toLowerCase();
      const tailor = tailorProfiles.find((t) => t.id === creation.tailorId);
      const matchesTitle = creation.title.toLowerCase().includes(normalized);
      const matchesTailor = tailor?.atelierName.toLowerCase().includes(normalized) ?? false;
      if (!matchesTitle && !matchesTailor) {
        return false;
      }
    }

    return true;
  });
}

export const mockCreationRepository: CreationRepository = {
  async findAll() {
    return creations;
  },

  async findRecent(limit) {
    return creations.slice(0, limit);
  },

  async findBySlug(slug) {
    return creations.find((c) => c.slug === slug) ?? null;
  },

  async findByTailorId(tailorId) {
    return creations.filter((c) => c.tailorId === tailorId);
  },

  async search(filters) {
    return filterCreations(filters);
  },
};
