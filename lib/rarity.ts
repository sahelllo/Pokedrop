import type { Product } from "@/types";

/**
 * Seltenheit eines Produkts.
 *
 * Grundgedanke: Seltenheit ist keine Meinung, sondern das, was der Markt
 * dafür verlangt. Wenn eine Box mit 54,99 € UVP heute für 120 € gehandelt
 * wird, ist sie selten – egal was auf der Packung steht.
 *
 * Deshalb ist der **Aufschlag** die Hauptgröße:
 *
 *     Aufschlag = Marktpreis / UVP − 1
 *
 * Ein Produkt, das nicht mehr gedruckt wird ("out_of_print"), rückt
 * zusätzlich eine Stufe hoch: Der Nachschub ist endgültig versiegt.
 */

export type RarityTier = "standard" | "gesucht" | "selten" | "sehr_selten" | "grail";

export interface RarityInfo {
  tier: RarityTier;
  /** Aufschlag gegenüber der UVP in Prozent (kann negativ sein) */
  premiumPct: number;
  /** ein Satz Klartext, warum diese Stufe */
  reason: string;
}

export interface RarityMeta {
  label: string;
  /** Alltagssprache, erscheint als Erklärung */
  hint: string;
  color: string;
  /** je höher, desto seltener – zum Sortieren */
  order: number;
}

export const RARITY_META: Record<RarityTier, RarityMeta> = {
  standard: {
    label: "Standard",
    hint: "Überall zu bekommen",
    color: "var(--heat-0)",
    order: 0,
  },
  gesucht: {
    label: "Gesucht",
    hint: "Läuft langsam aus",
    color: "var(--radar-mid)",
    order: 1,
  },
  selten: {
    label: "Selten",
    hint: "Deutlich über UVP gehandelt",
    color: "var(--heat-1)",
    order: 2,
  },
  sehr_selten: {
    label: "Sehr selten",
    hint: "Schwer zu bekommen",
    color: "var(--heat-3)",
    order: 3,
  },
  grail: {
    label: "Sammlerstück",
    hint: "Wird kaum noch angeboten",
    color: "var(--heat-4)",
    order: 4,
  },
};

export const RARITY_ORDER: RarityTier[] = [
  "grail",
  "sehr_selten",
  "selten",
  "gesucht",
  "standard",
];

/** Schwellen des Aufschlags in Prozent. Bewusst als Konstante, damit die
 *  Grenzen an einer Stelle stehen und getestet werden können. */
export const RARITY_THRESHOLDS = {
  gesucht: 5,
  selten: 20,
  sehr_selten: 50,
  grail: 100,
} as const;

const TIERS_ASC: RarityTier[] = ["standard", "gesucht", "selten", "sehr_selten", "grail"];

function tierFromPremium(premiumPct: number): RarityTier {
  if (premiumPct >= RARITY_THRESHOLDS.grail) return "grail";
  if (premiumPct >= RARITY_THRESHOLDS.sehr_selten) return "sehr_selten";
  if (premiumPct >= RARITY_THRESHOLDS.selten) return "selten";
  if (premiumPct >= RARITY_THRESHOLDS.gesucht) return "gesucht";
  return "standard";
}

function bumpUp(tier: RarityTier): RarityTier {
  const i = TIERS_ASC.indexOf(tier);
  return TIERS_ASC[Math.min(i + 1, TIERS_ASC.length - 1)];
}

export function rarityOf(product: Product): RarityInfo {
  const uvp = product.reference_uvp;
  const market = product.market_reference_price || uvp;
  const premiumPct = uvp > 0 ? ((market - uvp) / uvp) * 100 : 0;

  const base = tierFromPremium(premiumPct);
  const outOfPrint = product.availability_status === "out_of_print";

  // "Wird nicht mehr gedruckt" hebt eine Stufe an – aber die oberste Stufe
  // muss man sich am Markt verdienen. Sonst wäre jedes eingestellte Produkt
  // automatisch ein Sammlerstück und die Auszeichnung wertlos.
  let tier = base;
  if (outOfPrint && base !== "grail") {
    const bumped = bumpUp(base);
    tier = bumped === "grail" ? "sehr_selten" : bumped;
  }

  const rounded = Math.round(premiumPct);
  let reason: string;
  if (rounded >= RARITY_THRESHOLDS.gesucht) {
    reason = `Wird ${rounded} % über UVP gehandelt`;
  } else if (rounded <= -5) {
    reason = `Aktuell ${Math.abs(rounded)} % unter UVP zu haben`;
  } else {
    reason = "Wird etwa zur UVP gehandelt";
  }
  if (outOfPrint) reason += " · wird nicht mehr gedruckt";

  return { tier, premiumPct, reason };
}

/** Seltenste zuerst; bei Gleichstand der höhere Marktwert. */
export function compareByRarity(a: Product, b: Product): number {
  const ra = rarityOf(a);
  const rb = rarityOf(b);
  const diff = RARITY_META[rb.tier].order - RARITY_META[ra.tier].order;
  if (diff !== 0) return diff;
  return rb.premiumPct - ra.premiumPct;
}

/** Rangliste: seltenstes Produkt auf Platz 1. */
export function rankByRarity(list: Product[]): Product[] {
  return [...list].sort(compareByRarity);
}
