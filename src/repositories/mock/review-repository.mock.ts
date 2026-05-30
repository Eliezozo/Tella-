import type { ReviewRepository } from "@/repositories/types";

export const mockReviewRepository: ReviewRepository = {
  async findByTailorId() {
    return [];
  },

  async findFeatured() {
    return [];
  },
};
