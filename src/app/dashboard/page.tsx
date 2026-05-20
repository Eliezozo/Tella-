import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSession } from "@/lib/session";
import { getTailorById } from "@/services/tailor-service";

export default async function DashboardPage() {
  const session = await requireSession();
  const { user } = session;

  if (user.role === "TAILOR" && user.tailorProfileId) {
    const tailor = await getTailorById(user.tailorProfileId);
    const handleLabel = user.handle ?? tailor?.handle ?? "—";

    return (
      <DashboardShell
        session={session}
        title={`Bienvenue, ${user.name ?? "couturière"}`}
        description="Suivez la visibilité de votre atelier, vos créations et les contacts WhatsApp depuis votre espace Tella."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Profil public", handleLabel, "Visible sur la marketplace"],
            ["Note moyenne", tailor ? `${tailor.rating}/5` : "—", `${tailor?.reviewsCount ?? 0} avis`],
            ["Commandes terminées", String(tailor?.completedOrders ?? 0), "Historique atelier"],
            ["Taux de réponse", tailor ? `${tailor.responseRate}%` : "—", "WhatsApp & messages"],
          ].map(([label, value, note]) => (
            <article key={label} className="surface-card p-5">
              <p className="text-xs text-muted">{label}</p>
              <p className="heading-display mt-2 text-3xl">{value}</p>
              <p className="mt-2 text-xs text-primary">{note}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Prochaines actions</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>Complétez vos créations dans l&apos;onglet « Mes créations ».</p>
              <p>Partagez votre profil {handleLabel} sur WhatsApp Status.</p>
              <p>Abonnement : contactez l&apos;équipe Tella pour activer la visibilité premium.</p>
            </div>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Canal principal</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>Les clientes vous contactent via le bouton WhatsApp sur votre profil.</p>
              <p>Ville : {tailor?.city ?? "—"}</p>
              <p>Spécialités : {tailor?.specialties.join(", ") ?? "—"}</p>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const stats = [
    ["Couturières abonnées", "48", "+6 ce mois"],
    ["Abonnements actifs", "41", "7 à relancer"],
    ["Utilisatrices clientes", "1 284", "+18% ce mois"],
    ["Demandes envoyées", "318", "Canal principal: WhatsApp"],
  ];

  return (
    <DashboardShell
      session={session}
      title="Vue d'ensemble admin"
      description="Suivi des couturières inscrites, abonnements et activité générée par chaque atelier."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, note]) => (
          <article key={label} className="surface-card p-5">
            <p className="text-xs text-muted">{label}</p>
            <p className="heading-display mt-2 text-3xl">{value}</p>
            <p className="mt-2 text-xs text-primary">{note}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-foreground">Suivi des ateliers</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>Atelier Ama: abonnement annuel actif jusqu&apos;au 30 juin 2026.</p>
            <p>Studio Kekeli: relance trimestrielle à faire.</p>
            <p>Mawufe Design: 84 nouvelles vues profil cette semaine.</p>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm font-semibold text-foreground">Performance plateforme</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>Top canal: WhatsApp direct depuis les profils.</p>
            <p>Top recherche: robes cérémonie et traditionnel.</p>
            <p>Paiements: suivi manuel côté administration.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
