import type { MetadataRoute } from "next";

const routes = ["", "/explore", "/pricing", "/search", "/login", "/register", "/dashboard"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://tella.com${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
