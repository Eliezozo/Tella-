import type { ReactNode } from "react";

import { OptimizedImage } from "@/components/ui/optimized-image";
import { PageShell } from "@/components/layout/page-shell";
import { landingImages } from "@/lib/images";

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <section className="section-padding">
        <div className="container-width grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="hidden lg:block">
            <div className="illustration-frame relative aspect-[4/5] w-full max-w-md">
              <OptimizedImage
                src={landingImages.authSide}
                alt="Artisan couturière"
                fill
                sizes="500px"
              />
            </div>
          </div>
          <div className="surface-card p-6 sm:p-8">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="heading-display heading-h2 mt-2">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            {children}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
