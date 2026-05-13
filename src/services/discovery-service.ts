import { creations, tailorProfiles } from "@/lib/mock-data";

export function getFeaturedTailors() {
  return tailorProfiles.slice(0, 3);
}

export function getRecentCreations() {
  return creations.slice(0, 6);
}
