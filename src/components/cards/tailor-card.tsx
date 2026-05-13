import Link from "next/link";

import type { TailorProfile } from "@/types";

export function TailorCard({ tailor }: { tailor: TailorProfile }) {
  return (
    <article className="surface-card rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {tailor.city}
          </p>
          <h3 className="mt-3 font-display text-2xl text-secondary">{tailor.atelierName}</h3>
          <p className="mt-2 text-sm text-muted">{tailor.heroLabel}</p>
        </div>
        <div className="rounded-2xl bg-primary/10 px-3 py-2 text-right text-xs font-medium text-primary">
          <p>{tailor.rating}/5</p>
          <p>{tailor.reviewsCount} avis</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted">{tailor.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tailor.specialties.map((specialty) => (
          <span
            key={specialty}
            className="rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-xs font-medium text-primary"
          >
            {specialty}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted">
          <p>{tailor.completedOrders} commandes terminées</p>
          <p>{tailor.responseRate}% de réponse</p>
        </div>
        <Link
          href={`/${tailor.handle}`}
          className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary/90"
        >
          Voir le profil
        </Link>
      </div>
    </article>
  );
}
