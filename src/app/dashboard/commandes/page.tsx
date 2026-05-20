import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";

const subscriptions = [
  ["Atelier Ama", "Plan annuel", "actif", "30 juin 2026"],
  ["Studio Kekeli", "Plan trimestriel", "relance", "15 avril 2026"],
  ["Mawufe Design", "Plan annuel", "actif", "12 août 2026"],
  ["Couture Lomé+", "Plan trimestriel", "expiré", "1 mars 2026"],
];

const statusVariant = {
  actif: "success" as const,
  relance: "primary" as const,
  expiré: "default" as const,
};

export default function DashboardOrdersPage() {
  return (
    <DashboardShell
      title="Abonnements couturières"
      description="Suivi des abonnements actifs, relances et renouvellements hors plateforme."
    >
      <div className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[1.5fr_1fr_0.8fr_1fr] gap-4 border-b border-border px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted sm:grid">
          <span>Atelier</span>
          <span>Plan</span>
          <span>Statut</span>
          <span>Échéance</span>
        </div>
        <div className="divide-y divide-border">
          {subscriptions.map(([name, plan, status, date]) => (
            <div
              key={name}
              className="grid gap-2 px-5 py-4 sm:grid-cols-[1.5fr_1fr_0.8fr_1fr] sm:items-center sm:gap-4"
            >
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-sm text-muted">{plan}</p>
              <Badge variant={statusVariant[status as keyof typeof statusVariant] ?? "default"}>
                {status}
              </Badge>
              <p className="text-sm text-muted">{date}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
