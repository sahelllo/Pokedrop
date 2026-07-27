import { test, expect } from "@playwright/test";
import { seedStore, collectErrors } from "./helpers";

/**
 * Scanner ohne Kamera: Code eintippen, unbekannten Code zuordnen, Sammlung.
 * Der Weg über die echte Kamera steht in scanner-kamera.spec.ts.
 */

/** Katalogprodukt "Dunkelnacht – 36er Booster Display". */
const KNOWN_EAN = "0820650550010";
const KNOWN_NAME = "Dunkelnacht – 36er Booster Display";
/** Gültiger EAN-13, der in keinem Katalogprodukt vorkommt. */
const FOREIGN_EAN = "4006381333931";

async function openScanner(page: import("@playwright/test").Page) {
  await page.goto("/scanner/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
  await page.waitForTimeout(600);
}

async function typeCode(page: import("@playwright/test").Page, code: string) {
  await page.getByLabel("Strichcode eintippen").fill(code);
  await page.getByRole("button", { name: "Suchen", exact: true }).click();
  await page.waitForTimeout(500);
}

test.describe("Scanner – Code eintippen", () => {
  test("findet ein Produkt und zeigt Preis und Seltenheit sofort", async ({ page }) => {
    const errors = collectErrors(page);
    await seedStore(page, { radiusKm: 500 });
    await openScanner(page);

    await typeCode(page, KNOWN_EAN);

    const result = page.getByTestId("scan-result");
    await expect(result).toBeVisible();
    await expect(result).toContainText("erkannt");
    await expect(result).toContainText(KNOWN_NAME);
    // Preis erscheint automatisch, ohne weiteren Klick
    await expect(result).toContainText("Marktwert");
    await expect(result).toContainText("179,99");
    await expect(result).toContainText(/UVP\s+179,99/);
    // Seltenheitsstufe steht dabei
    await expect(result).toContainText("Standard");

    expect(errors).toEqual([]);
  });

  test("liest auch die zwölfstellige UPC-Schreibweise", async ({ page }) => {
    await seedStore(page);
    await openScanner(page);
    await typeCode(page, KNOWN_EAN.slice(1)); // führende Null weglassen
    await expect(page.getByTestId("scan-result")).toContainText(KNOWN_NAME);
  });

  test("weist einen Code mit falscher Prüfziffer ab", async ({ page }) => {
    await seedStore(page);
    await openScanner(page);
    await typeCode(page, "0820650550011"); // letzte Ziffer verfälscht
    await expect(page.getByText(/Code nicht lesbar/i)).toBeVisible();
    await expect(page.getByTestId("scan-result")).toBeHidden();
  });

  test("legt das Produkt automatisch in die Sammlung", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await openScanner(page);
    await typeCode(page, KNOWN_EAN);

    await expect(page.getByTestId("scan-result")).toContainText("In deiner Sammlung");

    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("pokedrop-store") ?? "{}"),
    );
    expect(stored.state.portfolio).toHaveLength(1);
    expect(stored.state.portfolio[0].source).toBe("scan");
    expect(stored.state.portfolio[0].barcode).toBe(KNOWN_EAN);
  });

  test("Rückgängig nimmt den Eintrag wieder heraus", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await openScanner(page);
    await typeCode(page, KNOWN_EAN);

    await page.getByRole("button", { name: /Rückgängig/i }).click();
    await page.waitForTimeout(400);

    await expect(page.getByRole("button", { name: /Zur Sammlung/i })).toBeVisible();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("pokedrop-store") ?? "{}"),
    );
    expect(stored.state.portfolio).toHaveLength(0);
  });

  test("ausgeschaltete Automatik legt nichts ohne Zutun ab", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await openScanner(page);

    await page
      .getByLabel("Gescannte Produkte automatisch zur Sammlung hinzufügen")
      .click();
    await typeCode(page, KNOWN_EAN);

    await expect(page.getByRole("button", { name: /Zur Sammlung/i })).toBeVisible();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("pokedrop-store") ?? "{}"),
    );
    expect(stored.state.portfolio ?? []).toHaveLength(0);
  });
});

test.describe("Scanner lernt unbekannte Codes", () => {
  test("fremder Code lässt sich zuordnen und wird danach sofort erkannt", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await openScanner(page);

    await typeCode(page, FOREIGN_EAN);
    const unknown = page.getByTestId("scan-unknown");
    await expect(unknown).toBeVisible();
    await expect(unknown).toContainText("4 006381 333931");

    // Produkt zuordnen
    await unknown.getByLabel("Produkt suchen").fill("Dunkelnacht – 36er");
    await page.waitForTimeout(300);
    await unknown.locator("button").filter({ hasText: KNOWN_NAME }).first().click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("scan-result")).toContainText(KNOWN_NAME);

    // Zuordnung ist dauerhaft gespeichert
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("pokedrop-store") ?? "{}"),
    );
    expect(stored.state.barcodeMappings[FOREIGN_EAN]).toBe("p-dunkelnacht-display");

    // Und sie landet auch in der Sammlung
    expect(stored.state.portfolio).toHaveLength(1);
    expect(stored.state.portfolio[0].barcode).toBe(FOREIGN_EAN);
  });

  test("ein gemerkter Code wird beim nächsten Besuch sofort erkannt", async ({ page }) => {
    // Zustand eines Nutzers, der den Code schon einmal zugeordnet hat.
    await seedStore(page, {
      portfolio: [],
      barcodeMappings: { [FOREIGN_EAN]: "p-dunkelnacht-display" },
    });
    await openScanner(page);

    await typeCode(page, FOREIGN_EAN);

    await expect(page.getByTestId("scan-result")).toBeVisible();
    await expect(page.getByTestId("scan-result")).toContainText(KNOWN_NAME);
    await expect(page.getByTestId("scan-unknown")).toBeHidden();
  });
});

test.describe("Sammlung nach Seltenheit", () => {
  test("sortiert das seltenste Produkt nach oben und rechnet den Wert", async ({ page }) => {
    const errors = collectErrors(page);
    await seedStore(page, {
      portfolio: [
        { product_id: "p-dunkelnacht-etb", qty: 1, source: "manuell" },
        { product_id: "p-celebrations-etb", qty: 2, source: "scan" },
        { product_id: "p-151-upc", qty: 1, source: "scan" },
      ],
    });
    await page.goto("/portfolio/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await page.waitForTimeout(800);

    // Standardsortierung ist Seltenheit
    await expect(page.getByRole("button", { name: "Seltenheit" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const rows = page.locator("main a[href^='/product/']");
    await expect(rows.first()).toContainText("Celebrations");

    // Die Standard-Box steht hinten
    const texts = await rows.allTextContents();
    const idxCeleb = texts.findIndex((t) => t.includes("Celebrations"));
    const idxEtb = texts.findIndex((t) => t.includes("Dunkelnacht – Top-Trainer-Box"));
    expect(idxCeleb).toBeLessThan(idxEtb);

    // Kennzahlen im Wert-Kasten: 4 Stück, davon 3 gescannt
    const summary = page.locator("section").filter({ hasText: "Gesamtwert" }).first();
    await expect(summary.getByText("Stück", { exact: true }).locator("..")).toContainText("4");
    await expect(summary.getByText("gescannt", { exact: true }).locator("..")).toContainText("3");

    // Wertaufteilung nach Seltenheit ist da
    await expect(page.getByText("Wert nach Seltenheit")).toBeVisible();
    await expect(page.getByText("Sammlerstück").first()).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("Sortierung nach Wert stellt das teuerste nach vorn", async ({ page }) => {
    await seedStore(page, {
      portfolio: [
        { product_id: "p-dunkelnacht-etb", qty: 1 },
        { product_id: "p-dunkelnacht-display", qty: 1 },
      ],
    });
    await page.goto("/portfolio/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    await page.getByRole("button", { name: "Wert" }).click();
    await page.waitForTimeout(400);

    const rows = page.locator("main a[href^='/product/']");
    await expect(rows.first()).toContainText("36er Booster Display");
  });

  test("leere Sammlung verweist auf den Scanner", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await page.goto("/portfolio/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    await expect(page.getByText(/Noch nichts in der Sammlung/i)).toBeVisible();
    await expect(page.getByText(/Scanne den Strichcode/i)).toBeVisible();
  });
});
