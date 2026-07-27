/**
 * Prüft, ob die Datenbank erreichbar ist und wie viele Einträge drinstehen.
 *
 *   npm run db:check
 *
 * Liest die Zugangsdaten aus .env.local oder aus den Umgebungsvariablen.
 * Gibt eine verständliche Zusammenfassung aus – keine rohen Fehlermeldungen.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// .env.local einlesen, falls vorhanden
const envFile = path.join(root, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log("\n  Keine Datenbank eingerichtet.");
  console.log("  Die App läuft dann mit Beispieldaten – das ist kein Fehler.");
  console.log("  Zum Verbinden: siehe SETUP.md, Abschnitt C.\n");
  process.exit(0);
}

const ERWARTET = {
  products: 16,
  retailers: 26,
  retailer_locations: 44,
  offers: 81,
  drops: 12,
  rumors: 8,
  events: 32,
};

const LABEL = {
  products: "Produkte",
  retailers: "Händler",
  retailer_locations: "Filialen",
  offers: "Angebote",
  drops: "Live-Drops",
  rumors: "Gerüchte",
  events: "Events",
};

async function zaehle(tabelle) {
  const res = await fetch(`${url}/rest/v1/${tabelle}?select=*`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const range = res.headers.get("content-range") ?? "";
  const total = range.split("/")[1];
  return total === "*" ? 0 : Number(total ?? 0);
}

console.log(`\n  Datenbank: ${new URL(url).host}\n`);

let alleOk = true;
try {
  for (const [tabelle, soll] of Object.entries(ERWARTET)) {
    const ist = await zaehle(tabelle);
    const ok = ist >= soll;
    if (!ok) alleOk = false;
    const zeichen = ok ? "OK  " : "FEHLT";
    console.log(`  ${zeichen}  ${LABEL[tabelle].padEnd(12)} ${String(ist).padStart(4)}  (erwartet mindestens ${soll})`);
  }
} catch (e) {
  console.log("\n  Die Datenbank war nicht erreichbar.");
  console.log("  Mögliche Gründe: falsche Zugangsdaten, oder das Projekt bei");
  console.log("  Supabase pausiert gerade (passiert bei längerer Nichtnutzung).");
  console.log("  Nachsehen unter: https://supabase.com/dashboard\n");
  process.exit(1);
}

if (alleOk) {
  console.log("\n  Alles vorhanden. Die Website zeigt echte Daten.\n");
} else {
  console.log("\n  Es fehlen Einträge. Lösung: SETUP.md Abschnitt B1 ausführen");
  console.log("  (die Datei db/setup-komplett.sql in Supabase einfügen).\n");
  process.exit(1);
}
