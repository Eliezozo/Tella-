import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-padding flex min-h-screen items-center justify-center">
      <div className="surface-card max-w-xl rounded-[32px] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">404</p>
        <h1 className="mt-3 font-display text-4xl text-secondary">Page introuvable</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Le lien demandé n’existe pas encore ou le profil atelier n’est pas disponible.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Revenir à l’accueil
        </Link>
      </div>
    </div>
  );
}
