import { defineConfig, devices } from "@playwright/test";
import { BARCODE_FIXTURE } from "./e2e/fixture-paths";

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

  // Erzeugt vorab das Strichcode-Video für den Kamera-Test.
  globalSetup: "./e2e/global-setup.ts",

  projects: [
    {
      name: "desktop",
      testIgnore: /scanner-kamera\.spec\.ts/,
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
      testIgnore: /scanner-kamera\.spec\.ts/,
      use: {
        ...devices["Pixel 7"],
        launchOptions: process.env.PW_CHROMIUM_PATH
          ? { executablePath: process.env.PW_CHROMIUM_PATH }
          : {},
      },
    },
    {
      // Eigenes Projekt, weil Chromium die Fake-Kamera nur beim Start
      // annimmt: Statt einer echten Kamera bekommt der Browser ein Video
      // mit einem echten EAN-13-Strichcode untergeschoben.
      name: "scanner-kamera",
      testMatch: /scanner-kamera\.spec\.ts/,
      use: {
        ...devices["Pixel 7"],
        permissions: ["camera"],
        launchOptions: {
          ...(process.env.PW_CHROMIUM_PATH
            ? { executablePath: process.env.PW_CHROMIUM_PATH }
            : {}),
          args: [
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream",
            `--use-file-for-fake-video-capture=${BARCODE_FIXTURE}`,
          ],
        },
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
