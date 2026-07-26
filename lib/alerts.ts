import type { Offer, Product } from "@/types";
import type { AlertRule } from "@/lib/store";
import { evaluateDeal } from "@/lib/deals";

export interface AlertMatchContext {
  rule: AlertRule;
  product: Product;
  offer: Offer;
  /** Entfernung zur nächsten teilnehmenden Filiale (undefined = ONLINE) */
  distanceKm?: number;
  /** Radius des Nutzers in km */
  radiusKm: number;
  /** war das Produkt vorher ausverkauft? (für Restock-Regel) */
  wasOutOfStock?: boolean;
  now?: Date;
}

export interface AlertMatchResult {
  matches: boolean;
  reason: string;
}

/**
 * Alert-Matching (Masterliste 19.10 "Benachrichtige mich").
 *
 * Regeln:
 *  - mode "uvp":         Angebot ≤ Referenz-UVP
 *  - mode "wunschpreis": Angebot ≤ individuell gesetztem Wunschpreis
 *  - mode "restock":     Produkt wechselt von ausverkauft → verfügbar
 *
 * Reichweite:
 *  - scope "lokal":            nur Angebote innerhalb des Nutzer-Radius
 *                             (ONLINE zählt nicht als lokal)
 *  - scope "deutschlandweit":  Entfernung egal, ONLINE eingeschlossen
 *
 * Grundsätzlich gilt: abgelaufene Angebote und ausverkaufte Bestände lösen
 * (außer beim Restock-Alarm) keinen Alert aus.
 */
export function matchesAlert(ctx: AlertMatchContext): AlertMatchResult {
  const { rule, product, offer, distanceKm, radiusKm, wasOutOfStock } = ctx;
  const now = ctx.now ?? new Date();

  if (rule.product_id !== product.product_id) {
    return { matches: false, reason: "anderes Produkt" };
  }

  // Gültigkeitszeitraum prüfen
  const validFrom = new Date(offer.valid_from);
  const validUntil = new Date(offer.valid_until);
  // valid_until zählt bis zum Ende des Tages
  validUntil.setHours(23, 59, 59, 999);
  if (now < validFrom) return { matches: false, reason: "Angebot noch nicht gültig" };
  if (now > validUntil) return { matches: false, reason: "Angebot abgelaufen" };

  // Reichweite prüfen
  const isOnline = offer.validity_type === "ONLINE";
  if (rule.scope === "lokal") {
    if (isOnline) return { matches: false, reason: "Online-Angebot, Regel ist lokal" };
    if (distanceKm === undefined) return { matches: false, reason: "keine Filiale zuordenbar" };
    if (distanceKm > radiusKm) return { matches: false, reason: "außerhalb des Radius" };
  }

  // Modus-spezifische Prüfung
  if (rule.mode === "restock") {
    if (!wasOutOfStock) return { matches: false, reason: "kein Restock (war nicht ausverkauft)" };
    if (offer.stock_signal === "ausverkauft") {
      return { matches: false, reason: "weiterhin ausverkauft" };
    }
    return { matches: true, reason: "wieder verfügbar" };
  }

  // Preisbasierte Regeln setzen verfügbare Ware voraus
  if (offer.stock_signal === "ausverkauft") {
    return { matches: false, reason: "ausverkauft" };
  }

  if (rule.mode === "uvp") {
    // Cent-Toleranz gegen Rundungsfehler
    if (offer.price <= product.reference_uvp + 0.001) {
      const evaluation = evaluateDeal(product, offer, now);
      return { matches: true, reason: `zur UVP oder günstiger (${evaluation.badge})` };
    }
    return { matches: false, reason: "über UVP" };
  }

  if (rule.mode === "wunschpreis") {
    const target = rule.wunschpreis;
    if (target === undefined || !Number.isFinite(target) || target <= 0) {
      return { matches: false, reason: "kein gültiger Wunschpreis gesetzt" };
    }
    if (offer.price <= target + 0.001) {
      return { matches: true, reason: `unter Wunschpreis (${target} €)` };
    }
    return { matches: false, reason: "über Wunschpreis" };
  }

  return { matches: false, reason: "unbekannter Modus" };
}
