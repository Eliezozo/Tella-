import { prisma } from "@/lib/prisma";
import type { TailorRepository, TailorSearchFilters } from "@/repositories/types";
import type { TailorProfile } from "@/types";

function mapPrismaTailor(record: {
  id: string;
  handle: string;
  atelierName: string;
  city: string;
  bio: string;
  heroLabel: string;
  whatsapp: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  specialties: string[];
  averageRating: number;
  reviewsCount: number;
  completedOrders: number;
  responseRate: number;
}): TailorProfile {
  return {
    id: record.id,
    handle: record.handle,
    atelierName: record.atelierName,
    city: record.city,
    description: record.bio,
    whatsapp: record.whatsapp,
    specialties: record.specialties,
    rating: record.averageRating,
    reviewsCount: record.reviewsCount,
    completedOrders: record.completedOrders,
    responseRate: record.responseRate,
    heroLabel: record.heroLabel,
    avatarUrl: record.avatarUrl ?? undefined,
    coverUrl: record.bannerUrl ?? undefined,
  };
}

const publicTailorWhere = { isApproved: true, isPublished: true } as const;

export const prismaTailorRepository: TailorRepository = {
  async findAll() {
    const rows = await prisma.tailorProfile.findMany({
      where: publicTailorWhere,
      orderBy: { atelierName: "asc" },
    });
    return rows.map(mapPrismaTailor);
  },

  async findFeatured(limit) {
    const rows = await prisma.tailorProfile.findMany({
      where: publicTailorWhere,
      orderBy: { viewsCount: "desc" },
      take: limit,
    });
    return rows.map(mapPrismaTailor);
  },

  async findByHandle(handle) {
    const normalized = handle.startsWith("@") ? handle : `@${handle}`;
    const row = await prisma.tailorProfile.findFirst({
      where: { handle: normalized, ...publicTailorWhere },
    });
    return row ? mapPrismaTailor(row) : null;
  },

  async findById(id) {
    const row = await prisma.tailorProfile.findUnique({ where: { id } });
    return row ? mapPrismaTailor(row) : null;
  },

  async search(filters) {
    const { query, city } = filters;
    const rows = await prisma.tailorProfile.findMany({
      where: {
        ...publicTailorWhere,
        ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
        ...(query
          ? {
              OR: [
                { atelierName: { contains: query, mode: "insensitive" } },
                { bio: { contains: query, mode: "insensitive" } },
                { heroLabel: { contains: query, mode: "insensitive" } },
                { specialties: { has: query } },
              ],
            }
          : {}),
      },
      orderBy: { atelierName: "asc" },
    });
    return rows.map(mapPrismaTailor);
  },

  async getCities() {
    const rows = await prisma.tailorProfile.findMany({
      where: publicTailorWhere,
      select: { city: true },
      distinct: ["city"],
    });
    return rows.map((r) => r.city);
  },
};
