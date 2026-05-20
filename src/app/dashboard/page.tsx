import { DashboardShell } from "@/components/layout/dashboard-shell";

const stats = [
  ["Couturières abonnées", "48", "+6 ce mois"],
  ["Abonnements actifs", "41", "7 à relancer"],
  ["Utilisatrices clientes", "1 284", "+18% ce mois"],
  ["Demandes envoyées", "318", "Canal principal: WhatsApp"],
];

export default function DashboardPage() {
  return (
    <DashboardShell
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
