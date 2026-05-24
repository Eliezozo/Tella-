import { DashboardShell } from "@/components/layout/dashboard-shell";
import { toTailorProfilePath } from "@/lib/handle";
import { requireSession, requireTailorSession } from "@/lib/session";
import { getTailorById } from "@/services/tailor-service";

export default async function DashboardSettingsPage() {
  const session = await requireSession();
  const { user } = session;

  if (user.role === "TAILOR" && user.tailorProfileId) {
    const tailorSession = await requireTailorSession();
    const tailor = await getTailorById(user.tailorProfileId);

    if (!tailor) {
      return (
        <DashboardShell
          session={tailorSession}
          workspaceLabel="Mon atelier"
          title="Paramètres"
          description="Profil atelier introuvable."
        >
          <p className="surface-card p-5 text-sm text-muted">
            Reconnectez-vous ou contactez le support Tella.
          </p>
        </DashboardShell>
      );
    }

    const fields = [
      { label: "Nom de l'atelier", value: tailor.atelierName },
      { label: "Ville", value: tailor.city },
      { label: "Numéro WhatsApp", value: tailor.whatsapp },
      { label: "Accroche", value: tailor.heroLabel },
      { label: "Description", value: tailor.description },
      { label: "Spécialités", value: tailor.specialties.join(", ") },
    ];

    return (
      <DashboardShell
        session={tailorSession}
        workspaceLabel="Mon atelier"
        title="Paramètres de l'atelier"
        description="Modifiez les informations affichées sur votre vitrine publique."
      >
        <div className="surface-card p-5">
          <p className="mb-4 text-sm text-muted">
            Les champs ci-dessous reflètent votre profil actuel. L&apos;enregistrement sera
            disponible dans une prochaine version.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="rounded-md border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {field.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{field.value}</p>
              </div>
            ))}
          </div>
          {user.handle ? (
            <p className="mt-5 text-sm text-muted">
              Vitrine publique :{" "}
              <a href={toTailorProfilePath(user.handle)} className="font-semibold text-primary hover:underline">
                {user.handle}
              </a>
            </p>
          ) : null}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      session={session}
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
