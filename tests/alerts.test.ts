import { describe, it, expect } from "vitest";
import { matchesAlert } from "@/lib/alerts";
import type { Offer, Product } from "@/types";
import type { AlertRule } from "@/lib/store";

const NOW = new Date("2026-07-22T12:00:00Z");

function makeProduct(over: Partial<Product> = {}): Product {
  return {
    product_id: "p-test",
    product_name: "Testprodukt",
    set_name: "Testset",
    product_type: "ETB",
    language: "Deutsch",
    release_date: "2026-05-01",
    reference_uvp: 100,
    uvp_source: "test",
    market_reference_price: 100,
    good_deal_threshold: 90,
    great_deal_threshold: 85,
    price_reference_updated_at: "2026-07-01",
    availability_status: "aktuell",
    ...over,
  };
}

function makeOffer(over: Partial<Offer> = {}): Offer {
  return {
    offer_id: "of-test",
    product_id: "p-test",
    retailer_group: "kaufland",
    retailer_brand: "Kaufland",
    price: 95,
    valid_from: "2026-07-20",
    valid_until: "2026-07-30",
    validity_type: "LOCAL",
    participating_store_ids: ["s1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    ...over,
  };
}

function rule(over: Partial<AlertRule> = {}): AlertRule {
  return { product_id: "p-test", mode: "uvp", scope: "deutschlandweit", ...over };
}

describe("matchesAlert – Grundvoraussetzungen", () => {
  it("greift nicht bei einem anderen Produkt", () => {
    const r = matchesAlert({
      rule: rule({ product_id: "p-anderes" }),
      product: makeProduct(),
      offer: makeOffer(),
      radiusKm: 100,
      distanceKm: 10,
      now: NOW,
    });
    expect(r.matches).toBe(false);
  });

  it("greift nicht bei abgelaufenem Angebot", () => {
    const r = matchesAlert({
      rule: rule(),
      product: makeProduct(),
      offer: makeOffer({ valid_until: "2026-07-01" }),
      radiusKm: 100,
      distanceKm: 10,
      now: NOW,
    });
    expect(r.matches).toBe(false);
    expect(r.reason).toContain("abgelaufen");
  });

  it("greift nicht, wenn das Angebot noch nicht gültig ist", () => {
    const r = matchesAlert({
      rule: rule(),
      product: makeProduct(),
      offer: makeOffer({ valid_from: "2026-08-01", valid_until: "2026-08-10" }),
      radiusKm: 100,
      distanceKm: 10,
      now: NOW,
    });
    expect(r.matches).toBe(false);
  });

  it("am letzten Gültigkeitstag greift der Alert noch", () => {
    const r = matchesAlert({
      rule: rule(),
      product: makeProduct(),
      offer: makeOffer({ valid_until: "2026-07-22" }),
      radiusKm: 100,
      distanceKm: 10,
      now: NOW,
    });
    expect(r.matches).toBe(true);
  });
});

describe("matchesAlert – Modus UVP", () => {
  it("löst bei Preis unter UVP aus", () => {
    expect(
      matchesAlert({ rule: rule(), product: makeProduct(), offer: makeOffer({ price: 89 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches,
    ).toBe(true);
  });

  it("löst exakt zur UVP aus", () => {
    expect(
      matchesAlert({ rule: rule(), product: makeProduct(), offer: makeOffer({ price: 100 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches,
    ).toBe(true);
  });

  it("löst über UVP NICHT aus", () => {
    expect(
      matchesAlert({ rule: rule(), product: makeProduct(), offer: makeOffer({ price: 100.5 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches,
    ).toBe(false);
  });

  it("löst bei ausverkaufter Ware nicht aus", () => {
    expect(
      matchesAlert({ rule: rule(), product: makeProduct(), offer: makeOffer({ price: 50, stock_signal: "ausverkauft" }), radiusKm: 100, distanceKm: 5, now: NOW }).matches,
    ).toBe(false);
  });
});

describe("matchesAlert – Modus Wunschpreis", () => {
  const r = rule({ mode: "wunschpreis", wunschpreis: 80 });

  it("löst unter dem Wunschpreis aus", () => {
    expect(matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ price: 79.99 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches).toBe(true);
  });

  it("löst exakt auf dem Wunschpreis aus", () => {
    expect(matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ price: 80 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches).toBe(true);
  });

  it("löst darüber nicht aus", () => {
    expect(matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ price: 80.5 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches).toBe(false);
  });

  it("ohne gesetzten Wunschpreis löst nichts aus", () => {
    const bad = rule({ mode: "wunschpreis", wunschpreis: undefined });
    expect(matchesAlert({ rule: bad, product: makeProduct(), offer: makeOffer({ price: 1 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches).toBe(false);
  });

  it("negativer Wunschpreis wird abgelehnt", () => {
    const bad = rule({ mode: "wunschpreis", wunschpreis: -10 });
    expect(matchesAlert({ rule: bad, product: makeProduct(), offer: makeOffer({ price: 1 }), radiusKm: 100, distanceKm: 5, now: NOW }).matches).toBe(false);
  });
});

describe("matchesAlert – Modus Restock", () => {
  const r = rule({ mode: "restock" });

  it("löst aus, wenn vorher ausverkauft und jetzt verfügbar", () => {
    expect(
      matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ stock_signal: "verfuegbar" }), radiusKm: 100, distanceKm: 5, wasOutOfStock: true, now: NOW }).matches,
    ).toBe(true);
  });

  it("löst nicht aus, wenn nie ausverkauft war", () => {
    expect(
      matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ stock_signal: "verfuegbar" }), radiusKm: 100, distanceKm: 5, wasOutOfStock: false, now: NOW }).matches,
    ).toBe(false);
  });

  it("löst nicht aus, wenn weiterhin ausverkauft", () => {
    expect(
      matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ stock_signal: "ausverkauft" }), radiusKm: 100, distanceKm: 5, wasOutOfStock: true, now: NOW }).matches,
    ).toBe(false);
  });

  it("ignoriert den Preis (auch teure Restocks melden)", () => {
    expect(
      matchesAlert({ rule: r, product: makeProduct(), offer: makeOffer({ price: 999, stock_signal: "verfuegbar" }), radiusKm: 100, distanceKm: 5, wasOutOfStock: true, now: NOW }).matches,
    ).toBe(true);
  });
});

describe("matchesAlert – Reichweite (lokal vs. deutschlandweit)", () => {
  it("lokal: innerhalb des Radius löst aus", () => {
    expect(
      matchesAlert({ rule: rule({ scope: "lokal" }), product: makeProduct(), offer: makeOffer({ price: 90 }), radiusKm: 100, distanceKm: 50, now: NOW }).matches,
    ).toBe(true);
  });

  it("lokal: außerhalb des Radius löst NICHT aus", () => {
    expect(
      matchesAlert({ rule: rule({ scope: "lokal" }), product: makeProduct(), offer: makeOffer({ price: 90 }), radiusKm: 100, distanceKm: 340, now: NOW }).matches,
    ).toBe(false);
  });

  it("lokal: genau am Radius löst aus (inklusiv)", () => {
    expect(
      matchesAlert({ rule: rule({ scope: "lokal" }), product: makeProduct(), offer: makeOffer({ price: 90 }), radiusKm: 100, distanceKm: 100, now: NOW }).matches,
    ).toBe(true);
  });

  it("lokal: ONLINE-Angebote lösen nicht aus", () => {
    expect(
      matchesAlert({ rule: rule({ scope: "lokal" }), product: makeProduct(), offer: makeOffer({ price: 90, validity_type: "ONLINE", participating_store_ids: [] }), radiusKm: 100, now: NOW }).matches,
    ).toBe(false);
  });

  it("deutschlandweit: auch weit entfernte Angebote lösen aus", () => {
    expect(
      matchesAlert({ rule: rule({ scope: "deutschlandweit" }), product: makeProduct(), offer: makeOffer({ price: 90 }), radiusKm: 100, distanceKm: 340, now: NOW }).matches,
    ).toBe(true);
  });

  it("deutschlandweit: ONLINE-Angebote lösen aus", () => {
    expect(
      matchesAlert({ rule: rule({ scope: "deutschlandweit" }), product: makeProduct(), offer: makeOffer({ price: 90, validity_type: "ONLINE", participating_store_ids: [] }), radiusKm: 100, now: NOW }).matches,
    ).toBe(true);
  });
});
