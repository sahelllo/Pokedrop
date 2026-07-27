/**
 * Erzeugt db/seed.sql aus den typisierten Seed-Daten in /data.
 *
 *   node scripts/generate-seed-sql.mjs
 *
 * Die TypeScript-Dateien werden mit esbuild gebündelt und importiert – so
 * gibt es keine zweite Kopie der Daten und auch generierte Angebote
 * (data/offers.ts) landen korrekt in der Datenbank.
 */
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { build } from "esbuild";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tmp = path.join(root, ".seed-tmp");

/** Bündelt eine TS-Datei nach ESM und importiert sie. */
async function loadModule(relFile, outName) {
  const outfile = path.join(tmp, `${outName}.mjs`);
  await build({
    entryPoints: [path.join(root, relFile)],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });
  return import(pathToFileURL(outfile).href + `?t=${Date.now()}`);
}

mkdirSync(tmp, { recursive: true });

const { retailers } = await loadModule("data/retailers.ts", "retailers");
const { stores } = await loadModule("data/stores.ts", "stores");
const { products } = await loadModule("data/products.ts", "products");
const { events } = await loadModule("data/events.ts", "events");
const { offers } = await loadModule("data/offers.ts", "offers");
const { liveDrops } = await loadModule("data/drops.ts", "drops");
const { rumors } = await loadModule("data/rumors.ts", "rumors");

const q = (v) => (v === undefined || v === null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v === undefined || v === null || v === "" ? "NULL" : Number(v));
const b = (v) => (v ? "true" : "false");

const lines = [];
const push = (s) => lines.push(s);

push("-- ============================================================");
push("-- PokeDrop – Seed-Daten (generiert aus /data)");
push("-- Erzeugt mit: node scripts/generate-seed-sql.mjs");
push("-- Idempotent: mehrfaches Ausfuehren ist unschaedlich.");
push("-- ============================================================");
push("BEGIN;");
push("");

// ---------------------------------------------------------- Händler ------
push("-- Haendler");
for (const r of retailers) {
  push(`INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES (${q(r.retailer_group)}, ${q(r.retailer_brand)}, ${q(r.displayName)}, ${q(r.status)}, ${
    r.category === "online" ? "'online'" : "'stationaer'"
  }, ${n(r.crawlerTier)}, ${q(r.regionality)}, ${q(r.brandColor)})
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;`);
}
push("");

// --------------------------------------------------------- Filialen ------
push("-- Filialen (Geo)");
for (const s of stores) {
  push(`INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, ${q(s.store_id)}, ${q(s.regional_company)}, ${q(s.store_name)}, ${q(s.street)}, ${q(s.postal_code)}, ${q(s.city)},
       ST_SetSRID(ST_MakePoint(${n(s.longitude)}, ${n(s.latitude)}), 4326)::geography
FROM retailers r WHERE r.retailer_group = ${q(s.retailer_group)} AND r.retailer_brand = ${q(s.retailer_brand)}
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;`);
}
push("");

// ------------------------------------------------------ Sets/Produkte ----
push("-- Sets");
const sets = [...new Map(products.map((p) => [p.set_name, p])).values()];
for (const p of sets) {
  push(`INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES (${q(p.set_code ?? p.set_name)}, ${q(p.set_name)}, ${q(p.release_date)}, ${q(p.language)})
ON CONFLICT (set_code) DO NOTHING;`);
}
push("");
push("-- Produkte");
for (const p of products) {
  push(`INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT ${q(p.product_id)}, ${q(p.product_name)}, ps.id, ${q(p.product_type)}, ${q(p.ean)}, ${q(p.sku)},
  ${q(p.language)}, ${q(p.release_date)}, ${n(p.reference_uvp)}, ${q(p.uvp_source)},
  ${n(p.market_reference_price)}, ${n(p.good_deal_threshold)}, ${n(p.great_deal_threshold)},
  ${q(p.availability_status)}, ${n(p.pokemonArtworkId)}, ${q(p.energyType)}
FROM product_sets ps WHERE ps.set_code = ${q(p.set_code ?? p.set_name)}
ON CONFLICT (slug) DO NOTHING;`);
}
push("");

// --------------------------------------------------------- Angebote ------
push("-- Angebote (inkl. teilnehmender Filialen)");
for (const o of offers) {
  push(`INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, ${n(o.price)}, ${n(o.regular_price)}, ${q(o.valid_from)}, ${q(o.valid_until)},
  ${q(o.validity_type)}, ${q(o.source_type)}, ${q(o.source_url)}, ${q(o.verification_status)},
  ${q(o.stock_signal)}, ${o.stock_signal_at ? `${q(o.stock_signal_at)}::timestamptz` : "NULL"}
FROM products p, retailers r
WHERE p.slug = ${q(o.product_id)}
  AND r.retailer_group = ${q(o.retailer_group)} AND r.retailer_brand = ${q(o.retailer_brand)}
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = ${q(o.product_id)} AND o2.retailer_id = r.id
      AND o2.price = ${n(o.price)} AND o2.valid_from = ${q(o.valid_from)}
  );`);

  for (const storeId of o.participating_store_ids ?? []) {
    push(`INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = ${q(storeId)}
WHERE p.slug = ${q(o.product_id)} AND o.price = ${n(o.price)} AND o.valid_from = ${q(o.valid_from)}
ON CONFLICT DO NOTHING;`);
  }
}
push("");

// ------------------------------------------------------------ Drops ------
push("-- Live Drops & Restocks");
for (const d of liveDrops) {
  push(`INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = ${q(d.source_name)} LIMIT 1),
  ${q(d.kind)}, ${b(d.isPokemonCenter)}, ${n(d.price)}, ${q(d.availability)}, ${b(d.hot)},
  ${q(d.source_name)}, ${q(d.source_url)}, now() - (${n(d.minutes_ago)} * INTERVAL '1 minute')
FROM products p WHERE p.slug = ${q(d.product_id)}
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = ${q(d.product_id)} AND dd.source_name = ${q(d.source_name)} AND dd.kind = ${q(d.kind)});`);
}
push("");

// ---------------------------------------------------------- Rumors -------
push("-- Geruechte");
for (const r of rumors) {
  push(`INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES (${r.product_id ? `(SELECT id FROM products WHERE slug = ${q(r.product_id)})` : "NULL"},
  ${q(r.title)}, ${q(r.body)}, ${q(r.status)}, ${q(r.source_type)}, ${q(r.source_handle)},
  ${n(r.source_count)}, ${n(r.confidence)}, now() - (${n(r.posted_minutes_ago)} * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;`);
}
push("");

// ----------------------------------------------------------- Events ------
push("-- Events");
push(`-- Duplikate aus frueheren Laeufen entfernen (es gab keinen Schluessel)
DELETE FROM events a USING events b
WHERE a.ctid > b.ctid
  AND a.event_name = b.event_name AND a.date_start = b.date_start AND a.city = b.city;
-- ab jetzt verhindert ein Schluessel Doppelungen
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_natural_key;
ALTER TABLE events ADD CONSTRAINT events_natural_key UNIQUE (event_name, date_start, city);`);
for (const e of events) {
  push(`INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES (${q(e.event_name)}, ${q(e.event_type)}, ${q(e.date_start)}, ${q(e.date_end)}, ${q(e.opening_hours)},
  ${q(e.venue_name)}, ${q(e.street)}, ${q(e.postal_code)}, ${q(e.city)},
  ST_SetSRID(ST_MakePoint(${n(e.longitude)}, ${n(e.latitude)}), 4326)::geography,
  ${q(e.organizer)}, ${q(e.official_source)}, ${n(e.ticket_price)}, ${q(e.ticket_url)},
  ${q(e.pokemon_focus)}, ${b(e.trading_available)}, ${q(e.verification_status)}, ${q(e.last_checked)})
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;`);
}

push("");
push("COMMIT;");

mkdirSync(path.join(root, "db"), { recursive: true });
writeFileSync(path.join(root, "db/seed.sql"), lines.join("\n") + "\n", "utf8");
rmSync(tmp, { recursive: true, force: true });

console.log(
  `db/seed.sql geschrieben:\n` +
    `  ${retailers.length} Haendler, ${stores.length} Filialen, ${sets.length} Sets,\n` +
    `  ${products.length} Produkte, ${offers.length} Angebote, ${liveDrops.length} Drops,\n` +
    `  ${rumors.length} Geruechte, ${events.length} Events`,
);
