"use client";

import { usePathname } from "next/navigation";

import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";

export function PageBackNav({ className }: { className?: string }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className={cn("container-width px-4 pt-4 sm:px-6 lg:px-8", className)}>
      <BackButton />
    </div>
  );
}
