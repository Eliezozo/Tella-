import { PageBackNav } from "@/components/layout/page-back-nav";
import { SiteHeader } from "@/components/layout/site-header";
import { TailorDashboardHeader } from "@/components/layout/tailor-dashboard-header";
import { auth } from "@/auth";
import { getTailorById } from "@/services/tailor-service";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  const isTailor = user?.role === "TAILOR" && user.tailorProfileId;

  if (isTailor && user.tailorProfileId) {
    const tailor = await getTailorById(user.tailorProfileId);
    const atelierName = tailor?.atelierName ?? user.name ?? "Mon atelier";
    const handle = user.handle ?? tailor?.handle ?? "@atelier";

    return (
      <div className="min-h-screen bg-background">
        <TailorDashboardHeader atelierName={atelierName} handle={handle} />
        <PageBackNav />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBackNav />
      {children}
    </div>
  );
}
