import { getCreationRepository, getReviewRepository, getTailorRepository } from "@/repositories";

export async function getTailorByHandle(handle: string) {
  return getTailorRepository().findByHandle(handle);
}

export async function getTailorById(id: string) {
  return getTailorRepository().findById(id);
}

export async function getTailorPortfolio(tailorId: string) {
  return getCreationRepository().findByTailorId(tailorId);
}

export async function getTailorReviews(tailorId: string) {
  return getReviewRepository().findByTailorId(tailorId);
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
