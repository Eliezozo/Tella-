import Link from "next/link";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { SearchIcon } from "@/components/ui/search-icon";
import { SiteLogo } from "@/components/layout/site-logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/explore", label: "Ateliers" },
  { href: "/pricing", label: "Tarifs" },
];

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const isTailor = user?.role === "TAILOR";

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
            {user ? (
              <>
                <span className="max-w-[140px] truncate text-sm text-muted">
                  {user.name ?? user.email}
                </span>
                <Button href="/dashboard" variant="ghost" className="min-h-9 px-4">
                  {isTailor ? "Mon atelier" : "Dashboard"}
                </Button>
                {isTailor && user.handle ? (
                  <Button
                    href={`/${user.handle.replace("@", "")}`}
                    variant="ghost"
                    className="min-h-9 px-4"
                  >
                    Profil public
                  </Button>
                ) : null}
                <SignOutButton className="min-h-9 rounded-md px-4 text-sm font-semibold text-muted hover:text-primary" />
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost" className="min-h-9 px-4">
                  Connexion
                </Button>
                <Button href="/register" className="min-h-9 px-4">
                  Créer mon atelier
                </Button>
              </>
            )}
          </div>

          <MobileNav
            isAuthenticated={Boolean(user)}
            userName={user?.name ?? user?.email ?? undefined}
            handle={user?.handle ?? undefined}
          />
        </div>
      </div>
    </header>
  );
}
