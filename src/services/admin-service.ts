import { getDataSourceMode } from "@/lib/data-source";
import { prisma } from "@/lib/prisma";
import { withPrismaRetry } from "@/lib/prisma-retry";
import { withPrismaFallback } from "@/lib/with-prisma-fallback";
import {
  approveTailorInMock,
  listPendingTailorsInMock,
  publishTailorInMock,
} from "@/repositories/mock/admin-repository.mock";

export type PendingTailorRegistration = {
  id: string;
  handle: string;
  atelierName: string;
  city: string;
  email: string | null;
  whatsapp: string;
  createdAt: Date;
  isApproved: boolean;
  isPublished: boolean;
};

async function listPendingTailorRegistrationsFromPrisma(): Promise<PendingTailorRegistration[]> {
  const rows = await prisma.tailorProfile.findMany({
    where: { isApproved: false },
    include: {
      user: { select: { email: true, createdAt: true } },
    },
    orderBy: { user: { createdAt: "desc" } },
  });

  return rows.map((row) => ({
    id: row.id,
    handle: row.handle,
    atelierName: row.atelierName,
    city: row.city,
    email: row.user.email,
    whatsapp: row.whatsapp,
    createdAt: row.user.createdAt,
    isApproved: row.isApproved,
    isPublished: row.isPublished,
  }));
}

export async function listPendingTailorRegistrations(): Promise<PendingTailorRegistration[]> {
  return withPrismaFallback(
    () => withPrismaRetry(listPendingTailorRegistrationsFromPrisma),
    () => Promise.resolve(listPendingTailorsInMock()),
  );
}

export async function approveTailorProfile(tailorProfileId: string) {
  if (getDataSourceMode() === "prisma") {
    await withPrismaRetry(() =>
      prisma.tailorProfile.update({
        where: { id: tailorProfileId },
        data: { isApproved: true },
      }),
    );
    return;
  }
  approveTailorInMock(tailorProfileId);
}

export async function publishTailorProfile(tailorProfileId: string) {
  if (getDataSourceMode() === "prisma") {
    await withPrismaRetry(() =>
      prisma.tailorProfile.update({
        where: { id: tailorProfileId },
        data: { isApproved: true, isPublished: true },
      }),
    );
    return;
  }
  publishTailorInMock(tailorProfileId);
}
