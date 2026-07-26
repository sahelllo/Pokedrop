import type { Page } from "@playwright/test";

/** Zustand eines eingerichteten Nutzers – überspringt das Onboarding. */
export const READY_STATE = {
  state: {
    location: {
      name: "Oberhausen",
      postal_code: "46045",
      latitude: 51.4696,
      longitude: 6.8514,
    },
    radiusKm: 500,
    favoriteSets: [],
    watchlist: [],
    savedEvents: [],
    alertRules: [],
    portfolio: [],
    premium: false,
    theme: "dark",
    onboarded: true,
  },
  version: 0,
};

/** Setzt den persistierten Store, bevor die Seite lädt. */
export async function seedStore(page: Page, overrides: Record<string, unknown> = {}) {
  const payload = {
    ...READY_STATE,
    state: { ...READY_STATE.state, ...overrides },
  };
  await page.addInitScript((data) => {
    window.localStorage.setItem("pokedrop-store", JSON.stringify(data));
  }, payload);
}

/** Sammelt Browser-Fehler; Favicon-404 wird ignoriert. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (t.includes("favicon") || t.includes("ERR_INTERNET_DISCONNECTED")) return;
    // Externe Bild-CDNs sind in der Testumgebung ggf. nicht erreichbar –
    // die App hat dafür einen Fallback, das ist kein App-Fehler.
    if (t.includes("raw.githubusercontent.com") || t.includes("Failed to load resource")) return;
    errors.push(`console: ${t}`);
  });
  return errors;
}

/** Horizontaler Überlauf des Dokuments in Pixeln (0 = sauber). */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
