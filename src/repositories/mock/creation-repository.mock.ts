import { slugifyText } from "@/lib/slug";
import { getDynamicTailors } from "@/repositories/mock/auth-repository.mock";
import type {
  CreateCreationPayload,
  CreationRepository,
  CreationSearchFilters,
} from "@/repositories/types";
import type { Creation } from "@/types";

const dynamicCreations: Creation[] = [];

function allCreations(): Creation[] {
  return dynamicCreations;
}

function filterCreations(filters: CreationSearchFilters): Creation[] {
  const { query, category } = filters;

  return allCreations().filter((creation) => {
    if (category && creation.category !== category) {
      return false;
    }

    if (query) {
      const normalized = query.toLowerCase();
      const tailor = getDynamicTailors().find((t) => t.id === creation.tailorId);
      const matchesTitle = creation.title.toLowerCase().includes(normalized);
      const matchesTailor = tailor?.atelierName.toLowerCase().includes(normalized) ?? false;
      const matchesHandle = tailor?.handle.toLowerCase().includes(normalized) ?? false;
      if (!matchesTitle && !matchesTailor && !matchesHandle) {
        return false;
      }
    }

    return true;
  });
}

export const mockCreationRepository: CreationRepository = {
  async findAll() {
    return allCreations();
  },

  async findRecent(limit) {
    return allCreations().slice(0, limit);
  },

  async findBySlug(slug) {
    return allCreations().find((c) => c.slug === slug) ?? null;
  },

  async findByTailorId(tailorId) {
    return allCreations().filter((c) => c.tailorId === tailorId);
  },

  async findByTailorIdForOwner(tailorId) {
    return this.findByTailorId(tailorId);
  },

  async getSlugsForTailor(tailorId) {
    return allCreations()
      .filter((c) => c.tailorId === tailorId)
      .map((c) => c.slug);
  },

  async create(payload: CreateCreationPayload) {
    const creation: Creation = {
      id: `c-${Date.now()}`,
      tailorId: payload.tailorProfileId,
      title: payload.title,
      category: payload.category,
      slug: payload.slug || slugifyText(payload.title),
      priceFrom: payload.priceFrom,
      turnaround: payload.turnaroundLabel,
      likes: 0,
      imageClassName: "from-surface-strong to-surface",
      imageUrl: payload.mediaUrl,
      availableSizes: payload.availableSizes,
      details: payload.details,
    };

    dynamicCreations.unshift(creation);
    return creation;
  },

  async search(filters) {
    return filterCreations(filters);
  },
};
