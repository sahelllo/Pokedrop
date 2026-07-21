/* PokéDrop – Anwendungslogik
   Kein Framework, kein Build-Schritt. ES-Module, läuft direkt im Browser. */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const STATUS_TEXT = {
  in_stock: 'Auf Lager',
  preorder: 'Vorbestellbar',
  backorder: 'Nachbestellt',
  out_of_stock: 'Ausverkauft',
  unknown: 'Unbekannt'
};

const euro = (n) =>
  typeof n === 'number' ? n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '–';

const state = {
  drops: null,
  stock: null,
  history: {},
  merkliste: new Set(JSON.parse(localStorage.getItem('pd.merkliste') || '[]')),
  pro: localStorage.getItem('pd.pro') === '1',
  gesehen: new Set(JSON.parse(localStorage.getItem('pd.gesehen') || '[]')),
  alarme: new Map(JSON.parse(localStorage.getItem('pd.alarme') || '[]')),
  holoGestartet: false
};

const vorZeit = (iso) => {
  if (!iso) return null;
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 8) return 'gerade eben';
  if (s < 60) return `vor ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `vor ${m} Min`;
  const h = Math.floor(m / 60);
  return `vor ${h} Std`;
};

/* ---------------- Daten laden ---------------- */

async function holen(pfad, fallback) {
  try {
    const res = await fetch(`${pfad}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return fallback;
  }
}

function frischeTreffer(alt, neu) {
  const altStatus = new Map();
  for (const p of alt?.produkte ?? []) altStatus.set(p.sku, p.status);
  const frisch = new Set();
  for (const p of neu?.produkte ?? []) {
    const vorher = altStatus.get(p.sku);
    if (p.status === 'in_stock' && vorher && vorher !== 'in_stock') frisch.add(p.sku);
  }
  return frisch;
}

async function aktualisieren({ still = false } = {}) {
  const vorherStock = state.stock;
  const [drops, stock, history] = await Promise.all([
    holen('data/drops.json', state.drops),
    holen('data/stock.json', state.stock ?? { produkte: [], stand: null }),
    holen('data/history.json', state.history)
  ]);
  state.drops = drops;
  state.stock = stock;
  state.history = history ?? {};

  const frisch = frischeTreffer(vorherStock, stock);

  zeichneRadar(frisch);
  zeichneDrops();
  zeichneMerkliste();
  if (!still) { zeichneShops(); zeichnePro(); }
  zeichneFuss();
  meldeNeueTreffer();
  echteBilderEinsetzen();
  heroTiltEinrichten();
  if (!state.holoGestartet) { state.holoGestartet = true; holoRegen(); }
}

/* ---------------- Echte Kartenbilder (Pokémon TCG API) ----------------
   Lädt echte, offizielle Kartenbilder live von api.pokemontcg.io (der
   Community-Referenzdatenbank für das Pokémon-TCG). Die Bilder werden nur
   verlinkt, nicht im Repo gespeichert. Ist die API nicht erreichbar, bleibt
   automatisch der eigene SVG-Mockup bzw. das Partikelsystem als Fallback
   sichtbar – die Seite bricht nie deswegen. */

const KARTEN_API = 'https://api.pokemontcg.io/v2';
const KARTEN_CACHE_MS = 6 * 60 * 60 * 1000;

async function kartenApiHolen(pfad) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${KARTEN_API}${pfad}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function heldenkarteHolen(id) {
  if (!id) return null;
  const key = `pd.karte.${id}`;
  try {
    const cache = JSON.parse(localStorage.getItem(key) || 'null');
    if (cache && Date.now() - cache.zeit < KARTEN_CACHE_MS) return cache.bild;
  } catch {}
  const karte = await kartenApiHolen(`/cards/${id}`);
  const bild = karte?.images?.large ?? null;
  if (bild) { try { localStorage.setItem(key, JSON.stringify({ bild, zeit: Date.now() })); } catch {} }
  return bild;
}

async function kartenPoolHolen() {
  const key = 'pd.kartenpool';
  try {
    const cache = JSON.parse(localStorage.getItem(key) || 'null');
    if (cache?.bilder?.length && Date.now() - cache.zeit < KARTEN_CACHE_MS) return cache.bilder;
  } catch {}
  const karten = await kartenApiHolen('/cards?pageSize=40&orderBy=-set.releaseDate');
  const bilder = (karten ?? []).filter((k) => k.images?.large).map((k) => k.images.large);
  if (bilder.length) { try { localStorage.setItem(key, JSON.stringify({ bilder, zeit: Date.now() })); } catch {} }
  return bilder;
}

async function echteBilderEinsetzen() {
  if (!state.drops) return;
  for (const drop of state.drops.drops) {
    if (!drop.heldenkarte) continue;
    const wrap = document.querySelector(`.karte[data-drop-id="${drop.id}"] .mockup-wrap`);
    if (!wrap || wrap.dataset.geladen) continue;
    wrap.dataset.geladen = '1';
    const bild = await heldenkarteHolen(drop.heldenkarte);
    if (!bild) continue;
    const img = new Image();
    img.alt = `${drop.set} – ${drop.star} (offizielles Kartenbild)`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'mockup mockup-foto';
    img.onload = () => { wrap.prepend(img); wrap.classList.add('foto-bereit'); };
    img.src = bild;
  }
}

/* Schwebende, sich drehende echte Karten im Hintergrund. Rein dekorativ,
   niedrige Deckkraft, pausiert bei "Bewegung reduzieren" und inaktivem Tab. */
async function holoRegen() {
  const feld = $('#holoregen');
  if (!feld || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bilder = await kartenPoolHolen();
  if (!bilder.length) return;

  const anzahl = innerWidth < 600 ? 6 : innerWidth < 1100 ? 9 : 13;
  const auswahl = [...bilder].sort(() => Math.random() - 0.5).slice(0, anzahl);

  feld.replaceChildren();
  auswahl.forEach((url, i) => {
    const stueck = document.createElement('div');
    stueck.className = 'holo-karte';
    stueck.style.setProperty('--x', `${Math.random() * 100}%`);
    stueck.style.setProperty('--verzoegerung', `${(i / auswahl.length) * -40}s`);
    stueck.style.setProperty('--dauer', `${28 + Math.random() * 22}s`);
    stueck.style.setProperty('--groesse', `${64 + Math.random() * 58}px`);
    stueck.style.setProperty('--dreh', `${360 + Math.random() * 360}deg`);
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    stueck.append(img);
    feld.append(stueck);
  });

  document.addEventListener('visibilitychange', () => {
    feld.style.animationPlayState = document.hidden ? 'paused' : 'running';
    $$('.holo-karte', feld).forEach((k) => { k.style.animationPlayState = document.hidden ? 'paused' : 'running'; });
  });
}

/* ---------------- Hero-Holo-Tilt ---------------- */

function heroTiltEinrichten() {
  const hero = $('.karte.hero');
  if (!hero || hero.dataset.tiltAktiv) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  hero.dataset.tiltAktiv = '1';

  const setzen = (px, py) => {
    hero.style.setProperty('--tilt-x', `${(py - 0.5) * -9}deg`);
    hero.style.setProperty('--tilt-y', `${(px - 0.5) * 9}deg`);
    hero.style.setProperty('--glanz-x', `${px * 100}%`);
    hero.style.setProperty('--glanz-y', `${py * 100}%`);
  };
  const zuruecksetzen = () => {
    hero.style.setProperty('--tilt-x', '0deg');
    hero.style.setProperty('--tilt-y', '0deg');
    hero.style.setProperty('--glanz-x', '50%');
    hero.style.setProperty('--glanz-y', '50%');
  };

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    setzen((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  });
  hero.addEventListener('pointerleave', zuruecksetzen);
  hero.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    const r = hero.getBoundingClientRect();
    setzen((t.clientX - r.left) / r.width, (t.clientY - r.top) / r.height);
  }, { passive: true });
  hero.addEventListener('touchend', zuruecksetzen);
  zuruecksetzen();
}

/* ---------------- Radar ---------------- */

function alleAngebote() {
  const liste = [];
  for (const p of state.stock?.produkte ?? []) {
    for (const s of p.shops ?? []) {
      liste.push({ ...s, sku: p.sku, produkt: p.produkt, uvp: p.uvp });
    }
  }
  const rang = { in_stock: 0, preorder: 1, backorder: 2, unknown: 3, out_of_stock: 4 };
  return liste.sort((a, b) =>
    (rang[a.status] ?? 9) - (rang[b.status] ?? 9) || (a.preis ?? 1e9) - (b.preis ?? 1e9));
}

function trefferZeile(a, frisch) {
  const unterUvp = a.uvp && a.preis && a.preis <= a.uvp;
  const el = document.createElement('a');
  el.className = `treffer ${a.status}${frisch?.has(a.sku) ? ' frisch' : ''}`;
  el.href = a.url;
  el.target = '_blank';
  el.rel = 'noopener nofollow sponsored';
  el.innerHTML = `
    <div class="treffer-text">
      <p class="treffer-name">${a.produkt}</p>
      <p class="treffer-meta">${a.shop} · ${STATUS_TEXT[a.status] ?? a.status}${a.typ ? ` · ${a.typ}` : ''}</p>
    </div>
    <span class="treffer-preis ${unterUvp ? 'gut' : ''}">${euro(a.preis)}</span>`;
  return el;
}

function zeichneRadar(frisch) {
  const box = $('#radar-liste');
  const stand = $('#radar-stand');
  const angebote = alleAngebote();
  const live = angebote.filter((a) => a.status === 'in_stock' || a.status === 'preorder');

  stand.dataset.iso = state.stock?.stand ?? '';
  stand.textContent = state.stock?.stand ? `geprüft ${vorZeit(state.stock.stand)}` : 'kein Feed';

  box.replaceChildren();
  if (!live.length) {
    const p = document.createElement('p');
    p.className = 'leer';
    p.textContent = angebote.length
      ? 'Gerade nirgends auf Lager. Der Radar prüft weiter – aktiviere Benachrichtigungen im Pro-Tab.'
      : 'Noch kein Verfügbarkeits-Feed. Starte den Stock-Checker (scraper/check-stock.mjs).';
    box.append(p);
    return;
  }
  live.slice(0, 6).forEach((a) => box.append(trefferZeile(a, frisch)));
}

/* ---------------- Drops ---------------- */

function restzeit(ziel) {
  const diff = new Date(ziel) - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    tage: Math.floor(s / 86400),
    std: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    sek: s % 60
  };
}

function countdownHtml(r) {
  const zelle = (z, l) => `<div class="cd-zelle"><span class="cd-zahl">${String(z).padStart(2, '0')}</span><span class="cd-label">${l}</span></div>`;
  return `<div class="countdown">${zelle(r.tage, 'Tage')}${zelle(r.std, 'Std')}${zelle(r.min, 'Min')}${zelle(r.sek, 'Sek')}</div>`;
}

function sparkline(sku) {
  const punkte = Object.entries(state.history)
    .filter(([k]) => k.startsWith(`${sku}|`))
    .flatMap(([, v]) => v)
    .sort((a, b) => new Date(a.t) - new Date(b.t))
    .slice(-40);
  if (punkte.length < 3) return '';

  const werte = punkte.map((p) => p.p);
  const min = Math.min(...werte), max = Math.max(...werte);
  const spanne = max - min || 1;
  const d = punkte.map((p, i) => {
    const x = (i / (punkte.length - 1)) * 100;
    const y = 40 - ((p.p - min) / spanne) * 34;
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const jetzt = werte.at(-1);
  const richtung = jetzt < werte[0] ? '↓ gefallen' : jetzt > werte[0] ? '↑ gestiegen' : '→ stabil';
  return `<div class="verlauf">
    <svg viewBox="0 0 100 46" preserveAspectRatio="none" role="img" aria-label="Preisverlauf">
      <path d="${d}" fill="none" stroke="var(--gelb)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>
    </svg>
    <p class="verlauf-text">Tief ${euro(min)} · Hoch ${euro(max)} · ${richtung}</p>
  </div>`;
}

function statusFuerSet(drop) {
  const skus = new Set(drop.produkte.map((p) => p.sku));
  const treffer = (state.stock?.produkte ?? []).filter((p) => skus.has(p.sku));
  const live = treffer.filter((p) => p.status === 'in_stock');
  if (live.length) {
    const preis = Math.min(...live.map((p) => p.bester_preis ?? Infinity));
    const shop = live[0].shops.find((s) => s.status === 'in_stock');
    return { text: `Jetzt kaufbar bei ${shop?.shop ?? 'einem Händler'} · ${euro(Number.isFinite(preis) ? preis : null)}`, klasse: '' };
  }
  if (treffer.some((p) => p.status === 'preorder')) return { text: 'Vorbestellbar', klasse: '' };
  if (treffer.length) return { text: 'Aktuell überall ausverkauft', klasse: 'ruhig' };
  return null;
}

function dropKarte(drop, hero = false) {
  const r = restzeit(drop.release);
  const tageSeit = Math.floor((Date.now() - new Date(drop.release)) / 86400000);
  const verkauf = statusFuerSet(drop);

  const badge = verkauf
    ? `<span class="badge ${verkauf.klasse}">${verkauf.text}</span>`
    : r
      ? `<span class="badge ruhig">Erscheint ${new Date(drop.release).toLocaleDateString('de-DE')}</span>`
      : `<span class="badge">Seit ${tageSeit} ${tageSeit === 1 ? 'Tag' : 'Tagen'} erhältlich</span>`;

  const kern = `
    ${badge}
    <h2 class="set-name">${drop.set}</h2>
    <p class="set-star">${drop.star}</p>
    <div class="mockup-wrap">
      <svg class="mockup" viewBox="0 0 320 160"><use href="#mk-${drop.mockup}"></use></svg>
    </div>
    ${r ? countdownHtml(r) : ''}
    <ul class="fakten">${drop.fakten.map((f) => `<li>${f}</li>`).join('')}</ul>
    <div class="preise">${drop.produkte.map((p) => `<span class="preis-chip">${p.name} · ${euro(p.uvp)}</span>`).join('')}</div>
    ${sparkline(drop.produkte[0]?.sku ?? '')}
    <div class="aktionen">
      <button class="knopf merken" data-sku="${drop.produkte[0]?.sku ?? drop.id}"
              aria-pressed="${state.merkliste.has(drop.produkte[0]?.sku ?? drop.id)}">
        ${state.merkliste.has(drop.produkte[0]?.sku ?? drop.id) ? '★ Gemerkt' : '☆ Merken'}
      </button>
      <a class="knopf stark" href="${drop.quellen[0]?.url ?? '#'}" target="_blank" rel="noopener">Händler zeigen</a>
      <button class="knopf teilen" data-teilen="${drop.id}" aria-label="Diesen Drop teilen">↗ Teilen</button>
    </div>
    <details class="klapp">
      <summary>Quellen &amp; alle Shops</summary>
      <div class="aktionen">
        ${drop.quellen.map((q) => `<a class="knopf" href="${q.url}" target="_blank" rel="noopener">${q.titel}</a>`).join('')}
        ${(state.drops?.shops ?? []).slice(0, 5).map((s) => `<a class="knopf" href="${s.url}" target="_blank" rel="noopener nofollow sponsored">${s.name}</a>`).join('')}
      </div>
    </details>`;

  const art = document.createElement('article');
  art.className = hero ? 'karte hero' : 'karte';
  art.dataset.release = drop.release;
  art.dataset.dropId = drop.id;
  art.innerHTML = hero ? `<div class="hero-innen">${kern}</div>` : kern;
  return art;
}

function zeichneDrops() {
  if (!state.drops) return;
  const panel = $('#p-drops');
  const sortiert = [...state.drops.drops].sort((a, b) => new Date(a.release) - new Date(b.release));
  const erschienen = sortiert.filter((d) => new Date(d.release) <= Date.now());
  const kommend = sortiert.filter((d) => new Date(d.release) > Date.now());
  const hero = erschienen.at(-1) ?? kommend[0];

  panel.replaceChildren();
  if (hero) panel.append(dropKarte(hero, true));
  kommend.filter((d) => d !== hero).forEach((d, i) => {
    const k = dropKarte(d);
    k.style.animationDelay = `${(i + 1) * 60}ms`;
    panel.append(k);
  });
  erschienen.filter((d) => d !== hero).reverse().forEach((d) => panel.append(dropKarte(d)));
}

/* ---------------- Merkliste ---------------- */

function zeichneMerkliste() {
  const panel = $('#p-merkliste');
  const angebote = alleAngebote().filter((a) => state.merkliste.has(a.sku));

  panel.replaceChildren();
  const karte = document.createElement('div');
  karte.className = 'karte';

  if (!state.merkliste.size) {
    karte.innerHTML = `
      <h2 class="set-name">Merkliste ist leer</h2>
      <p class="set-star">Tippe bei einem Drop auf „Merken“. Sobald ein gemerktes Produkt irgendwo auf Lager geht, siehst du es hier zuerst.</p>`;
    panel.append(karte);
    return;
  }

  karte.innerHTML = `<h2 class="set-name">Merkliste</h2>
    <p class="set-star">${state.merkliste.size} Produkte werden überwacht.</p>`;
  angebote.forEach((a) => karte.append(trefferZeile(a)));
  if (!angebote.length) {
    const p = document.createElement('p');
    p.className = 'leer';
    p.textContent = 'Noch keine Verfügbarkeitsdaten für diese Produkte.';
    karte.append(p);
  }
  panel.append(karte);

  const alarmKarte = document.createElement('div');
  alarmKarte.className = 'karte';
  alarmKarte.innerHTML = `<h2 class="set-name">Preisalarm</h2>
    <p class="set-star">Trag einen Zielpreis ein – du bekommst eine Meldung, sobald ein Shop diesen Preis erreicht.</p>`;
  [...state.merkliste].forEach((sku) => {
    const name = state.stock?.produkte?.find((p) => p.sku === sku)?.produkt ?? sku;
    const zeile = document.createElement('div');
    zeile.className = 'alarm-zeile';
    zeile.innerHTML = `
      <span class="alarm-name">${name}</span>
      <label class="alarm-feld">
        <input type="number" inputmode="decimal" step="0.01" min="0" placeholder="Zielpreis in €"
               value="${state.alarme.get(sku) ?? ''}" data-alarm-sku="${sku}">
      </label>`;
    alarmKarte.append(zeile);
  });
  if (state.merkliste.size) panel.append(alarmKarte);
}

/* ---------------- Shops ---------------- */

function zeichneShops() {
  if (!state.drops) return;
  const panel = $('#p-shops');
  panel.replaceChildren();

  const haendler = document.createElement('div');
  haendler.className = 'karte';
  haendler.innerHTML = `<h2 class="set-name">Händler</h2>
    <p class="set-star">Sortiert danach, wer neue Sets erfahrungsgemäß zuerst listet.</p>`;
  state.drops.shops.forEach((s) => {
    const a = document.createElement('a');
    a.className = 'shop-zeile';
    a.href = s.url; a.target = '_blank'; a.rel = 'noopener nofollow sponsored';
    a.innerHTML = `<div style="flex:1;min-width:0">
        <p class="shop-name">${s.name}</p>
        <p class="shop-note">${s.note}</p>
      </div><span class="typ">${s.typ}</span>`;
    haendler.append(a);
  });

  const prospekte = document.createElement('div');
  prospekte.className = 'karte';
  prospekte.innerHTML = `<h2 class="set-name">Prospekte</h2>
    <p class="set-star">Wochenangebote von Marktkauf, REWE, EDEKA und Kaufland durchsuchen.</p>
    <div class="aktionen">${state.drops.prospekte.map((p) => `<a class="knopf" href="${p.url}" target="_blank" rel="noopener">${p.name} durchsuchen</a>`).join('')}</div>`;

  panel.append(haendler, prospekte);
}

/* ---------------- Pro ---------------- */

function zeichnePro() {
  const panel = $('#p-pro');
  panel.replaceChildren();

  const karte = document.createElement('div');
  karte.className = 'karte pro-karte';
  karte.innerHTML = `
    <span class="badge">PokéDrop Pro</span>
    <p class="pro-preis">4,99 € <small>/ Monat</small></p>
    <p class="set-star">Jederzeit kündbar. Erste 7 Tage kostenlos.</p>
    <ul class="pro-liste">
      <li>Benachrichtigung in dem Moment, in dem ein Produkt auf Lager geht</li>
      <li>Unbegrenzte Merkliste statt drei Produkten</li>
      <li>Preisverlauf und Alarm bei Preisen unter UVP</li>
      <li>Direktlink in den Warenkorb statt auf die Startseite</li>
      <li>Keine Werbung</li>
      <li class="aus">Gratis: Kalender, Shops, Prospekte, Hinweise mit 15 Minuten Verzögerung</li>
    </ul>
    <div class="aktionen">
      <button class="knopf stark" id="pro-start">Pro starten</button>
      <button class="knopf" id="push-an">Benachrichtigungen erlauben</button>
    </div>
    <p class="verlauf-text" id="push-status"></p>`;

  const hinweis = document.createElement('div');
  hinweis.className = 'karte';
  hinweis.innerHTML = `<h2 class="set-name">Wie der Radar arbeitet</h2>
    <ul class="fakten">
      <li>Ein Prüfdienst ruft alle ${state.stock?.intervall_minuten ?? 5} Minuten die Produktseiten der Händler ab.</li>
      <li>Ausgewertet werden die strukturierten Angebotsdaten der Seite, nicht der sichtbare Text – das erkennt Lagerwechsel zuverlässig.</li>
      <li>Ändert sich der Status, entsteht ein Ereignis. Daraus wird die Benachrichtigung.</li>
      <li>Filial-Funde lassen sich nicht abrufen. Dafür melden Nutzer, was sie vor Ort gesehen haben.</li>
    </ul>`;

  panel.append(karte, hinweis);

  $('#pro-start').addEventListener('click', () => {
    // Anbindung an Stripe Checkout hier einsetzen, siehe README.
    state.pro = !state.pro;
    localStorage.setItem('pd.pro', state.pro ? '1' : '0');
    $('#pro-start').textContent = state.pro ? 'Pro aktiv (Test)' : 'Pro starten';
  });
  if (state.pro) $('#pro-start').textContent = 'Pro aktiv (Test)';

  $('#push-an').addEventListener('click', pushAnfordern);
}

async function pushAnfordern() {
  const status = $('#push-status');
  if (!('Notification' in window)) {
    status.textContent = 'Dieses Gerät unterstützt keine Web-Benachrichtigungen.';
    return;
  }
  const erlaubnis = await Notification.requestPermission();
  status.textContent = erlaubnis === 'granted'
    ? 'Benachrichtigungen sind aktiv. Auf dem iPhone funktioniert das nur, wenn PokéDrop über „Zum Home-Bildschirm“ installiert ist.'
    : 'Benachrichtigungen wurden abgelehnt. Du kannst das in den Browser-Einstellungen ändern.';
}

/* ---------------- Neue Treffer melden ---------------- */

function meldeNeueTreffer() {
  if (Notification?.permission !== 'granted') return;
  for (const a of alleAngebote()) {
    if (a.status !== 'in_stock') continue;
    const key = `${a.sku}|${a.shop}|${a.preis}`;
    if (!state.gesehen.has(key)) {
      state.gesehen.add(key);
      if (state.merkliste.has(a.sku)) {
        new Notification('Auf Lager', {
          body: `${a.produkt} bei ${a.shop} für ${euro(a.preis)}`,
          tag: key,
          icon: 'assets/icon-180.png'
        });
      }
    }

    const ziel = state.alarme.get(a.sku);
    if (ziel && a.preis && a.preis <= ziel) {
      const alarmKey = `alarm|${a.sku}|${a.shop}|${a.preis}`;
      if (!state.gesehen.has(alarmKey)) {
        state.gesehen.add(alarmKey);
        new Notification('Preisalarm erreicht', {
          body: `${a.produkt} bei ${a.shop} für ${euro(a.preis)} (Ziel: ${euro(ziel)})`,
          tag: alarmKey,
          icon: 'assets/icon-180.png'
        });
      }
    }
  }
  localStorage.setItem('pd.gesehen', JSON.stringify([...state.gesehen].slice(-200)));
}

/* ---------------- Fuß ---------------- */

function zeichneFuss() {
  const teile = [];
  if (state.drops?.stand) teile.push(`Drop-Daten: ${new Date(state.drops.stand).toLocaleDateString('de-DE')}`);
  if (state.stock?.stand) teile.push(`Verfügbarkeit ${vorZeit(state.stock.stand)} geprüft`);
  teile.push(navigator.onLine ? 'Verbunden' : 'Offline – letzter Stand');
  $('#datenstand').textContent = teile.join(' · ');
}

/* ---------------- Tabs & Interaktion ---------------- */

$$('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    $$('[role="tabpanel"]').forEach((p) => p.classList.toggle('versteckt', p.id !== tab.getAttribute('aria-controls')));
    $('#radar').classList.toggle('versteckt', tab.id === 'tab-pro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.addEventListener('click', (e) => {
  const knopf = e.target.closest('.knopf.merken');
  if (!knopf) return;
  const sku = knopf.dataset.sku;
  const drin = state.merkliste.has(sku);

  if (!drin && !state.pro && state.merkliste.size >= 3) {
    knopf.textContent = 'Limit erreicht – Pro';
    setTimeout(() => (knopf.textContent = '☆ Merken'), 1800);
    return;
  }
  drin ? state.merkliste.delete(sku) : state.merkliste.add(sku);
  localStorage.setItem('pd.merkliste', JSON.stringify([...state.merkliste]));
  knopf.setAttribute('aria-pressed', String(!drin));
  knopf.textContent = drin ? '☆ Merken' : '★ Gemerkt';
  zeichneMerkliste();
});

document.addEventListener('click', async (e) => {
  const teilen = e.target.closest('.knopf.teilen');
  if (!teilen) return;
  const drop = state.drops?.drops.find((d) => d.id === teilen.dataset.teilen);
  const url = `${location.origin}${location.pathname}#${teilen.dataset.teilen}`;
  const text = drop ? `${drop.set} bei PokéDrop verfolgen` : 'PokéDrop';
  if (navigator.share) {
    try { await navigator.share({ title: 'PokéDrop', text, url }); } catch {}
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    const alt = teilen.textContent;
    teilen.textContent = '✓ Link kopiert';
    setTimeout(() => { teilen.textContent = alt; }, 1800);
  } catch {}
});

document.addEventListener('change', (e) => {
  const feld = e.target.closest('[data-alarm-sku]');
  if (!feld) return;
  const sku = feld.dataset.alarmSku;
  const wert = parseFloat(feld.value);
  if (Number.isFinite(wert) && wert > 0) state.alarme.set(sku, wert);
  else state.alarme.delete(sku);
  localStorage.setItem('pd.alarme', JSON.stringify([...state.alarme]));
});

/* ---------------- Uhr & Countdown-Takt ---------------- */

setInterval(() => {
  $('#uhr').textContent = new Date().toLocaleTimeString('de-DE');
  let umbau = false;
  $$('.karte[data-release]').forEach((k) => {
    const r = restzeit(k.dataset.release);
    const felder = $$('.cd-zahl', k);
    if (!r) { if (felder.length) umbau = true; return; }
    [r.tage, r.std, r.min, r.sek].forEach((v, i) => {
      if (felder[i]) felder[i].textContent = String(v).padStart(2, '0');
    });
  });
  if (umbau) zeichneDrops();

  const stand = $('#radar-stand');
  if (stand?.dataset.iso) stand.textContent = `geprüft ${vorZeit(stand.dataset.iso)}`;
  zeichneFuss();
}, 1000);

setInterval(() => aktualisieren({ still: true }), 20_000);
window.addEventListener('online', () => aktualisieren({ still: true }));
document.addEventListener('visibilitychange', () => { if (!document.hidden) aktualisieren({ still: true }); });

/* ---------------- Partikel ---------------- */

(function partikel() {
  const canvas = $('#partikel');
  const ctx = canvas.getContext('2d', { alpha: true });
  const sparsam = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sparsam) return;

  let teile = [], laeuft = true, dpr = Math.min(devicePixelRatio || 1, 2);
  const farben = ['#7ee8ff', '#a97bff', '#ff7bd0', '#ffd76e'];

  function messen() {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const anzahl = innerWidth < 600 ? 22 : 40;
    teile = Array.from({ length: anzahl }, () => neu());
  }

  function neu(oben = false) {
    return {
      x: Math.random() * innerWidth,
      y: oben ? innerHeight + 20 : Math.random() * innerHeight,
      v: 0.12 + Math.random() * 0.4,
      g: 1 + Math.random() * 1.8,
      dreh: Math.random() * Math.PI,
      farbe: Math.random() < 0.7 ? '#ffe14d' : farben[(Math.random() * farben.length) | 0],
      alpha: 0.12 + Math.random() * 0.3
    };
  }

  function bild() {
    if (!laeuft) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const t of teile) {
      t.y -= t.v;
      t.dreh += 0.004;
      if (t.y < -30) Object.assign(t, neu(true));
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.translate(t.x, t.y);
      ctx.rotate(t.dreh);
      ctx.fillStyle = t.farbe;
      ctx.beginPath();
      ctx.arc(0, 0, t.g / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(bild);
  }

  addEventListener('resize', messen, { passive: true });
  document.addEventListener('visibilitychange', () => {
    laeuft = !document.hidden;
    if (laeuft) requestAnimationFrame(bild);
  });

  messen();
  requestAnimationFrame(bild);
})();

/* ---------------- Service Worker ---------------- */

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

aktualisieren();
