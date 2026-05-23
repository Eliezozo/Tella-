import type { ReactNode } from "react";

import { PageBackNav } from "@/components/layout/page-back-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBackNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
