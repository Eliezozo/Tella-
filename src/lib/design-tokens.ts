/**
 * Design tokens from provided JSON spec (Ceedow / artisan premium).
 * @see src/app/globals.css for CSS variable bindings
 */
export const designTokens = {
  colors: {
    primary: "#C4522A",
    secondary: "#A99170",
    accent: "#C4522A",
    background: "#FDFAF6",
    textPrimary: "#1A0D06",
    link: "#1A0D06",
    onPrimary: "#FDFAF6",
    onSecondaryDark: "#FEFEFC",
  },
  typography: {
    heading: "DM Sans",
    body: "Inter",
    h1: "64px",
    h2: "44.8px",
    bodySize: "12.48px",
  },
  spacing: {
    baseUnit: 4,
    borderRadius: "6px",
  },
  buttons: {
    primary: { background: "#C4522A", text: "#FDFAF6", radius: "6px" },
    secondary: { background: "#1A0D06", text: "#FEFEFC", radius: "6px" },
  },
} as const;
