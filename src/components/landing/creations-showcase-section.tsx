import Link from "next/link";

import { CreationCard } from "@/components/cards/creation-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getRecentCreations } from "@/services/discovery-service";
import { getTailorById } from "@/services/tailor-service";

export async function CreationsShowcaseSection() {
  const recentCreations = await getRecentCreations();

  const cards = await Promise.all(
    recentCreations.map(async (creation) => {
      const tailor = await getTailorById(creation.tailorId);
      return { creation, atelierName: tailor?.atelierName };
    }),
  );

  return (
    <section className="section-padding bg-surface">
      <div className="container-width space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Collections"
            title="Découvrez les modèles avant d'écrire à la couturière"
            description="Robes, tenues traditionnelles, uniformes — explorez les créations des ateliers locaux."
          />
          <Link
            href="/explore"
            className="shrink-0 text-sm font-semibold text-primary hover:text-primary-strong"
          >
            Explorer les créations →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ creation, atelierName }) => (
            <CreationCard key={creation.id} creation={creation} atelierName={atelierName} />
          ))}
        </div>
      </div>
    </section>
  );
}
