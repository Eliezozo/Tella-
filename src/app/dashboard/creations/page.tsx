import { CreationCard } from "@/components/cards/creation-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { creations } from "@/lib/mock-data";

export default function DashboardCreationsPage() {
  return (
    <DashboardShell
      title="Créations"
      description="Gestion du portfolio et du catalogue de modèles avec base pour publication, disponibilité et prix optionnel."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {creations.slice(0, 4).map((creation) => (
          <CreationCard key={creation.id} creation={creation} />
        ))}
      </div>
    </DashboardShell>
  );
}
