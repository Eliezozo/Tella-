import { DashboardShell } from "@/components/layout/dashboard-shell";

const orders = [
  ["CMD-104", "Robe cérémonie corail", "en cours"],
  ["CMD-105", "Uniforme scolaire premium", "en attente"],
  ["CMD-106", "Ensemble homme graphite", "livré"],
];

export default function DashboardOrdersPage() {
  return (
    <DashboardShell
      title="Commandes"
      description="Le flux de commandes est structuré pour évoluer vers un vrai suivi par statut, paiement et livraison."
    >
      <div className="surface-card rounded-[28px] p-6">
        <div className="grid gap-4">
          {orders.map(([id, label, status]) => (
            <div
              key={id}
              className="flex flex-col justify-between gap-4 rounded-[24px] border border-border bg-white p-5 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{id}</p>
                <p className="mt-2 text-lg font-semibold text-secondary">{label}</p>
              </div>
              <span className="rounded-full bg-secondary/8 px-4 py-2 text-sm font-medium text-secondary">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
