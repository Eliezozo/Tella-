import Link from "next/link";
import { notFound } from "next/navigation";

import { ProfileViewTracker } from "@/components/analytics/profile-view-tracker";
import { CreationCard } from "@/components/cards/creation-card";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { TailorOwnerBanner } from "@/components/dashboard/tailor-owner-banner";
import { auth } from "@/auth";
import { normalizeHandle } from "@/lib/handle";
import { buildTrackedWhatsappHref } from "@/lib/whatsapp-track";
import { getTailorProfilePage } from "@/services/tailor-service";

export default async function TailorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: rawHandle } = await params;
  const handle = normalizeHandle(decodeURIComponent(rawHandle));

  const data = await getTailorProfilePage(handle);

  if (!data) {
    notFound();
  }

  const { profile, portfolio, reviews: profileReviews } = data;
  const session = await auth();
  const isOwner =
    session?.user?.role === "TAILOR" &&
    session.user.tailorProfileId === profile.id;

  const whatsappHref = buildTrackedWhatsappHref(
    profile.id,
    profile.whatsapp,
    "Bonjour, je vous contacte depuis Tella concernant un modèle.",
  );

  return (
    <PageShell>
      <ProfileViewTracker tailorProfileId={profile.id} skip={isOwner} />
      {isOwner ? <TailorOwnerBanner atelierName={profile.atelierName} /> : null}
      <section className="section-padding">
        <div className="container-width grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="surface-card overflow-hidden">
            <div className="relative h-40 w-full sm:h-48">
              {profile.coverUrl ? (
                <OptimizedImage
                  src={profile.coverUrl}
                  alt={`Bannière ${profile.atelierName}`}
                  fill
                  priority
                  sizes="100vw"
                />
              ) : (
                <div className="h-full w-full bg-surface-strong" />
              )}
              <div className="absolute inset-0 bg-secondary-dark/30" />
            </div>

            <div className="relative px-5 pb-6 sm:px-6">
              {profile.avatarUrl ? (
                <div className="absolute -top-8 h-16 w-16 overflow-hidden rounded-md border-2 border-surface">
                  <OptimizedImage
                    src={profile.avatarUrl}
                    alt={profile.atelierName}
                    fill
                    sizes="64px"
                  />
                </div>
              ) : null}

              <div className={profile.avatarUrl ? "pt-10" : "pt-5"}>
                <Badge variant="primary">{profile.city}</Badge>
                <h1 className="heading-display heading-h2 mt-2">{profile.atelierName}</h1>
                <p className="mt-2 text-sm text-muted">{profile.heroLabel}</p>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm leading-7 text-muted">{profile.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="default">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">Informations</p>
                  <div className="mt-3 space-y-2 text-sm text-muted">
                    <p>Ville : {profile.city}</p>
                    <p>
                      Note : {profile.rating}/5 ({profile.reviewsCount} avis)
                    </p>
                    <p>{profile.completedOrders} clientes accompagnées</p>
                    <p>{profile.responseRate}% de réponse</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="heading-display text-xl">Collections</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {portfolio.map((creation) => (
                    <CreationCard
                      key={creation.id}
                      creation={creation}
                      atelierName={profile.atelierName}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="surface-card p-5">
              <p className="eyebrow">Contacter</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Message pré-rempli pour accélérer la prise de contact.
              </p>
              <Button href={whatsappHref} className="mt-4 w-full">
                Ouvrir WhatsApp
              </Button>
              <Link
                href={`/search?city=${encodeURIComponent(profile.city)}`}
                className="mt-3 block text-center text-xs text-primary hover:underline"
              >
                Autres ateliers à {profile.city}
              </Link>
            </div>

            <div className="surface-card p-5">
              <p className="text-sm font-semibold text-foreground">Avis clientes</p>
              <div className="mt-4 space-y-3">
                {profileReviews.map((review) => (
                  <article key={review.id} className="rounded-md border border-border bg-background p-3">
                    <p className="text-xs text-primary">
                      {Array.from({ length: review.rating }, () => "★").join("")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                      {review.author}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
