import Link from "next/link";

export function AddCreationCard() {
  return (
    <div className="surface-card flex min-h-[280px] flex-col items-center justify-center border border-dashed border-primary/30 p-6 text-center">
      <p className="eyebrow">Nouvelle pièce</p>
      <p className="heading-display mt-2 text-lg">Ajouter à ma collection</p>
      <p className="mt-2 max-w-xs text-sm text-muted">
        Publiez une photo, un prix indicatif et les tailles disponibles pour votre vitrine.
      </p>
      <Link
        href="/dashboard/creations/nouvelle"
        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
      >
        Ajouter une création
      </Link>
    </div>
  );
}
