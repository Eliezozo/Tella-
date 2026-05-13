import Link from "next/link";
import type { ReactNode } from "react";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/creations", label: "Créations" },
  { href: "/dashboard/commandes", label: "Commandes" },
  { href: "/dashboard/statistiques", label: "Statistiques" },
  { href: "/dashboard/parametres", label: "Paramètres" },
];

export function DashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="container-width px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="surface-card rounded-[28px] p-5">
          <p className="font-display text-2xl text-secondary">Atelier Ama</p>
          <p className="mt-2 text-sm text-muted">Gestion simple des commandes et de la visibilité.</p>
          <nav className="mt-6 space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-secondary hover:bg-primary/10 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          <div className="surface-card rounded-[28px] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Dashboard couturière
            </p>
            <h1 className="mt-3 font-display text-3xl text-secondary sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
