import { describe, expect, it } from "vitest";
import {
  eanCheckDigit,
  findProductByBarcode,
  formatBarcode,
  isValidBarcode,
  normalizeBarcode,
} from "@/lib/barcode";
import { products } from "@/data/products";

/**
 * Der Scanner darf niemals ein falsches Produkt anzeigen. Die Prüfziffer ist
 * die erste Verteidigungslinie gegen verwackelte Kamerabilder.
 */

describe("Strichcode prüfen", () => {
  it("berechnet die Prüfziffer nach GS1", () => {
    // Bekannte Beispiele aus der GS1-Spezifikation
    expect(eanCheckDigit("400638133393")).toBe(1); // EAN-13
    expect(eanCheckDigit("978014300723")).toBe(4);
    expect(eanCheckDigit("9638507")).toBe(4); // EAN-8
  });

  it("erkennt gültige Codes", () => {
    expect(isValidBarcode("4006381333931")).toBe(true);
    expect(isValidBarcode("9780143007234")).toBe(true);
    expect(isValidBarcode("96385074")).toBe(true);
  });

  it("weist Codes mit falscher Prüfziffer ab", () => {
    expect(isValidBarcode("4006381333930")).toBe(false);
    expect(isValidBarcode("4006381333939")).toBe(false);
    expect(isValidBarcode("96385075")).toBe(false);
  });

  it("weist unsinnige Eingaben ab", () => {
    for (const bad of ["", "123", "abcdefghijklm", "1234567890123456"]) {
      expect(isValidBarcode(bad), bad).toBe(false);
    }
  });

  it("macht aus UPC-A (12 Stellen) einen EAN-13", () => {
    expect(normalizeBarcode("036000291452")).toBe("0036000291452");
    expect(isValidBarcode("036000291452")).toBe(true);
  });

  it("ignoriert Leerzeichen und Bindestriche beim Eintippen", () => {
    expect(normalizeBarcode("4 006381 333931")).toBe("4006381333931");
    expect(isValidBarcode("4-006381-333931")).toBe(true);
  });

  it("zeigt den Code lesbar gruppiert an", () => {
    expect(formatBarcode("4006381333931")).toBe("4 006381 333931");
  });
});

describe("Katalog-EANs", () => {
  it("jedes Produkt hat einen formal gültigen Strichcode", () => {
    for (const p of products) {
      expect(p.ean, `${p.product_name} hat keine EAN`).toBeTruthy();
      expect(isValidBarcode(p.ean!), `${p.product_name}: ${p.ean}`).toBe(true);
    }
  });

  it("kein Strichcode kommt doppelt vor", () => {
    const eans = products.map((p) => normalizeBarcode(p.ean!));
    expect(new Set(eans).size).toBe(eans.length);
  });
});

describe("Produkt zum Code finden", () => {
  it("findet jedes Katalogprodukt über seine EAN", () => {
    for (const p of products) {
      const hit = findProductByBarcode(p.ean!);
      expect(hit?.product.product_id, p.product_name).toBe(p.product_id);
      expect(hit?.source).toBe("katalog");
    }
  });

  it("findet ein Produkt auch über die UPC-A-Schreibweise", () => {
    const p = products.find((x) => x.ean?.startsWith("0"))!;
    const upc = p.ean!.slice(1); // führende Null weglassen
    expect(findProductByBarcode(upc)?.product.product_id).toBe(p.product_id);
  });

  it("liefert nichts bei einem unbekannten Code", () => {
    expect(findProductByBarcode("4006381333931")).toBeUndefined();
  });

  it("nutzt eigene Zuordnungen, wenn der Katalog nichts hat", () => {
    const target = products[0];
    const hit = findProductByBarcode("4006381333931", {
      "4006381333931": target.product_id,
    });
    expect(hit?.product.product_id).toBe(target.product_id);
    expect(hit?.source).toBe("eigene");
  });

  it("gibt dem Katalog Vorrang vor einer eigenen Zuordnung", () => {
    const a = products[0];
    const b = products[1];
    const hit = findProductByBarcode(a.ean!, { [a.ean!]: b.product_id });
    expect(hit?.product.product_id).toBe(a.product_id);
    expect(hit?.source).toBe("katalog");
  });
});
