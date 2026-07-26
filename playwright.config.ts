import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-Tests gegen den echten statischen Export (out/).
 * Getestet wird also exakt das, was auf GitHub Pages ausgeliefert wird.
 *
 * Der Build läuft hier OHNE GITHUB_PAGES, damit die App an der Wurzel liegt
 * und `serve out` sie direkt ausliefern kann.
 */
const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 8_000 },

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        // Vorinstalliertes Chromium der Umgebung nutzen (kein Download).
        launchOptions: process.env.PW_CHROMIUM_PATH
          ? { executablePath: process.env.PW_CHROMIUM_PATH }
          : {},
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        launchOptions: process.env.PW_CHROMIUM_PATH
          ? { executablePath: process.env.PW_CHROMIUM_PATH }
          : {},
      },
    },
  ],

  webServer: {
    // KEIN --single: der Export hat echte Verzeichnisse pro Route. Im
    // SPA-Modus bekäme jede Route die Startseiten-HTML und React würde beim
    // Hydrieren zwangsläufig etwas anderes vorfinden.
    command: `npx serve out -l ${PORT} --no-clipboard`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
