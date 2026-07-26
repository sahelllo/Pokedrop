import { describe, it, expect } from "vitest";
import {
  haversineKm,
  offerDistanceKm,
  nearestParticipatingStore,
  isWithinRadius,
} from "@/lib/geo";
import type { Offer, Store } from "@/types";

const OBERHAUSEN = { latitude: 51.4696, longitude: 6.8514 };
const LUDWIGSBURG = { latitude: 48.8976, longitude: 9.1916 };
const KOELN = { latitude: 50.9375, longitude: 6.9603 };

function makeStore(over: Partial<Store> = {}): Store {
  return {
    store_id: "s1",
    retailer_group: "edeka",
    retailer_brand: "EDEKA",
    store_name: "Testfiliale",
    street: "Teststr. 1",
    city: "Teststadt",
    postal_code: "00000",
    latitude: 51.0,
    longitude: 7.0,
    ...over,
  };
}

function makeOffer(over: Partial<Offer> = {}): Offer {
  return {
    offer_id: "of1",
    product_id: "p1",
    retailer_group: "edeka",
    retailer_brand: "EDEKA",
    price: 50,
    valid_from: "2026-07-20",
    valid_until: "2026-07-30",
    validity_type: "LOCAL",
    participating_store_ids: ["s1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    ...over,
  };
}

describe("haversineKm", () => {
  it("liefert 0 für identische Punkte", () => {
    expect(haversineKm(OBERHAUSEN, OBERHAUSEN)).toBeCloseTo(0, 6);
  });

  it("berechnet Oberhausen→Ludwigsburg mit ca. 340 km (±15 km)", () => {
    const d = haversineKm(OBERHAUSEN, LUDWIGSBURG);
    expect(d).toBeGreaterThan(325);
    expect(d).toBeLessThan(355);
  });

  it("berechnet Oberhausen→Köln mit ca. 59 km (±6 km)", () => {
    const d = haversineKm(OBERHAUSEN, KOELN);
    expect(d).toBeGreaterThan(53);
    expect(d).toBeLessThan(65);
  });

  it("ist symmetrisch", () => {
    expect(haversineKm(OBERHAUSEN, LUDWIGSBURG)).toBeCloseTo(
      haversineKm(LUDWIGSBURG, OBERHAUSEN),
      6,
    );
  });
});

describe("offerDistanceKm – Regionalitätslogik (Masterliste 17.6)", () => {
  const storesById = new Map<string, Store>([
    ["lb", makeStore({ store_id: "lb", city: "Ludwigsburg", ...LUDWIGSBURG })],
    ["koeln", makeStore({ store_id: "koeln", city: "Köln", ...KOELN })],
  ]);

  it("ONLINE-Angebote haben keine physische Distanz", () => {
    const o = makeOffer({ validity_type: "ONLINE", participating_store_ids: [] });
    expect(offerDistanceKm(o, OBERHAUSEN, storesById)).toBeUndefined();
  });

  it("nimmt die NÄCHSTE teilnehmende Filiale, nicht die erste", () => {
    const o = makeOffer({ participating_store_ids: ["lb", "koeln"] });
    const d = offerDistanceKm(o, OBERHAUSEN, storesById)!;
    // Köln (~59 km) ist näher als Ludwigsburg (~340 km)
    expect(d).toBeLessThan(70);
  });

  it("liefert undefined, wenn keine Filiale auflösbar ist", () => {
    const o = makeOffer({ participating_store_ids: ["gibtsnicht"] });
    expect(offerDistanceKm(o, OBERHAUSEN, storesById)).toBeUndefined();
  });

  it("liefert undefined bei leerer Filialliste (nicht 0!)", () => {
    // Wichtig: 0 würde fälschlich „direkt vor der Tür" bedeuten.
    const o = makeOffer({ participating_store_ids: [] });
    expect(offerDistanceKm(o, OBERHAUSEN, storesById)).toBeUndefined();
  });
});

describe("nearestParticipatingStore", () => {
  const storesById = new Map<string, Store>([
    ["lb", makeStore({ store_id: "lb", city: "Ludwigsburg", ...LUDWIGSBURG })],
    ["koeln", makeStore({ store_id: "koeln", city: "Köln", ...KOELN })],
  ]);

  it("wählt die tatsächlich nächste Filiale", () => {
    const o = makeOffer({ participating_store_ids: ["lb", "koeln"] });
    expect(nearestParticipatingStore(o, OBERHAUSEN, storesById)?.city).toBe("Köln");
  });

  it("wählt aus Stuttgarter Sicht Ludwigsburg", () => {
    const o = makeOffer({ participating_store_ids: ["lb", "koeln"] });
    const stuttgart = { latitude: 48.7758, longitude: 9.1829 };
    expect(nearestParticipatingStore(o, stuttgart, storesById)?.city).toBe("Ludwigsburg");
  });
});

describe("isWithinRadius", () => {
  it("ONLINE ist immer sichtbar, auch bei Radius 0", () => {
    expect(isWithinRadius(undefined, "ONLINE", 0)).toBe(true);
  });

  it("undefined Distanz bei physischem Angebot ist NICHT sichtbar", () => {
    expect(isWithinRadius(undefined, "LOCAL", 500)).toBe(false);
  });

  it("Distanz genau am Radius zählt als drin (inklusiv)", () => {
    expect(isWithinRadius(100, "LOCAL", 100)).toBe(true);
  });

  it("Distanz knapp über Radius ist draußen", () => {
    expect(isWithinRadius(100.1, "LOCAL", 100)).toBe(false);
  });
});

describe("Der Masterlisten-Beispielfall 17.7: Oberhausen → Ludwigsburg", () => {
  const storesById = new Map<string, Store>([
    ["lb", makeStore({ store_id: "lb", city: "Ludwigsburg", ...LUDWIGSBURG })],
  ]);
  // LOCAL-Angebot, gilt NUR in der Ludwigsburger Filiale
  const offer = makeOffer({ validity_type: "LOCAL", participating_store_ids: ["lb"] });

  it("ist bei 500 km Radius sichtbar", () => {
    const d = offerDistanceKm(offer, OBERHAUSEN, storesById);
    expect(isWithinRadius(d, offer.validity_type, 500)).toBe(true);
  });

  it("ist bei 100 km Radius NICHT sichtbar", () => {
    const d = offerDistanceKm(offer, OBERHAUSEN, storesById);
    expect(isWithinRadius(d, offer.validity_type, 100)).toBe(false);
  });
});
