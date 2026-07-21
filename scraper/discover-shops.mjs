#!/usr/bin/env node
/**
 * PokéDrop – Live-Radar-Scanner (Entdeckung, nicht nur Watchlist)
 * -----------------------------------------------------------------
 * check-stock.mjs prüft eine feste, kuratierte Liste bekannter Produkte
 * (scraper/sources.json). Dieses Skript ergänzt das um eine BREITE Suche:
 * es fragt echte, verifizierte Quellen komplett ab und findet dadurch auch
 * Pokémon-Produkte, die noch nicht manuell in sources.json eingetragen sind.
 *
 * Zwei Quellen, beide ohne Login und ohne externe Abhängigkeiten nutzbar:
 *
 * 1. Shopify-Shops (SHOPIFY_SHOPS unten): `/products.json` ist ein
 *    öffentlicher Standard-Endpunkt jedes Shopify-Shops – kein Login nötig,
 *    liefert den kompletten Produktkatalog inkl. Preis/Verfügbarkeit.
 *    Jeder Eintrag hier wurde vor der Aufnahme manuell geprüft (echte Domain,
 *    liefert echte Pokémon-Produktdaten).
 *
 * 2. kaufDA-Prospekt-Aggregator: https://www.kaufda.de/Angebote/Pokemon
 *    bettet serverseitig schema.org-`Product`-JSON-LD ein (dieselbe Quelle,
 *    die Google für Rich Snippets liest). Das deckt automatisch neue
 *    Wochenprospekte großer Ketten ab (Kaufland, Marktkauf, REWE, Aldi, ...),
 *    sobald sie erscheinen – ohne dass wir pro Kette manuell etwas eintragen
 *    müssen. robots.txt von kaufda.de erlaubt das (`crawl-delay: 2`, der Pfad
 *    `/Angebote/` ist nicht gesperrt) – wir halten uns daran.
 *
 * Ergebnisse landen als zusätzliche Einträge (sku-Präfix "disc-") in
 * data/stock.json, damit die bestehende Radar-Ansicht (assets/app.js,
 * alleAngebote()) sie automatisch mitrendert – ganz ohne Frontend-Änderung.
 * Nur ein Händlername, den wir nicht kennen (nicht in KAUFDA_RETAILERS),
 * wird ignoriert statt einen geratenen Link zu erzeugen.
 *
 * WICHTIG zur Reihenfolge: dieses Skript muss NACH check-stock.mjs laufen
 * (siehe .github/workflows/stock-check.yml) und hängt seine Funde an das
 * an, was check-stock.mjs gerade in stock.json geschrieben hat – so bleiben
 * kuratierte und entdeckte Produkte sauber getrennt, unabhängig davon, was
 * vorher schon drinstand.
 *
 * Node 18+, keine externen Abhängigkeiten.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'data');

const UA =
  'Mozilla/5.0 (compatible; PokeDropBot/1.0; +https://pokedrop.app/bot) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const TIMEOUT_MS = 15000;
const DELAY_MS = 1500;           // höflich bleiben zwischen Anfragen
const MAX_HISTORY_EVENTS = 120;
const MAX_DISCOVERIES = 30;      // begrenzt, damit stock.json/Git nicht unnötig wächst
const MAX_PER_SHOP = 8;

const KEYWORDS = ['pokemon', 'pokémon'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Netzwerk ---------- */

async function fetchUrl(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' }
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

function normalisiert(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/* ---------- Quelle 1: Shopify-Shops ---------- */

const SHOPIFY_SHOPS = [
  { domain: 'www.cardbuddys.de', shop: 'CardBuddys' },
  { domain: 'webbas-kartenecke.de', shop: 'Webbas Kartenecke' },
  { domain: 'www.celestial-gameshop.de', shop: 'Celestial Gameshop' },
  { domain: 'www.cardstore.at', shop: 'CardStore.at' },
  { domain: 'lairos.shop', shop: 'Lairos' }
];

async function scanShopifyShop({ domain, shop }) {
  const funde = [];
  const res = await fetchUrl(`https://${domain}/products.json?limit=250`);
  if (!res.ok) {
    console.warn(`[discover] ${shop}: HTTP ${res.status}, übersprungen`);
    return funde;
  }
  const data = await res.json().catch(() => null);
  if (!data?.products) return funde;

  for (const p of data.products) {
    const tags = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags ?? '');
    const heuhaufen = normalisiert(`${p.title} ${p.product_type ?? ''} ${tags}`);
    if (!KEYWORDS.some((k) => heuhaufen.includes(k))) continue;

    const variants = p.variants ?? [];
    // Nur Varianten mit echtem Preis zählen – manche Shops führen
    // Platzhalter-/ausgelistete Varianten mit price "0.00", die sonst
    // fälschlich als "günstigster Fund" durchrutschen würden.
    const mitPreis = variants.filter((v) => Number.parseFloat(v.price) > 0);
    if (!mitPreis.length) continue;

    const verfuegbar = mitPreis.find((v) => v.available);
    const guenstigste = mitPreis.reduce((min, v) =>
      !min || Number.parseFloat(v.price) < Number.parseFloat(min.price) ? v : min, null);
    const quelle = verfuegbar ?? guenstigste;

    funde.push({
      sku: `disc-shopify-${domain.replace(/[^a-z0-9]+/gi, '-')}-${p.id}`,
      produkt: p.title,
      shop,
      typ: 'TCG-Fachhandel',
      url: `https://${domain}/products/${p.handle}`,
      preis: quelle ? Number.parseFloat(quelle.price) : null,
      waehrung: 'EUR',
      status: verfuegbar ? 'in_stock' : 'out_of_stock',
      quelle: 'shopify-json'
    });
  }
  return funde;
}

/* ---------- Quelle 2: kaufDA Prospekt-Aggregator ---------- */

// Namen exakt so, wie kaufDA sie auf kaufda.de/Angebote/Pokemon als
// `manufacturer.name` ausgibt. websiteUrl ist die echte, offizielle Seite des
// Händlers – NICHT die kaufDA-Seite selbst, damit der "Jetzt ansehen"-Link
// immer zum echten Händler führt.
const KAUFDA_RETAILERS = {
  kaufland: { name: 'Kaufland', url: 'https://www.kaufland.de', typ: 'Supermarkt' },
  edeka: { name: 'Edeka', url: 'https://www.edeka.de', typ: 'Supermarkt' },
  rewe: { name: 'REWE', url: 'https://www.rewe.de', typ: 'Supermarkt' },
  lidl: { name: 'Lidl', url: 'https://www.lidl.de', typ: 'Supermarkt' },
  penny: { name: 'Penny', url: 'https://www.penny.de', typ: 'Supermarkt' },
  'netto marken-discount': { name: 'Netto Marken-Discount', url: 'https://www.netto-online.de', typ: 'Supermarkt' },
  'aldi nord': { name: 'Aldi Nord', url: 'https://www.aldi-nord.de', typ: 'Supermarkt' },
  'aldi süd': { name: 'Aldi Süd', url: 'https://www.aldi-sued.de', typ: 'Supermarkt' },
  marktkauf: { name: 'Marktkauf', url: 'https://www.marktkauf.de', typ: 'Supermarkt' },
  'famila nordost': { name: 'famila Nordost', url: 'https://www.famila.de', typ: 'Supermarkt' },
  rossmann: { name: 'Rossmann', url: 'https://www.rossmann.de', typ: 'Drogerie' },
  dm: { name: 'dm', url: 'https://www.dm.de', typ: 'Drogerie' },
  müller: { name: 'Müller', url: 'https://www.mueller.de', typ: 'Filialhandel' },
  metro: { name: 'Metro', url: 'https://www.metro.de', typ: 'Großhandel' },
  mediamarkt: { name: 'MediaMarkt', url: 'https://www.mediamarkt.de', typ: 'Elektronikmarkt' },
  saturn: { name: 'Saturn', url: 'https://www.saturn.de', typ: 'Elektronikmarkt' },
  'smyths toys': { name: 'Smyths Toys', url: 'https://www.smythstoys.com/de', typ: 'Spielwarenhändler' },
  gamestop: { name: 'GameStop', url: 'https://www.gamestop.de', typ: 'Filialhandel' },
  galeria: { name: 'Galeria', url: 'https://www.galeria.de', typ: 'Kaufhaus' }
};

function extractJsonLd(html) {
  const out = [];
  const re = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try { out.push(JSON.parse(m[1])); } catch { /* kaputtes JSON-LD ignorieren */ }
  }
  return out;
}

async function scanKaufdaProspekte() {
  const funde = [];
  const url = 'https://www.kaufda.de/Angebote/Pokemon';
  const res = await fetchUrl(url);
  if (!res.ok) {
    console.warn(`[discover] kaufDA: HTTP ${res.status}, übersprungen`);
    return funde;
  }
  const html = await res.text();

  for (const block of extractJsonLd(html)) {
    if (block?.['@type'] !== 'Product') continue;
    const haendlerName = block.manufacturer?.name?.trim();
    if (!haendlerName) continue;
    const haendler = KAUFDA_RETAILERS[haendlerName.toLowerCase()];
    if (!haendler) {
      console.warn(`[discover] kaufDA nennt unbekannten Händler "${haendlerName}" – ignoriert (in KAUFDA_RETAILERS ergänzen, wenn geprüft).`);
      continue;
    }

    const preis = block.offers?.lowPrice ?? block.offers?.price ?? null;
    const validUntil = block.offers?.priceValidUntil ?? '';
    const hash = createHash('sha1').update(`${haendlerName}|${block.name}|${validUntil}`).digest('hex').slice(0, 16);

    funde.push({
      sku: `disc-kaufda-${hash}`,
      produkt: block.name,
      shop: haendler.name,
      typ: haendler.typ,
      url: haendler.url,
      preis: typeof preis === 'number' ? preis : null,
      waehrung: block.offers?.priceCurrency ?? 'EUR',
      status: 'in_stock',
      quelle: 'kaufda-json-ld'
    });
  }
  return funde;
}

/* ---------- Dateien ---------- */

async function loadJson(file, fallback) {
  const p = path.join(DATA, file);
  if (!existsSync(p)) return fallback;
  try { return JSON.parse(await readFile(p, 'utf8')); } catch { return fallback; }
}

async function saveJson(file, value) {
  await mkdir(DATA, { recursive: true });
  await writeFile(path.join(DATA, file), JSON.stringify(value, null, 2) + '\n', 'utf8');
}

/* ---------- Hauptlauf ---------- */

async function main() {
  const alleFunde = [];

  for (const shop of SHOPIFY_SHOPS) {
    const funde = await scanShopifyShop(shop);
    alleFunde.push(...funde);
    await sleep(DELAY_MS);
  }
  alleFunde.push(...(await scanKaufdaProspekte()));

  // Auf Lager zuerst (wie STATUS_TEXT-Rang in app.js), erst dann nach Preis –
  // sonst gewinnen scheinbar "günstige" ausverkaufte Fundstücke Plätze, die
  // eigentlich lieferbaren Funden gehören sollten. Danach pro Shop begrenzen
  // (Vielfalt statt ein Shop dominiert alle Plätze), dann global begrenzen –
  // hält stock.json/Git-History klein.
  const statusRang = { in_stock: 0, preorder: 1, out_of_stock: 2, unknown: 3 };
  const proShop = new Map();
  const begrenzt = [];
  const sortiert = alleFunde.sort((a, b) =>
    (statusRang[a.status] ?? 9) - (statusRang[b.status] ?? 9) || (a.preis ?? 1e9) - (b.preis ?? 1e9));
  for (const f of sortiert) {
    const anzahl = proShop.get(f.shop) ?? 0;
    if (anzahl >= MAX_PER_SHOP) continue;
    proShop.set(f.shop, anzahl + 1);
    begrenzt.push(f);
    if (begrenzt.length >= MAX_DISCOVERIES) break;
  }

  const vorherState = await loadJson('discoveries-state.json', {});
  const events = await loadJson('events.json', { events: [] });
  const neueEreignisse = await loadJson('_new-events.json', []); // von check-stock.mjs in diesem Lauf befüllt

  const jetzt = new Date().toISOString();
  const neuerState = {};
  let neuInDiesemLauf = 0;

  for (const f of begrenzt) {
    neuerState[f.sku] = { status: f.status, preis: f.preis };
    const alt = vorherState[f.sku];

    if (alt && alt.status !== f.status && f.status === 'in_stock') {
      const ev = { art: 'auf_lager', sku: f.sku, produkt: f.produkt, shop: f.shop, preis: f.preis, url: f.url, zeit: jetzt };
      events.events.unshift(ev);
      neueEreignisse.push(ev);
      neuInDiesemLauf += 1;
    } else if (alt?.preis && f.preis && f.preis < alt.preis - 0.01) {
      const ev = { art: 'preis_gefallen', sku: f.sku, produkt: f.produkt, shop: f.shop, preis: f.preis, vorher: alt.preis, url: f.url, zeit: jetzt };
      events.events.unshift(ev);
      neueEreignisse.push(ev);
      neuInDiesemLauf += 1;
    }
  }
  events.events = events.events.slice(0, MAX_HISTORY_EVENTS);

  // In stock.json einhängen: kuratierte Produkte (check-stock.mjs) bleiben
  // unangetastet, nur die "disc-"-Einträge werden komplett neu gesetzt.
  const stock = await loadJson('stock.json', { produkte: [], stand: jetzt });
  const kuratiert = (stock.produkte ?? []).filter((p) => !p.sku.startsWith('disc-'));
  const entdeckt = begrenzt.map((f) => ({
    sku: f.sku,
    produkt: f.produkt,
    uvp: null,
    status: f.status,
    bester_preis: f.preis,
    shops_verfuegbar: f.status === 'in_stock' ? 1 : 0,
    shops: [{
      shop: f.shop, typ: f.typ, url: f.url, geprueft: jetzt,
      status: f.status, preis: f.preis, waehrung: f.waehrung, quelle: f.quelle, http: 200
    }]
  }));

  await saveJson('stock.json', { ...stock, stand: stock.stand ?? jetzt, produkte: [...kuratiert, ...entdeckt] });
  await saveJson('discoveries-state.json', neuerState);
  await saveJson('events.json', events);
  await saveJson('_new-events.json', neueEreignisse);

  console.log(`[discover] ${alleFunde.length} Treffer gescannt, ${begrenzt.length} übernommen, ${neuInDiesemLauf} neue Ereignisse in diesem Lauf.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
