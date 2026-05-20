import { getReviewRepository } from "@/repositories";

export async function getFeaturedTestimonials(limit = 3) {
  return getReviewRepository().findFeatured(limit);
}
