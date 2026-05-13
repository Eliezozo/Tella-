import { DashboardShell } from "@/components/layout/dashboard-shell";

const stats = [
  ["Vues profil", "5 240", "+12% cette semaine"],
  ["Clics WhatsApp", "318", "Canal principal d’acquisition"],
  ["Commandes", "42", "11 en cours de production"],
  ["Avis", "126", "Note moyenne 4.9/5"],
];

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Overview"
      description="Vue d’ensemble opérationnelle pour suivre la visibilité, les clics WhatsApp et les commandes."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, note]) => (
          <article key={label} className="surface-card rounded-[28px] p-6">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-3 font-display text-4xl text-secondary">{value}</p>
            <p className="mt-3 text-sm text-primary">{note}</p>
          </article>
        ))}
      </div>
      <div className="surface-card rounded-[28px] p-6">
        <p className="text-sm font-semibold text-secondary">Activité récente</p>
        <div className="mt-5 space-y-4 text-sm text-muted">
          <p>Commande mariage confirmée pour samedi prochain.</p>
          <p>12 nouveaux clics WhatsApp depuis le statut partagé ce matin.</p>
          <p>3 avis reçus après livraison sur Lomé.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
