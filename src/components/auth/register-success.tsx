import Link from "next/link";

export function RegisterSuccess({
  atelierName,
  handle,
  email,
}: {
  atelierName: string;
  handle: string;
  email: string;
}) {
  return (
    <div className="mt-8 space-y-6">
      <div
        role="status"
        className="rounded-md border border-success/40 bg-success/10 px-5 py-5"
      >
        <p className="text-sm font-semibold text-success">
          ✓ Demande enregistrée pour {atelierName}
        </p>
        <p className="mt-3 text-sm leading-6 text-foreground">
          Notre équipe a été notifiée et va vérifier votre inscription sous 48 h.
          Vous pourrez vous connecter à votre espace atelier une fois la validation
          confirmée.
        </p>
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
        <li>2. Vous vous connectez avec l&apos;email ci-dessus.</li>
        <li>3. Vous complétez vos créations dans votre dashboard atelier.</li>
      </ol>

      <Link
        href="/login"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-on-primary hover:bg-primary-strong"
      >
        Aller à la connexion
      </Link>
    </div>
  );
}
