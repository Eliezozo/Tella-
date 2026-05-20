import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="section-padding flex min-h-screen items-center justify-center">
      <div className="surface-card max-w-md p-8 text-center">
        <p className="eyebrow">404</p>
        <h1 className="heading-display heading-h2 mt-2">Page introuvable</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Le lien demandé n&apos;existe pas ou le profil atelier n&apos;est pas disponible.
        </p>
        <Button href="/" className="mt-6">
          Revenir à l&apos;accueil
        </Button>
      </div>
    </div>
  );
}
