import Link from "next/link";
import type { ReactNode } from "react";

import type { Session } from "next-auth";

type DashboardShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  session: Session;
};

export function DashboardShell({
  title,
  description,
  children,
  session,
}: DashboardShellProps) {
  const user = session.user;
  const isTailor = user.role === "TAILOR";
  const handleSlug = user.handle?.replace("@", "");

  const navItems = isTailor
    ? [
        { href: "/dashboard", label: "Vue d'ensemble" },
        { href: "/dashboard/creations", label: "Mes créations" },
        { href: "/dashboard/statistiques", label: "Audience" },
        { href: "/dashboard/parametres", label: "Paramètres" },
        ...(handleSlug
          ? [{ href: `/${handleSlug}`, label: "Profil public" }]
          : []),
      ]
    : [
        { href: "/dashboard", label: "Vue admin" },
        { href: "/dashboard/creations", label: "Collections" },
        { href: "/dashboard/commandes", label: "Abonnements" },
        { href: "/dashboard/statistiques", label: "Audience" },
        { href: "/dashboard/parametres", label: "Réglages" },
      ];

  return (
    <div className="container-width px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="surface-card h-fit p-4 lg:sticky lg:top-20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-on-primary">
              {user.name?.charAt(0)?.toUpperCase() ?? "T"}
            </div>
            <div>
              <p className="heading-display text-base line-clamp-1">
                {user.name ?? "Mon espace"}
              </p>
              <p className="text-[10px] text-muted">
                {isTailor ? "Espace couturière" : "Administration"}
              </p>
            </div>
          </div>
          <nav className="mt-5 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-primary-soft hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-5 block rounded-md border border-border px-3 py-2 text-center text-xs font-medium text-muted hover:text-primary"
          >
            ← Retour au site
          </Link>
        </aside>

        <main className="space-y-4">
          <div className="surface-card p-5 sm:p-6">
            <p className="eyebrow">Dashboard</p>
            <h1 className="heading-display heading-h2 mt-2">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
