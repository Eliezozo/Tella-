import { getDataSourceMode } from "@/lib/data-source";
import { prisma } from "@/lib/prisma";
import { withPrismaRetry } from "@/lib/prisma-retry";

export type TailorStats = {
  viewsCount: number;
  whatsappClicks: number;
  reviewsCount: number;
  averageRating: number;
  completedOrders: number;
  responseRate: number;
  creationsCount: number;
  totalLikes: number;
};

async function fetchTailorStats(tailorProfileId: string): Promise<TailorStats | null> {
  const profile = await prisma.tailorProfile.findUnique({
    where: { id: tailorProfileId },
    select: {
      viewsCount: true,
      whatsappClicks: true,
      reviewsCount: true,
      averageRating: true,
      completedOrders: true,
      responseRate: true,
      posts: {
        where: { isPublished: true },
        select: { likesCount: true },
      },
    },
  });

  if (!profile) return null;

  const totalLikes = profile.posts.reduce((sum, post) => sum + post.likesCount, 0);

  return {
    viewsCount: profile.viewsCount,
    whatsappClicks: profile.whatsappClicks,
    reviewsCount: profile.reviewsCount,
    averageRating: profile.averageRating,
    completedOrders: profile.completedOrders,
    responseRate: profile.responseRate,
    creationsCount: profile.posts.length,
    totalLikes,
  };
}

export async function getTailorStats(tailorProfileId: string): Promise<TailorStats | null> {
  if (getDataSourceMode() !== "prisma") {
    return {
      viewsCount: 0,
      whatsappClicks: 0,
      reviewsCount: 0,
      averageRating: 0,
      completedOrders: 0,
      responseRate: 0,
      creationsCount: 0,
      totalLikes: 0,
    };
  }
  return withPrismaRetry(() => fetchTailorStats(tailorProfileId));
}

export async function incrementTailorProfileView(tailorProfileId: string): Promise<void> {
  if (getDataSourceMode() !== "prisma") return;

  await withPrismaRetry(() =>
    prisma.tailorProfile.update({
      where: { id: tailorProfileId },
      data: { viewsCount: { increment: 1 } },
    }),
  );
}

export async function incrementTailorWhatsappClick(tailorProfileId: string): Promise<void> {
  if (getDataSourceMode() !== "prisma") return;

  await withPrismaRetry(() =>
    prisma.tailorProfile.update({
      where: { id: tailorProfileId },
      data: { whatsappClicks: { increment: 1 } },
    }),
  );
}
