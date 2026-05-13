export function buildWhatsappLink(phone: string, message: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `https://wa.me/${normalized.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
