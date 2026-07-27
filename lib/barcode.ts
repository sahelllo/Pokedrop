import type { Product } from "@/types";
import { getDataset } from "./dataset";

/**
 * Barcodes (EAN-13 / UPC-A) – Prüfung, Vereinheitlichung und Produktsuche.
 *
 * Warum Barcode und nicht Bilderkennung?
 * PokéDrop handelt mit **versiegelten Produkten** – Displays, Top-Trainer-
 * Boxen, Blistern. Auf jeder Packung klebt ein Strichcode. Den kann die
 * Handykamera zuverlässig und offline lesen. Eine Bilderkennung, die eine
 * Verpackung am Foto erkennt, wäre dagegen ein Ratespiel.
 *
 * UPC-A (12 Stellen, USA) und EAN-13 (13 Stellen, Europa) sind dieselbe
 * Nummer: EAN-13 ist UPC-A mit einer führenden Null. Deshalb wird intern
 * immer auf 13 Stellen normalisiert.
 */

/** Nur Ziffern behalten und auf 13 Stellen bringen. */
export function normalizeBarcode(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 13) return digits;
  if (digits.length === 12) return "0" + digits; // UPC-A -> EAN-13
  if (digits.length === 8) return digits; // EAN-8 bleibt wie es ist
  return undefined;
}

/** Prüfziffer nach GS1: Stellen abwechselnd mit 1 und 3 gewichtet. */
export function eanCheckDigit(body: string): number {
  // Von rechts nach links gewichtet – funktioniert damit für EAN-8 und EAN-13.
  let sum = 0;
  for (let i = body.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += Number(body[i]) * w;
  }
  return (10 - (sum % 10)) % 10;
}

/** Ist der Code formal gültig? Fängt Lesefehler der Kamera ab. */
export function isValidBarcode(code: string): boolean {
  const n = normalizeBarcode(code);
  if (!n) return false;
  if (n.length !== 8 && n.length !== 13) return false;
  return eanCheckDigit(n.slice(0, -1)) === Number(n[n.length - 1]);
}

/** Für die Anzeige gruppieren: 0 820650 550010 */
export function formatBarcode(code: string): string {
  const n = normalizeBarcode(code) ?? code;
  if (n.length !== 13) return n;
  return `${n[0]} ${n.slice(1, 7)} ${n.slice(7)}`;
}

/**
 * Produkt zu einem Code finden.
 *
 * Zwei Quellen, in dieser Reihenfolge:
 * 1. die EAN aus dem Katalog
 * 2. eigene Zuordnungen – Codes, die der Nutzer selbst einmal einem Produkt
 *    zugewiesen hat. Dadurch lernt der Scanner mit jedem echten Produkt dazu,
 *    auch wenn dessen EAN noch nicht im Katalog steht.
 */
export function findProductByBarcode(
  code: string,
  ownMappings: Record<string, string> = {},
): { product: Product; source: "katalog" | "eigene" } | undefined {
  const n = normalizeBarcode(code);
  if (!n) return undefined;
  const ds = getDataset();

  for (const p of ds.products) {
    if (p.ean && normalizeBarcode(p.ean) === n) return { product: p, source: "katalog" };
  }

  const mapped = ownMappings[n];
  if (mapped) {
    const p = ds.productsById.get(mapped);
    if (p) return { product: p, source: "eigene" };
  }
  return undefined;
}

/** Welche Codearten die Kamera lesen soll. */
export const BARCODE_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e"] as const;

/** Steht im Browser eine eingebaute Barcode-Erkennung bereit? */
export function hasNativeBarcodeDetector(): boolean {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}
