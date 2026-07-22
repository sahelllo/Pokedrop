import type { Product } from "@/types";

export interface PricePoint {
  date: string;
  label: string;
  uvp: number;
  market: number;
  /** bester bei PokeDrop gesehener Dealpreis an diesem Punkt */
  bestDeal: number;
}

/**
 * Deterministischer Preisverlauf für die Produktdetailseite (Recharts).
 * Zeigt UVP (konstant), Markt-Referenzpreis (Trend) und PokeDrop-Dealpreise.
 */
export function buildPriceHistory(product: Product, months = 12): PricePoint[] {
  const points: PricePoint[] = [];
  const now = new Date("2026-07-22");
  let seed = hash(product.product_id);
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const market = product.market_reference_price;
  const uvp = product.reference_uvp;
  const isOlder = product.availability_status !== "aktuell";

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const progress = (months - 1 - i) / (months - 1);

    // Ältere Produkte: Markt steigt tendenziell über UVP.
    const marketAtPoint = isOlder
      ? uvp + (market - uvp) * progress * (0.85 + rnd() * 0.3)
      : market * (0.98 + rnd() * 0.06);

    const bestDeal = Math.max(
      (product.pokedrop_lowest ?? uvp * 0.85),
      marketAtPoint * (0.8 + rnd() * 0.12),
    );

    points.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("de-DE", { month: "short", year: "2-digit" }),
      uvp: round(uvp),
      market: round(marketAtPoint),
      bestDeal: round(bestDeal),
    });
  }
  return points;
}

/**
 * Täglicher Preisverlauf der letzten N Tage (30-Tage-Trend, Recharts).
 */
export function buildPriceHistoryDaily(product: Product, days = 30): PricePoint[] {
  const points: PricePoint[] = [];
  const now = new Date("2026-07-22");
  let seed = hash(product.product_id + ":d");
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const uvp = product.reference_uvp;
  const market = product.market_reference_price;
  const isOlder = product.availability_status !== "aktuell";
  const low = product.pokedrop_lowest ?? uvp * 0.85;

  // sanfter Random-Walk um den Referenzpreis
  let cur = isOlder ? market : uvp;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    cur += (rnd() - 0.5) * (isOlder ? market : uvp) * 0.03;
    cur = Math.max(low * 0.98, Math.min(cur, (isOlder ? market : uvp) * 1.15));
    const bestDeal = Math.max(low, cur * (0.82 + rnd() * 0.1));
    points.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
      uvp: round(uvp),
      market: round(cur),
      bestDeal: round(bestDeal),
    });
  }
  return points;
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
