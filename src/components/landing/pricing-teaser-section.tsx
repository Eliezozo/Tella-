import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getPricingPlans } from "@/services/pricing-service";

export async function PricingTeaserSection() {
  const pricingPlans = await getPricingPlans();

  return (
    <section className="section-padding border-t border-border">
      <div className="container-width space-y-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Abonnements</p>
          <h2 className="heading-display heading-h2 mt-3">
            Visibilité pour les couturières
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Tella vend de la visibilité, pas un système de paiement client.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`surface-card p-6 ${plan.highlighted ? "ring-1 ring-primary" : ""}`}
            >
              <p className="eyebrow">{plan.highlighted ? "Recommandé" : "Essentiel"}</p>
              <h3 className="heading-display mt-2 text-2xl">{plan.title}</h3>
              <p className="mt-4 text-3xl font-semibold text-foreground">
                {formatCurrency(plan.amount)}
                <span className="ml-2 text-sm font-normal text-muted">{plan.billing}</span>
              </p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted">
                    — {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="text-center">
          <Button href="/pricing" variant="secondary">
            Voir les tarifs
          </Button>
        </div>
      </div>
    </section>
  );
}
