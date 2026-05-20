import Link from "next/link";

import { TailorCard } from "@/components/cards/tailor-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedTailors } from "@/services/discovery-service";

export async function FeaturedTailorsSection() {
  const featuredTailors = await getFeaturedTailors();

  return (
    <section className="section-padding">
      <div className="container-width space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Ateliers visibles"
            title="Des profils crédibles, structurés et faciles à comparer"
            description="Nom, localisation, spécialités, collections et contact direct — tout ce qu'une cliente a besoin de voir."
          />
          <Link
            href="/explore"
            className="shrink-0 text-sm font-semibold text-primary hover:text-primary-strong"
          >
            Voir tous les ateliers →
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredTailors.map((tailor) => (
            <TailorCard key={tailor.id} tailor={tailor} />
          ))}
        </div>
      </div>
    </section>
  );
}
