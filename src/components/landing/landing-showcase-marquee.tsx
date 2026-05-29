import { OptimizedImage } from "@/components/ui/optimized-image";
import { showcaseImages } from "@/lib/showcase-images";
import { cn } from "@/lib/utils";

type MarqueeRowProps = {
  images: readonly (typeof showcaseImages)[number][];
  durationClass: string;
  offsetClass?: string;
};

function MarqueeRow({ images, durationClass, offsetClass }: MarqueeRowProps) {
  const loop = [...images, ...images];

  return (
    <div className={cn("showcase-marquee-row", durationClass, offsetClass)}>
      {loop.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className="illustration-frame relative h-44 w-32 shrink-0 overflow-hidden sm:h-52 sm:w-36 lg:h-60 lg:w-40"
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            sizes="160px"
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}

export function LandingShowcaseMarquee() {
  const rowOne = showcaseImages;
  const rowTwo = [...showcaseImages.slice(3), ...showcaseImages.slice(0, 3)];

  return (
    <div
      className={cn(
        "relative min-h-[320px] w-full overflow-hidden sm:min-h-[380px] lg:min-h-[440px]",
        "hero-animate hero-animate-right hero-delay-4",
      )}
      aria-hidden
    >
      <div className="showcase-marquee-fade pointer-events-none absolute inset-0 z-10" />
      <div className="showcase-oblique">
        <MarqueeRow images={rowOne} durationClass="showcase-marquee-duration-a" />
        <MarqueeRow
          images={rowTwo}
          durationClass="showcase-marquee-duration-b"
          offsetClass="mt-4 lg:mt-5"
        />
      </div>
    </div>
  );
}
