import { getReviewRepository } from "@/repositories";
import { mockReviewRepository } from "@/repositories/mock/review-repository.mock";
import { withPrismaFallback } from "@/lib/with-prisma-fallback";

export async function getFeaturedTestimonials(limit = 3) {
  return withPrismaFallback(
    () => getReviewRepository().findFeatured(limit),
    () => mockReviewRepository.findFeatured(limit),
  );
}
