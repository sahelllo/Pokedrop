import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PokeDrop – Live-Radar für Pokémon-TCG-Deals, Drops & Events",
  description:
    "Finde Pokémon-Sammelkarten zur UVP oder günstiger in deiner Nähe. Standortbezogene Deals, Live-Drops, Pokémon-Center-Restocks, Gerüchte-Radar und ein Event-Kalender für Tauschbörsen und Card Shows in ganz Deutschland.",
  keywords: [
    "Pokémon",
    "TCG",
    "Sammelkarten",
    "Deals",
    "Restock",
    "Pokémon Center",
    "Tauschbörse",
    "UVP",
  ],
  authors: [{ name: "PokeDrop" }],
  openGraph: {
    title: "PokeDrop – Live-Radar für Pokémon-TCG-Deals",
    description:
      "Standortbezogene Pokémon-TCG-Deals, Drops, Restocks und Events – zur UVP oder günstiger.",
    type: "website",
    locale: "de_DE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} ${grotesk.variable} ${mono.variable} font-sans`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
