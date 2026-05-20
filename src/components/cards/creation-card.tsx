import Link from "next/link";

import { OptimizedImage } from "@/components/ui/optimized-image";
import { Badge } from "@/components/ui/badge";
import { categoryLabels } from "@/lib/constants/categories";
import { formatCurrency } from "@/lib/utils";
import type { Creation } from "@/types";
import { cn } from "@/lib/utils";

export function CreationCard({
  creation,
  atelierName,
}: {
  creation: Creation;
  atelierName?: string;
}) {
  return (
    <Link
      href={`/boutique/${creation.slug}`}
      className="group surface-card block overflow-hidden transition-opacity hover:opacity-95"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {creation.imageUrl ? (
          <OptimizedImage
            src={creation.imageUrl}
            alt={creation.title}
            fill
            sizes="400px"
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className={cn("h-full w-full bg-surface-strong", creation.imageClassName)} />
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="primary">{categoryLabels[creation.category]}</Badge>
            <h3 className="heading-display mt-2 text-base">{creation.title}</h3>
            {atelierName ? <p className="mt-0.5 text-xs text-muted">{atelierName}</p> : null}
          </div>
          <span className="text-xs font-medium text-secondary">{creation.turnaround}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            {creation.priceFrom ? `Dès ${formatCurrency(creation.priceFrom)}` : "Prix sur demande"}
          </span>
          <span className="text-muted">{creation.likes} favoris</span>
        </div>
      </div>
    </Link>
  );
}
