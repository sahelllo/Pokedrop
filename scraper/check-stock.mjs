#!/usr/bin/env node
/**
 * PokéDrop Stock-Checker
 * ----------------------
 * Liest scraper/sources.json, ruft jede Händler-Produktseite ab und ermittelt
 * Verfügbarkeit + Preis. Bevorzugt strukturierte Daten (schema.org/Offer im
 * JSON-LD oder Microdata) – das ist deutlich robuster als HTML-Diffing und
 * liefert kaum Fehlalarme. Nur wenn nichts Strukturiertes da ist, greift eine
 * konservative Textheuristik.
 *
 * Schreibt:
 *   data/stock.json    – aktueller Stand, wird von der PWA jede Minute geladen
 *   data/history.json  – Preisverlauf pro SKU/Shop (max. 180 Punkte)
 *   data/events.json   – Ereignisse (auf Lager / ausverkauft / Preis gefallen)
 *
 * Ohne externe Abhängigkeiten. Node 18+.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'data');

const UA =
  'Mozilla/5.0 (compatible; PokeDropBot/1.0; +https://pokedrop.app/bot) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const TIMEOUT_MS = 12000;
const DELAY_MS = 1200;          // höflich bleiben: 1 Anfrage/Shop-Seite alle 1,2 s
const MAX_HISTORY = 180;

const OOS_WORDS = [
  'ausverkauft', 'nicht verfügbar', 'nicht auf lager', 'derzeit nicht',
  'vergriffen', 'out of stock', 'soldout', 'sold out', 'benachrichtigen sie mich'
];
const IN_WORDS = [
  'in den warenkorb', 'sofort lieferbar', 'auf lager', 'jetzt kaufen',
  'in den einkaufswagen', 'versandfertig'
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Netzwerk ---------- */

async function fetchPage(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'de-DE,de;q=0.9'
      }
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, status: res.status, html: await res.text() };
  } catch (err) {
    return { ok: false, status: 0, error: String(err.name || err) };
  } finally {
    clearTimeout(t);
  }
}

/* ---------- Strukturierte Daten ---------- */

function collectJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim().replace(/^\uFEFF/, ''));
      out.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch { /* kaputtes JSON-LD ignorieren */ }
  }
  return out;
}

function* walk(node) {
  if (!node || typeof node !== 'object') return;
  yield node;
  for (const v of Object.values(node)) {
    if (Array.isArray(v)) for (const item of v) yield* walk(item);
    else if (v && typeof v === 'object') yield* walk(v);
  }
}

function normAvailability(value) {
  if (!value) return null;
  const v = String(value).toLowerCase();
  if (v.includes('instock') || v.includes('limitedavailability')) return 'in_stock';
  if (v.includes('preorder') || v.includes('presale')) return 'preorder';
  if (v.includes('backorder')) return 'backorder';
  if (v.includes('outofstock') || v.includes('soldout') || v.includes('discontinued')) return 'out_of_stock';
  return null;
}

function readOffer(html) {
  for (const doc of collectJsonLd(html)) {
    for (const node of walk(doc)) {
      const type = String(node['@type'] ?? '').toLowerCase();
      if (!type.includes('offer')) continue;
      const availability = normAvailability(node.availability ?? node.itemAvailability);
      const price = Number(String(node.price ?? node.lowPrice ?? '').replace(',', '.'));
      if (availability || Number.isFinite(price)) {
        return {
          availability,
          price: Number.isFinite(price) && price > 0 ? price : null,
          currency: node.priceCurrency ?? 'EUR',
          quelle: 'json-ld'
        };
      }
    }
  }
  // Microdata-Fallback
  const meta = /<(?:link|meta)[^>]+itemprop=["']availability["'][^>]+(?:href|content)=["']([^"']+)["']/i.exec(html)
    || /<(?:link|meta)[^>]+(?:href|content)=["']([^"']+)["'][^>]+itemprop=["']availability["']/i.exec(html);
  const priceMeta = /itemprop=["']price["'][^>]*content=["']([\d.,]+)["']/i.exec(html);
  if (meta || priceMeta) {
    const price = priceMeta ? Number(priceMeta[1].replace(',', '.')) : null;
    return {
      availability: meta ? normAvailability(meta[1]) : null,
      price: Number.isFinite(price) && price > 0 ? price : null,
      currency: 'EUR',
      quelle: 'microdata'
    };
  }
  return null;
}

/* ---------- Textheuristik (nur als letzte Instanz) ---------- */

function guessFromText(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const oos = OOS_WORDS.some((w) => text.includes(w));
  const inn = IN_WORDS.some((w) => text.includes(w));
  const priceHit = /(\d{1,4})[,.](\d{2})\s*(?:€|eur)/.exec(text);
  const price = priceHit ? Number(`${priceHit[1]}.${priceHit[2]}`) : null;

  if (oos && !inn) return { availability: 'out_of_stock', price, currency: 'EUR', quelle: 'text' };
  if (inn && !oos) return { availability: 'in_stock', price, currency: 'EUR', quelle: 'text' };
  return { availability: 'unknown', price, currency: 'EUR', quelle: 'text' };
}

/* ---------- Ein Shop prüfen ---------- */

async function checkShop(shop) {
  const res = await fetchPage(shop.url);
  const basis = { shop: shop.shop, typ: shop.typ, url: shop.url, geprueft: new Date().toISOString() };

  if (!res.ok) {
    return { ...basis, status: 'unknown', preis: null, quelle: 'fehler', http: res.status, hinweis: res.error ?? `HTTP ${res.status}` };
  }
  const offer = readOffer(res.html) ?? guessFromText(res.html);
  return {
    ...basis,
    status: offer.availability ?? 'unknown',
    preis: offer.price,
    waehrung: offer.currency ?? 'EUR',
    quelle: offer.quelle,
    http: res.status
  };
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
  const cfg = JSON.parse(await readFile(path.join(ROOT, 'scraper', 'sources.json'), 'utf8'));
  const vorher = await loadJson('stock.json', { produkte: [] });
  const history = await loadJson('history.json', {});
  const events = await loadJson('events.json', { events: [] });

  const alterStatus = new Map();
  for (const p of vorher.produkte ?? []) {
    for (const s of p.shops ?? []) alterStatus.set(`${p.sku}|${s.shop}`, s);
  }

  const produkte = [];
  const neueEreignisse = []; // nur die in diesem Lauf neu entstandenen Ereignisse (für Telegram-Sofortpush)

  for (const eintrag of cfg.watch) {
    const shops = [];
    for (const shop of eintrag.shops) {
      const ergebnis = await checkShop(shop);
      shops.push(ergebnis);

      const key = `${eintrag.sku}|${shop.shop}`;
      const alt = alterStatus.get(key);

      // Preisverlauf
      if (ergebnis.preis) {
        history[key] ??= [];
        const letzter = history[key].at(-1);
        if (!letzter || letzter.p !== ergebnis.preis) {
          history[key].push({ t: ergebnis.geprueft, p: ergebnis.preis });
          if (history[key].length > MAX_HISTORY) history[key] = history[key].slice(-MAX_HISTORY);
        }
      }

      // Ereignisse – das, was später den Push auslöst
      if (alt && alt.status !== ergebnis.status && ergebnis.status !== 'unknown') {
        if (ergebnis.status === 'in_stock' || ergebnis.status === 'preorder') {
          const ev = {
            art: ergebnis.status === 'preorder' ? 'vorbestellbar' : 'auf_lager',
            sku: eintrag.sku, produkt: eintrag.produkt, shop: shop.shop,
            preis: ergebnis.preis, url: shop.url, zeit: ergebnis.geprueft
          };
          events.events.unshift(ev);
          neueEreignisse.push(ev);
        } else if (ergebnis.status === 'out_of_stock' && alt.status === 'in_stock') {
          const ev = {
            art: 'ausverkauft', sku: eintrag.sku, produkt: eintrag.produkt,
            shop: shop.shop, url: shop.url, zeit: ergebnis.geprueft
          };
          events.events.unshift(ev);
          neueEreignisse.push(ev);
        }
      }
      if (alt?.preis && ergebnis.preis && ergebnis.preis < alt.preis - 0.01) {
        const ev = {
          art: 'preis_gefallen', sku: eintrag.sku, produkt: eintrag.produkt,
          shop: shop.shop, preis: ergebnis.preis, vorher: alt.preis,
          url: shop.url, zeit: ergebnis.geprueft
        };
        events.events.unshift(ev);
        neueEreignisse.push(ev);
      }

      await sleep(DELAY_MS);
    }

    const verfuegbar = shops.filter((s) => s.status === 'in_stock');
    const preise = shops.map((s) => s.preis).filter((p) => typeof p === 'number');

    produkte.push({
      sku: eintrag.sku,
      produkt: eintrag.produkt,
      uvp: eintrag.uvp ?? null,
      status: verfuegbar.length ? 'in_stock'
        : shops.some((s) => s.status === 'preorder') ? 'preorder'
        : shops.some((s) => s.status === 'out_of_stock') ? 'out_of_stock'
        : 'unknown',
      bester_preis: preise.length ? Math.min(...preise) : null,
      shops_verfuegbar: verfuegbar.length,
      shops
    });
  }

  events.events = events.events.slice(0, 120);

  await saveJson('stock.json', {
    stand: new Date().toISOString(),
    intervall_minuten: Number(process.env.CHECK_INTERVAL_MIN ?? 5),
    produkte
  });
  await saveJson('history.json', history);
  await saveJson('events.json', events);

  // Nur für den Telegram-Sofortpush im Workflow gedacht (data/_new-events.json
  // ist ungetrackt, siehe .gitignore) – wird nach dem Versand wieder gelöscht.
  await saveJson('_new-events.json', neueEreignisse);

  const live = produkte.filter((p) => p.status === 'in_stock').length;
  console.log(`Fertig: ${produkte.length} Produkte geprüft, ${live} verfügbar, ${neueEreignisse.length} neue Ereignisse, ${events.events.length} Ereignisse gesamt.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
