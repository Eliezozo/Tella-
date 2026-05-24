import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSession, requireTailorSession } from "@/lib/session";

export default async function DashboardStatsPage() {
  const session = await requireSession();
  const isTailor = session.user.role === "TAILOR" && session.user.tailorProfileId;
  const tailorSession = isTailor ? await requireTailorSession() : session;

  return (
    <DashboardShell
      session={tailorSession}
      workspaceLabel={isTailor ? "Mon atelier" : undefined}
      title="Statistiques"
      description={
        isTailor
          ? "Vues de votre vitrine, clics WhatsApp et performance de vos créations."
          : "Indicateurs: vues profil, conversion WhatsApp, sources de trafic et performance des créations."
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-foreground">Sources de trafic</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>WhatsApp: 58%</p>
            <p>Recherche Tella: 24%</p>
            <p>Partages directs: 18%</p>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-foreground">Conversions clés</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>Visite → clic WhatsApp: 6.1%</p>
            <p>Clic WhatsApp → commande: 14.8%</p>
            <p>Commande → avis: 42%</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
