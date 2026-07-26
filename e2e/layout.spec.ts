import { test, expect } from "@playwright/test";
import { seedStore, collectErrors, horizontalOverflow } from "./helpers";

/**
 * Regressionstests für den gemeldeten Bug: Karten waren auf dem Handy rechts
 * abgeschnitten ("man sieht die Sachen nur halb"), weil den Grids die
 * mobile Spaltendefinition fehlte.
 */

const ROUTES = [
  { path: "/", name: "Home" },
  { path: "/live/", name: "Live Drops" },
  { path: "/pokemon-center/", name: "Pokémon Center" },
  { path: "/rumors/", name: "Gerüchte" },
  { path: "/events/", name: "Events" },
  { path: "/portfolio/", name: "Portfolio" },
  { path: "/scanner/", name: "Scanner" },
  { path: "/premium/", name: "Premium" },
  { path: "/watchlist/", name: "Merkliste" },
  { path: "/product/p-151-upc/", name: "Produktdetail" },
];

for (const route of ROUTES) {
  test(`${route.name}: lädt ohne horizontalen Überlauf und ohne Fehler`, async ({ page }) => {
    const errors = collectErrors(page);
    await seedStore(page);

    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${route.path} muss erreichbar sein`).toBeLessThan(400);

    // Auf gerenderten Inhalt warten (React-Hydration)
    await expect(page.locator("main")).toBeVisible();
    await page.waitForTimeout(600);

    const overflow = await horizontalOverflow(page);
    expect(overflow, `${route.name} darf nicht horizontal überlaufen`).toBeLessThanOrEqual(1);

    expect(errors, `${route.name} darf keine JS-Fehler werfen`).toEqual([]);
  });
}

test("Deal-Karten passen vollständig in den Viewport", async ({ page }) => {
  await seedStore(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
  await page.waitForTimeout(900);

  const viewportWidth = page.viewportSize()!.width;
  // Die Live-Drops-Leiste scrollt absichtlich horizontal – hier geht es um
  // die Karten im Feed-Raster.
  const cards = page.locator("main .grid a[href^='/product/']");
  const count = await cards.count();
  expect(count, "es muss Deal-Karten geben").toBeGreaterThan(0);

  // Erste zehn Karten prüfen – keine darf über den rechten Rand hinausragen.
  for (let i = 0; i < Math.min(count, 10); i++) {
    const box = await cards.nth(i).boundingBox();
    if (!box) continue;
    expect(
      box.x + box.width,
      `Karte ${i} ragt über den Viewport hinaus`,
    ).toBeLessThanOrEqual(viewportWidth + 1);
  }
});

test("Handy: Zoom ist gesperrt (Layout bleibt fest)", async ({ page }) => {
  await seedStore(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).toContain("maximum-scale=1");
  expect(viewport).toContain("user-scalable=no");
});
