import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tella",
    short_name: "Tella",
    description: "Marketplace couture et visibilité digitale pour couturières au Togo.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf8",
    theme_color: "#ff6f61",
    lang: "fr",
  };
}
