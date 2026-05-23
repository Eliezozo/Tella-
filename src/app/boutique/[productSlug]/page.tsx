import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { categoryLabels } from "@/lib/constants/categories";
import { toTailorProfilePath } from "@/lib/handle";
import { buildWhatsappLink } from "@/hooks/build-whatsapp-link";
import { getCreationDetailPage } from "@/services/creation-service";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

function buildSizeGuide(sizes: string[]) {
  const map: Record<string, number> = { XS: 34, S: 36, M: 38, L: 40, XL: 42 };
  return sizes.map((size) => ({ brandSize: size, ukUs: map[size] ?? 38 }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const data = await getCreationDetailPage(productSlug);

  if (!data) {
    notFound();
  }

  const { product, tailor } = data;
  const availableSizes = product.availableSizes ?? ["XS", "S", "L", "XL"];
  const sizeGuide = buildSizeGuide(availableSizes);
  const whatsappHref = buildWhatsappLink(
    tailor.whatsapp,
    `Bonjour, je vous contacte depuis Tella pour le modèle "${product.title}".`,
  );

  return (
    <PageShell>
      <section className="section-padding">
        <div className="container-width">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link href={toTailorProfilePath(tailor.handle)} className="hover:text-primary">
              {tailor.atelierName}
            </Link>
            <span>/</span>
            <span>{categoryLabels[product.category]}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <div className="illustration-frame relative aspect-[4/5] w-full sm:aspect-[3/4]">
                {product.imageUrl ? (
                  <OptimizedImage
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                ) : (
                  <div className={cn("h-full w-full bg-surface-strong", product.imageClassName)} />
                )}
              </div>
            </div>

            <aside className="surface-card p-5 sm:p-6 lg:sticky lg:top-20 lg:self-start">
              <Badge variant="primary">{tailor.city}</Badge>
              <h1 className="heading-display heading-h2 mt-2">{product.title}</h1>
              <p className="mt-1 text-sm text-muted">{tailor.atelierName}</p>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {product.priceFrom ? formatCurrency(product.priceFrom) : "Prix sur demande"}
              </p>
              <p className="mt-1 text-sm text-muted">Délai : {product.turnaround}</p>

              <div className="mt-6">
                <p className="eyebrow">Tailles</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {availableSizes.map((size) => (
                    <span
                      key={size}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-semibold",
                        size === product.selectedSize
                          ? "border-primary bg-primary text-on-primary"
                          : "border-border bg-background text-foreground",
                      )}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {product.composition ? (
                <div className="mt-6 space-y-1 text-xs text-muted">
                  <p>Rembourrage : {product.composition.filling}</p>
                  <p>Doublure : {product.composition.lining}</p>
                  <p>Intérieur : {product.composition.inner}</p>
                  <p>Matière : {product.composition.outerMaterial}</p>
                </div>
              ) : null}

              {(product.details ?? []).length > 0 ? (
                <div className="mt-6">
                  <p className="eyebrow">Détails</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(product.details ?? []).map((detail) => (
                      <Badge key={detail} variant="primary">
                        {detail}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 overflow-hidden rounded-md border border-border">
                <div className="border-b border-border bg-surface px-4 py-2.5">
                  <p className="text-sm font-semibold text-foreground">Guide des tailles</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 px-4 py-2 text-xs">
                  <p className="font-semibold text-muted">Taille</p>
                  <p className="font-semibold text-muted">UK / US</p>
                  {sizeGuide.map((row) => (
                    <div key={row.brandSize} className="contents">
                      <p className="border-t border-border py-2 font-medium text-foreground">
                        {row.brandSize}
                      </p>
                      <p className="border-t border-border py-2 text-muted">{row.ukUs}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button href={whatsappHref} className="flex-1">
                  Contacter la couturière
                </Button>
                <Button href={toTailorProfilePath(tailor.handle)} variant="secondary" className="flex-1">
                  Voir l&apos;atelier
                </Button>
              </div>

              <p className="mt-3 text-xs text-muted">
                {product.likes} favoris · Paiement direct avec la couturière
              </p>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
