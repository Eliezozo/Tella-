export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white/80">
      <div className="container-width grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl text-secondary">Tella</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Une plateforme légère, mobile-first et pensée pour rendre la couture locale visible, accessible et plus simple à gérer.
          </p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-secondary">Produit</p>
          <p className="mt-3">Profils ateliers</p>
          <p>Catalogue</p>
          <p>Commandes</p>
          <p>Statistiques</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-secondary">Prochaine étape</p>
          <p className="mt-3">
            Brancher Auth.js, Prisma, UploadThing/Cloudinary et les paiements Mobile Money côté backend.
          </p>
        </div>
      </div>
    </footer>
  );
}
