import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const styles = {
  primary:
    "bg-primary text-white shadow-[0_14px_30px_rgba(255,111,97,0.28)] hover:-translate-y-0.5 hover:bg-primary-strong",
  secondary:
    "border border-primary/40 bg-white text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5",
  ghost: "bg-transparent text-secondary hover:bg-secondary/5",
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
