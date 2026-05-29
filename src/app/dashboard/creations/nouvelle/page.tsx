import { CreationForm } from "@/components/dashboard/creation-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireTailorSession } from "@/lib/session";

export default async function NewCreationPage() {
  const session = await requireTailorSession();

  return (
    <DashboardShell
      session={session}
      workspaceLabel="Mon atelier"
      title="Ajouter une création"
      description="Publiez une pièce dans votre collection : photo, prix indicatif, tailles et description pour votre vitrine Tella."
    >
      <CreationForm />
    </DashboardShell>
  );
}
