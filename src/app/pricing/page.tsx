import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCurrency } from "@/lib/utils";
import { getPricingPlans } from "@/services/pricing-service";

const faq = [
  {
    q: "Comment fonctionne l'abonnement ?",
    a: "Les couturières paient un abonnement trimestriel ou annuel pour avoir leur profil en ligne. Paiement hors plateforme, suivi manuel.",
  },
  {
    q: "Tella gère-t-il les paiements clients ?",
    a: "Non. Tella est une plateforme de visibilité. Les clientes contactent les couturières via WhatsApp.",
  },
  {
    q: "Que comprend le plan annuel ?",
    a: "Plan trimestriel + badge vérifié, statistiques avancées et mise en avant dans l'explore.",
  },
];

export default async function PricingPage() {
  const pricingPlans = await getPricingPlans();

  return (
    <PageShell>
      <section className="section-padding">
        <div className="container-width space-y-10">
          <SectionHeading
            eyebrow="Tarifs"
            title="Abonnements pour la visibilité locale"
            description="Le plan annuel consolide la rétention et la mise en avant premium."
            align="center"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {pricingPlans.map((plan) => (
              <article
                key={plan.id}
                className={`surface-card p-6 ${plan.highlighted ? "ring-1 ring-primary" : ""}`}
              >
                <p className="eyebrow">{plan.highlighted ? "Recommandé" : "Essentiel"}</p>
                <h2 className="heading-display mt-2 text-2xl">{plan.title}</h2>
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
                <Button href="/register" className="mt-6 w-full">
                  Commencer
                </Button>
              </article>
            ))}
          </div>

          <div className="mx-auto max-w-xl space-y-3">
            <h2 className="heading-display text-center text-xl">Questions fréquentes</h2>
            {faq.map((item) => (
              <details key={item.q} className="surface-card p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-6 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
