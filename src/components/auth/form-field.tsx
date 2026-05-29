import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  className,
  children,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children ?? (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
      )}
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </label>
  );
}
