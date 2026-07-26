/**
 * Erzeugt db/seed.sql aus den typisierten Seed-Daten in /data.
 *
 *   node scripts/generate-seed-sql.mjs
 *
 * So bleibt die Datenbank-Befüllung immer synchron mit dem, was die App
 * ohne Datenbank anzeigt – eine Quelle der Wahrheit.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Sehr einfacher TS-Datenextraktor: liest das exportierte Array als JSON-ähnlichen Text. */
function loadArray(file, exportName) {
  const src = readFileSync(path.join(root, file), "utf8");
  const start = src.indexOf(`export const ${exportName}`);
  if (start === -1) throw new Error(`${exportName} nicht gefunden in ${file}`);
  // Erst hinter das Gleichheitszeichen springen – sonst trifft die eckige
  // Klammer der Typ-Annotation (z. B. `: Retailer[] =`) und liefert [].
  const eq = src.indexOf("=", start);
  if (eq === -1) throw new Error(`Zuweisung für ${exportName} nicht gefunden`);
  const open = src.indexOf("[", eq);
  let depth = 0;
  let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  const body = src.slice(open, end + 1);
  // TS-Objektliteral → JSON: Schlüssel quoten, trailing commas entfernen
  const json = body
    // Kommentare entfernen, aber "https://" verschonen: ein // zaehlt nur,
    // wenn KEIN Doppelpunkt unmittelbar davor steht.
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    .replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(json);
}

const q = (v) => (v === undefined || v === null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v === undefined || v === null || v === "" ? "NULL" : Number(v));
const b = (v) => (v ? "true" : "false");

const retailers = loadArray("data/retailers.ts", "retailers");
const stores = loadArray("data/stores.ts", "stores");
const products = loadArray("data/products.ts", "products");
const events = loadArray("data/events.ts", "events");

const lines = [];
lines.push("-- ============================================================");
lines.push("-- PokeDrop – Seed-Daten (generiert aus /data)");
lines.push("-- Erzeugt mit: node scripts/generate-seed-sql.mjs");
lines.push("-- Idempotent: mehrfaches Ausfuehren ist unschaedlich.");
lines.push("-- ============================================================");
lines.push("BEGIN;");
lines.push("");

// ---- Händler ----
lines.push("-- Haendler");
for (const r of retailers) {
  lines.push(
    `INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES (${q(r.retailer_group)}, ${q(r.retailer_brand)}, ${q(r.displayName)}, ${q(r.status)}, ${
      r.category === "online" ? "'online'" : "'stationaer'"
    }, ${n(r.crawlerTier)}, ${q(r.regionality)}, ${q(r.brandColor)})
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;`,
  );
}
lines.push("");

// ---- Filialen ----
lines.push("-- Filialen (Geo)");
for (const s of stores) {
  lines.push(
    `INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, ${q(s.store_id)}, ${q(s.regional_company)}, ${q(s.store_name)}, ${q(s.street)}, ${q(s.postal_code)}, ${q(s.city)},
       ST_SetSRID(ST_MakePoint(${n(s.longitude)}, ${n(s.latitude)}), 4326)::geography
FROM retailers r WHERE r.retailer_group = ${q(s.retailer_group)} AND r.retailer_brand = ${q(s.retailer_brand)}
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;`,
  );
}
lines.push("");

// ---- Sets + Produkte ----
lines.push("-- Sets");
const sets = [...new Map(products.map((p) => [p.set_name, p])).values()];
for (const p of sets) {
  lines.push(
    `INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES (${q(p.set_code ?? p.set_name)}, ${q(p.set_name)}, ${q(p.release_date)}, ${q(p.language)})
ON CONFLICT (set_code) DO NOTHING;`,
  );
}
lines.push("");
lines.push("-- Produkte");
for (const p of products) {
  lines.push(
    `INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT ${q(p.product_id)}, ${q(p.product_name)}, ps.id, ${q(p.product_type)}, ${q(p.ean)}, ${q(p.sku)},
  ${q(p.language)}, ${q(p.release_date)}, ${n(p.reference_uvp)}, ${q(p.uvp_source)},
  ${n(p.market_reference_price)}, ${n(p.good_deal_threshold)}, ${n(p.great_deal_threshold)},
  ${q(p.availability_status)}, ${n(p.pokemonArtworkId)}, ${q(p.energyType)}
FROM product_sets ps WHERE ps.set_code = ${q(p.set_code ?? p.set_name)}
ON CONFLICT (slug) DO NOTHING;`,
  );
}
lines.push("");

// ---- Events ----
lines.push("-- Events");
for (const e of events) {
  lines.push(
    `INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES (${q(e.event_name)}, ${q(e.event_type)}, ${q(e.date_start)}, ${q(e.date_end)}, ${q(e.opening_hours)},
  ${q(e.venue_name)}, ${q(e.street)}, ${q(e.postal_code)}, ${q(e.city)},
  ST_SetSRID(ST_MakePoint(${n(e.longitude)}, ${n(e.latitude)}), 4326)::geography,
  ${q(e.organizer)}, ${q(e.official_source)}, ${n(e.ticket_price)}, ${q(e.ticket_url)},
  ${q(e.pokemon_focus)}, ${b(e.trading_available)}, ${q(e.verification_status)}, ${q(e.last_checked)})
ON CONFLICT DO NOTHING;`,
  );
}

lines.push("");
lines.push("COMMIT;");

mkdirSync(path.join(root, "db"), { recursive: true });
writeFileSync(path.join(root, "db/seed.sql"), lines.join("\n") + "\n", "utf8");
console.log(
  `db/seed.sql geschrieben: ${retailers.length} Haendler, ${stores.length} Filialen, ` +
    `${sets.length} Sets, ${products.length} Produkte, ${events.length} Events.`,
);
