# PokéDrop 🎴

**Pokémon-Drops & Prospekt-Angebote der Märkte in deiner Umgebung.**

PokéDrop zeigt dir die neuesten Pokémon-Produkte (Booster, Boxen, Plüsch & Co.)
aus den Prospekten der Märkte in deinem Umkreis – z. B. Marktkauf, REWE, EDEKA,
Kaufland, Lidl, Müller, Rossmann oder GameStop.

## Features (aktueller Stand)

- 📍 **Umkreissuche per GPS** – einstellbarer Radius von 1–50 km
- 🏪 **Märkte in der Nähe** mit Entfernungsanzeige, nach Distanz sortiert
- 🎴 **Drops pro Markt** mit Preis, Aktionszeitraum und Verfügbarkeit
- 🔍 **Filter** nach Marktkette, „nur verfügbar“ und „nur neue Drops“
- 📱 **Installierbar als App (PWA)** – funktioniert auf praktisch allen
  Smartphones und Tablets der letzten ~10 Jahre (iPhone/iPad, Samsung,
  alle Android-Geräte) direkt im Browser, ohne App Store
- 🌙 Automatischer Dark Mode
- 📶 Offline-fähig dank Service Worker

> ⚠️ **Demo-Version:** Die Märkte und Drops sind derzeit Beispieldaten, die
> relativ zum eigenen Standort platziert werden. Eine Anbindung an echte
> Prospekt-/Angebotsdaten ist der nächste Schritt.

## App starten

Es wird kein Build-Schritt benötigt – ein beliebiger statischer Webserver
reicht:

```bash
# Variante 1: Python
python3 -m http.server 8080

# Variante 2: Node
npx serve .
```

Dann im Browser `http://localhost:8080` öffnen.

> Hinweis: Die GPS-Standortabfrage funktioniert nur über `https://` oder
> `localhost` (Browser-Sicherheitsrichtlinie). Ohne Standortfreigabe läuft die
> App mit einem Demo-Standort.

## Auf dem Handy installieren

1. Die gehostete Seite im Browser öffnen (z. B. via GitHub Pages).
2. **Android/Samsung:** Menü → „Zum Startbildschirm hinzufügen“
3. **iPhone/iPad (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“

## Technik

- Reines HTML/CSS/JavaScript – keine Frameworks, kein Build
- PWA mit Web-App-Manifest und Service Worker (Cache-first)
- Entfernungsberechnung per Haversine-Formel

## Roadmap-Ideen

- [ ] Echte Prospekt-Daten anbinden (z. B. Marktguru/offizielle Händler-APIs)
- [ ] Push-Benachrichtigungen bei neuen Drops im Umkreis
- [ ] Merkliste / Favoriten
- [ ] Kartenansicht der Märkte
- [ ] Community-Meldungen („Drop gesichtet!“)
