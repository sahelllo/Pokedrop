import { describe, expect, it } from "vitest";
import {
  RARITY_META,
  RARITY_ORDER,
  RARITY_THRESHOLDS,
  compareByRarity,
  rankByRarity,
  rarityOf,
} from "@/lib/rarity";
import { products } from "@/data/products";
import type { AvailabilityStatus, Product } from "@/types";

function make(
  uvp: number,
  market: number,
  availability: AvailabilityStatus = "aktuell",
): Product {
  return {
    product_id: `t-${uvp}-${market}-${availability}`,
    product_name: "Testprodukt",
    set_name: "Testset",
    product_type: "ETB",
    language: "Deutsch",
    release_date: "2025-01-01",
    reference_uvp: uvp,
    uvp_source: "Test",
    market_reference_price: market,
    good_deal_threshold: uvp * 0.9,
    great_deal_threshold: uvp * 0.8,
    price_reference_updated_at: "2026-07-01",
    availability_status: availability,
  };
}

describe("Seltenheit einstufen", () => {
  it("Marktpreis gleich UVP ist Standard", () => {
    expect(rarityOf(make(50, 50)).tier).toBe("standard");
  });

  it("unter UVP bleibt Standard", () => {
    expect(rarityOf(make(50, 40)).tier).toBe("standard");
  });

  it("trifft die Schwellen genau", () => {
    expect(rarityOf(make(100, 100 + RARITY_THRESHOLDS.gesucht)).tier).toBe("gesucht");
    expect(rarityOf(make(100, 100 + RARITY_THRESHOLDS.selten)).tier).toBe("selten");
    expect(rarityOf(make(100, 100 + RARITY_THRESHOLDS.sehr_selten)).tier).toBe("sehr_selten");
    expect(rarityOf(make(100, 100 + RARITY_THRESHOLDS.grail)).tier).toBe("grail");
  });

  it("knapp unter einer Schwelle bleibt in der niedrigeren Stufe", () => {
    expect(rarityOf(make(100, 119.99)).tier).toBe("gesucht");
    expect(rarityOf(make(100, 149.99)).tier).toBe("selten");
  });

  it("'wird nicht mehr gedruckt' hebt eine Stufe an", () => {
    expect(rarityOf(make(100, 100, "aktuell")).tier).toBe("standard");
    expect(rarityOf(make(100, 100, "out_of_print")).tier).toBe("gesucht");
    expect(rarityOf(make(100, 125, "out_of_print")).tier).toBe("sehr_selten");
  });

  it("die oberste Stufe erreicht man nur über den Marktpreis", () => {
    // 60 % Aufschlag + eingestellt: würde durch die Anhebung sonst zum
    // Sammlerstück – das bleibt aber dem echten Verdoppler vorbehalten.
    expect(rarityOf(make(100, 160, "out_of_print")).tier).toBe("sehr_selten");
    expect(rarityOf(make(100, 200, "out_of_print")).tier).toBe("grail");
  });

  it("rechnet den Aufschlag korrekt aus", () => {
    expect(Math.round(rarityOf(make(50, 100)).premiumPct)).toBe(100);
    expect(Math.round(rarityOf(make(100, 75)).premiumPct)).toBe(-25);
  });

  it("erklärt die Einstufung in einem verständlichen Satz", () => {
    expect(rarityOf(make(100, 130)).reason).toMatch(/30 % über UVP/);
    expect(rarityOf(make(100, 100)).reason).toMatch(/etwa zur UVP/);
    expect(rarityOf(make(100, 80)).reason).toMatch(/20 % unter UVP/);
    expect(rarityOf(make(100, 130, "out_of_print")).reason).toMatch(/nicht mehr gedruckt/);
  });

  it("stürzt bei UVP 0 nicht ab", () => {
    expect(rarityOf(make(0, 0)).premiumPct).toBe(0);
    expect(rarityOf(make(0, 0)).tier).toBe("standard");
  });
});

describe("Rangliste nach Seltenheit", () => {
  it("stellt das seltenste Produkt nach vorne", () => {
    const list = [make(100, 100), make(100, 250), make(100, 130)];
    const ranked = rankByRarity(list);
    expect(rarityOf(ranked[0]).tier).toBe("grail");
    expect(rarityOf(ranked[2]).tier).toBe("standard");
  });

  it("sortiert bei gleicher Stufe nach dem höheren Aufschlag", () => {
    const a = make(100, 125);
    const b = make(100, 140);
    expect(compareByRarity(a, b)).toBeGreaterThan(0); // b gehört nach vorne
    expect(rankByRarity([a, b])[0]).toBe(b);
  });

  it("verändert die Ausgangsliste nicht", () => {
    const list = [make(100, 100), make(100, 250)];
    const copy = [...list];
    rankByRarity(list);
    expect(list).toEqual(copy);
  });

  it("RARITY_ORDER geht von selten nach häufig", () => {
    const orders = RARITY_ORDER.map((t) => RARITY_META[t].order);
    expect(orders).toEqual([...orders].sort((a, b) => b - a));
  });
});

describe("Echte Katalogdaten", () => {
  it("stuft jedes Produkt ein", () => {
    for (const p of products) {
      const r = rarityOf(p);
      expect(RARITY_META[r.tier], p.product_name).toBeTruthy();
      expect(r.reason.length).toBeGreaterThan(5);
    }
  });

  it("liefert eine sinnvolle Streuung statt nur einer Stufe", () => {
    const tiers = new Set(products.map((p) => rarityOf(p).tier));
    expect(tiers.size, "es sollte mehrere Seltenheitsstufen geben").toBeGreaterThanOrEqual(3);
  });

  it("stuft eingestellte Produkte nie als Standard ein", () => {
    for (const p of products.filter((x) => x.availability_status === "out_of_print")) {
      expect(rarityOf(p).tier, p.product_name).not.toBe("standard");
    }
  });
});
