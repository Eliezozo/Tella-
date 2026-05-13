import { notFound } from "next/navigation";

import { CreationCard } from "@/components/cards/creation-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { buildWhatsappLink } from "@/hooks/build-whatsapp-link";
import { creations, reviews, tailorProfiles } from "@/lib/mock-data";

export default async function TailorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  if (!handle.startsWith("@")) {
    notFound();
  }

  const profile = tailorProfiles.find((item) => item.handle === handle);

  if (!profile) {
    notFound();
  }

  const portfolio = creations.filter((item) => item.tailorId === profile.id);
  const profileReviews = reviews.filter((item) => item.tailorId === profile.id);
  const whatsappHref = buildWhatsappLink(
    profile.whatsapp,
    "Bonjour, je vous contacte depuis Tella concernant un modèle.",
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="section-padding">
          <div className="container-width grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="surface-card rounded-[36px] p-6 sm:p-8">
              <div className="rounded-[28px] bg-gradient-to-br from-[#ff8b7d] via-[#ffd0c8] to-[#fff5f1] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Profil couturière</p>
                <h1 className="mt-3 font-display text-4xl text-secondary sm:text-5xl">
                  {profile.atelierName}
                </h1>
                <p className="mt-3 text-sm text-secondary/80">{profile.heroLabel}</p>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm leading-7 text-muted">{profile.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {profile.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] bg-surface p-5">
                  <p className="text-sm font-semibold text-secondary">Aperçu</p>
                  <div className="mt-4 space-y-3 text-sm text-muted">
                    <p>Ville: {profile.city}</p>
                    <p>WhatsApp: {profile.whatsapp}</p>
                    <p>Avis: {profile.rating}/5</p>
                    <p>Commandes terminées: {profile.completedOrders}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {portfolio.map((creation) => (
                  <CreationCard key={creation.id} creation={creation} />
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="surface-card rounded-[32px] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Contacter l’atelier
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Message pré-rempli pour accélérer la prise de contact et éviter les frictions sur mobile.
                </p>
                <Button href={whatsappHref} className="mt-6 w-full">
                  Ouvrir WhatsApp
                </Button>
              </div>

              <div className="surface-card rounded-[32px] p-6">
                <p className="text-sm font-semibold text-secondary">Avis clients</p>
                <div className="mt-5 space-y-4">
                  {profileReviews.map((review) => (
                    <article key={review.id} className="rounded-[24px] bg-white p-4">
                      <p className="text-primary">
                        {Array.from({ length: review.rating }, () => "★").join("")}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted">{review.comment}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                        {review.author}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
