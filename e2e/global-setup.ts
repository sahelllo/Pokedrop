import { writeBarcodeY4m } from "../scripts/make-barcode-fixture.mjs";
import { BARCODE_FIXTURE, BARCODE_FIXTURE_EAN } from "./fixture-paths";

/**
 * Läuft einmal vor allen Tests.
 *
 * Erzeugt das "Kamerabild" für den Scanner-Test: ein kleines Video, das
 * nichts als einen echten EAN-13-Strichcode zeigt. Chromium bekommt es
 * später als Kamera untergeschoben. Die Datei wird jedes Mal frisch
 * erzeugt, damit nichts Binäres im Repository liegt.
 */
export default function globalSetup() {
  writeBarcodeY4m(BARCODE_FIXTURE_EAN, BARCODE_FIXTURE);
}
