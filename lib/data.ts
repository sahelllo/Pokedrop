import { offers } from "@/data/offers";
import { products, productsById } from "@/data/products";
import { retailers, retailersByBrand } from "@/data/retailers";
import { stores, storesById } from "@/data/stores";
import { events } from "@/data/events";
import { liveDrops } from "@/data/drops";
import { rumors } from "@/data/rumors";
import type {
  DealBadge,
  DealView,
  Offer,
  PokeEvent,
  Product,
  ProductType,
} from "@/types";
import { daysLeft, evaluateDeal, rankScore } from "./deals";
import {
  isWithinRadius,
  nearestParticipatingStore,
  offerDistanceKm,
  type Coords,
} from "./geo";

/**
 * Datenzugriffsschicht (Abschnitt 3 der Aufgabe).
 * Kapselt alle Seed-Daten hinter Query-Funktionen, damit später ein echtes
 * Backend/DB angeflanscht werden kann, ohne die UI umzubauen.
 */

export {
  offers,
  products,
  productsById,
  retailers,
  retailersByBrand,
  stores,
  storesById,
  events,
  liveDrops,
  rumors,
};

export function getProduct(productId: string): Product | undefined {
  return productsById.get(productId);
}

export function getOffersForProduct(productId: string): Offer[] {
  return offers.filter((o) => o.product_id === productId);
}

export interface DealFilters {
  /** nur Angebote zur UVP oder darunter */
  onlyUnderUvp?: boolean;
  /** nur verifizierte Angebote */
  onlyVerified?: boolean;
  /** Set-Namen (leer = alle) */
  sets?: string[];
  /** Produktarten */
  productTypes?: ProductType[];
  /** Händler-Marken */
  retailerBrands?: string[];
  /** Sprache */
  languages?: string[];
  /** Preisspanne */
  priceMin?: number;
  priceMax?: number;
  /** nur bestimmte Badges */
  badges?: DealBadge[];
  /** Freitextsuche */
  query?: string;
}

/**
 * Kern-Query: standortbezogene, gerankte Deal-Views (Masterliste 17.7–17.9).
 * Berücksichtigt Radius, Gültigkeitslogik, Deal-Bewertung und Verifizierung.
 */
export function getDealViews(
  user: Coords,
  radiusKm: number,
  filters: DealFilters = {},
  now = new Date(),
): DealView[] {
  const views: DealView[] = [];

  for (const offer of offers) {
    const product = productsById.get(offer.product_id);
    const retailer = retailersByBrand.get(offer.retailer_brand);
    if (!product || !retailer) continue;

    const distanceKm = offerDistanceKm(offer, user, storesById);
    if (!isWithinRadius(distanceKm, offer.validity_type, radiusKm)) continue;

    const evaluation = evaluateDeal(product, offer, now);
    const dLeft = daysLeft(offer, now);
    const nearestStore = nearestParticipatingStore(offer, user, storesById);
    const score = rankScore({
      evaluation,
      offer,
      distanceKm,
      radiusKm,
      daysLeft: dLeft,
    });

    views.push({
      offer,
      product,
      retailer,
      nearestStore,
      distanceKm,
      evaluation,
      rankScore: score,
      daysLeft: dLeft,
    });
  }

  const filtered = applyFilters(views, filters);
  filtered.sort((a, b) => b.rankScore - a.rankScore);
  return filtered;
}

function applyFilters(views: DealView[], f: DealFilters): DealView[] {
  return views.filter((v) => {
    if (f.onlyUnderUvp && v.offer.price > v.product.reference_uvp + 0.01) return false;
    if (f.onlyVerified && v.offer.verification_status === "COMMUNITY_UNVERIFIED") return false;
    if (f.sets && f.sets.length > 0 && !f.sets.includes(v.product.set_name)) return false;
    if (f.productTypes && f.productTypes.length > 0 && !f.productTypes.includes(v.product.product_type)) return false;
    if (f.retailerBrands && f.retailerBrands.length > 0 && !f.retailerBrands.includes(v.offer.retailer_brand)) return false;
    if (f.languages && f.languages.length > 0 && !f.languages.includes(v.product.language)) return false;
    if (f.badges && f.badges.length > 0 && !f.badges.includes(v.evaluation.badge)) return false;
    if (f.priceMin != null && v.offer.price < f.priceMin) return false;
    if (f.priceMax != null && v.offer.price > f.priceMax) return false;
    if (f.query && f.query.trim().length > 0) {
      const q = f.query.toLowerCase();
      const hay = `${v.product.product_name} ${v.product.set_name} ${v.offer.retailer_brand} ${v.nearestStore?.city ?? ""} ${v.product.product_type}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Ein einzelner Deal-View für die Produktdetailseite. */
export function getDealViewForOffer(
  offer: Offer,
  user: Coords,
  radiusKm: number,
  now = new Date(),
): DealView | undefined {
  const product = productsById.get(offer.product_id);
  const retailer = retailersByBrand.get(offer.retailer_brand);
  if (!product || !retailer) return undefined;
  const distanceKm = offerDistanceKm(offer, user, storesById);
  const evaluation = evaluateDeal(product, offer, now);
  const dLeft = daysLeft(offer, now);
  const nearestStore = nearestParticipatingStore(offer, user, storesById);
  const score = rankScore({ evaluation, offer, distanceKm, radiusKm, daysLeft: dLeft });
  return { offer, product, retailer, nearestStore, distanceKm, evaluation, rankScore: score, daysLeft: dLeft };
}

/* ---- Filter-Optionslisten für die UI ---------------------------------- */

export const ALL_SETS = Array.from(new Set(products.map((p) => p.set_name)));
export const ALL_PRODUCT_TYPES = Array.from(
  new Set(products.map((p) => p.product_type)),
) as ProductType[];
export const ALL_RETAILER_BRANDS = Array.from(
  new Set(offers.map((o) => o.retailer_brand)),
);
export const ALL_LANGUAGES = Array.from(new Set(products.map((p) => p.language)));

/* ---- Events ----------------------------------------------------------- */

export interface EventFilters {
  window?: "today" | "weekend" | "next30";
  types?: string[];
  onlyTrading?: boolean;
}

export function getEventsInRadius(
  user: Coords,
  radiusKm: number,
  filters: EventFilters = {},
  now = new Date(),
): (PokeEvent & { distanceKm: number })[] {
  const out: (PokeEvent & { distanceKm: number })[] = [];
  for (const ev of events) {
    const distanceKm = haversineForEvent(user, ev);
    if (distanceKm > radiusKm) continue;
    if (!matchesEventWindow(ev, filters.window, now)) continue;
    if (filters.types && filters.types.length > 0 && !filters.types.includes(ev.event_type)) continue;
    if (filters.onlyTrading && !ev.trading_available) continue;
    out.push({ ...ev, distanceKm });
  }
  out.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
  return out;
}

function haversineForEvent(user: Coords, ev: PokeEvent): number {
  const R = 6371;
  const dLat = ((ev.latitude - user.latitude) * Math.PI) / 180;
  const dLon = ((ev.longitude - user.longitude) * Math.PI) / 180;
  const lat1 = (user.latitude * Math.PI) / 180;
  const lat2 = (ev.latitude * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function matchesEventWindow(
  ev: PokeEvent,
  window: EventFilters["window"],
  now: Date,
): boolean {
  if (!window) return new Date(ev.date_start) >= startOfDay(now) || withinMultiDay(ev, now);
  const start = new Date(ev.date_start);
  const today = startOfDay(now);
  if (window === "today") {
    return sameDay(start, now) || withinMultiDay(ev, now);
  }
  if (window === "weekend") {
    const { sat, sun } = upcomingWeekend(now);
    return (
      (start >= sat && start <= endOfDay(sun)) ||
      (ev.date_end != null && new Date(ev.date_end) >= sat && start <= endOfDay(sun))
    );
  }
  // next30
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);
  return start >= today && start <= in30;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function sameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function withinMultiDay(ev: PokeEvent, now: Date): boolean {
  if (!ev.date_end) return false;
  const s = startOfDay(new Date(ev.date_start));
  const e = endOfDay(new Date(ev.date_end));
  return now >= s && now <= e;
}
function upcomingWeekend(now: Date): { sat: Date; sun: Date } {
  const d = startOfDay(now);
  const day = d.getDay(); // 0 So .. 6 Sa
  const daysToSat = (6 - day + 7) % 7;
  const sat = new Date(d);
  sat.setDate(d.getDate() + daysToSat);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return { sat, sun };
}

export const ALL_EVENT_TYPES = Array.from(new Set(events.map((e) => e.event_type)));
