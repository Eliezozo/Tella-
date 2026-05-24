import { redirect } from "next/navigation";

import { PendingTailorsList } from "@/components/dashboard/pending-tailors-list";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSession } from "@/lib/session";
import { listPendingTailorRegistrations } from "@/services/admin-service";

export default async function DashboardDemandesPage() {
  const session = await requireSession();

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const pending = await listPendingTailorRegistrations();

  return (
    <DashboardShell
      session={session}
      title="Demandes d'inscription atelier"
      description="Validez les nouvelles couturières avant qu'elles puissent se connecter et publier leur vitrine."
    >
      <div className="surface-card border border-primary/15 bg-primary-soft/30 p-4 text-sm text-foreground">
        <p className="font-semibold">Comment ça fonctionne</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted">
          <li>Chaque inscription crée un compte avec statut « en attente » en base.</li>
          <li>
            <strong className="text-foreground">Approuver le compte</strong> : la couturière
            peut se connecter à /login.
          </li>
          <li>
            <strong className="text-foreground">Approuver + publier</strong> : connexion +
            profil visible sur Explore et recherche.
          </li>
        </ul>
      </div>

      <PendingTailorsList items={pending} />
    </DashboardShell>
  );
}
