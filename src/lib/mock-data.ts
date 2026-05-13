import type { Creation, PricingPlan, Review, TailorProfile } from "@/types";

export const tailorProfiles: TailorProfile[] = [
  {
    id: "t1",
    handle: "@atelier-ama",
    atelierName: "Atelier Ama",
    city: "Lomé",
    description:
      "Spécialiste des robes de cérémonie et tenues sur mesure, avec livraison locale et suivi WhatsApp.",
    whatsapp: "+22890000001",
    specialties: ["Robes", "Mariage", "Traditionnel"],
    rating: 4.9,
    reviewsCount: 126,
    completedOrders: 248,
    responseRate: 97,
    heroLabel: "Couture premium pour cérémonies et événements",
  },
  {
    id: "t2",
    handle: "@studio-kekeli",
    atelierName: "Studio Kekeli",
    city: "Kara",
    description:
      "Vestes homme, ensembles élégants et coupes contemporaines pensées pour le quotidien et les événements.",
    whatsapp: "+22890000002",
    specialties: ["Homme", "Uniformes", "Enfant"],
    rating: 4.8,
    reviewsCount: 84,
    completedOrders: 173,
    responseRate: 95,
    heroLabel: "Atelier moderne pour silhouettes nettes et fiables",
  },
  {
    id: "t3",
    handle: "@mawufe-design",
    atelierName: "Mawufe Design",
    city: "Tsévié",
    description:
      "Créations colorées inspirées des tissus locaux, avec finitions légères adaptées aux usages du quotidien.",
    whatsapp: "+22890000003",
    specialties: ["Traditionnel", "Enfant", "Robes"],
    rating: 4.7,
    reviewsCount: 52,
    completedOrders: 109,
    responseRate: 92,
    heroLabel: "Mode locale expressive, pensée pour le mobile-first",
  },
];

export const creations: Creation[] = [
  {
    id: "c1",
    tailorId: "t1",
    title: "Robe cérémonie corail",
    category: "mariage",
    priceFrom: 45000,
    turnaround: "7 jours",
    likes: 320,
    imageClassName: "from-[#ff8e7f] via-[#ffd6c7] to-[#fff4ee]",
  },
  {
    id: "c2",
    tailorId: "t1",
    title: "Coupe traditionnelle brodée",
    category: "traditionnel",
    priceFrom: 30000,
    turnaround: "5 jours",
    likes: 187,
    imageClassName: "from-[#efb286] via-[#f7d0a9] to-[#fff0db]",
  },
  {
    id: "c3",
    tailorId: "t2",
    title: "Ensemble homme graphite",
    category: "homme",
    priceFrom: 38000,
    turnaround: "6 jours",
    likes: 205,
    imageClassName: "from-[#596579] via-[#b0b9c8] to-[#edf0f4]",
  },
  {
    id: "c4",
    tailorId: "t2",
    title: "Uniforme scolaire premium",
    category: "uniformes",
    priceFrom: 15000,
    turnaround: "4 jours",
    likes: 112,
    imageClassName: "from-[#6c8aa3] via-[#d2dde8] to-[#f8fbff]",
  },
  {
    id: "c5",
    tailorId: "t3",
    title: "Robe enfant wax léger",
    category: "enfant",
    priceFrom: 12000,
    turnaround: "3 jours",
    likes: 146,
    imageClassName: "from-[#ffbe71] via-[#ffe0b3] to-[#fff7e7]",
  },
  {
    id: "c6",
    tailorId: "t3",
    title: "Robe ville fluidité",
    category: "robes",
    priceFrom: 22000,
    turnaround: "5 jours",
    likes: 164,
    imageClassName: "from-[#ff8b91] via-[#ffd3d8] to-[#fff6f7]",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    tailorId: "t1",
    author: "Afi K.",
    rating: 5,
    comment: "Réponse rapide sur WhatsApp, finition très propre et livraison à temps.",
  },
  {
    id: "r2",
    tailorId: "t2",
    author: "Komlan S.",
    rating: 5,
    comment: "Bonne coupe, bon suivi, et prix clair dès le départ.",
  },
  {
    id: "r3",
    tailorId: "t3",
    author: "Yawa M.",
    rating: 4,
    comment: "Très beau rendu final et excellent choix de tissu pour la saison chaude.",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "quarterly",
    title: "Plan trimestriel",
    amount: 10000,
    billing: "/ trimestre",
    features: [
      "Profil atelier personnalisé",
      "Galerie photos et vidéos",
      "Lien public partageable",
      "Bouton WhatsApp intégré",
      "Réception des avis clients",
    ],
  },
  {
    id: "yearly",
    title: "Plan annuel",
    amount: 35000,
    billing: "/ an",
    highlighted: true,
    features: [
      "Tout le plan trimestriel",
      "Badge atelier vérifié",
      "Statistiques avancées",
      "Mise en avant dans l’explore",
      "Accès prioritaire aux nouveautés",
    ],
  },
];

export const categoryLabels = {
  robes: "Robes",
  homme: "Homme",
  mariage: "Mariage",
  enfant: "Enfant",
  uniformes: "Uniformes",
  traditionnel: "Traditionnel",
} as const;
