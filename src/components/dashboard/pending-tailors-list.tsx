"use client";

import { useTransition } from "react";

import { approveTailorAction, publishTailorAction } from "@/actions/admin-actions";
import type { PendingTailorRegistration } from "@/services/admin-service";

export function PendingTailorsList({ items }: { items: PendingTailorRegistration[] }) {
  const [isPending, startTransition] = useTransition();

  function run(action: (id: string) => Promise<void>, id: string) {
    startTransition(() => {
      void action(id);
    });
  }

  if (items.length === 0) {
    return (
      <p className="surface-card p-5 text-sm text-muted">
        Aucune demande en attente. Les nouvelles inscriptions apparaîtront ici.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="surface-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs text-muted">
                {item.createdAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h2 className="heading-display mt-1 text-xl">{item.atelierName}</h2>
              <p className="mt-1 text-sm font-semibold text-primary">{item.handle}</p>
              <dl className="mt-3 space-y-1 text-sm text-muted">
                <div>
                  <dt className="inline">Ville : </dt>
                  <dd className="inline text-foreground">{item.city}</dd>
                </div>
                <div>
                  <dt className="inline">Email : </dt>
                  <dd className="inline text-foreground">{item.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="inline">WhatsApp : </dt>
                  <dd className="inline text-foreground">{item.whatsapp}</dd>
                </div>
              </dl>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:min-w-[200px]">
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(approveTailorAction, item.id)}
                className="min-h-10 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:border-primary disabled:opacity-60"
              >
                Approuver le compte
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(publishTailorAction, item.id)}
                className="min-h-10 rounded-md bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-strong disabled:opacity-60"
              >
                Approuver + publier
              </button>
              <p className="text-[10px] leading-4 text-muted">
                « Approuver » permet la connexion. « Publier » active aussi la vitrine sur
                Explore.
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
