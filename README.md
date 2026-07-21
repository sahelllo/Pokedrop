# PokéDrop

Live-Radar für Pokémon-Sammelkarten in Deutschland. Zeigt, **wo ein Produkt
gerade auf Lager ist, zu welchem Preis und bei welchem Händler** – statt nur
einen Countdown zu zählen.

Reine PWA: HTML, CSS, ES-Module. Kein Framework, kein Build-Schritt.

---

## Was drin ist

```
index.html                  App-Gerüst, SVG-Mockups als Fallback, Holo-Regen-Layer
assets/styles.css           Mitternachtsblau/Elektro-Gelb, Holo-Foil, Statusfarben
assets/app.js               Rendering, Countdowns, Merkliste, Preisalarm, echte Kartenbilder
assets/icon-*.png           App-Icons (Radar-Blitz-Motiv, selbst erzeugt)
sw.js                       Service Worker: App cache-first, Daten netz-first
manifest.webmanifest        Installation auf dem Home-Bildschirm

data/drops.json             Sets, Release-Daten, Produkte, Quellen (gepflegt)
data/stock.json             Verfügbarkeit + Preise (vom Checker geschrieben)
data/history.json           Preisverlauf pro SKU/Shop
data/events.json            Statuswechsel – Grundlage für Push
data/karten-cache.json       Echte Kartenbild-URLs, serverseitig geholt (siehe unten)
data/_new-events.json       Ungetrackt, nur für den Telegram-Push eines Laufs (.gitignore)

scraper/sources.json        Welche Produktseiten überwacht werden
scraper/check-stock.mjs     Der Stock-Checker
scraper/karten-cache.mjs    Holt echte Kartenbild-URLs mit Retries
scraper/telegram-push.mjs   Sofortmeldung neuer Ereignisse an Telegram
.github/workflows/          Cron alle 5 Minuten + Kartenbild-Cache + Telegram-Push + Auto-Commit
```

## Echte Kartenbilder & Holo-Hintergrund

Kartenbilder kommen von der **Pokémon TCG API** (`api.pokemontcg.io`) – aber
**nicht** live aus jedem Besucher-Browser. Der kostenlose, schlüssellose
Zugang dieser API ist unter Last unzuverlässig (im Test: gut die Hälfte der
Anfragen HTTP 500). Stattdessen holt `scraper/karten-cache.mjs` die Bilder
**serverseitig im GitHub-Workflow** (mit Wiederholversuchen, alle paar
Stunden) und schreibt nur die Bild-URLs in `data/karten-cache.json`. Die App
liest diese eigene, zuverlässige Datei – wie `drops.json`/`stock.json` auch.
Es wird nichts heruntergeladen oder im Repo gespeichert, nur URLs; die Bilder
selbst werden per `<img src>` weiterhin direkt vom Bild-CDN der API verlinkt.
Ist der Cache leer oder veraltet, bleibt automatisch der eigene SVG-Mockup
sichtbar – die Seite bricht nie deswegen.

Optional: Mit einem kostenlosen Key von [dev.pokemontcg.io](https://dev.pokemontcg.io/)
als Secret `POKEMONTCG_API_KEY` wird der Cache-Lauf im Workflow noch
zuverlässiger (höheres Rate-Limit). Ohne Key funktioniert es dank Retries und
dem 12-Stunden-Cache trotzdem meistens beim ersten oder zweiten Versuch.

Pro Drop in `data/drops.json` steuerbar:

```json
"kartenset": "me5",        // Set-ID in der Pokémon TCG API (sobald das Set dort gelistet ist)
"heldenkarte": "me5-116"   // Konkrete Karten-ID für das Bild auf der Drop-Karte
```

Bisher ist nur `dunkelnacht` (`me5`, engl. Setname "Pitch Black", Mega
Evolution-Serie, Release 2026-07-17) in der Datenbank gelistet. First Partner
Collection Serie 3, Mega Forces Tins und das Jubiläums-Set tauchen dort
erfahrungsgemäß erst kurz vor bzw. mit ihrem Release auf – sobald das
passiert, reicht das Eintragen der Felder, und echte Bilder erscheinen
automatisch, ohne Codeänderung.

## Lokal starten

```bash
python3 -m http.server 8100     # oder: npx serve .
# → http://127.0.0.1:8100
```

Service Worker und Installation brauchen `localhost` oder HTTPS.

## Stock-Checker

```bash
node scraper/check-stock.mjs
```

Er ruft jede Produktseite ab und liest bevorzugt die strukturierten
Angebotsdaten (`schema.org/Offer` im JSON-LD oder Microdata). Das ist der
entscheidende Punkt: Shopware-, Shopify- und Magento-Shops liefern dort
`availability` und `price` maschinenlesbar. Erst wenn nichts Strukturiertes
vorhanden ist, greift eine konservative Textheuristik – und markiert im Zweifel
`unknown` statt zu raten.

**Neue Produkte aufnehmen:** Eintrag in `scraper/sources.json` ergänzen.
Gleiche `sku` bei mehreren Shops heißt: dasselbe Produkt, Preisvergleich
passiert automatisch.

Prüfen, ob ein Shop verwertbare Daten liefert:

```bash
curl -s "URL" | grep -o 'application/ld+json' | head -1
```

### Betrieb

GitHub Actions läuft alle 5 Minuten (`.github/workflows/stock-check.yml`) und
committet die Datendateien zurück. Reicht für den Start, ist aber unter Last
manchmal einige Minuten verzögert.

Für echte Sekunden brauchst du später **Cloudflare Workers** mit Cron-Trigger
und KV-Speicher – dieselbe Logik, nur ohne Git-Commit-Umweg. Das ist der Schritt,
an dem aus dem Projekt ein Produkt wird.

## Benachrichtigungen

In der App ist die lokale Variante fertig: Sobald ein gemerktes Produkt in einem
Feed-Update auf Lager erscheint, kommt eine Meldung. Voraussetzung auf dem
iPhone: die App muss über „Zum Home-Bildschirm“ installiert sein (Web Push
funktioniert dort seit iOS 16.4 nur in installierten PWAs).

Für echte Server-Pushs (auch bei geschlossener App) brauchst du VAPID-Schlüssel
und einen kleinen Dienst:

```bash
npx web-push generate-vapid-keys
```

Ablauf: App abonniert per `pushManager.subscribe()` → Abo-Objekt an deinen
Server → der Checker legt bei jedem Statuswechsel ein Ereignis in
`data/events.json` an → dein Dienst schickt an alle Abos, die diese `sku`
gemerkt haben. Der `push`-Handler im Service Worker ist schon implementiert.

**Preisalarm (clientseitig, schon fertig):** Im Merkliste-Tab lässt sich pro
gemerktem Produkt ein Zielpreis eintragen. Sobald der Radar einen Treffer
darunter meldet, kommt zusätzlich zur „auf Lager“-Meldung eine
Preisalarm-Benachrichtigung. Läuft komplett im Browser, kein Server nötig.

### Telegram-Sofortmeldung (fertig, ohne eigenen Server)

Der schnellstmögliche Weg zu einer echten Push-Benachrichtigung, ganz ohne
VAPID/eigenen Dienst: `scraper/telegram-push.mjs` läuft im selben
Workflow-Schritt wie der Stock-Checker und meldet neue Ereignisse sofort an
einen Telegram-Chat – noch bevor die Daten committet werden.

Einrichten:

1. Bot bei [@BotFather](https://t.me/BotFather) anlegen → Token kopieren.
2. Chat-ID holen: Bot in einem Chat/Kanal anschreiben, dann
   `https://api.telegram.org/bot<TOKEN>/getUpdates` aufrufen und `chat.id`
   ablesen.
3. In GitHub: Repo → Settings → Secrets and variables → Actions →
   `TELEGRAM_BOT_TOKEN` und `TELEGRAM_CHAT_ID` anlegen.

Ohne diese Secrets überspringt der Workflow den Schritt automatisch – nichts
bricht.

## Bezahlung

Der Pro-Knopf schaltet im Auslieferungszustand nur einen lokalen Testschalter um.
Für echte Abos: **Stripe Checkout** im Abo-Modus, Rückleitung auf `?pro=ok`,
Freischaltung serverseitig über den Webhook `checkout.session.completed`.
Wichtig: Den Pro-Status nicht dauerhaft im `localStorage` entscheiden lassen –
der ist manipulierbar. Client-seitig nur die Anzeige, die Push-Geschwindigkeit
regelt der Server.

Vorgeschlagene Grenze:

| Gratis | Pro (4,99 €/Monat) |
|---|---|
| Kalender, Shops, Prospekte | alles aus Gratis |
| 3 Produkte auf der Merkliste | unbegrenzt |
| Hinweise mit 15 Min. Verzögerung | sofort |
| — | Preisverlauf, Alarm unter UVP |
| Werbung | werbefrei |

Die Verzögerung ist der eigentliche Hebel. Bei einem Produkt, das in Minuten
ausverkauft ist, ist „15 Minuten später“ wertlos – genau das verkauft das Abo.

## Recht

**Wichtig, bewusste Entscheidung, hier dokumentiert:** Die App zeigt inzwischen
echte offizielle Pokémon-Kartenbilder (Holo-Hintergrund + teils Produktkarte),
live verlinkt über `api.pokemontcg.io`. Das ist **keine Lizenz von Nintendo,
Creatures Inc., GAME FREAK oder The Pokémon Company** – die API selbst hat
auch keine. Es ist gängige, weit verbreitete Praxis in der Fan-Community,
aber rechtlich nicht wasserdicht. Konkret heißt das:

- Kein eigenes Hosting: Bilder werden nur per `<img src>` vom API-CDN
  verlinkt, nie heruntergeladen oder ins Repo kopiert. Das reduziert das
  Risiko, ersetzt aber keine Lizenz.
- Realistisches Szenario bei Erfolg der App: eine Unterlassungsaufforderung
  oder Cease-and-Desist, kein Straf- oder Bußgeldverfahren. Trotzdem:
  einplanen, nicht ignorieren – besonders sobald **Stripe/Pro** live ist
  (siehe unten), weil ein zahlungspflichtiges Angebot ein lohnenderes Ziel ist.
- Fallback bleibt im Code: Ohne API-Antwort läuft alles automatisch mit den
  eigenen SVG-Mockups weiter. Bei einer Abmahnung ist der schnellste Ausweg,
  `holoRegen()` und `echteBilderEinsetzen()` in `assets/app.js` zu
  deaktivieren (ein Kommentar an der Aufrufstelle in `aktualisieren()` genügt)
  – die App bleibt danach voll funktionsfähig, nur wieder ohne echte Bilder.
- Für echte **Produktfotos** (Verpackungen, Boxen) bleibt die sicherere Route
  weiterhin: Partnerprogramme (Amazon PA-API, Awin, Tradedoubler) oder eigene
  Fotos gekaufter Produkte. Bilder von Herstellerseiten direkt zu kopieren und
  selbst zu hosten ist die riskantere Variante und wurde hier nicht gemacht.
- Der Disclaimer steht im Footer und muss dort bleiben.
- Der Checker liest nur öffentlich sichtbare Preis- und Verfügbarkeitsangaben,
  wartet zwischen Anfragen und identifiziert sich per User-Agent. Halte dich an
  `robots.txt` der jeweiligen Shops und dreh das Intervall nicht ohne Grund hoch.
- Partnerlinks sind kennzeichnungspflichtig – der Hinweis steht im Footer.
- Ab dem ersten zahlenden Nutzer: Impressum und Datenschutzerklärung sind Pflicht.

## Nächste Schritte

1. Echte Produkt-URLs in `scraper/sources.json` eintragen (die enthaltenen sind
   Platzhalter im richtigen Format) – erst dann liefert der Radar echte Treffer.
2. `data/stock.json` einmal echt erzeugen lassen und prüfen, welche Shops
   JSON-LD liefern – die kommen zuerst in den Radar.
3. Auf GitHub Pages veröffentlichen, Workflow aktivieren, `TELEGRAM_BOT_TOKEN`
   / `TELEGRAM_CHAT_ID` als Secrets setzen (siehe oben) – Telegram-Push ist
   bereits fertig eingebaut.
4. Sobald First Partner Collection Serie 3 / Mega Forces Tins / das
   Jubiläums-Set in der Pokémon TCG API auftauchen: `kartenset`/`heldenkarte`
   in `data/drops.json` ergänzen, echte Bilder erscheinen automatisch.
5. Erst danach Stripe. Vorher gibt es nichts zu verkaufen.
