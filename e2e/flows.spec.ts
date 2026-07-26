import { test, expect } from "@playwright/test";
import { seedStore, collectErrors } from "./helpers";

test.describe("Onboarding", () => {
  test("erscheint beim ersten Öffnen und lässt sich abschließen", async ({ page }) => {
    // bewusst KEIN seedStore → frischer Nutzer
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const onboarding = page.getByText(/Willkommen bei/i);
    await expect(onboarding).toBeVisible();

    // Durch die Schritte klicken
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: /Weiter/i }).click();
      await page.waitForTimeout(250);
    }
    await page.getByRole("button", { name: /Los geht/i }).click();

    await expect(onboarding).toBeHidden();
    await expect(page.locator("main")).toBeVisible();
  });

  test("lässt sich überspringen", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Überspringen/i }).click();
    await expect(page.getByText(/Willkommen bei/i)).toBeHidden();
  });
});

test.describe("Standort & Radius (Kern-Flow)", () => {
  test("Radius ändern aktualisiert die Trefferzahl", async ({ page }) => {
    await seedStore(page, { radiusKm: 500 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await page.waitForTimeout(700);

    const counter = page.getByText(/Angebote im Radius/i).first();
    await expect(counter).toBeVisible();
    const wide = await counter.textContent();

    // Auf 10 km verkleinern
    await page.getByRole("button", { name: "10 km", exact: true }).first().click();
    await page.waitForTimeout(700);

    const narrow = await counter.textContent();
    expect(narrow, "kleinerer Radius muss die Ergebnisse verändern").not.toBe(wide);

    const wideNum = parseInt(wide?.match(/\d+/)?.[0] ?? "0", 10);
    const narrowNum = parseInt(narrow?.match(/\d+/)?.[0] ?? "0", 10);
    expect(narrowNum, "10 km darf nicht mehr Treffer liefern als 500 km").toBeLessThanOrEqual(wideNum);
  });

  test("Der Ludwigsburg-Fall: nur bei großem Radius sichtbar", async ({ page }) => {
    // Nutzer in Oberhausen, Ludwigsburg ist ~340 km entfernt
    await seedStore(page, { radiusKm: 500 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);
    await page.getByPlaceholder(/Suchen/i).fill("Ludwigsburg");
    await page.waitForTimeout(600);
    // Bei 500 km muss mindestens ein Treffer eine Ludwigsburger Filiale nennen.
    const wideCards = page.locator("main .grid a[href^='/product/']");
    const wideLudwigsburg = await wideCards.filter({ hasText: "Ludwigsburg" }).count();
    expect(wideLudwigsburg, "bei 500 km muss Ludwigsburg auftauchen").toBeGreaterThan(0);

    // Radius auf 100 km → Ludwigsburg (~340 km) fällt raus
    await page.getByRole("button", { name: "100 km", exact: true }).first().click();
    await page.waitForTimeout(800);
    const narrowLudwigsburg = await wideCards.filter({ hasText: "Ludwigsburg" }).count();
    expect(narrowLudwigsburg, "bei 100 km darf Ludwigsburg nicht mehr auftauchen").toBe(0);
  });
});

test.describe("Filter", () => {
  test("Freitextsuche filtert den Feed", async ({ page }) => {
    await seedStore(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    const before = await page.locator("main a[href^='/product/']").count();
    await page.getByPlaceholder(/Suchen/i).fill("Dunkelnacht");
    await page.waitForTimeout(600);
    const after = await page.locator("main a[href^='/product/']").count();

    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(before);
  });

  test("'Nur unter UVP' schränkt die Ergebnisse ein", async ({ page }) => {
    await seedStore(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    const counter = page.getByText(/Angebote im Radius/i).first();
    const before = parseInt((await counter.textContent())?.match(/\d+/)?.[0] ?? "0", 10);

    await page.getByRole("button", { name: /Nur unter UVP/i }).click();
    await page.waitForTimeout(600);

    const after = parseInt((await counter.textContent())?.match(/\d+/)?.[0] ?? "0", 10);
    expect(after).toBeLessThan(before);
    expect(after).toBeGreaterThan(0);
  });
});

test.describe("Produktdetail", () => {
  test("zeigt UVP, Marktpreis, Preisquellen und Chart", async ({ page }) => {
    const errors = collectErrors(page);
    await seedStore(page);
    await page.goto("/product/p-151-upc/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await page.waitForTimeout(900);

    // h1 der Detailseite (Karten weiter unten tragen denselben Namen als h3)
    await expect(page.locator("h1")).toContainText(/Ultra-Premium/i);
    await expect(page.getByText(/Historische/i).first()).toBeVisible();
    await expect(page.getByText(/Markt-/i).first()).toBeVisible();
    const main = page.locator("main");
    await expect(main.getByText(/Preise aus allen Quellen/i)).toBeVisible();
    // auf main eingrenzen: der Live-Ticker oben enthält denselben Begriff
    await expect(main.getByText(/Bestpreis/i).first()).toBeVisible();
    await expect(main.getByText(/Preisverlauf/i)).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("Preisverlauf lässt sich zwischen 30 Tagen und 12 Monaten umschalten", async ({ page }) => {
    await seedStore(page);
    await page.goto("/product/p-151-upc/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);

    await page.getByRole("button", { name: "12 Monate" }).click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "30 Tage" }).click();
    await expect(page.getByText(/Preisverlauf/i)).toBeVisible();
  });

  test("Alert anlegen speichert die Regel", async ({ page }) => {
    await seedStore(page);
    await page.goto("/product/p-151-upc/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);

    await page.getByRole("button", { name: /Benachrichtige mich/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /^Speichern$/ }).click();

    // Button spiegelt jetzt den aktiven Alert
    await expect(page.getByRole("button", { name: /Alert aktiv/i })).toBeVisible();
    // Bestätigung als Toast
    await expect(page.getByText(/Alert aktiv/i).first()).toBeVisible();
  });

  test("gespeicherte Alerts erscheinen in der Merkliste", async ({ page }) => {
    // Regel vorab im Store – prüft die Anzeige, nicht das Anlegen.
    await seedStore(page, {
      alertRules: [{ product_id: "p-151-upc", mode: "uvp", scope: "lokal" }],
    });
    await page.goto("/watchlist/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    await expect(page.getByText(/Aktive Alerts/i)).toBeVisible();
    await expect(page.getByText(/Bei UVP oder günstiger/i)).toBeVisible();
  });
});

test.describe("Portfolio", () => {
  test("Produkt hinzufügen erhöht den Gesamtwert", async ({ page }) => {
    await seedStore(page, { portfolio: [] });
    await page.goto("/portfolio/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    await expect(page.getByText(/Noch nichts in der Sammlung/i)).toBeVisible();

    await page.getByRole("button", { name: /Hinzufügen/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.locator("[role=dialog] button").filter({ hasText: /€/ }).first().click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    await expect(page.getByText(/Noch nichts in der Sammlung/i)).toBeHidden();
    await expect(page.getByText(/^Deine Sammlung$/)).toBeVisible();
  });

  test("Menge erhöhen und Position entfernen funktioniert", async ({ page }) => {
    await seedStore(page, { portfolio: [{ product_id: "p-151-upc", qty: 1 }] });
    await page.goto("/portfolio/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    await page.getByRole("button", { name: "Mehr" }).first().click();
    await page.waitForTimeout(300);
    await expect(page.getByText("2", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: "Entfernen" }).first().click();
    await page.waitForTimeout(400);
    await expect(page.getByText(/Noch nichts in der Sammlung/i)).toBeVisible();
  });
});

test.describe("Events", () => {
  test("Ansichten Liste / Kalender / Karte lassen sich umschalten", async ({ page }) => {
    const errors = collectErrors(page);
    await seedStore(page);
    await page.goto("/events/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    await expect(page.getByText(/Events im Radius/i)).toBeVisible();

    // exact:true, sonst treffen die "Zum Kalender"-Buttons der Event-Karten mit
    await page.getByRole("button", { name: "Kalender", exact: true }).click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Karte", exact: true }).click();
    await page.waitForTimeout(1200);

    await page.getByRole("button", { name: "Liste", exact: true }).click();
    await page.waitForTimeout(400);

    expect(errors).toEqual([]);
  });
});

test.describe("Premium", () => {
  test("Upgrade schaltet den Premium-Status frei", async ({ page }) => {
    await seedStore(page, { premium: false });
    await page.goto("/premium/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    await page.getByRole("button", { name: /Jetzt Premium freischalten/i }).click();
    await expect(page.getByText(/Premium aktiv/i)).toBeVisible();
  });

  test("Alert-Demo zeigt eine Benachrichtigung", async ({ page }) => {
    await seedStore(page);
    await page.goto("/live/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    await page.getByRole("button", { name: /Alert testen/i }).click();
    await expect(page.getByText(/Instant Alert/i)).toBeVisible();
  });
});

test.describe("Support-Chat", () => {
  test("öffnet sich und beantwortet eine Schnellfrage", async ({ page }) => {
    await seedStore(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    await page.getByRole("button", { name: /Support-Chat/i }).click();
    await expect(page.getByText(/PokeDrop-Support/i)).toBeVisible();

    await page.getByRole("button", { name: /Wie funktioniert der Radius\?/i }).click();
    await expect(page.getByText(/Umkreis/i).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Theme", () => {
  test("Dark/Light-Switch wechselt das Theme", async ({ page }) => {
    await seedStore(page, { theme: "dark" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("switch").first().click();
    await page.waitForTimeout(400);
    await expect(page.locator("html")).toHaveClass(/light/);
  });
});
