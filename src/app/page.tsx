import { CreationCard } from "@/components/cards/creation-card";
import { TailorCard } from "@/components/cards/tailor-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { categoryLabels, pricingPlans, reviews } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { getFeaturedTailors, getRecentCreations } from "@/services/discovery-service";

const featuredTailors = getFeaturedTailors();
const recentCreations = getRecentCreations();

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="section-padding hero-grid overflow-hidden">
          <div className="container-width grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Couture locale. Visibilité digitale. WhatsApp-first.
              </div>
              <h1 className="max-w-3xl font-display text-5xl leading-[0.96] text-secondary sm:text-6xl lg:text-7xl">
                La mode locale mérite une visibilité mondiale.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                Tella aide les couturières, ateliers et stylistes au Togo à exposer leurs créations, centraliser les demandes clientes et gérer leurs commandes dans une interface légère pensée pour le mobile.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/explore">Trouver une couturière</Button>
                <Button href="/register" variant="secondary">
                  Créer mon atelier
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 text-left">
                {[
                  ["350+", "ateliers visés"],
                  ["97%", "réponse via WhatsApp"],
                  ["< 1 Mo", "page d’accueil optimisée"],
                ].map(([value, label]) => (
                  <div key={label} className="surface-card rounded-2xl p-4">
                    <p className="font-display text-3xl text-secondary">{value}</p>
                    <p className="mt-1 text-sm text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mesh-panel surface-card relative overflow-hidden rounded-[36px] p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/14 to-transparent" />
              <div className="relative grid gap-4">
                <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_38px_rgba(17,17,17,0.07)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        Profil public
                      </p>
                      <h2 className="mt-2 font-display text-2xl text-secondary">@atelier-ama</h2>
                    </div>
                    <div className="rounded-2xl bg-primary px-3 py-2 text-xs font-semibold text-white">
                      Vérifié
                    </div>
                  </div>
                  <div className="mt-5 h-36 rounded-[24px] bg-gradient-to-br from-[#ff8879] via-[#ffd0c6] to-[#fff4ef]" />
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-surface p-4">
                    <div>
                      <p className="text-sm font-semibold text-secondary">Bouton WhatsApp</p>
                      <p className="text-xs text-muted">Message pré-rempli pour chaque modèle</p>
                    </div>
                    <div className="rounded-xl bg-[#1f8a70] px-4 py-3 text-sm font-semibold text-white">
                      Contacter
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="surface-card rounded-[28px] p-5">
                    <p className="text-sm text-muted">Commandes</p>
                    <p className="mt-2 font-display text-4xl text-secondary">248</p>
                    <p className="mt-2 text-sm text-success">+18% ce trimestre</p>
                  </div>
                  <div className="surface-card rounded-[28px] p-5">
                    <p className="text-sm text-muted">Vues profil</p>
                    <p className="mt-2 font-display text-4xl text-secondary">5.2k</p>
                    <p className="mt-2 text-sm text-primary">SEO et partage simplifiés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width space-y-10">
            <SectionHeading
              eyebrow="Couturières populaires"
              title="Des ateliers crédibles, visibles et prêts à être contactés"
              description="Chaque profil met en avant les créations, la ville, les spécialités, les avis et un accès direct à WhatsApp."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {featuredTailors.map((tailor) => (
                <TailorCard key={tailor.id} tailor={tailor} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white/70">
          <div className="container-width space-y-10">
            <SectionHeading
              eyebrow="Dernières créations"
              title="Une galerie pensée comme un flux mode, mais légère sur Android"
              description="Photos compressées, lazy loading, catégories claires et accès rapide aux demandes clientes."
            />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recentCreations.map((creation) => (
                <CreationCard key={creation.id} creation={creation} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Catégories"
              title="Un discovery simple pour clientes locales et stylistes"
              description="Tella structure l’offre par catégorie, ville et style pour réduire la dépendance au bouche-à-oreille."
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Object.values(categoryLabels).map((label, index) => (
                <div
                  key={label}
                  className="surface-card rounded-[24px] p-5"
                  style={{ transform: `rotate(${index % 2 === 0 ? "-1.2deg" : "1.2deg"})` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Mode locale
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-secondary">{label}</h3>
                  <p className="mt-2 text-sm text-muted">
                    Explorer des modèles adaptés à la demande locale avec prix indicatif et délai de réalisation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary text-white">
          <div className="container-width grid gap-8 lg:grid-cols-3">
            {[
              ["1", "Créer son atelier", "Photo, bannière, ville, spécialités, galerie et lien public."],
              ["2", "Partager partout", "Lien unique simple à envoyer sur WhatsApp, Facebook ou statut."],
              ["3", "Recevoir et gérer", "Demandes clientes, commandes et statistiques dans un dashboard clair."],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-[28px] border border-white/10 bg-white/6 p-6">
                <p className="font-display text-5xl text-primary">{step}</p>
                <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width space-y-10">
            <SectionHeading
              eyebrow="Avis clients"
              title="Confiance, preuve sociale et conversion locale"
              description="Les notes et commentaires rassurent les clientes avant le premier message."
              align="center"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.id} className="surface-card rounded-[28px] p-6">
                  <p className="text-primary">{Array.from({ length: review.rating }, () => "★").join("")}</p>
                  <p className="mt-4 text-sm leading-7 text-secondary">{review.comment}</p>
                  <p className="mt-5 text-sm font-semibold text-muted">{review.author}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-width space-y-10">
            <SectionHeading
              eyebrow="Tarification"
              title="Un modèle simple, compréhensible et soutenable"
              description="Le pricing favorise l’adoption locale tout en ouvrant la voie aux badges, stats avancées et mises en avant."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              {pricingPlans.map((plan) => (
                <article
                  key={plan.id}
                  className={`surface-card rounded-[32px] p-8 ${plan.highlighted ? "ring-2 ring-primary/30" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        {plan.highlighted ? "Recommandé" : "Essentiel"}
                      </p>
                      <h3 className="mt-3 font-display text-3xl text-secondary">{plan.title}</h3>
                    </div>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        Meilleure valeur
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-6 text-4xl font-bold text-secondary">
                    {formatCurrency(plan.amount)}
                    <span className="ml-2 text-base font-normal text-muted">{plan.billing}</span>
                  </p>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <p key={feature} className="text-sm text-muted">
                        • {feature}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
