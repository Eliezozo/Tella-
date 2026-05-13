import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricingPlans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-padding">
        <div className="container-width space-y-10">
          <SectionHeading
            eyebrow="Pricing"
            title="Des abonnements conçus pour l’adoption puis la montée en gamme"
            description="Le plan annuel est stratégique pour consolider la rétention, les badges et la visibilité premium."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {pricingPlans.map((plan) => (
              <article
                key={plan.id}
                className={`surface-card rounded-[32px] p-8 ${plan.highlighted ? "ring-2 ring-primary/30" : ""}`}
              >
                <h2 className="font-display text-3xl text-secondary">{plan.title}</h2>
                <p className="mt-5 text-4xl font-bold text-secondary">
                  {formatCurrency(plan.amount)}
                  <span className="ml-2 text-base font-normal text-muted">{plan.billing}</span>
                </p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="text-sm text-muted">
                      • {feature}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
