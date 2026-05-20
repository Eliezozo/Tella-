import Link from "next/link";

export function SiteLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group leading-none">
      <span className="logo-wordmark block text-[1.75rem] tracking-[0.06em] text-foreground transition-colors group-hover:text-primary sm:text-[2rem]">
        Tella
      </span>
      {!compact ? (
        <span className="mt-1.5 block text-[10px] uppercase tracking-[0.28em] text-secondary">
          Marketplace couture
        </span>
      ) : null}
    </Link>
  );
}
