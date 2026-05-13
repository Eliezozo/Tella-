import type { Metadata } from "next";
import { Hammersmith_One, Inter } from "next/font/google";
import "./globals.css";

const headingFont = Hammersmith_One({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Tella",
    description:
      "La mode locale mérite une visibilité mondiale. Découvrez et développez votre atelier.",
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
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="app-shell min-h-full font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
