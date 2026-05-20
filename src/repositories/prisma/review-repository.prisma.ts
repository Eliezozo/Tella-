import { prisma } from "@/lib/prisma";
import type { ReviewRepository } from "@/repositories/types";
import type { Review } from "@/types";

export const prismaReviewRepository: ReviewRepository = {
  async findFeatured(limit) {
    const rows = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    return rows.map((row) => ({
      id: row.id,
      tailorId: row.tailorProfileId,
      author: row.author.name ?? "Cliente",
      rating: row.rating,
      comment: row.comment,
    }));
  },

  async findByTailorId(tailorId) {
    const rows = await prisma.review.findMany({
      where: { tailorProfileId: tailorId },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => ({
      id: row.id,
      tailorId: row.tailorProfileId,
      author: row.author.name ?? "Cliente",
      rating: row.rating,
      comment: row.comment,
    }));
  },
};
