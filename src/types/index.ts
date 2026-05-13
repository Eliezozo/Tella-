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
}

export interface Creation {
  id: string;
  tailorId: string;
  title: string;
  category: CategoryKey;
  priceFrom?: number;
  turnaround: string;
  likes: number;
  imageClassName: string;
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
