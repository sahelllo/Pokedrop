import type { Offer, Store, ValidityType } from "@/types";

export interface Coords {
  latitude: number;
  longitude: number;
}

/**
 * Haversine-Entfernung in Kilometern zwischen zwei Koordinaten.
 * Grundlage der Radius-Suche (Masterliste 6 / 17.6 / 17.7).
 */
export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371; // Erdradius km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Entscheidende Regionalitätslogik (Masterliste 17.6).
 * Ein gefundener Preis gilt NIE automatisch für alle Filialen eines Händlers.
 * Wir bestimmen die effektive Entfernung eines Angebots als die kleinste
 * Distanz zu einer *tatsächlich teilnehmenden* Filiale.
 *
 * So funktioniert der Oberhausen→Ludwigsburg-Fall (17.7): ein LOCAL-Angebot,
 * das nur an der Ludwigsburger Filiale gilt, taucht bei einem Nutzer in
 * Oberhausen mit 500 km Radius auf – obwohl der Oberhausener Markt derselben
 * Kette die Aktion NICHT hat.
 */
export function offerDistanceKm(
  offer: Offer,
  user: Coords,
  storesById: Map<string, Store>,
): number | undefined {
  // ONLINE gilt überall – keine physische Distanz.
  if (offer.validity_type === "ONLINE") return undefined;

  const stores = offer.participating_store_ids
    .map((id) => storesById.get(id))
    .filter((s): s is Store => Boolean(s));

  if (stores.length === 0) return undefined;

  let min = Infinity;
  for (const store of stores) {
    const d = haversineKm(user, store);
    if (d < min) min = d;
  }
  return min === Infinity ? undefined : min;
}

/** Die konkrete nächstgelegene teilnehmende Filiale eines Angebots. */
export function nearestParticipatingStore(
  offer: Offer,
  user: Coords,
  storesById: Map<string, Store>,
): Store | undefined {
  const stores = offer.participating_store_ids
    .map((id) => storesById.get(id))
    .filter((s): s is Store => Boolean(s));
  if (stores.length === 0) return undefined;

  return stores.reduce((best, s) =>
    haversineKm(user, s) < haversineKm(user, best) ? s : best,
  );
}

/**
 * Ist ein Angebot im Radius sichtbar?
 * ONLINE-Angebote sind immer sichtbar (werden aber separat markiert).
 */
export function isWithinRadius(
  distanceKm: number | undefined,
  validity: ValidityType,
  radiusKm: number,
): boolean {
  if (validity === "ONLINE") return true;
  if (distanceKm === undefined) return false;
  return distanceKm <= radiusKm;
}

/** Menschliche Beschreibung des Gültigkeitsmodells (Masterliste 17.6). */
export const VALIDITY_LABEL: Record<ValidityType, string> = {
  NATIONAL: "Bundesweit",
  REGIONAL: "Regional",
  STORE_GROUP: "Filialgruppe",
  LOCAL: "Lokale Filiale",
  ONLINE: "Online",
};
