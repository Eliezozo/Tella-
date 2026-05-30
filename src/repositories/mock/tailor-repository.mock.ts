import { getDynamicTailors } from "@/repositories/mock/auth-repository.mock";
import type { TailorRepository, TailorSearchFilters } from "@/repositories/types";
import type { TailorProfile } from "@/types";

function isPublicTailor(tailor: TailorProfile) {
  return (tailor.isApproved ?? false) && (tailor.isPublished ?? false);
}

function allTailors(): TailorProfile[] {
  return getDynamicTailors();
}

function publicTailors(): TailorProfile[] {
  return allTailors().filter(isPublicTailor);
}

function normalizeHandle(handle: string) {
  return handle.startsWith("@") ? handle : `@${handle}`;
}

function filterTailors(filters: TailorSearchFilters): TailorProfile[] {
  const { query, city } = filters;

  return publicTailors().filter((tailor) => {
    if (city && tailor.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    if (query) {
      const normalized = query.toLowerCase();
      const matchesName = tailor.atelierName.toLowerCase().includes(normalized);
      const matchesHandle = tailor.handle.toLowerCase().includes(normalized);
      const matchesDesc = tailor.description.toLowerCase().includes(normalized);
      const matchesSpecialty = tailor.specialties.some((s) =>
        s.toLowerCase().includes(normalized),
      );
      if (!matchesName && !matchesHandle && !matchesDesc && !matchesSpecialty) {
        return false;
      }
    }

    return true;
  });
}

export const mockTailorRepository: TailorRepository = {
  async findAll() {
    return publicTailors();
  },

  async findFeatured(limit) {
    return publicTailors().slice(0, limit);
  },

  async findByHandle(handle) {
    const normalized = normalizeHandle(handle);
    return publicTailors().find((t) => t.handle === normalized) ?? null;
  },

  async findById(id) {
    const tailor = allTailors().find((t) => t.id === id) ?? null;
    if (!tailor) return null;
    return tailor;
  },

  async search(filters) {
    return filterTailors(filters);
  },

  async getCities() {
    return [...new Set(publicTailors().map((t) => t.city))];
  },

  async updateProfileImages(id, data) {
    const tailor = allTailors().find((item) => item.id === id);
    if (!tailor) {
      throw new Error("Profil atelier introuvable.");
    }
    if (data.avatarUrl !== undefined) {
      tailor.avatarUrl = data.avatarUrl;
    }
    if (data.bannerUrl !== undefined) {
      tailor.coverUrl = data.bannerUrl;
    }
    return tailor;
  },
};
