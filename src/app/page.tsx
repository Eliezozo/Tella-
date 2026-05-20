import { CategoriesSection } from "@/components/landing/categories-section";
import { CreationsShowcaseSection } from "@/components/landing/creations-showcase-section";
import { CtaBannerSection } from "@/components/landing/cta-banner-section";
import { FeaturedTailorsSection } from "@/components/landing/featured-tailors-section";
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
      <FeaturedTailorsSection />
      <CreationsShowcaseSection />
      <CategoriesSection />
      <TestimonialsSection />
      <PricingTeaserSection />
      <CtaBannerSection />
    </PageShell>
  );
}
