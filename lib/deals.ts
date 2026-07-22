import type {
  DealBadge,
  DealEvaluation,
  Offer,
  Product,
  VerificationStatus,
} from "@/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Produktalter in Monaten (Masterliste 12: 12-Monats-Geschäftsregel). */
export function productAgeMonths(product: Product, now = new Date()): number {
  const release = new Date(product.release_date);
  return (now.getTime() - release.getTime()) / MS_PER_DAY / 30.44;
}

export function isCurrentProduct(product: Product, now = new Date()): boolean {
  return (
    productAgeMonths(product, now) <= 12 &&
    product.availability_status === "aktuell"
  );
}

/**
 * Deal-Bewertung als echte Funktion (Masterliste 12–14).
 *
 * 0–12 Monate seit Release  → UVP als primäre Referenz.
 *     Unter UVP = sehr guter Deal, UVP = guter/normaler Deal.
 * >12 Monate                → UVP + Markt-Referenzpreis + individuelle
 *     Good-/Great-Deal-Schwellen.
 * Out of Print              → Markt-Referenzpreis wird stärker gewichtet;
 *     auch über historischer UVP kann ein Top-Deal vorliegen.
 *
 * Ableitung der Badge (Abschnitt 14):
 *   🔥 TOP DEAL   deutlich unter UVP / unter Great-Deal-Schwelle
 *   🟢 UVP DEAL   aktuelles Produkt zur UVP oder günstiger
 *   ✅ GUTER DEAL älteres Produkt unter Good-Deal-Schwelle
 *   🟡 MARKTPREIS ~ aktueller Referenz-Markt
 *   🔴 ÜBER MARKT deutlich über Referenzwert
 */
export function evaluateDeal(
  product: Product,
  offer: Offer,
  now = new Date(),
): DealEvaluation {
  const price = offer.price;
  const uvp = product.reference_uvp;
  const current = isCurrentProduct(product, now);

  const savingsVsUvp = uvp - price;
  const savingsPct = uvp > 0 ? (savingsVsUvp / uvp) * 100 : 0;

  let badge: DealBadge;
  let referenceLabel: string;
  let referencePrice: number;

  if (current) {
    // --- Aktuelles Produkt: UVP ist der Maßstab ------------------------
    referenceLabel = "UVP";
    referencePrice = uvp;

    // Great-Deal-Schwelle greift auch bei aktuellen Produkten, falls gesetzt;
    // sonst gilt "deutlich unter UVP" (>= 15 %).
    const greatCut = product.great_deal_threshold || uvp * 0.85;

    if (price <= greatCut) badge = "TOP_DEAL";
    else if (price <= uvp + 0.01) badge = "UVP_DEAL";
    else if (price <= uvp * 1.08) badge = "MARKTPREIS";
    else badge = "UEBER_MARKT";
  } else {
    // --- Älteres / Out-of-Print-Produkt: Markt + individuelle Schwellen -
    const market = product.market_reference_price || uvp;
    referenceLabel = "Marktpreis";
    referencePrice = market;

    const great = product.great_deal_threshold || market * 0.85;
    const good = product.good_deal_threshold || market * 0.97;

    if (price <= uvp + 0.01 && uvp < market) {
      // Seltener Glücksfall: altes Produkt sogar noch zur alten UVP.
      badge = "TOP_DEAL";
      referenceLabel = "UVP";
      referencePrice = uvp;
    } else if (price <= great) badge = "TOP_DEAL";
    else if (price <= good) badge = "GUTER_DEAL";
    else if (price <= market * 1.05) badge = "MARKTPREIS";
    else badge = "UEBER_MARKT";
  }

  return {
    badge,
    referenceLabel,
    referencePrice,
    savingsVsUvp,
    savingsPct,
    isCurrent: current,
  };
}

/** Sortier-Priorität der Badge (höher = besser), Masterliste 17.9. */
const BADGE_PRIORITY: Record<DealBadge, number> = {
  TOP_DEAL: 100,
  UVP_DEAL: 80,
  GUTER_DEAL: 60,
  MARKTPREIS: 30,
  UEBER_MARKT: 5,
};

const VERIFICATION_BONUS: Record<VerificationStatus, number> = {
  VERIFIED: 20,
  REGIONAL_CONFIRMED: 14,
  PROBABLE: 7,
  COMMUNITY_UNVERIFIED: 0,
};

export function daysLeft(offer: Offer, now = new Date()): number {
  const end = new Date(offer.valid_until);
  return Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY);
}

/**
 * Rang-Score fürs Feed-Sorting (Masterliste 17.9).
 * Kombiniert Deal-Qualität, Verifizierung, Entfernung, Restlaufzeit und
 * Verfügbarkeit. Abwertung für unverifiziert/abgelaufen/über Markt.
 */
export function rankScore(params: {
  evaluation: DealEvaluation;
  offer: Offer;
  distanceKm?: number;
  radiusKm: number;
  daysLeft: number;
}): number {
  const { evaluation, offer, distanceKm, radiusKm, daysLeft } = params;

  let score = BADGE_PRIORITY[evaluation.badge] * 10;
  score += VERIFICATION_BONUS[offer.verification_status];

  // Ersparnis in % fließt moderat ein.
  score += Math.max(0, evaluation.savingsPct) * 1.5;

  // Nähe: je näher, desto besser (relativ zum eingestellten Radius).
  if (distanceKm !== undefined && radiusKm > 0) {
    score += (1 - Math.min(distanceKm, radiusKm) / radiusKm) * 40;
  } else if (offer.validity_type === "ONLINE") {
    score += 12; // Online immer erreichbar, aber ohne Nähe-Bonus
  }

  // Restlaufzeit: bald ablaufende gültige Deals leicht hochziehen (Dringlichkeit),
  // abgelaufene stark abwerten.
  if (daysLeft < 0) score -= 500;
  else if (daysLeft <= 2) score += 8;

  // Verfügbarkeit (Crowd Intelligence).
  if (offer.stock_signal === "ausverkauft") score -= 120;
  else if (offer.stock_signal === "wenig_bestand") score += 4;

  return score;
}

/* ------------------------------------------------------------------ */
/*  Badge-Metadaten für die UI                                         */
/* ------------------------------------------------------------------ */

export const BADGE_META: Record<
  DealBadge,
  { label: string; emoji: string; color: string; bg: string; ring: string }
> = {
  TOP_DEAL: {
    label: "TOP DEAL",
    emoji: "🔥",
    color: "#ff4d6d",
    bg: "rgba(255,77,109,0.14)",
    ring: "rgba(255,77,109,0.5)",
  },
  UVP_DEAL: {
    label: "UVP DEAL",
    emoji: "🟢",
    color: "#31d158",
    bg: "rgba(49,209,88,0.14)",
    ring: "rgba(49,209,88,0.45)",
  },
  GUTER_DEAL: {
    label: "GUTER DEAL",
    emoji: "✅",
    color: "#3fb950",
    bg: "rgba(63,185,80,0.13)",
    ring: "rgba(63,185,80,0.4)",
  },
  MARKTPREIS: {
    label: "MARKTPREIS",
    emoji: "🟡",
    color: "#f0b429",
    bg: "rgba(240,180,41,0.13)",
    ring: "rgba(240,180,41,0.4)",
  },
  UEBER_MARKT: {
    label: "ÜBER MARKT",
    emoji: "🔴",
    color: "#f2555a",
    bg: "rgba(242,85,90,0.12)",
    ring: "rgba(242,85,90,0.35)",
  },
};

export const VERIFICATION_META: Record<
  VerificationStatus,
  { label: string; short: string; color: string }
> = {
  VERIFIED: { label: "Verifiziert", short: "Verifiziert", color: "#31d158" },
  REGIONAL_CONFIRMED: {
    label: "Regional bestätigt",
    short: "Regional",
    color: "#3aa0ff",
  },
  PROBABLE: { label: "Wahrscheinlich", short: "Wahrsch.", color: "#f0b429" },
  COMMUNITY_UNVERIFIED: {
    label: "Community – unbestätigt",
    short: "Community",
    color: "#9aa3b2",
  },
};
