import { OptimizedImage } from "@/components/ui/optimized-image";
import { landingImages } from "@/lib/images";

const steps = [
  {
    step: "01",
    title: "La couturière crée son atelier",
    text: "Photo, bannière, ville, téléphone, spécialités et collections en un profil clair.",
    image: landingImages.stepCreate,
    alt: "Création d'un profil atelier",
  },
  {
    step: "02",
    title: "La cliente trouve le bon profil",
    text: "Recherche par ville, type de tenue ou style — comparez les ateliers en confiance.",
    image: landingImages.stepDiscover,
    alt: "Recherche d'un atelier couture",
  },
  {
    step: "03",
    title: "La relation se fait en direct",
    text: "Contact WhatsApp immédiat. Paiement et suivi gérés hors plateforme.",
    image: landingImages.stepContact,
    alt: "Contact direct avec la couturière",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-width">
        <p className="eyebrow">Comment ça marche</p>
        <h2 className="heading-display heading-h2 mt-3 max-w-xl">
          De la découverte au premier message
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((item) => (
            <article key={item.step} className="surface-card overflow-hidden">
              <div className="relative h-44 min-h-[176px] w-full">
                <OptimizedImage src={item.image} alt={item.alt} fill sizes="400px" />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold tracking-widest text-secondary">{item.step}</p>
                <h3 className="heading-display mt-2 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
