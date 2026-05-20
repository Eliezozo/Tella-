import Link from "next/link";

import { OptimizedImage } from "@/components/ui/optimized-image";
import { Badge } from "@/components/ui/badge";
import type { TailorProfile } from "@/types";

export function TailorCard({ tailor }: { tailor: TailorProfile }) {
  return (
    <article className="group surface-card overflow-hidden transition-opacity hover:opacity-95">
      <div className="relative h-36 w-full">
        {tailor.coverUrl ? (
          <OptimizedImage src={tailor.coverUrl} alt={`Atelier ${tailor.atelierName}`} fill sizes="400px" />
        ) : (
          <div className="h-full w-full bg-surface-strong" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/50 to-transparent" />
        {tailor.avatarUrl ? (
          <div className="absolute -bottom-5 left-4 h-12 w-12 overflow-hidden rounded-md border-2 border-surface">
            <OptimizedImage src={tailor.avatarUrl} alt={tailor.atelierName} fill sizes="48px" />
          </div>
        ) : null}
      </div>

      <div className="p-5 pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="primary">{tailor.city}</Badge>
            <h3 className="heading-display mt-2 text-xl">{tailor.atelierName}</h3>
            <p className="mt-1 text-sm text-muted">{tailor.heroLabel}</p>
          </div>
          <div className="text-right text-xs font-medium text-secondary">
            <p>{tailor.rating}/5</p>
            <p>{tailor.reviewsCount} avis</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{tailor.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tailor.specialties.map((specialty) => (
            <Badge key={specialty} variant="default">
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="text-xs text-muted">
            <p>{tailor.completedOrders} clientes</p>
            <p>{tailor.responseRate}% réponse</p>
          </div>
          <Link
            href={`/${tailor.handle}`}
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-strong"
          >
            Voir le profil
          </Link>
        </div>
      </div>
    </article>
  );
}
