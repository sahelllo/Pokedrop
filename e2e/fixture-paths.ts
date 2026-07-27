import path from "node:path";

/** EAN des Produkts "Dunkelnacht – 36er Booster Display" aus dem Katalog. */
export const BARCODE_FIXTURE_EAN = "0820650550010";
export const BARCODE_FIXTURE_PRODUCT = "Dunkelnacht – 36er Booster Display";

/** Wird von e2e/global-setup.ts erzeugt, liegt außerhalb der Versionierung. */
export const BARCODE_FIXTURE = path.resolve(
  process.cwd(),
  "test-results/fixtures/barcode.y4m",
);
