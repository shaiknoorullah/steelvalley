import type { ReactNode } from "react";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata = {
  title: "Steel Valley",
  description: "Stainless steel fabrication — Jeddah, Saudi Arabia.",
};

// TODO: move className={fontVariables} to [locale]/layout.tsx once feat-intl lands. Orchestrator handles during merge.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
