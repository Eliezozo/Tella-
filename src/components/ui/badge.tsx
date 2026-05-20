import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "success";
  className?: string;
}) {
  const variants = {
    default: "border border-border bg-surface text-foreground",
    primary: "border border-primary/20 bg-primary-soft text-primary",
    secondary: "bg-secondary text-on-primary",
    success: "border border-success/20 bg-success/10 text-success",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
