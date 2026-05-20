import Link from "next/link";

import { OptimizedImage } from "@/components/ui/optimized-image";
import { categoryImages } from "@/lib/images";
import { categoryLabels } from "@/lib/constants/categories";
import type { CategoryKey } from "@/types";

export function CategoriesSection() {
  const entries = Object.entries(categoryLabels) as [CategoryKey, string][];

  return (
    <section className="section-padding border-t border-border">
      <div className="container-width">
        <p className="eyebrow">Catégories</p>
        <h2 className="heading-display heading-h2 mt-3 max-w-xl">
          Une découverte organisée par besoin
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([key, label]) => (
            <Link
              key={key}
              href={`/search?category=${key}`}
              className="group surface-card overflow-hidden transition-opacity hover:opacity-90"
            >
              <div className="relative h-36 min-h-[144px] w-full">
                <OptimizedImage src={categoryImages[key]} alt={label} fill sizes="300px" />
                <div className="absolute inset-0 bg-secondary-dark/40" />
                <p className="absolute bottom-3 left-3 heading-display text-lg text-on-primary">
                  {label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
