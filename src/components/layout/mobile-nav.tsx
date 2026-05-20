"use client";

import Link from "next/link";
import { useState } from "react";

import { SearchIcon } from "@/components/ui/search-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/explore", label: "Ateliers" },
  { href: "/pricing", label: "Tarifs" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-foreground"
      >
        {isOpen ? (
          <span className="text-lg">✕</span>
        ) : (
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 rounded bg-foreground" />
            <span className="block h-0.5 w-4 rounded bg-foreground" />
            <span className="block h-0.5 w-4 rounded bg-foreground" />
          </span>
        )}
      </button>

      <div
        className={cn(
          "fixed inset-x-0 top-[65px] z-20 border-b border-border bg-background px-4 py-5 transition-all duration-200",
          isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <Link
          href="/search"
          onClick={() => setIsOpen(false)}
          className="mb-4 flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground"
        >
          <SearchIcon className="h-6 w-6" />
          Rechercher un atelier
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary-soft hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2">
          <Button href="/login" variant="ghost" className="w-full">
            Connexion
          </Button>
          <Button href="/register" className="w-full">
            Créer mon atelier
          </Button>
        </div>
      </div>
    </div>
  );
}
