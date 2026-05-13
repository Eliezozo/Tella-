import Link from "next/link";

import { Button } from "@/components/ui/button";

const links = [
  { href: "/explore", label: "Explorer" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/search", label: "Recherche" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/80 backdrop-blur-xl">
      <div className="container-width flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-[0_10px_24px_rgba(255,111,97,0.28)]">
            T
          </div>
          <div>
            <p className="font-display text-2xl text-secondary">Tella</p>
            <p className="text-xs text-muted">Marketplace couture au Togo</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-secondary md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/register">Créer mon atelier</Button>
        </div>
      </div>
    </header>
  );
}
