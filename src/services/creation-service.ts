import { getDataSourceMode } from "@/lib/data-source";
import { parseCreationDetails } from "@/lib/parse-creation-form";
import { withPrismaRetry } from "@/lib/prisma-retry";
import { ensureUniqueSlug, slugifyText } from "@/lib/slug";
import { createCreationSchema, type CreateCreationInput } from "@/lib/validations/creation";
import { getCreationRepository, getTailorRepository } from "@/repositories";
import { mockCreationRepository } from "@/repositories/mock/creation-repository.mock";
import { mockTailorRepository } from "@/repositories/mock/tailor-repository.mock";
import { withPrismaFallback } from "@/lib/with-prisma-fallback";
import type { Creation } from "@/types";

export class CreationServiceError extends Error {
  constructor(
    message: string,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "CreationServiceError";
  }
}

export async function getCreationBySlug(slug: string) {
  return withPrismaFallback(
    () => getCreationRepository().findBySlug(slug),
    () => mockCreationRepository.findBySlug(slug),
  );
}

export async function getCreationsByTailorId(tailorId: string) {
  return withPrismaFallback(
    () => getCreationRepository().findByTailorIdForOwner(tailorId),
    () => mockCreationRepository.findByTailorIdForOwner(tailorId),
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

export async function createCreationForTailor(
  tailorProfileId: string,
  input: CreateCreationInput,
  mediaUrl: string,
): Promise<Creation> {
  const parsed = createCreationSchema.safeParse(input);
  if (!parsed.success) {
    throw new CreationServiceError(
      "Vérifiez les champs du formulaire.",
      parsed.error.flatten().fieldErrors,
    );
  }

  if (!mediaUrl.trim()) {
    throw new CreationServiceError("Ajoutez une photo (fichier ou lien URL).", {
      imageUrl: ["Photo requise."],
    });
  }

  try {
    new URL(mediaUrl);
  } catch {
    if (!mediaUrl.startsWith("/")) {
      throw new CreationServiceError("Lien image invalide.", {
        imageUrl: ["Utilisez une URL complète (https://…) ou importez un fichier."],
      });
    }
  }

  const repo = getCreationRepository();
  const usePrisma = getDataSourceMode() === "prisma";

  const runDb = <T>(operation: () => Promise<T>) =>
    usePrisma ? withPrismaRetry(operation) : operation();

  const existingSlugs = await runDb(() => repo.getSlugsForTailor(tailorProfileId));
  const slug = ensureUniqueSlug(slugifyText(parsed.data.title), existingSlugs);

  const details = parseCreationDetails(parsed.data.detailsText);

  return runDb(() =>
    repo.create({
      tailorProfileId,
      slug,
      title: parsed.data.title.trim(),
      description: parsed.data.description.trim(),
      category: parsed.data.category,
      mediaUrl: mediaUrl.trim(),
      priceFrom: parsed.data.priceFrom,
      turnaroundLabel: parsed.data.turnaroundLabel.trim(),
      availableSizes: parsed.data.sizes,
      details,
    }),
  );
}
