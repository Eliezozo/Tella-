import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/session";
import { getAdminSubscriptions } from "@/services/admin-dashboard-service";

const statusVariant = {
  actif: "success" as const,
  relance: "primary" as const,
  expiré: "default" as const,
};

export default async function DashboardOrdersPage() {
  const session = await requireSession();
  const subscriptions = await getAdminSubscriptions();

  return (
    <DashboardShell
      session={session}
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
        {subscriptions.length > 0 ? (
          <div className="divide-y divide-border">
            {subscriptions.map((row) => (
              <div
                key={row.id}
                className="grid gap-2 px-5 py-4 sm:grid-cols-[1.5fr_1fr_0.8fr_1fr] sm:items-center sm:gap-4"
              >
                <p className="text-sm font-semibold text-foreground">{row.atelierName}</p>
                <p className="text-sm text-muted">{row.planLabel}</p>
                <Badge variant={statusVariant[row.statusKey] ?? "default"}>
                  {row.statusLabel}
                </Badge>
                <p className="text-sm text-muted">{row.renewsAtLabel}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-sm text-muted">
            Aucun abonnement enregistré. Les abonnements apparaîtront ici lorsque des ateliers
            seront activés.
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
