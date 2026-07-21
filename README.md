# PokéDrop ⚡

**Drop-Radar für Sammelkarten – Releases, Countdowns und Angebote in Deutschland.**

PokéDrop zeigt live, welches Pokémon-TCG-Set gerade erschienen ist, zählt
sekundengenau auf die nächsten Drops herunter und verlinkt direkt zu deutschen
Händlern und zur Prospekt-Suche für Angebote in der Umgebung.

## Features

- ⚡ **Echte Release-Daten** für den deutschen Markt (z. B. „Mega-Entwicklung:
  Dunkelnacht“ seit 17.07.2026, „30 Jahre Pokémon“ am 16.09.2026), recherchiert
  aus offiziellen Ankündigungen und Produktkalendern
- ⏱️ **Live-Countdowns**, die jede Sekunde ticken – inkl. Live-Uhr im Header
- 🔄 **Auto-Update-System:** Die App lädt jede Minute `data/drops.json` neu.
  Wird die Datei im Repo aktualisiert, sehen alle Nutzer die neuen Daten
  sofort – ohne Seiten-Reload. Erreicht ein Countdown null, baut sich die
  Seite automatisch um und der Drop wandert in den „Jetzt erhältlich“-Bereich.
- 🛒 **Direkte Händler-Links** (Müller, Rossmann, Kaufland, GameStop, Amazon,
  Cardmarket, idealo, Card-Corner)
- 📰 **Prospekt-Suche** über marktguru und kaufDA – echte aktuelle Angebote
  der Märkte in der Nähe (Marktkauf, REWE, EDEKA, Kaufland …)
- 📱 **PWA:** installierbar auf praktisch allen Smartphones/Tablets der
  letzten ~10 Jahre, offline-fähig, Dark & Light Mode

## Rechtliches Design-Konzept

Die App verwendet bewusst **keine geschützten Grafiken**: kein Pokéball, keine
offiziellen Logos, Schriftarten oder Charakter-Artworks. Die Pokémon-Anmutung
entsteht nur über Farbwelt (Mitternachtsblau + Elektro-Gelb), einen dezenten
„Holo-Foil“-Verlauf und Typografie. Produktnamen werden rein beschreibend
genannt; ein Disclaimer im Footer stellt die Nicht-Zugehörigkeit zu
Nintendo/The Pokémon Company klar.

## Daten aktualisieren

Neue Drops einfach in **`data/drops.json`** eintragen (und `lastUpdated`
hochsetzen) – die laufende App übernimmt die Änderung innerhalb von 60
Sekunden automatisch. `js/data.js` enthält dieselben Daten als eingebauten
Offline-Fallback und sollte mitgepflegt werden.

## App starten

Kein Build nötig – ein statischer Webserver reicht:

```bash
python3 -m http.server 8080
```

Dann `http://localhost:8080` öffnen. Für die Installation als App auf dem
Handy: Seite über `https://` hosten (z. B. GitHub Pages) und „Zum
Startbildschirm hinzufügen“ wählen.

## Technik

- Reines HTML/CSS/JavaScript, keine Frameworks, kein Build-Schritt
- Sekunden-Ticker (`setInterval` 1 s) für Uhr und Countdowns
- Minuten-Polling des JSON-Feeds mit `cache: no-store`
- Service Worker: App-Dateien cache-first, Daten-Feed immer frisch vom Netz
- Design-Tokens mit automatischem Dark/Light Mode

## Roadmap-Ideen

- [ ] Push-Benachrichtigungen bei neuen Drops
- [ ] Automatischer Scraper (GitHub Action), der Release-Kalender und
      Händler-Verfügbarkeiten regelmäßig in `data/drops.json` schreibt
- [ ] Merkliste / Erinnerungen pro Set
- [ ] Preis-Historie über Cardmarket-Daten
