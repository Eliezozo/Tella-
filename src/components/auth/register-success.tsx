import Link from "next/link";

import { REGISTER_SUCCESS_MESSAGE } from "@/lib/auth-messages";

export function RegisterSuccess({
  atelierName,
  handle,
  email,
  message,
}: {
  atelierName: string;
  handle: string;
  email: string;
  message?: string;
}) {
  const body = message ?? REGISTER_SUCCESS_MESSAGE;

  return (
    <div className="mt-8 space-y-6">
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-success/40 bg-success/10 px-5 py-6"
      >
        <p className="text-lg font-semibold text-success">
          Compte créé avec succès
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          {atelierName}
        </p>
        <p className="mt-3 text-sm leading-6 text-foreground">{body}</p>
      </div>

      <dl className="space-y-3 rounded-md border border-border bg-background px-4 py-4 text-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-muted">Profil réservé</dt>
          <dd className="font-semibold text-primary">{handle}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-muted">Email de connexion</dt>
          <dd className="font-medium text-foreground">{email}</dd>
        </div>
      </dl>

      <ol className="space-y-2 text-sm text-muted">
        <li>1. L&apos;équipe Tella vérifie votre inscription (sous 48 h).</li>
        <li>2. Vous recevez la confirmation après validation de l&apos;atelier.</li>
        <li>3. Vous pourrez alors vous connecter avec l&apos;email ci-dessus.</li>
      </ol>

      <Link
        href="/"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
