export type DiscoveryState = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
};

export const discoveryStore: DiscoveryState = {
  selectedCity: "Toutes les villes",
  setSelectedCity(selectedCity: string) {
    this.selectedCity = selectedCity;
  },
};
