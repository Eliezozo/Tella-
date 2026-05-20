import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const logoFont = Cormorant_Garamond({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headingFont = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tella.com"),
  title: {
    default: "Tella | Marketplace couture au Togo",
    template: "%s | Tella",
  },
  description:
    "Tella aide les couturières, ateliers et stylistes au Togo à présenter leurs créations, recevoir des demandes et gagner en visibilité locale.",
  applicationName: "Tella",
  keywords: [
    "couturière Togo",
    "mode locale",
    "atelier couture",
    "styliste",
    "marketplace couture",
    "WhatsApp commerce",
  ],
  openGraph: {
    title: "Tella",
    description:
      "La plateforme de visibilité et de commandes pour les couturières au Togo.",
    type: "website",
    locale: "fr_FR",
    siteName: "Tella",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558171813-4c08878a5171?w=1200&h=630&fit=crop&q=85",
        width: 1200,
        height: 630,
        alt: "Tella — artisan couture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tella",
    description:
      "La mode locale mérite une visibilité mondiale. Découvrez et développez votre atelier.",
    images: [
      "https://images.unsplash.com/photo-1558171813-4c08878a5171?w=1200&h=630&fit=crop&q=85",
    ],
  },
  icons: {
    icon: "https://ceedow.world/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${logoFont.variable} ${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="app-shell min-h-full font-sans text-foreground">{children}</body>
    </html>
  );
}
