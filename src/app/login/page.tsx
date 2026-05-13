import { SiteHeader } from "@/components/layout/site-header";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-padding">
        <div className="container-width max-w-2xl">
          <div className="surface-card rounded-[32px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Connexion
            </p>
            <h1 className="mt-3 font-display text-4xl text-secondary">Accéder à mon atelier</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Écran prêt à connecter à Auth.js / NextAuth avec email, téléphone ou OAuth.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="skeleton h-12 rounded-xl bg-surface" />
              <div className="skeleton h-12 rounded-xl bg-surface" />
              <div className="skeleton h-12 rounded-xl bg-primary/20" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
