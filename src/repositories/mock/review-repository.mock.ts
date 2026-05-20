import { reviews } from "@/lib/mock-data";
import type { ReviewRepository } from "@/repositories/types";

export const mockReviewRepository: ReviewRepository = {
  async findByTailorId(tailorId) {
    return reviews.filter((r) => r.tailorId === tailorId);
  },

  async findFeatured(limit) {
    return reviews.slice(0, limit);
  },
};
