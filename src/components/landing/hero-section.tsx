import { Button } from "@/components/ui/button";
import { LandingShowcaseMarquee } from "@/components/landing/landing-showcase-marquee";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

const proofStats = [
  ["48", "couturières abonnées"],
  ["1 284", "utilisatrices clientes"],
  ["318", "demandes via WhatsApp"],
] as const;

export function HeroSection() {
  return (
    <section className="section-padding overflow-hidden border-b border-border">
      <div className="container-width grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className={cn("eyebrow hero-animate hero-animate-up hero-delay-1")}>
            Couturières & clientes au Togo
          </p>
          <h1
            className={cn(
              "heading-display heading-h1 mt-4 max-w-2xl hero-animate hero-animate-up hero-delay-2",
            )}
          >
            Trouvez l&apos;atelier idéal.{" "}
            <span className="text-primary">Contactez en un clic.</span>
          </h1>
          <p
            className={cn(
              "mt-6 max-w-xl text-sm leading-7 text-muted hero-animate hero-animate-up hero-delay-3",
            )}
          >
            Tella met en relation les couturières togolaises et les clientes qui cherchent
            des créations sur mesure — robes, tenues traditionnelles, mariage et plus.
          </p>
          <div
            className={cn(
              "mt-8 flex flex-col gap-2 sm:flex-row hero-animate hero-animate-up hero-delay-4",
            )}
          >
            <Button href="/explore">Chercher un atelier</Button>
            <Button href="/register" variant="secondary">
              Créer mon atelier
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {proofStats.map(([value, label], index) => (
              <div
                key={label}
                className={cn(
                  "hero-animate hero-animate-up",
                  index === 0 && "hero-delay-5",
                  index === 1 && "hero-delay-6",
                  index === 2 && "hero-delay-7",
                )}
              >
                <StatCard value={value} label={label} />
              </div>
            ))}
          </div>
        </div>

        <LandingShowcaseMarquee />
      </div>
    </section>
  );
}
