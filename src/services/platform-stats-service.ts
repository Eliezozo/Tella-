import { getDataSourceMode } from "@/lib/data-source";
import { prisma } from "@/lib/prisma";
import { withPrismaRetry } from "@/lib/prisma-retry";

export type PlatformPublicStats = {
  publishedTailors: number;
  totalClients: number;
  whatsappClicks: number;
  totalCreations: number;
  averageRating: number | null;
  totalReviews: number;
};

function formatStatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatPlatformStat(value: number): string {
  return formatStatNumber(Math.max(0, value));
}

async function fetchPlatformPublicStats(): Promise<PlatformPublicStats> {
  const [publishedTailors, totalClients, clicksAggregate, totalCreations, reviewsAggregate] =
    await Promise.all([
      prisma.tailorProfile.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.tailorProfile.aggregate({ _sum: { whatsappClicks: true } }),
      prisma.post.count({ where: { isPublished: true } }),
      prisma.review.aggregate({ _avg: { rating: true }, _count: { id: true } }),
    ]);

  return {
    publishedTailors,
    totalClients,
    whatsappClicks: clicksAggregate._sum.whatsappClicks ?? 0,
    totalCreations,
    averageRating: reviewsAggregate._avg.rating,
    totalReviews: reviewsAggregate._count.id,
  };
}

const emptyStats: PlatformPublicStats = {
  publishedTailors: 0,
  totalClients: 0,
  whatsappClicks: 0,
  totalCreations: 0,
  averageRating: null,
  totalReviews: 0,
};

export async function getPlatformPublicStats(): Promise<PlatformPublicStats> {
  if (getDataSourceMode() !== "prisma") {
    return emptyStats;
  }
  return withPrismaRetry(fetchPlatformPublicStats);
}
