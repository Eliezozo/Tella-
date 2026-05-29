import { showcaseImageSrc } from "@/lib/showcase-images";

export const landingImages = {
  heroMain: showcaseImageSrc(0),
  heroDress: showcaseImageSrc(1),
  heroClient: showcaseImageSrc(2),
  stepDiscover: showcaseImageSrc(3),
  stepContact: showcaseImageSrc(4),
  stepCreate: showcaseImageSrc(5),
  authSide: showcaseImageSrc(0),
} as const;

export const categoryImages: Record<string, string> = {
  robes: showcaseImageSrc(0),
  homme: showcaseImageSrc(1),
  mariage: showcaseImageSrc(2),
  enfant: showcaseImageSrc(3),
  uniformes: showcaseImageSrc(4),
  traditionnel: showcaseImageSrc(5),
};
