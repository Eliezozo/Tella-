import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSession, requireTailorSession } from "@/lib/session";
import { getAdminDashboardStats } from "@/services/admin-dashboard-service";
import { getTailorStats } from "@/services/tailor-stats-service";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default async function DashboardStatsPage() {
  const session = await requireSession();
  const isTailor = session.user.role === "TAILOR" && session.user.tailorProfileId;
  const tailorSession = isTailor ? await requireTailorSession() : session;

  const [adminStats, tailorStats] = await Promise.all([
    !isTailor ? getAdminDashboardStats() : Promise.resolve(null),
    isTailor && session.user.tailorProfileId
      ? getTailorStats(session.user.tailorProfileId)
      : Promise.resolve(null),
  ]);

  return (
    <DashboardShell
      session={tailorSession}
      workspaceLabel={isTailor ? "Mon atelier" : undefined}
      title="Statistiques"
      description={
        isTailor
          ? "Vues de votre vitrine, clics WhatsApp et performance de vos créations."
          : "Indicateurs agrégés de la plateforme depuis la base de données."
      }
    >
      {isTailor && tailorStats ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Vues vitrine", formatNumber(tailorStats.viewsCount), "Visites de votre profil public"],
              ["Clics WhatsApp", formatNumber(tailorStats.whatsappClicks), "Contacts depuis Tella"],
              ["Créations", formatNumber(tailorStats.creationsCount), `${formatNumber(tailorStats.totalLikes)} favoris`],
              ["Note moyenne", `${tailorStats.averageRating.toFixed(1)}/5`, `${tailorStats.reviewsCount} avis`],
            ].map(([label, value, note]) => (
              <article key={label} className="surface-card p-5">
                <p className="text-xs text-muted">{label}</p>
                <p className="heading-display mt-2 text-3xl">{value}</p>
                <p className="mt-2 text-xs text-primary">{note}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-foreground">Engagement clientes</p>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p>{formatNumber(tailorStats.completedOrders)} clientes accompagnées</p>
                <p>{tailorStats.responseRate}% de taux de réponse</p>
                <p>{formatNumber(tailorStats.whatsappClicks)} demandes via WhatsApp</p>
              </div>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-foreground">Conseil Tella</p>
              <p className="mt-4 text-sm leading-7 text-muted">
                Ajoutez des photos de qualité et complétez votre profil pour augmenter vos vues
                et vos contacts WhatsApp. Les chiffres se mettent à jour automatiquement.
              </p>
            </div>
          </div>
        </>
      ) : isTailor ? (
        <div className="surface-card p-5 text-sm text-muted">
          Statistiques indisponibles pour le moment.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Activité plateforme</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>{adminStats?.totalProfileViews ?? 0} vues de profils atelier</p>
              <p>{adminStats?.totalCreations ?? 0} créations publiées</p>
              <p>{adminStats?.publishedTailors ?? 0} vitrines actives</p>
            </div>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Comptes</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>{adminStats?.totalTailors ?? 0} ateliers inscrits</p>
              <p>{adminStats?.pendingTailors ?? 0} inscriptions en attente</p>
              <p>{adminStats?.totalClients ?? 0} clientes inscrites</p>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
