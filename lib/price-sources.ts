import type { Product } from "@/types";
import { getOffersForProduct } from "@/lib/data";

export interface PriceSource {
  id: string;
  name: string;
  logo: string; // Emoji/Kürzel als Platzhalter-Logo
  price: number;
  currency: "EUR";
  url?: string;
  inStock: boolean;
  note?: string;
  isLowest?: boolean;
}

/**
 * Live-Preisaggregation über mehrere Quellen (Masterliste-Erweiterung).
 * Zeigt Cardmarket, TCGplayer, Pokémon Center und den besten lokalen
 * Händlerpreis – Bestpreis wird hervorgehoben.
 *
 * Hinweis: seed-/demo-basiert (die App hat kein Backend). Die Struktur ist so
 * gebaut, dass hier später echte APIs eingehängt werden können.
 */
export function getPriceSources(product: Product): PriceSource[] {
  const base = product.market_reference_price || product.reference_uvp;
  const seed = hash(product.product_id);
  const rnd = mulberry(seed);

  // bester lokaler Händlerpreis aus den vorhandenen Angeboten
  const offers = getOffersForProduct(product.product_id);
  const localBest = offers.length ? Math.min(...offers.map((o) => o.price)) : undefined;

  const sources: PriceSource[] = [
    {
      id: "cardmarket",
      name: "Cardmarket",
      logo: "🟠",
      price: round(base * (0.98 + rnd() * 0.14)),
      currency: "EUR",
      url: "https://www.cardmarket.com/",
      inStock: true,
      note: "EU-Marktplatz",
    },
    {
      id: "tcgplayer",
      name: "TCGplayer",
      logo: "🔵",
      price: round(base * (1.04 + rnd() * 0.18)),
      currency: "EUR",
      url: "https://www.tcgplayer.com/",
      inStock: rnd() > 0.2,
      note: "US-Markt (umgerechnet)",
    },
    {
      id: "pokemoncenter",
      name: "Pokémon Center",
      logo: "🟡",
      price: round(product.reference_uvp * (1.0 + rnd() * 0.06)),
      currency: "EUR",
      url: "https://www.pokemoncenter.com/",
      inStock: product.availability_status === "aktuell" && rnd() > 0.4,
      note: "offiziell (UVP)",
    },
  ];

  if (localBest !== undefined) {
    sources.push({
      id: "local",
      name: "Lokaler Händler",
      logo: "📍",
      price: round(localBest),
      currency: "EUR",
      inStock: true,
      note: "PokeDrop-Radar",
    });
  }

  // niedrigsten verfügbaren Preis markieren
  const available = sources.filter((s) => s.inStock);
  if (available.length) {
    const min = Math.min(...available.map((s) => s.price));
    for (const s of sources) if (s.inStock && s.price === min) s.isLowest = true;
  }

  return sources.sort((a, b) => a.price - b.price);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
