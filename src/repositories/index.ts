import { getDataSourceMode } from "@/lib/data-source";
import { mockCreationRepository } from "@/repositories/mock/creation-repository.mock";
import { mockReviewRepository } from "@/repositories/mock/review-repository.mock";
import { mockTailorRepository } from "@/repositories/mock/tailor-repository.mock";
import { prismaCreationRepository } from "@/repositories/prisma/creation-repository.prisma";
import { prismaReviewRepository } from "@/repositories/prisma/review-repository.prisma";
import { prismaTailorRepository } from "@/repositories/prisma/tailor-repository.prisma";

export function getTailorRepository() {
  return getDataSourceMode() === "prisma" ? prismaTailorRepository : mockTailorRepository;
}

export function getCreationRepository() {
  return getDataSourceMode() === "prisma" ? prismaCreationRepository : mockCreationRepository;
}

export function getReviewRepository() {
  return getDataSourceMode() === "prisma" ? prismaReviewRepository : mockReviewRepository;
}
