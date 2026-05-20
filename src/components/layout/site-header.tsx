import Link from "next/link";

import { SearchIcon } from "@/components/ui/search-icon";
import { SiteLogo } from "@/components/layout/site-logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/explore", label: "Ateliers" },
  { href: "/pricing", label: "Tarifs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container-width flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Rechercher"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-primary hover:text-primary md:h-12 md:w-12"
          >
            <SearchIcon className="h-6 w-6 md:h-7 md:w-7" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Button href="/login" variant="ghost" className="min-h-9 px-4">
              Connexion
            </Button>
            <Button href="/register" className="min-h-9 px-4">
              Créer mon atelier
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
