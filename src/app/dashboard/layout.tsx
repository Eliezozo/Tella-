import { PageBackNav } from "@/components/layout/page-back-nav";
import { SiteHeader } from "@/components/layout/site-header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBackNav />
      {children}
    </div>
  );
}
