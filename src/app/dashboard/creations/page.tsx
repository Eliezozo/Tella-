import Link from "next/link";

import { AddCreationCard } from "@/components/dashboard/add-creation-card";
import { CreationCard } from "@/components/cards/creation-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSession, requireTailorSession } from "@/lib/session";
import { getCreationsByTailorId } from "@/services/creation-service";
import { getAllCreations } from "@/services/discovery-service";
import { getTailorById } from "@/services/tailor-service";

export default async function DashboardCreationsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const session = await requireSession();
  const { user } = session;
  const params = await searchParams;
  const justCreated = params.created === "1";

  if (user.role === "TAILOR" && user.tailorProfileId) {
    const tailorSession = await requireTailorSession();
    const tailor = await getTailorById(user.tailorProfileId);
    const creations = await getCreationsByTailorId(user.tailorProfileId);

    return (
      <DashboardShell
        session={tailorSession}
        workspaceLabel="Mon atelier"
        title="Mes créations"
        description="Catalogue affiché sur votre vitrine publique. Ajoutez des pièces pour enrichir votre collection."
      >
        {justCreated ? (
          <div className="mb-6 rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
            Création publiée avec succès. Elle est visible sur votre vitrine.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AddCreationCard />
          {creations.map((creation) => (
            <div key={creation.id} className="space-y-2">
              <CreationCard creation={creation} atelierName={tailor?.atelierName} />
              <div className="flex gap-2 px-1">
                <Link
                  href={`/boutique/${creation.slug}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Vitrine →
                </Link>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-muted">{creation.turnaround}</span>
              </div>
            </div>
          ))}
        </div>

        {creations.length === 0 ? (
          <p className="text-sm text-muted">Aucune création pour le moment. Ajoutez votre première pièce.</p>
        ) : null}
      </DashboardShell>
    );
  }

  const creations = await getAllCreations();
  const preview = creations.slice(0, 4);
  const cards = await Promise.all(
    preview.map(async (creation) => {
      const tailor = await getTailorById(creation.tailorId);
      return { creation, atelierName: tailor?.atelierName };
    }),
  );

  return (
    <DashboardShell
      session={session}
      title="Collections"
      description="Gestion du portfolio et du catalogue de modèles."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map(({ creation, atelierName }) => (
          <CreationCard key={creation.id} creation={creation} atelierName={atelierName} />
        ))}
      </div>
    </DashboardShell>
  );
}
