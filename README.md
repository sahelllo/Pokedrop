# PokeDrop

**Live-Radar für Pokémon-TCG-Deals, Drops & Events in Deutschland.**
Zeigt standortbezogen, wo Pokémon-Sammelkarten gerade **zur UVP oder günstiger**
verfügbar sind – mit echter UVP- vs. Marktpreis-Bewertung, Live-Drops,
Pokémon-Center-Monitoring, Gerüchte-Radar und einem Event-Kalender für
Tauschbörsen und Card Shows.

Gebaut als vollständige, deploybare **Next.js-Web-App**. Läuft ab der ersten
Sekunde mit realistischen Demodaten – kein leerer Screen.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![TS](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## Was drin ist

| Bereich | Umsetzung |
|---|---|
| **Home / Deal-Feed** | Standort + Radius (Slider 5–500 km), Filter-Chips, Deal-Ranking, Top-Deal-Highlight, Konfetti bei 🔥 TOP DEALS |
| **Live Drops & Restocks** | Echtzeit-Optik, pulsierende LIVE-Badges, „vor 2 Min.", Alert-Simulation |
| **Pokémon Center** | Eigener Monitoring-Bereich für Restocks & neue Produkte |
| **Gerüchte & frühe Hinweise** | Klar getrennter Frühwarnkanal: RUMOR → MULTI_SOURCE_RUMOR → LIKELY → CONFIRMED mit Confidence-Balken |
| **Events** | Liste / Kalender / Karte (Leaflet + OpenStreetMap), Radius, Filter (heute / Wochenende / 30 Tage / Tauschbörsen …) |
| **Produktdetail** | Echtes Artwork, UVP vs. Markt-Referenz transparent, Preisverlauf-Chart (Recharts), „Benachrichtige mich"-Regeln |
| **Premium** | Free-vs-Premium-Vergleich, 5 MVP-Bausteine, Upgrade-Flow, Alert-Demo |
| **Watchlist & Einstellungen** | Gemerkte Produkte/Events, aktive Alerts, Standard-Standort/-Radius, Theme, Onboarding-Reset |
| **Onboarding** | 4-Schritte-Flow (Standort → Radius → Lieblings-Sets) beim ersten Öffnen |

Dazu: Aktivitäts-Ticker, Community-Statistiken mit Count-up, Social Proof,
Skeleton-Loader, Toasts, Bottom-Nav (mobil) / Sidebar (Desktop), Dark-/Light-Mode.

### Die Kern-Logik aus der Masterliste (1:1 umgesetzt)

- **Deal-Bewertung** (`lib/deals.ts`): 0–12 Monate → UVP als Referenz;
  >12 Monate → UVP + Markt-Referenzpreis + individuelle Good-/Great-Deal-Schwellen;
  Out of Print → Marktpreis stärker gewichtet. Daraus abgeleitete Badges:
  🔥 TOP DEAL · 🟢 UVP DEAL · ✅ GUTER DEAL · 🟡 MARKTPREIS · 🔴 ÜBER MARKT.
- **Regionalitäts-/Geo-Logik** (`lib/geo.ts`): Haversine-Distanz +
  `validity_type` NATIONAL / REGIONAL / STORE_GROUP / LOCAL / ONLINE. Ein Preis
  gilt nie automatisch für alle Filialen – die effektive Entfernung ist die
  kleinste Distanz zu einer *tatsächlich teilnehmenden* Filiale.
- **Der Beispielfall** (Masterliste 17.7) funktioniert echt: Nutzer in
  **Oberhausen** mit **500 km** Radius sieht ein **LOCAL**-Angebot in
  **Ludwigsburg** (~340 km), obwohl der Oberhausener Markt derselben Kette die
  Aktion nicht hat.
- **Verifizierung**: VERIFIED / REGIONAL_CONFIRMED / PROBABLE / COMMUNITY_UNVERIFIED
  fließt ins Ranking ein.

---

## Projektstruktur

```
app/                     Seiten (App Router)
  page.tsx               Home / Deal-Feed
  live/ pokemon-center/  Live-Bereiche
  rumors/ events/        Gerüchte, Events
  product/[id]/          Produktdetail
  premium/ watchlist/    Premium, Merkliste & Einstellungen
components/              UI (ui/ = shadcn-Stil), Karten, Map, Charts, Onboarding …
lib/                     Logik: deals, geo, data (Zugriffsschicht), store (Zustand), images …
data/                    Typisierte Seed-Daten (retailers, stores, products, offers, events, drops, rumors, community)
types/                   Zentrale Typen (Feldnamen 1:1 aus der Masterliste)
legacy/                  Frühere Vanilla-PWA-Version (unverändert archiviert)
```

Die **Datenzugriffsschicht** (`lib/data.ts`) kapselt alle Seed-Daten hinter
Query-Funktionen – so lässt sich später ein echtes Backend/DB anflanschen, ohne
die UI umzubauen.

---

## Lokal starten

Voraussetzung: **Node.js 18.18+** (empfohlen 20 oder 22).

```bash
npm install        # Abhängigkeiten installieren
npm run dev        # Entwicklungsserver
# → http://localhost:3000
```

Produktions-Build lokal testen:

```bash
npm run build
npm run start
```

---

## Demodaten anpassen

Alle Inhalte liegen typisiert in **`/data`** und sind leicht erweiterbar:

| Datei | Inhalt |
|---|---|
| `data/retailers.ts` | Händler-Watchlist (Status A/B/C, Priorität, Markenfarbe) |
| `data/stores.ts` | Filialen mit Geo-Koordinaten + bekannte Städte fürs Onboarding |
| `data/products.ts` | Produkt-/UVP-Referenz (UVP, Marktpreis, Deal-Schwellen, Artwork-ID) |
| `data/offers.ts` | Angebote (Hero-Angebote + deterministischer Generator) |
| `data/events.ts` | Events (Tauschbörsen, Card Shows, Messen …) |
| `data/drops.ts` · `data/rumors.ts` | Live-Drops · Gerüchte |
| `data/community.ts` | Ticker, Statistiken, Testimonials |

**Neues Produkt:** Eintrag in `data/products.ts` ergänzen (`pokemonArtworkId` =
National-Dex-Nummer für das Bild). **Neues Angebot:** Eintrag in
`data/offers.ts` mit `product_id`, `retailer_brand`, `validity_type` und
`participating_store_ids`.

Farben/Design: `tailwind.config.ts` und `app/globals.css` (CSS-Variablen).

---

## Bilder & Assets

Echte Bilder kommen aus **frei nutzbaren Quellen** mit sauberem Fallback
(`components/smart-image.tsx`) – nie graue Kästen:

- **PokéAPI Official Artwork** (`lib/images.ts`) für echte Pokémon-Renderbilder.
- Optionales Feld `tcgImage` je Produkt für echte **Pokémon-TCG-Kartenbilder**.
- Fällt eine Quelle aus, erscheint automatisch ein stimmiger Energie-Typ-Gradient.

Karten laufen über **react-leaflet + OpenStreetMap** (Carto-Dark-Tiles) – kein
API-Key nötig.

---

## Auf Vercel veröffentlichen (Schritt für Schritt, ohne Vorwissen)

1. Code zu **GitHub** pushen (dieses Repo).
2. Auf [vercel.com](https://vercel.com) mit dem GitHub-Konto anmelden.
3. **„Add New…" → „Project"** klicken und dieses Repository auswählen.
4. Vercel erkennt **Next.js automatisch** – alle Einstellungen einfach so lassen
   (Framework: Next.js, Build: `next build`). Keine Umgebungsvariablen nötig.
5. **„Deploy"** klicken. Nach ~1–2 Minuten ist die App unter einer
   `*.vercel.app`-Adresse live.
6. Jeder weitere `git push` deployt automatisch neu.

> **Netlify-Alternative:** „Add new site" → Repo wählen → Build `npm run build`.
> Das offizielle Next.js-Plugin wird automatisch verwendet.

---

## Rechtlicher Hinweis (wichtig für den echten Betrieb)

Diese App läuft auf **legalen Seed-/API-Daten** und ist ein **inoffizielles
Fan-Projekt** ohne Verbindung zu Nintendo, Creatures Inc., GAME FREAK oder The
Pokémon Company.

Für einen echten Live-Betrieb (öffentliche Veröffentlichung, kommerzielle
Nutzung) gilt: Marken- und Bildrechte von **The Pokémon Company** sind zu
beachten; Retailer-/Prospekt-/Social-Media-Daten dürfen nur im Rahmen der
jeweiligen **Nutzungsbedingungen, `robots.txt` und Rate-Limits** erhoben werden.
Das ist ein Backend-/Rechtsthema und bewusst von der App getrennt. Ein
zahlungspflichtiges Premium-Angebot (Stripe) sollte erst nach Klärung dieser
Punkte live gehen; der Pro-Status wird dann serverseitig freigeschaltet (im
aktuellen Stand ist Premium nur ein lokaler Demo-Schalter).

---

Gebaut mit Next.js 14, TypeScript, Tailwind CSS, Framer Motion, lucide-react,
Radix UI, react-leaflet, Recharts und Zustand.
