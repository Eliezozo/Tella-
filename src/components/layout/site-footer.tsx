import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-width grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <p className="heading-display text-xl">Tella</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            La plateforme qui rend les couturières togolaises visibles, crédibles et
            accessibles — avec un contact direct via WhatsApp.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Découvrir</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
            <Link href="/explore" className="hover:text-primary">
              Ateliers
            </Link>
            <Link href="/search" className="hover:text-primary">
              Recherche
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              Tarifs couturières
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Couturières</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
            <Link href="/register" className="hover:text-primary">
              Créer mon atelier
            </Link>
            <Link href="/login" className="hover:text-primary">
              Connexion
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-width px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-muted">© {new Date().getFullYear()} Tella — Couture locale au Togo.</p>
        </div>
      </div>
    </footer>
  );
}
