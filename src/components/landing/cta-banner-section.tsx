import { Button } from "@/components/ui/button";

export function CtaBannerSection() {
  return (
    <section className="section-padding">
      <div className="container-width">
        <div className="mesh-panel p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Pour les clientes</p>
              <h2 className="heading-display mt-2 text-2xl">
                Trouvez votre couturière idéale
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Parcourez les ateliers et contactez directement via WhatsApp.
              </p>
              <Button href="/explore" className="mt-5">
                Explorer les ateliers
              </Button>
            </div>
            <div>
              <p className="eyebrow">Pour les couturières</p>
              <h2 className="heading-display mt-2 text-2xl">
                Donnez une vitrine à votre talent
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Créez votre profil et recevez des demandes qualifiées.
              </p>
              <Button href="/register" variant="secondary" className="mt-5">
                Créer mon atelier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
