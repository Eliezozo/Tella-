export function buildTrackedWhatsappHref(
  tailorProfileId: string,
  phone: string,
  message: string,
): string {
  const params = new URLSearchParams({
    tailorId: tailorProfileId,
    phone,
    message,
  });
  return `/api/out/whatsapp?${params.toString()}`;
}
