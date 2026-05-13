type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | undefined | null>;

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap((input) => {
      if (!input) {
        return [];
      }

      if (typeof input === "string" || typeof input === "number") {
        return [String(input)];
      }

      return Object.entries(input)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([className]) => className);
    })
    .join(" ");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}
