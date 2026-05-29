import type { CreateCreationInput } from "@/lib/validations/creation";
import { creationSizeOptions } from "@/lib/validations/creation";

export function parseCreationFormData(formData: FormData): CreateCreationInput {
  const sizes = formData
    .getAll("sizes")
    .map((value) => String(value).trim())
    .filter((value): value is (typeof creationSizeOptions)[number] =>
      creationSizeOptions.includes(value as (typeof creationSizeOptions)[number]),
    );

  const priceRaw = String(formData.get("priceFrom") ?? "").trim();
  const priceFrom = priceRaw ? Number(priceRaw) : undefined;

  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "") as CreateCreationInput["category"],
    priceFrom: Number.isFinite(priceFrom) ? priceFrom : undefined,
    turnaroundLabel: String(formData.get("turnaroundLabel") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || undefined,
    sizes,
    detailsText: String(formData.get("detailsText") ?? ""),
  };
}

export function parseCreationDetails(detailsText?: string): string[] {
  if (!detailsText?.trim()) {
    return [];
  }

  return detailsText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}
