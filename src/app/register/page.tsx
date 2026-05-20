import Link from "next/link";

import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";

const fields = [
  "Nom de l'atelier",
  "Ville",
  "Numéro WhatsApp",
  "Spécialités",
  "Description",
  "Mot de passe",
];

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Inscription atelier"
      title="Créer votre espace professionnel Tella"
      description="Inscrivez votre atelier pour être visible par les clientes du Togo. Formulaire complet à venir avec validation."
    >
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="block sm:col-span-2 first:sm:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {field}
            </span>
            <input
              type="text"
              placeholder={field}
              disabled
              className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground"
            />
          </label>
        ))}
      </div>
      <Button className="mt-8 w-full" href="/dashboard">
        Créer mon atelier (démo)
      </Button>
      <p className="mt-4 text-center text-sm text-muted">
        Déjà inscrite ?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-strong">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
