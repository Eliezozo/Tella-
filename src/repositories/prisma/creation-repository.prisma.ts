import {
  isCategoryKey,
  parseCreationMetadata,
} from "@/lib/mappers/discovery-mappers";
import { prisma } from "@/lib/prisma";
import type {
  CreateCreationPayload,
  CreationRepository,
  CreationSearchFilters,
} from "@/repositories/types";
import type { CategoryKey, Creation } from "@/types";

function mapPrismaPost(record: {
  id: string;
  slug: string;
  tailorProfileId: string;
  title: string;
  mediaUrl: string;
  priceFrom: number | null;
  turnaroundLabel: string | null;
  likesCount: number;
  metadata: unknown;
  category: { slug: string } | null;
}): Creation {
  const meta = parseCreationMetadata(record.metadata);
  const categorySlug = record.category?.slug ?? "robes";
  const category = isCategoryKey(categorySlug) ? categorySlug : "robes";

  return {
    id: record.id,
    tailorId: record.tailorProfileId,
    title: record.title,
    category,
    slug: record.slug,
    priceFrom: record.priceFrom ?? undefined,
    turnaround: record.turnaroundLabel ?? "Sur demande",
    likes: record.likesCount,
    imageClassName: meta.imageClassName ?? "from-surface-strong to-surface",
    imageUrl: record.mediaUrl,
    palette: meta.palette,
    composition: meta.composition,
    details: meta.details,
    mediaThumbnails: meta.mediaThumbnails,
    availableSizes: meta.availableSizes,
    selectedSize: meta.selectedSize,
  };
}

export const prismaCreationRepository: CreationRepository = {
  async findAll() {
    const rows = await prisma.post.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapPrismaPost);
  },

  async findRecent(limit) {
    const rows = await prisma.post.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(mapPrismaPost);
  },

  async findBySlug(slug) {
    const row = await prisma.post.findFirst({
      where: { slug, isPublished: true },
      include: { category: true },
    });
    return row ? mapPrismaPost(row) : null;
  },

  async findByTailorId(tailorId) {
    const rows = await prisma.post.findMany({
      where: { tailorProfileId: tailorId, isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapPrismaPost);
  },

  async findByTailorIdForOwner(tailorId) {
    const rows = await prisma.post.findMany({
      where: { tailorProfileId: tailorId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapPrismaPost);
  },

  async getSlugsForTailor(tailorId) {
    const rows = await prisma.post.findMany({
      where: { tailorProfileId: tailorId },
      select: { slug: true },
    });
    return rows.map((row) => row.slug);
  },

  async create(payload: CreateCreationPayload) {
    const category = await prisma.category.findUnique({
      where: { slug: payload.category },
    });

    const row = await prisma.post.create({
      data: {
        slug: payload.slug,
        tailorProfileId: payload.tailorProfileId,
        categoryId: category?.id,
        title: payload.title,
        description: payload.description,
        mediaUrl: payload.mediaUrl,
        mediaType: "image",
        priceFrom: payload.priceFrom,
        turnaroundLabel: payload.turnaroundLabel,
        isPublished: true,
        metadata: {
          imageClassName: "from-surface-strong to-surface",
          availableSizes: payload.availableSizes,
          details: payload.details,
        },
      },
      include: { category: true },
    });

    return mapPrismaPost(row);
  },

  async search(filters) {
    const { query, category } = filters;
    const rows = await prisma.post.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                {
                  tailorProfile: {
                    atelierName: { contains: query, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapPrismaPost);
  },
};
