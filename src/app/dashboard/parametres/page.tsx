import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardSettingsPage() {
  return (
    <DashboardShell
      title="Paramètres"
      description="Identité atelier, abonnements, disponibilité et préférences WhatsApp."
    >
      <div className="surface-card p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {["Nom d'atelier", "Ville", "Numéro WhatsApp", "Description", "Spécialités", "Disponibilité"].map(
            (field) => (
              <div key={field} className="rounded-md border border-border bg-background p-4">
                <p className="text-sm font-medium text-foreground">{field}</p>
                <div className="skeleton mt-3 h-10 rounded-md bg-surface" />
              </div>
            ),
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
