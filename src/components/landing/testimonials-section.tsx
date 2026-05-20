import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedTestimonials } from "@/services/testimonial-service";

export async function TestimonialsSection() {
  const reviews = await getFeaturedTestimonials();

  return (
    <section className="section-padding bg-surface">
      <div className="container-width space-y-8">
        <SectionHeading
          eyebrow="Avis"
          title="La confiance passe par les retours clientes"
          description="Des avis authentiques pour rassurer avant le premier contact WhatsApp."
          align="center"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="surface-card p-5">
              <p className="text-sm text-primary">
                {Array.from({ length: review.rating }, () => "★").join("")}
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground">{review.comment}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary">
                {review.author}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
