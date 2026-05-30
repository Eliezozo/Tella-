import { SubscriptionStatus } from "@prisma/client";

import { getDataSourceMode } from "@/lib/data-source";
import { prisma } from "@/lib/prisma";
import { withPrismaRetry } from "@/lib/prisma-retry";

export type AdminDashboardStats = {
  totalTailors: number;
  approvedTailors: number;
  pendingTailors: number;
  publishedTailors: number;
  activeSubscriptions: number;
  subscriptionsToRenew: number;
  totalClients: number;
  totalCreations: number;
  totalProfileViews: number;
};

export type AdminTailorHighlight = {
  id: string;
  atelierName: string;
  handle: string;
  city: string;
  viewsCount: number;
  isApproved: boolean;
  isPublished: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  planKey: string | null;
  renewsAt: Date | null;
};

export type AdminSubscriptionRow = {
  id: string;
  atelierName: string;
  handle: string;
  planLabel: string;
  statusLabel: string;
  statusKey: "actif" | "relance" | "expiré";
  renewsAtLabel: string;
};

const PLAN_LABELS: Record<string, string> = {
  quarterly: "Plan trimestriel",
  yearly: "Plan annuel",
};

const STATUS_LABELS: Record<
  SubscriptionStatus,
  { label: string; key: AdminSubscriptionRow["statusKey"] }
> = {
  ACTIVE: { label: "actif", key: "actif" },
  RELANCE: { label: "relance", key: "relance" },
  EXPIRED: { label: "expiré", key: "expiré" },
};

function formatFrenchDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function emptyStats(): AdminDashboardStats {
  return {
    totalTailors: 0,
    approvedTailors: 0,
    pendingTailors: 0,
    publishedTailors: 0,
    activeSubscriptions: 0,
    subscriptionsToRenew: 0,
    totalClients: 0,
    totalCreations: 0,
    totalProfileViews: 0,
  };
}

async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    totalTailors,
    approvedTailors,
    pendingTailors,
    publishedTailors,
    activeSubscriptions,
    subscriptionsToRenew,
    totalClients,
    totalCreations,
    viewsAggregate,
  ] = await Promise.all([
    prisma.tailorProfile.count(),
    prisma.tailorProfile.count({ where: { isApproved: true } }),
    prisma.tailorProfile.count({ where: { isApproved: false } }),
    prisma.tailorProfile.count({ where: { isPublished: true } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
    prisma.subscription.count({ where: { status: SubscriptionStatus.RELANCE } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.post.count(),
    prisma.tailorProfile.aggregate({ _sum: { viewsCount: true } }),
  ]);

  return {
    totalTailors,
    approvedTailors,
    pendingTailors,
    publishedTailors,
    activeSubscriptions,
    subscriptionsToRenew,
    totalClients,
    totalCreations,
    totalProfileViews: viewsAggregate._sum.viewsCount ?? 0,
  };
}

async function fetchAdminTailorHighlights(): Promise<AdminTailorHighlight[]> {
  const rows = await prisma.tailorProfile.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { subscription: true },
  });

  return rows.map((row) => ({
    id: row.id,
    atelierName: row.atelierName,
    handle: row.handle,
    city: row.city,
    viewsCount: row.viewsCount,
    isApproved: row.isApproved,
    isPublished: row.isPublished,
    subscriptionStatus: row.subscription?.status ?? null,
    planKey: row.subscription?.planKey ?? null,
    renewsAt: row.subscription?.renewsAt ?? null,
  }));
}

async function fetchAdminSubscriptions(): Promise<AdminSubscriptionRow[]> {
  const rows = await prisma.subscription.findMany({
    include: {
      tailorProfile: {
        select: { atelierName: true, handle: true },
      },
    },
    orderBy: { renewsAt: "asc" },
  });

  return rows.map((row) => {
    const status = STATUS_LABELS[row.status];
    return {
      id: row.id,
      atelierName: row.tailorProfile.atelierName,
      handle: row.tailorProfile.handle,
      planLabel: PLAN_LABELS[row.planKey] ?? row.planKey,
      statusLabel: status.label,
      statusKey: status.key,
      renewsAtLabel: formatFrenchDate(row.renewsAt),
    };
  });
}

async function runAdminQuery<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (getDataSourceMode() !== "prisma") {
    return fallback;
  }
  return withPrismaRetry(operation);
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  return runAdminQuery(fetchAdminDashboardStats, emptyStats());
}

export async function getAdminTailorHighlights(): Promise<AdminTailorHighlight[]> {
  return runAdminQuery(fetchAdminTailorHighlights, []);
}

export async function getAdminSubscriptions(): Promise<AdminSubscriptionRow[]> {
  return runAdminQuery(fetchAdminSubscriptions, []);
}

export function describeTailorHighlight(tailor: AdminTailorHighlight): string {
  if (!tailor.isApproved) {
    return "Inscription en attente de validation.";
  }

  if (!tailor.isPublished) {
    return "Compte approuvé — vitrine non publiée.";
  }

  if (tailor.subscriptionStatus === SubscriptionStatus.RELANCE) {
    return `Relance abonnement${tailor.renewsAt ? ` — échéance ${formatFrenchDate(tailor.renewsAt)}` : ""}.`;
  }

  if (tailor.subscriptionStatus === SubscriptionStatus.EXPIRED) {
    return "Abonnement expiré.";
  }

  if (tailor.viewsCount > 0) {
    return `${tailor.viewsCount} vue${tailor.viewsCount > 1 ? "s" : ""} profil enregistrée${tailor.viewsCount > 1 ? "s" : ""}.`;
  }

  return `Vitrine publiée à ${tailor.city}.`;
}
