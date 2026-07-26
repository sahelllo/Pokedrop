import { describe, it, expect } from "vitest";
import {
  evaluateDeal,
  isCurrentProduct,
  productAgeMonths,
  daysLeft,
  rankScore,
} from "@/lib/deals";
import type { Offer, Product } from "@/types";

const NOW = new Date("2026-07-22T12:00:00Z");

function makeProduct(over: Partial<Product> = {}): Product {
  return {
    product_id: "p-test",
    product_name: "Testprodukt",
    set_name: "Testset",
    product_type: "ETB",
    language: "Deutsch",
    release_date: "2026-05-01", // ~3 Monate alt → aktuell
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
    price: 100,
    valid_from: "2026-07-20",
    valid_until: "2026-07-30",
    validity_type: "NATIONAL",
    participating_store_ids: ["s1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    ...over,
  };
}

describe("productAgeMonths / isCurrentProduct (Masterliste 12)", () => {
  it("erkennt ein 3 Monate altes Produkt als aktuell", () => {
    const p = makeProduct({ release_date: "2026-04-22" });
    expect(productAgeMonths(p, NOW)).toBeGreaterThan(2.8);
    expect(productAgeMonths(p, NOW)).toBeLessThan(3.2);
    expect(isCurrentProduct(p, NOW)).toBe(true);
  });

  it("erkennt ein 24 Monate altes Produkt als NICHT aktuell", () => {
    const p = makeProduct({ release_date: "2024-07-22", availability_status: "aeltere_kollektion" });
    expect(isCurrentProduct(p, NOW)).toBe(false);
  });

  it("behandelt out_of_print nie als aktuell, auch wenn jung", () => {
    const p = makeProduct({ release_date: "2026-06-01", availability_status: "out_of_print" });
    expect(isCurrentProduct(p, NOW)).toBe(false);
  });

  it("genau an der 12-Monats-Grenze gilt noch als aktuell", () => {
    // exakt 12 Monate vor NOW
    const p = makeProduct({ release_date: "2025-07-23" });
    expect(productAgeMonths(p, NOW)).toBeLessThanOrEqual(12);
    expect(isCurrentProduct(p, NOW)).toBe(true);
  });
});

describe("evaluateDeal – aktuelle Produkte (UVP als Referenz)", () => {
  it("deutlich unter UVP → TOP_DEAL", () => {
    const p = makeProduct();
    const o = makeOffer({ price: 80 }); // unter great_deal_threshold 85
    const e = evaluateDeal(p, o, NOW);
    expect(e.badge).toBe("TOP_DEAL");
    expect(e.isCurrent).toBe(true);
    expect(e.referenceLabel).toBe("UVP");
    expect(e.savingsVsUvp).toBeCloseTo(20, 5);
    expect(e.savingsPct).toBeCloseTo(20, 5);
  });

  it("exakt zur UVP → UVP_DEAL", () => {
    const e = evaluateDeal(makeProduct(), makeOffer({ price: 100 }), NOW);
    expect(e.badge).toBe("UVP_DEAL");
    expect(e.savingsVsUvp).toBeCloseTo(0, 5);
  });

  it("knapp unter UVP, aber über Great-Schwelle → UVP_DEAL", () => {
    const e = evaluateDeal(makeProduct(), makeOffer({ price: 95 }), NOW);
    expect(e.badge).toBe("UVP_DEAL");
  });

  it("leicht über UVP (bis 8%) → MARKTPREIS", () => {
    const e = evaluateDeal(makeProduct(), makeOffer({ price: 105 }), NOW);
    expect(e.badge).toBe("MARKTPREIS");
  });

  it("deutlich über UVP → UEBER_MARKT mit negativer Ersparnis", () => {
    const e = evaluateDeal(makeProduct(), makeOffer({ price: 130 }), NOW);
    expect(e.badge).toBe("UEBER_MARKT");
    expect(e.savingsVsUvp).toBeLessThan(0);
    expect(e.savingsPct).toBeLessThan(0);
  });

  it("fällt ohne gesetzte Great-Schwelle auf 15% unter UVP zurück", () => {
    const p = makeProduct({ great_deal_threshold: 0 });
    expect(evaluateDeal(p, makeOffer({ price: 85 }), NOW).badge).toBe("TOP_DEAL");
    expect(evaluateDeal(p, makeOffer({ price: 86 }), NOW).badge).toBe("UVP_DEAL");
  });
});

describe("evaluateDeal – ältere Produkte (Markt + individuelle Schwellen)", () => {
  const older = makeProduct({
    release_date: "2023-09-22",
    availability_status: "out_of_print",
    reference_uvp: 120,
    market_reference_price: 229,
    good_deal_threshold: 199,
    great_deal_threshold: 169,
  });

  it("bewertet gegen den Marktpreis, nicht gegen die alte UVP", () => {
    const e = evaluateDeal(older, makeOffer({ price: 210 }), NOW);
    expect(e.isCurrent).toBe(false);
    expect(e.referenceLabel).toBe("Marktpreis");
    expect(e.referencePrice).toBe(229);
  });

  it("unter Great-Schwelle → TOP_DEAL, obwohl über historischer UVP", () => {
    const e = evaluateDeal(older, makeOffer({ price: 165 }), NOW);
    expect(e.badge).toBe("TOP_DEAL");
    // Preis liegt über der alten UVP – Ersparnis ggü. UVP ist negativ,
    // trotzdem ist es marktbezogen ein Top-Deal (Masterliste 13).
    expect(e.savingsVsUvp).toBeLessThan(0);
  });

  it("unter Good-Schwelle → GUTER_DEAL", () => {
    expect(evaluateDeal(older, makeOffer({ price: 195 }), NOW).badge).toBe("GUTER_DEAL");
  });

  it("nahe Marktpreis → MARKTPREIS", () => {
    expect(evaluateDeal(older, makeOffer({ price: 232 }), NOW).badge).toBe("MARKTPREIS");
  });

  it("deutlich über Markt → UEBER_MARKT", () => {
    expect(evaluateDeal(older, makeOffer({ price: 300 }), NOW).badge).toBe("UEBER_MARKT");
  });

  it("altes Produkt sogar zur alten UVP → TOP_DEAL mit UVP als Referenz", () => {
    const e = evaluateDeal(older, makeOffer({ price: 119 }), NOW);
    expect(e.badge).toBe("TOP_DEAL");
    expect(e.referenceLabel).toBe("UVP");
    expect(e.referencePrice).toBe(120);
  });
});

describe("daysLeft", () => {
  it("berechnet verbleibende Tage positiv für laufende Angebote", () => {
    expect(daysLeft(makeOffer({ valid_until: "2026-07-30" }), NOW)).toBeGreaterThan(0);
  });

  it("liefert negative Werte für abgelaufene Angebote", () => {
    expect(daysLeft(makeOffer({ valid_until: "2026-07-01" }), NOW)).toBeLessThan(0);
  });
});

describe("rankScore (Masterliste 17.9)", () => {
  const base = {
    offer: makeOffer(),
    radiusKm: 100,
    daysLeft: 5,
  };

  it("rankt TOP_DEAL über UVP_DEAL", () => {
    const top = rankScore({ ...base, evaluation: evaluateDeal(makeProduct(), makeOffer({ price: 80 }), NOW), distanceKm: 10 });
    const uvp = rankScore({ ...base, evaluation: evaluateDeal(makeProduct(), makeOffer({ price: 100 }), NOW), distanceKm: 10 });
    expect(top).toBeGreaterThan(uvp);
  });

  it("bevorzugt näher gelegene Angebote bei gleicher Qualität", () => {
    const ev = evaluateDeal(makeProduct(), makeOffer({ price: 100 }), NOW);
    const near = rankScore({ ...base, evaluation: ev, distanceKm: 5 });
    const far = rankScore({ ...base, evaluation: ev, distanceKm: 95 });
    expect(near).toBeGreaterThan(far);
  });

  it("wertet abgelaufene Angebote stark ab", () => {
    const ev = evaluateDeal(makeProduct(), makeOffer({ price: 80 }), NOW);
    const alive = rankScore({ ...base, evaluation: ev, distanceKm: 10, daysLeft: 5 });
    const expired = rankScore({ ...base, evaluation: ev, distanceKm: 10, daysLeft: -1 });
    expect(expired).toBeLessThan(alive - 400);
  });

  it("wertet ausverkaufte Angebote ab", () => {
    const ev = evaluateDeal(makeProduct(), makeOffer({ price: 80 }), NOW);
    const inStock = rankScore({ ...base, evaluation: ev, offer: makeOffer({ stock_signal: "verfuegbar" }), distanceKm: 10 });
    const sold = rankScore({ ...base, evaluation: ev, offer: makeOffer({ stock_signal: "ausverkauft" }), distanceKm: 10 });
    expect(sold).toBeLessThan(inStock);
  });

  it("bevorzugt verifizierte gegenüber unbestätigten Angeboten", () => {
    const ev = evaluateDeal(makeProduct(), makeOffer({ price: 100 }), NOW);
    const verified = rankScore({ ...base, evaluation: ev, offer: makeOffer({ verification_status: "VERIFIED" }), distanceKm: 10 });
    const community = rankScore({ ...base, evaluation: ev, offer: makeOffer({ verification_status: "COMMUNITY_UNVERIFIED" }), distanceKm: 10 });
    expect(verified).toBeGreaterThan(community);
  });
});

describe("Edge-Cases", () => {
  it("Preis 0 ist der bestmögliche Deal", () => {
    expect(evaluateDeal(makeProduct(), makeOffer({ price: 0 }), NOW).badge).toBe("TOP_DEAL");
  });

  it("UVP 0 führt nicht zu Division durch Null (NaN/Infinity)", () => {
    const p = makeProduct({ reference_uvp: 0, market_reference_price: 0, good_deal_threshold: 0, great_deal_threshold: 0 });
    const e = evaluateDeal(p, makeOffer({ price: 10 }), NOW);
    expect(Number.isFinite(e.savingsPct)).toBe(true);
    expect(e.savingsPct).toBe(0);
  });
});
