import Link from "next/link";

import { TailorCard } from "@/components/cards/tailor-card";
import { CategoriesSection } from "@/components/landing/categories-section";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllCities, getAllTailors } from "@/services/discovery-service";

export default async function ExplorePage() {
  const [tailors, cities] = await Promise.all([getAllTailors(), getAllCities()]);

  return (
    <PageShell>
      <section className="section-padding">
        <div className="container-width space-y-8">
          <SectionHeading
            eyebrow="Explore"
            title="Trouvez votre couturière au Togo"
            description="Parcourez les ateliers et cliquez sur un profil pour découvrir ses créations."
          />

          <form
            action="/search"
            method="get"
            className="surface-card flex flex-col gap-2 p-4 sm:flex-row sm:p-5"
            role="search"
          >
            <label htmlFor="explore-q" className="sr-only">
              Rechercher une couturière
            </label>
            <input
              id="explore-q"
              name="q"
              type="search"
              placeholder="Nom d'atelier, ville, spécialité…"
              className="min-h-11 flex-1 rounded-md border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <CategoriesSection />

      <section className="section-padding border-t border-border">
        <div className="container-width space-y-10">
          <div>
            <p className="eyebrow">Filtrer par ville</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="primary">Toutes les villes</Badge>
              {cities.map((city) => (
                <Link key={city} href={`/search?city=${encodeURIComponent(city)}`}>
                  <Badge>{city}</Badge>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="heading-display text-xl">Ateliers ({tailors.length})</h2>
            <p className="mt-1 text-sm text-muted">
              Cliquez sur un atelier pour voir ses créations et le contacter via
              WhatsApp.
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {tailors.map((tailor) => (
                <TailorCard key={tailor.id} tailor={tailor} />
              ))}
            </div>
            {tailors.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Aucun atelier disponible pour le moment.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
