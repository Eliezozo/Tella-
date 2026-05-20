import Link from "next/link";

import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Connexion"
      title="Accéder à mon atelier"
      description="Connectez-vous pour gérer votre profil, vos collections et votre visibilité sur Tella."
    >
      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Email ou téléphone
          </span>
          <input
            type="text"
            placeholder="exemple@email.com"
            disabled
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Mot de passe
          </span>
          <input
            type="password"
            placeholder="••••••••"
            disabled
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground"
          />
        </label>
      </div>
      <Button className="mt-8 w-full" href="/dashboard">
        Se connecter (démo)
      </Button>
      <p className="mt-4 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-primary-strong">
          Créer mon atelier
        </Link>
      </p>
    </AuthLayout>
  );
}
