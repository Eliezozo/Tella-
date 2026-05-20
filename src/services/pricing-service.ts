import { pricingPlans } from "@/lib/mock-data";

/** Plans tarifaires — mock jusqu'à modèle Subscription branché en admin. */
export async function getPricingPlans() {
  return pricingPlans;
}
