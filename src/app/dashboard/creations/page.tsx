import { CreationCard } from "@/components/cards/creation-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getAllCreations } from "@/services/discovery-service";
import { getTailorById } from "@/services/tailor-service";

export default async function DashboardCreationsPage() {
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
