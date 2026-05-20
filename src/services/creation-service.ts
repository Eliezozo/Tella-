import { getCreationRepository, getTailorRepository } from "@/repositories";

export async function getCreationBySlug(slug: string) {
  return getCreationRepository().findBySlug(slug);
}

export async function getCreationDetailPage(slug: string) {
  const product = await getCreationBySlug(slug);
  if (!product) {
    return null;
  }

  const tailor = await getTailorRepository().findById(product.tailorId);
  if (!tailor) {
    return null;
  }

  return { product, tailor };
}
