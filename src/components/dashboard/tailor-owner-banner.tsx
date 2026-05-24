import { Button } from "@/components/ui/button";

export function TailorOwnerBanner({ atelierName }: { atelierName: string }) {
  return (
    <div className="border-b border-primary/20 bg-primary-soft">
      <div className="container-width flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{atelierName}</span>
          <span className="text-muted"> — aperçu vitrine publique (ce que voient les clientes)</span>
        </p>
        <Button href="/dashboard" variant="secondary" className="min-h-9 shrink-0 px-4 text-xs">
          Gérer mon atelier
        </Button>
      </div>
    </div>
  );
}
