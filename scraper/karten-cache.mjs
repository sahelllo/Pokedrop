#!/usr/bin/env node
/**
 * PokéDrop – Kartenbild-Cache
 * ----------------------------
 * Holt echte Kartenbilder von api.pokemontcg.io *serverseitig* im Workflow
 * (mit Wiederholversuchen) und schreibt sie als data/karten-cache.json.
 *
 * Warum serverseitig statt live aus dem Browser: Der kostenlose, schlüssel-
 * lose API-Zugang ist unter Last unzuverlässig (haeufig HTTP 500). Ein
 * einzelner Lauf hier alle paar Stunden mit Retries ist robust; tausende
 * Besucher-Browser, die alle gleichzeitig live anfragen, sind es nicht.
 * Die App liest hinterher nur noch eine eigene, zuverlässige JSON-Datei.
 *
 * Läuft im selben Cron wie der Stock-Checker, aktualisiert sich aber nur,
 * wenn der Cache älter als CACHE_MAX_STUNDEN ist – Kartenbilder ändern sich
 * nicht im 5-Minuten-Takt, unnötige API-Last wird so vermieden.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'data');
const CACHE_MAX_STUNDEN = 12;
const API = 'https://api.pokemontcg.io/v2';
const HEADERS = process.env.POKEMONTCG_API_KEY
  ? { 'X-Api-Key': process.env.POKEMONTCG_API_KEY }
  : {};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function holenMitRetry(pfad, versuche = 4) {
  for (let i = 0; i < versuche; i++) {
    try {
      const res = await fetch(`${API}${pfad}`, { headers: HEADERS });
      if (res.ok) {
        const json = await res.json();
        return json.data ?? null;
      }
    } catch { /* nächster Versuch */ }
    await sleep(1500 * (i + 1)); // steigender Abstand zwischen Versuchen
  }
  return null;
}

async function main() {
  const cachePfad = path.join(DATA, 'karten-cache.json');
  let bisher = null;
  if (existsSync(cachePfad)) {
    try { bisher = JSON.parse(await readFile(cachePfad, 'utf8')); } catch {}
  }
  if (bisher?.stand) {
    const alterStunden = (Date.now() - new Date(bisher.stand)) / 3_600_000;
    if (alterStunden < CACHE_MAX_STUNDEN) {
      console.log(`Kartenbild-Cache ist ${alterStunden.toFixed(1)} Std alt, noch frisch genug. Übersprungen.`);
      return;
    }
  }

  const drops = JSON.parse(await readFile(path.join(DATA, 'drops.json'), 'utf8'));
  const heldenIds = drops.drops.map((d) => d.heldenkarte).filter(Boolean);

  const helden = {};
  for (const id of heldenIds) {
    const karte = await holenMitRetry(`/cards/${id}`);
    if (karte?.images?.large) helden[id] = karte.images.large;
    await sleep(400);
  }

  const pool = [];
  const karten = await holenMitRetry('/cards?pageSize=40&orderBy=-set.releaseDate');
  if (karten) {
    for (const k of karten) if (k.images?.large) pool.push(k.images.large);
  }

  // Nicht überschreiben, wenn dieser Lauf nichts geliefert hat (API down) –
  // lieber den alten, funktionierenden Cache behalten als ihn zu leeren.
  if (!Object.keys(helden).length && !pool.length && bisher) {
    console.log('API lieferte diesmal nichts Verwertbares – alter Cache bleibt bestehen.');
    return;
  }

  await mkdir(DATA, { recursive: true });
  await writeFile(cachePfad, JSON.stringify({
    stand: new Date().toISOString(),
    helden: { ...(bisher?.helden ?? {}), ...helden },
    pool: pool.length ? pool : (bisher?.pool ?? [])
  }, null, 2) + '\n', 'utf8');

  console.log(`Kartenbild-Cache aktualisiert: ${Object.keys(helden).length} Heldenkarte(n), ${pool.length} Pool-Bilder.`);
}

main().catch((err) => { console.error(err); process.exit(0); }); // Cache-Fehler dürfen den Workflow nicht rot machen
