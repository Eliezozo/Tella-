import type { Creation, Review, TailorProfile } from "@/types";
import type { CategoryKey } from "@/types";

type CreationMetadata = {
  imageClassName?: string;
  palette?: Creation["palette"];
  composition?: Creation["composition"];
  details?: string[];
  mediaThumbnails?: string[];
  availableSizes?: string[];
  selectedSize?: string;
};

export function mapTailorProfile(record: TailorProfile): TailorProfile {
  return record;
}

export function mapCreation(record: Creation): Creation {
  return record;
}

export function mapReview(record: Review): Review {
  return record;
}

export function isCategoryKey(value: string): value is CategoryKey {
  return [
    "robes",
    "homme",
    "mariage",
    "enfant",
    "uniformes",
    "traditionnel",
  ].includes(value);
}

export function buildCreationMetadata(creation: Creation): CreationMetadata {
  return {
    imageClassName: creation.imageClassName,
    palette: creation.palette,
    composition: creation.composition,
    details: creation.details,
    mediaThumbnails: creation.mediaThumbnails,
    availableSizes: creation.availableSizes,
    selectedSize: creation.selectedSize,
  };
}

export function parseCreationMetadata(metadata: unknown): CreationMetadata {
  if (!metadata || typeof metadata !== "object") {
    return {};
  }
  return metadata as CreationMetadata;
}
