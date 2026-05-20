import { tailorProfiles } from "@/lib/mock-data";
import { getDynamicTailors } from "@/repositories/mock/auth-repository.mock";
import type { TailorRepository, TailorSearchFilters } from "@/repositories/types";
import type { TailorProfile } from "@/types";

function allTailors(): TailorProfile[] {
  return [...tailorProfiles, ...getDynamicTailors()];
}

function normalizeHandle(handle: string) {
  return handle.startsWith("@") ? handle : `@${handle}`;
}

function filterTailors(filters: TailorSearchFilters): TailorProfile[] {
  const { query, city } = filters;

  return allTailors().filter((tailor) => {
    if (city && tailor.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    if (query) {
      const normalized = query.toLowerCase();
      const matchesName = tailor.atelierName.toLowerCase().includes(normalized);
      const matchesDesc = tailor.description.toLowerCase().includes(normalized);
      const matchesSpecialty = tailor.specialties.some((s) =>
        s.toLowerCase().includes(normalized),
      );
      if (!matchesName && !matchesDesc && !matchesSpecialty) {
        return false;
      }
    }

    return true;
  });
}

export const mockTailorRepository: TailorRepository = {
  async findAll() {
    return allTailors();
  },

  async findFeatured(limit) {
    return allTailors().slice(0, limit);
  },

  async findByHandle(handle) {
    const normalized = normalizeHandle(handle);
    return allTailors().find((t) => t.handle === normalized) ?? null;
  },

  async findById(id) {
    return allTailors().find((t) => t.id === id) ?? null;
  },

  async search(filters) {
    return filterTailors(filters);
  },

  async getCities() {
    return [...new Set(allTailors().map((t) => t.city))];
  },
};
