import { test, expect } from "@playwright/test";
import { seedStore, collectErrors } from "./helpers";
import { BARCODE_FIXTURE_EAN, BARCODE_FIXTURE_PRODUCT } from "./fixture-paths";

/**
 * Der echte Kamera-Weg.
 *
 * Chromium startet in diesem Projekt mit einer **Fake-Kamera**: statt eines
 * Objektivs liefert sie ein Video, das nichts als einen echten EAN-13-
 * Strichcode zeigt (erzeugt von scripts/make-barcode-fixture.mjs). Für die
 * Seite ist das eine ganz normale Kamera – sie merkt keinen Unterschied.
 *
 * Damit wird geprüft, was sonst nur behauptet wäre: dass die App einen
 * Strichcode wirklich aus dem Kamerabild liest.
 */

test.describe("Scanner mit Kamera", () => {
  test("liest den Strichcode aus dem Kamerabild und zeigt das Produkt", async ({ page }) => {
    const errors = collectErrors(page);
    await seedStore(page, { radiusKm: 500, portfolio: [] });

    await page.goto("/scanner/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await page.waitForTimeout(600);

    await page.getByRole("button", { name: /Kamera starten/i }).click();

    // Das Videobild läuft
    await expect(page.locator("video")).toBeVisible();
    await expect(page.getByText(/Suche Strichcode/i)).toBeVisible();
    const playing = await page.evaluate(async () => {
      const v = document.querySelector("video") as HTMLVideoElement | null;
      if (!v) return false;
      for (let i = 0; i < 40 && v.videoWidth === 0; i++) {
        await new Promise((r) => setTimeout(r, 100));
      }
      return v.videoWidth > 0 && v.videoHeight > 0;
    });
    expect(playing, "die Kamera muss ein Bild liefern").toBe(true);

    // Erkennung: die Bibliothek braucht ein paar Bilder.
    const result = page.getByTestId("scan-result");
    await expect(result).toBeVisible({ timeout: 25_000 });
    await expect(result).toContainText("erkannt");
    await expect(result).toContainText(BARCODE_FIXTURE_PRODUCT);
    await expect(result).toContainText("Marktwert");

    // Und es landet mit genau diesem Code in der Sammlung.
    await expect(result).toContainText("In deiner Sammlung");
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("pokedrop-store") ?? "{}"),
    );
    expect(stored.state.portfolio).toHaveLength(1);
    expect(stored.state.portfolio[0].barcode).toBe(BARCODE_FIXTURE_EAN);
    expect(stored.state.portfolio[0].source).toBe("scan");

    expect(errors).toEqual([]);
  });

  test("schaltet die Kamera nach dem Treffer wieder ab", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await page.goto("/scanner/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    await page.getByRole("button", { name: /Kamera starten/i }).click();
    await expect(page.getByTestId("scan-result")).toBeVisible({ timeout: 25_000 });

    // Keine laufenden Videospuren mehr – sonst leuchtet die Kamera weiter.
    const live = await page.evaluate(() => {
      const v = document.querySelector("video") as HTMLVideoElement | null;
      const s = v?.srcObject as MediaStream | null;
      return s ? s.getTracks().filter((t) => t.readyState === "live").length : 0;
    });
    expect(live, "die Kamera darf nach dem Scan nicht weiterlaufen").toBe(0);
  });

  test("Abbrechen beendet die Kamera", async ({ page }) => {
    await seedStore(page);
    await page.goto("/scanner/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    await page.getByRole("button", { name: /Kamera starten/i }).click();
    await expect(page.locator("video")).toBeVisible();
    await page.getByRole("button", { name: "Abbrechen", exact: true }).click();
    await page.waitForTimeout(400);

    await expect(page.getByRole("button", { name: /Kamera starten/i })).toBeVisible();
    const live = await page.evaluate(() => {
      const v = document.querySelector("video") as HTMLVideoElement | null;
      const s = v?.srcObject as MediaStream | null;
      return s ? s.getTracks().filter((t) => t.readyState === "live").length : 0;
    });
    expect(live).toBe(0);
  });
});
