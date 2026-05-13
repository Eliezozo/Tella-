import { SiteHeader } from "@/components/layout/site-header";

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-padding">
        <div className="container-width max-w-3xl">
          <div className="surface-card rounded-[32px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Inscription atelier
            </p>
            <h1 className="mt-3 font-display text-4xl text-secondary">Créer un espace professionnel Tella</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Formulaire d’onboarding prévu pour React Hook Form + Zod, avec capture des informations d’atelier, ville, WhatsApp et spécialités.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton h-12 rounded-xl bg-surface" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
