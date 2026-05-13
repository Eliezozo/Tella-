import { CreationCard } from "@/components/cards/creation-card";
import { TailorCard } from "@/components/cards/tailor-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { creations, tailorProfiles } from "@/lib/mock-data";

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-padding">
        <div className="container-width space-y-10">
          <SectionHeading
            eyebrow="Explore"
            title="Découvrir les ateliers et créations à forte visibilité"
            description="Version initiale de l’explore marketplace, structurée pour évoluer vers des filtres dynamiques, favoris et recommandations."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {tailorProfiles.map((tailor) => (
              <TailorCard key={tailor.id} tailor={tailor} />
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {creations.map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
