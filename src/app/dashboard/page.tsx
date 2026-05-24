import Link from "next/link";

import { AddCreationCard } from "@/components/dashboard/add-creation-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { toTailorProfilePath } from "@/lib/handle";
import { requireSession } from "@/lib/session";
import { getCreationsByTailorId } from "@/services/creation-service";
import { getTailorById } from "@/services/tailor-service";

export default async function DashboardPage() {
  const session = await requireSession();
  const { user } = session;

  if (user.role === "TAILOR" && user.tailorProfileId) {
    const tailorSession = session;
    const tailor = await getTailorById(user.tailorProfileId);
    const handleLabel = user.handle ?? tailor?.handle ?? "—";
    const creations = await getCreationsByTailorId(user.tailorProfileId);

    return (
      <DashboardShell
        session={tailorSession}
        workspaceLabel="Mon atelier"
        title={tailor?.atelierName ?? user.name ?? "Mon atelier"}
        description="Gérez votre vitrine, vos collections et les informations visibles par les clientes sur la marketplace."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Créations publiées", String(creations.length), "Dans votre catalogue"],
            ["Note moyenne", tailor ? `${tailor.rating}/5` : "—", `${tailor?.reviewsCount ?? 0} avis`],
            ["Clientes accompagnées", String(tailor?.completedOrders ?? 0), "Historique atelier"],
            ["Taux de réponse", tailor ? `${tailor.responseRate}%` : "—", "WhatsApp"],
          ].map(([label, value, note]) => (
            <article key={label} className="surface-card p-5">
              <p className="text-xs text-muted">{label}</p>
              <p className="heading-display mt-2 text-3xl">{value}</p>
              <p className="mt-2 text-xs text-primary">{note}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Actions rapides</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                href="/dashboard/creations"
                className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
              >
                Gérer mes créations
              </Link>
              <Link
                href="/dashboard/parametres"
                className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
              >
                Modifier mon atelier
              </Link>
              <Link
                href="/dashboard/statistiques"
                className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
              >
                Voir l&apos;audience
              </Link>
              {user.handle ? (
                <Link
                  href={toTailorProfilePath(user.handle)}
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                >
                  Prévisualiser la vitrine
                </Link>
              ) : null}
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-sm font-semibold text-foreground">Profil public</p>
            <p className="mt-2 text-sm text-muted">
              Identifiant : <span className="font-semibold text-primary">{handleLabel}</span>
            </p>
            <p className="mt-2 text-sm text-muted">Ville : {tailor?.city ?? "—"}</p>
            {user.handle ? (
              <Button href={toTailorProfilePath(user.handle)} variant="secondary" className="mt-4 w-full">
                Ouvrir la vitrine publique
              </Button>
            ) : null}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="heading-display text-xl">Dernières créations</h2>
            <Link href="/dashboard/creations" className="text-sm font-semibold text-primary hover:underline">
              Tout voir →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AddCreationCard />
            {creations.slice(0, 2).map((creation) => (
              <article key={creation.id} className="surface-card p-4">
                <p className="text-sm font-semibold text-foreground">{creation.title}</p>
                <p className="mt-1 text-xs text-muted">{creation.turnaround}</p>
                <Link
                  href={`/boutique/${creation.slug}`}
                  className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  Voir sur la vitrine →
                </Link>
              </article>
            ))}
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
