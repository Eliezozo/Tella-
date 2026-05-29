export type ShowcaseImage = {
  src: string;
  alt: string;
};

/** Images Pinterest utilisées sur le landing et dans les données de démo. */
export const showcaseImages: readonly ShowcaseImage[] = [
  {
    src: "https://i.pinimg.com/control1/736x/0b/ca/48/0bca4860eec6abb3d76781322d6e6d5c.jpg",
    alt: "Tenue africaine sur mesure",
  },
  {
    src: "https://i.pinimg.com/736x/6b/4c/ad/6b4cad2baf13774d38b081a7abefd624.jpg",
    alt: "Création mode wax",
  },
  {
    src: "https://i.pinimg.com/736x/64/1f/e1/641fe1dd4e8071f26b9fcf2d7732418e.jpg",
    alt: "Chemise ankara homme",
  },
  {
    src: "https://i.pinimg.com/736x/42/c1/27/42c127cb53825d65e3d79ab76986ff72.jpg",
    alt: "Look cérémonie",
  },
  {
    src: "https://i.pinimg.com/736x/3c/92/84/3c9284de98a20dbc0cc8a8963f216333.jpg",
    alt: "Tenue traditionnelle brodée",
  },
  {
    src: "https://i.pinimg.com/736x/67/68/a1/6768a1072a6ca2d9de4b2a2c2b956758.jpg",
    alt: "Ensemble couture africaine",
  },
] as const;

export function showcaseImageSrc(index: number): string {
  return showcaseImages[index % showcaseImages.length].src;
}
