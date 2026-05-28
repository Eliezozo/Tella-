import { CtaBannerSection } from "@/components/landing/cta-banner-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingTeaserSection } from "@/components/landing/pricing-teaser-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PageShell } from "@/components/layout/page-shell";

export default function HomePage() {
  return (
    <PageShell>
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingTeaserSection />
      <CtaBannerSection />
    </PageShell>
  );
}
