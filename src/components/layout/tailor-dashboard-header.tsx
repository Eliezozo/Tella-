import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui/button";
import { toTailorProfilePath } from "@/lib/handle";

const workspaceLinks = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/creations", label: "Mes créations" },
  { href: "/dashboard/parametres", label: "Paramètres" },
];

export function TailorDashboardHeader({
  atelierName,
  handle,
}: {
  atelierName: string;
  handle: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container-width flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <SiteLogo href="/dashboard" subtitle="Espace atelier" />

        <nav className="hidden items-center gap-5 text-sm font-medium text-foreground md:flex">
          {workspaceLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden max-w-[120px] truncate text-sm text-muted lg:inline">
            {atelierName}
          </span>
          <Button href={toTailorProfilePath(handle)} variant="ghost" className="min-h-9 px-3 text-xs">
            Vitrine publique
          </Button>
          <Link
            href="/explore"
            className="hidden min-h-9 items-center rounded-md px-3 text-xs font-medium text-muted hover:text-primary sm:inline-flex"
          >
            Marketplace
          </Link>
          <SignOutButton className="min-h-9 rounded-md px-3 text-sm font-semibold text-muted hover:text-primary" />
        </div>
      </div>
    </header>
  );
}
