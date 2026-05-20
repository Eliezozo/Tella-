import { CreationCard } from "@/components/cards/creation-card";
import { TailorCard } from "@/components/cards/tailor-card";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllCreations, getAllCities, getAllTailors } from "@/services/discovery-service";
import { getTailorById } from "@/services/tailor-service";
import Link from "next/link";

export default async function ExplorePage() {
  const [tailors, creations, cities] = await Promise.all([
    getAllTailors(),
    getAllCreations(),
    getAllCities(),
  ]);

  const creationCards = await Promise.all(
    creations.map(async (creation) => {
      const tailor = await getTailorById(creation.tailorId);
      return { creation, atelierName: tailor?.atelierName };
    }),
  );

  return (
    <PageShell>
      <section className="section-padding">
        <div className="container-width space-y-10">
          <SectionHeading
            eyebrow="Explore"
            title="Ateliers et créations du Togo"
            description="Parcourez les profils de couturières et contactez-les via WhatsApp."
          />

          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Toutes les villes</Badge>
            {cities.map((city) => (
              <Link key={city} href={`/search?city=${encodeURIComponent(city)}`}>
                <Badge>{city}</Badge>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="heading-display text-xl">Ateliers</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {tailors.map((tailor) => (
                <TailorCard key={tailor.id} tailor={tailor} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="heading-display text-xl">Créations</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {creationCards.map(({ creation, atelierName }) => (
                <CreationCard
                  key={creation.id}
                  creation={creation}
                  atelierName={atelierName}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
