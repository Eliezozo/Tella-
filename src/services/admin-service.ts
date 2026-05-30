import { getDataSourceMode } from "@/lib/data-source";
import { notifyTailorAccountApproved } from "@/lib/notifications/notify-tailor-approved";
import { prisma } from "@/lib/prisma";
import { withPrismaRetry } from "@/lib/prisma-retry";
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
  if (getDataSourceMode() !== "prisma") {
    return listPendingTailorsInMock();
  }
  return withPrismaRetry(listPendingTailorRegistrationsFromPrisma);
}

export async function approveTailorProfile(tailorProfileId: string) {
  if (getDataSourceMode() === "prisma") {
    const profile = await withPrismaRetry(() =>
      prisma.tailorProfile.update({
        where: { id: tailorProfileId },
        data: { isApproved: true },
        include: { user: { select: { email: true } } },
      }),
    );

    if (profile.user.email) {
      void notifyTailorAccountApproved({
        email: profile.user.email,
        atelierName: profile.atelierName,
        handle: profile.handle,
        isPublished: profile.isPublished,
      }).catch((error) => {
        console.warn("[approveTailorProfile] email couturière non envoyé:", error);
      });
    }
    return;
  }
  approveTailorInMock(tailorProfileId);
}

export async function publishTailorProfile(tailorProfileId: string) {
  if (getDataSourceMode() === "prisma") {
    const profile = await withPrismaRetry(() =>
      prisma.tailorProfile.update({
        where: { id: tailorProfileId },
        data: { isApproved: true, isPublished: true },
        include: { user: { select: { email: true } } },
      }),
    );

    if (profile.user.email) {
      void notifyTailorAccountApproved({
        email: profile.user.email,
        atelierName: profile.atelierName,
        handle: profile.handle,
        isPublished: true,
      }).catch((error) => {
        console.warn("[publishTailorProfile] email couturière non envoyé:", error);
      });
    }
    return;
  }
  publishTailorInMock(tailorProfileId);
}
