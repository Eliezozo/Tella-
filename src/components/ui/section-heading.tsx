import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="heading-display heading-h2">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
