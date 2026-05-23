"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type BackButtonProps = {
  className?: string;
  label?: string;
  fallbackHref?: string;
};

export function BackButton({
  className,
  label = "Retour",
  fallbackHref = "/",
}: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined") {
      const referrer = document.referrer;
      try {
        if (referrer && new URL(referrer).origin === window.location.origin) {
          router.back();
          return;
        }
      } catch {
        // referrer invalide — fallback ci-dessous
      }
    }
    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary",
        className,
      )}
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}
