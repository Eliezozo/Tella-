import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardStatsPage() {
  return (
    <DashboardShell
      title="Statistiques"
      description="Espace réservé aux indicateurs détaillés: vues profil, conversion WhatsApp, sources de trafic et performance des créations."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card rounded-[28px] p-6">
          <p className="text-sm font-semibold text-secondary">Sources de trafic</p>
          <div className="mt-6 space-y-4 text-sm text-muted">
            <p>WhatsApp: 58%</p>
            <p>Recherche Tella: 24%</p>
            <p>Partages directs: 18%</p>
          </div>
        </div>
        <div className="surface-card rounded-[28px] p-6">
          <p className="text-sm font-semibold text-secondary">Conversions clés</p>
          <div className="mt-6 space-y-4 text-sm text-muted">
            <p>Visite → clic WhatsApp: 6.1%</p>
            <p>Clic WhatsApp → commande: 14.8%</p>
            <p>Commande → avis: 42%</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
