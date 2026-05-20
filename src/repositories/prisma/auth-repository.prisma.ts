import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { AuthRepository } from "@/repositories/types";

function normalizeIdentifier(value: string) {
  return value.trim();
}

export const prismaAuthRepository: AuthRepository = {
  async findByIdentifier(identifier) {
    const trimmed = normalizeIdentifier(identifier);
    const row = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: trimmed, mode: "insensitive" } },
          { phone: trimmed },
        ],
      },
      include: { tailorProfile: true },
    });

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      phone: row.phone,
      name: row.name,
      passwordHash: row.passwordHash,
      role: row.role,
      tailorProfileId: row.tailorProfile?.id ?? null,
      handle: row.tailorProfile?.handle ?? null,
    };
  },

  async findByEmail(email) {
    const row = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    return row;
  },

  async getAllHandles() {
    const rows = await prisma.tailorProfile.findMany({ select: { handle: true } });
    return rows.map((r) => r.handle);
  },

  async registerTailor(payload) {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: payload.atelierName,
          email: payload.email,
          phone: payload.whatsapp,
          passwordHash: payload.passwordHash,
          role: UserRole.TAILOR,
        },
      });

      const profile = await tx.tailorProfile.create({
        data: {
          userId: user.id,
          handle: payload.handle,
          atelierName: payload.atelierName,
          city: payload.city,
          bio: payload.description,
          heroLabel: `Découvrez ${payload.atelierName}`,
          whatsapp: payload.whatsapp,
          specialties: payload.specialties,
          isPublished: false,
        },
      });

      return {
        userId: user.id,
        tailorProfileId: profile.id,
        handle: profile.handle,
      };
    });

    return result;
  },
};
