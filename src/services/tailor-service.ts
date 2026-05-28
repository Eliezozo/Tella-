import {
  getCreationRepository,
  getReviewRepository,
  getTailorRepository,
} from "@/repositories";
import { mockCreationRepository } from "@/repositories/mock/creation-repository.mock";
import { mockReviewRepository } from "@/repositories/mock/review-repository.mock";
import { mockTailorRepository } from "@/repositories/mock/tailor-repository.mock";
import { withPrismaFallback } from "@/lib/with-prisma-fallback";

export async function getTailorByHandle(handle: string) {
  return withPrismaFallback(
    () => getTailorRepository().findByHandle(handle),
    () => mockTailorRepository.findByHandle(handle),
  );
}

export async function getTailorById(id: string) {
  return withPrismaFallback(
    () => getTailorRepository().findById(id),
    () => mockTailorRepository.findById(id),
  );
}

export async function getTailorPortfolio(tailorId: string) {
  return withPrismaFallback(
    () => getCreationRepository().findByTailorId(tailorId),
    () => mockCreationRepository.findByTailorId(tailorId),
  );
}

export async function getTailorReviews(tailorId: string) {
  return withPrismaFallback(
    () => getReviewRepository().findByTailorId(tailorId),
    () => mockReviewRepository.findByTailorId(tailorId),
  );
}

export async function getTailorProfilePage(handle: string) {
  const profile = await getTailorByHandle(handle);
  if (!profile) {
    return null;
  }

  const [portfolio, profileReviews] = await Promise.all([
    getTailorPortfolio(profile.id),
    getTailorReviews(profile.id),
  ]);

  return { profile, portfolio, reviews: profileReviews };
}
