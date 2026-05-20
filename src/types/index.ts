export type CategoryKey =
  | "robes"
  | "homme"
  | "mariage"
  | "enfant"
  | "uniformes"
  | "traditionnel";

export interface TailorProfile {
  id: string;
  handle: string;
  atelierName: string;
  city: string;
  description: string;
  whatsapp: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  responseRate: number;
  heroLabel: string;
  avatarUrl?: string;
  coverUrl?: string;
  /** Validation admin — requis pour se connecter (couturière). */
  isApproved?: boolean;
  /** Visibilité publique (explore, profil) — activé par l'admin. */
  isPublished?: boolean;
}

export interface Creation {
  id: string;
  tailorId: string;
  title: string;
  category: CategoryKey;
  slug: string;
  priceFrom?: number;
  turnaround: string;
  likes: number;
  imageClassName: string;
  imageUrl?: string;
  palette?: {
    backgroundMain: string;
    backgroundSidebar: string;
    accent: string;
  };
  availableSizes?: string[];
  selectedSize?: string;
  composition?: {
    filling: string;
    lining: string;
    inner: string;
    outerMaterial: string;
  };
  details?: string[];
  mediaThumbnails?: string[];
}

export interface Review {
  id: string;
  tailorId: string;
  author: string;
  rating: number;
  comment: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  amount: number;
  billing: string;
  highlighted?: boolean;
  features: string[];
}
