import { cn } from "@/lib/utils";

type AlertVariant = "error" | "info" | "success";

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "border-danger/40 bg-danger/10 text-danger",
  info: "border-info/40 bg-info/10 text-info",
  success: "border-success/40 bg-success/10 text-success",
};

export function FormAlert({
  variant,
  children,
  className,
}: {
  variant: AlertVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "mb-4 rounded-md border px-4 py-3 text-sm",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </p>
  );
}
