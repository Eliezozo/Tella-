import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/ui/section-heading";

const filters = ["Ville", "Type de vêtement", "Style", "Prix", "Délai", "Disponibilité"];

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-padding">
        <div className="container-width space-y-8">
          <SectionHeading
            eyebrow="Recherche"
            title="Un moteur de recherche prêt pour la découverte locale"
            description="Cette page prépare l’étape suivante: filtres multi-critères, SEO local et résultats personnalisés."
          />
          <div className="surface-card rounded-[32px] p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filters.map((filter) => (
                <div key={filter} className="rounded-[24px] border border-border bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Filtre
                  </p>
                  <p className="mt-3 text-lg font-semibold text-secondary">{filter}</p>
                  <div className="skeleton mt-4 h-11 rounded-xl bg-surface" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
