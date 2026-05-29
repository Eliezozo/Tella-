import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next 16.2 lit encore experimental.serverActions (pas la clé racine).
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // Évite la troncature du corps multipart côté proxy en dev.
    proxyClientMaxBodySize: "5mb",
  },
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
