import { getCreationRepository, getTailorRepository } from "@/repositories";
import { mockCreationRepository } from "@/repositories/mock/creation-repository.mock";
import { mockTailorRepository } from "@/repositories/mock/tailor-repository.mock";
import { withPrismaFallback } from "@/lib/with-prisma-fallback";

export async function getCreationBySlug(slug: string) {
  return withPrismaFallback(
    () => getCreationRepository().findBySlug(slug),
    () => mockCreationRepository.findBySlug(slug),
  );
}

export async function getCreationsByTailorId(tailorId: string) {
  return withPrismaFallback(
    () => getCreationRepository().findByTailorId(tailorId),
    () => mockCreationRepository.findByTailorId(tailorId),
  );
}

export async function getCreationDetailPage(slug: string) {
  const product = await getCreationBySlug(slug);
  if (!product) {
    return null;
  }

  const tailor = await withPrismaFallback(
    () => getTailorRepository().findById(product.tailorId),
    () => mockTailorRepository.findById(product.tailorId),
  );

  if (!tailor) {
    return null;
  }

  return { product, tailor };
}
