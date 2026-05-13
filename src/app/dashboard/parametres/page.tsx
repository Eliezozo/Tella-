import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardSettingsPage() {
  return (
    <DashboardShell
      title="Paramètres"
      description="Prévu pour gérer identité atelier, abonnements, disponibilité, préférences WhatsApp et options de visibilité premium."
    >
      <div className="surface-card rounded-[28px] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {["Nom d’atelier", "Ville", "Numéro WhatsApp", "Description", "Spécialités", "Disponibilité"].map(
            (field) => (
              <div key={field} className="rounded-[24px] border border-border bg-white p-5">
                <p className="text-sm font-medium text-secondary">{field}</p>
                <div className="skeleton mt-4 h-11 rounded-xl bg-surface" />
              </div>
            ),
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
