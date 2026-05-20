import Link from "next/link";

import { CreationCard } from "@/components/cards/creation-card";
import { TailorCard } from "@/components/cards/tailor-card";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { categoryLabels } from "@/lib/constants/categories";
import { getAllCities, searchCreations, searchTailors } from "@/services/discovery-service";
import { getTailorById } from "@/services/tailor-service";
import type { CategoryKey } from "@/types";

import type { ReactNode } from "react";

type SearchParams = {
  q?: string;
  city?: string;
  category?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim();
  const city = params.city?.trim();
  const category = params.category as CategoryKey | undefined;

  const [tailors, results, cities] = await Promise.all([
    searchTailors({ query, city }),
    searchCreations({ query, category }),
    getAllCities(),
  ]);

  const creationCards = await Promise.all(
    results.map(async (creation) => {
      const tailor = await getTailorById(creation.tailorId);
      return { creation, atelierName: tailor?.atelierName };
    }),
  );

  const categories = Object.entries(categoryLabels) as [CategoryKey, string][];

  return (
    <PageShell>
      <section className="section-padding">
        <div className="container-width space-y-8">
          <SectionHeading
            eyebrow="Recherche"
            title="Trouvez l'atelier ou la création qu'il vous faut"
            description="Filtrez par ville, catégorie ou mot-clé pour accélérer votre découverte."
          />

          <form className="surface-card p-5 sm:p-6" action="/search" method="get">
            <label htmlFor="q" className="eyebrow">
              Rechercher
            </label>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Robe, mariage, atelier..."
                className="min-h-11 flex-1 rounded-md border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
              >
                Rechercher
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="eyebrow">Ville</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cities.map((item) => (
                    <LinkBadge
                      key={item}
                      href={`/search?${buildParams({ q: query, city: item, category })}`}
                      active={city === item}
                    >
                      {item}
                    </LinkBadge>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">Catégorie</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map(([key, label]) => (
                    <LinkBadge
                      key={key}
                      href={`/search?${buildParams({ q: query, city, category: key })}`}
                      active={category === key}
                    >
                      {label}
                    </LinkBadge>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <div className="space-y-8">
            <div>
              <h2 className="heading-display text-xl">
                Ateliers ({tailors.length})
              </h2>
              {tailors.length > 0 ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  {tailors.map((tailor) => (
                    <TailorCard key={tailor.id} tailor={tailor} />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Aucun atelier trouvé pour ces critères.</p>
              )}
            </div>

            <div>
              <h2 className="heading-display text-xl">
                Créations ({results.length})
              </h2>
              {results.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {creationCards.map(({ creation, atelierName }) => (
                    <CreationCard
                      key={creation.id}
                      creation={creation}
                      atelierName={atelierName}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Aucune création trouvée pour ces critères.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function buildParams(filters: { q?: string; city?: string; category?: string }) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.city) params.set("city", filters.city);
  if (filters.category) params.set("category", filters.category);
  return params.toString();
}

function LinkBadge({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href}>
      <Badge variant={active ? "primary" : "default"}>{children}</Badge>
    </Link>
  );
}
