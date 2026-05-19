import {
  Inter,
  JetBrains_Mono,
  Saira_Condensed,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

/*
  Free/OFL font policy per spec §2.2.
  Constraint: exactly TWO weights preloaded per script.
  Variable names are stable — if licensed fonts (Söhne Schmal / Aktiv Grotesk / 29LT Bukra / TPTQ Massira)
  are acquired later, swap any single import for next/font/local without touching consumers or @theme.
*/

// --- Latin ---

export const latinDisplay = Saira_Condensed({
  subsets: ["latin"],
  weight: ["800", "900"], // ExtraBold + Black — display weights for industrial headlines
  variable: "--font-latin-display-loaded",
  display: "swap",
  preload: true,
});

export const latinBody = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-latin-body-loaded",
  display: "swap",
  preload: true,
});

export const latinMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-latin-mono-loaded",
  display: "swap",
  preload: true,
});

// --- Arabic ---

// IBM Plex Sans Arabic — engineered sans with sharp vertical strokes
// and a modern industrial feel. Same family for display + body so the
// page reads as one typographic system. OFL-licensed.
export const arabicDisplay = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["700"],
  variable: "--font-arabic-display-loaded",
  display: "swap",
  preload: true,
});

export const arabicBody = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-arabic-body-loaded",
  display: "swap",
  preload: true,
});

// Convenience: every CSS variable a layout needs to set on <html className=...>
export const fontVariables = [
  latinDisplay.variable,
  latinBody.variable,
  latinMono.variable,
  arabicDisplay.variable,
  arabicBody.variable,
].join(" ");
