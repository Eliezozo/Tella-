import { categoryLabels, tailorProfiles } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { Creation } from "@/types";

export function CreationCard({ creation }: { creation: Creation }) {
  const tailor = tailorProfiles.find((item) => item.id === creation.tailorId);

  return (
    <article className="surface-card overflow-hidden rounded-[24px]">
      <div className={`h-52 bg-gradient-to-br ${creation.imageClassName}`} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {categoryLabels[creation.category]}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-secondary">{creation.title}</h3>
            <p className="mt-1 text-sm text-muted">{tailor?.atelierName}</p>
          </div>
          <span className="rounded-full bg-secondary/6 px-3 py-1 text-xs font-medium text-secondary">
            {creation.turnaround}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-secondary">
            {creation.priceFrom ? `Dès ${formatCurrency(creation.priceFrom)}` : "Prix sur demande"}
          </span>
          <span className="text-muted">{creation.likes} favoris</span>
        </div>
      </div>
    </article>
  );
}
