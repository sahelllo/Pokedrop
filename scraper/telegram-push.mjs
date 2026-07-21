#!/usr/bin/env node
/**
 * PokéDrop – Telegram-Sofortmeldung
 * ----------------------------------
 * Liest data/_new-events.json (nur die in diesem Check-Lauf neu entstandenen
 * Ereignisse) und schickt sie sofort an einen Telegram-Chat. Läuft direkt im
 * selben Workflow-Schritt wie der Stock-Checker – das ist der schnellste Weg
 * zu einer Push-Benachrichtigung ohne eigenen Server (siehe README).
 *
 * Braucht TELEGRAM_BOT_TOKEN und TELEGRAM_CHAT_ID als Umgebungsvariablen
 * (in GitHub: Repo → Settings → Secrets and variables → Actions). Fehlen sie,
 * bricht das Skript sauber ab, ohne den Workflow scheitern zu lassen.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const TEXT = {
  auf_lager: (e) => `🟢 *Auf Lager*\n${e.produkt}\n${e.shop} · ${e.preis ? `${e.preis.toFixed(2)} €` : 'Preis unbekannt'}\n${e.url}`,
  vorbestellbar: (e) => `🟡 *Vorbestellbar*\n${e.produkt}\n${e.shop}\n${e.url}`,
  ausverkauft: (e) => `🔴 *Ausverkauft*\n${e.produkt}\n${e.shop}`,
  preis_gefallen: (e) => `💸 *Preis gefallen*\n${e.produkt}\n${e.shop}: ${e.vorher.toFixed(2)} € → ${e.preis.toFixed(2)} €\n${e.url}`
};

async function senden(text) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown', disable_web_page_preview: true })
  });
  if (!res.ok) console.error(`Telegram-Fehler: HTTP ${res.status} – ${await res.text()}`);
}

async function main() {
  if (!TOKEN || !CHAT_ID) {
    console.log('Kein TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID gesetzt – überspringe Push.');
    return;
  }

  const datei = path.join(ROOT, 'data', '_new-events.json');
  let events = [];
  try {
    events = JSON.parse(await readFile(datei, 'utf8'));
  } catch {
    console.log('Keine neuen Ereignisse gefunden.');
    return;
  }
  if (!events.length) {
    console.log('Keine neuen Ereignisse in diesem Lauf.');
    return;
  }

  // Nur die wichtigsten zuerst raus (Lager/Vorbestellung vor Ausverkauft),
  // und pro Lauf begrenzen, damit Telegram nicht flutet.
  const rang = { auf_lager: 0, vorbestellbar: 1, preis_gefallen: 2, ausverkauft: 3 };
  events.sort((a, b) => (rang[a.art] ?? 9) - (rang[b.art] ?? 9));

  for (const ev of events.slice(0, 15)) {
    const bauen = TEXT[ev.art];
    if (!bauen) continue;
    await senden(bauen(ev));
    await new Promise((r) => setTimeout(r, 350)); // Telegram-Rate-Limit
  }

  console.log(`${events.length} Ereignis(se) an Telegram gemeldet.`);
}

main().catch((err) => { console.error(err); process.exit(0); }); // Push-Fehler dürfen den Workflow nicht rot machen
