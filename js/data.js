/*
 * PokéDrop – Demodaten
 *
 * Solange es keine echte Prospekt-/Drop-API gibt, werden Beispiel-Märkte
 * relativ zur Position des Nutzers erzeugt, damit die Umkreissuche
 * überall in Deutschland sinnvoll demonstriert werden kann.
 *
 * offsetKm: Verschiebung [Ost, Nord] in km gegenüber dem Nutzerstandort.
 */

const CHAINS = {
  marktkauf: { name: "Marktkauf", color: "#e30613" },
  rewe:      { name: "REWE",      color: "#cc071e" },
  edeka:     { name: "EDEKA",     color: "#ffd500", textColor: "#1c1c1e" },
  kaufland:  { name: "Kaufland",  color: "#e10915" },
  lidl:      { name: "Lidl",      color: "#0050aa" },
  mueller:   { name: "Müller",    color: "#f39200" },
  rossmann:  { name: "Rossmann",  color: "#c3002d" },
  gamestop:  { name: "GameStop",  color: "#000000" }
};

const DEMO_MARKETS = [
  {
    id: "m1",
    chain: "marktkauf",
    branch: "Marktkauf-Center",
    address: "Hauptstraße 12",
    offsetKm: [2.1, 1.4],
    drops: [
      {
        id: "d1",
        emoji: "🎴",
        title: "Pokémon TCG: Karmesin & Purpur – Boosterpack",
        price: 4.99,
        validFrom: "2026-07-20",
        validTo: "2026-07-26",
        available: true,
        isNew: true,
        note: "Neu im aktuellen Prospekt. Limitiert auf 10 Packs pro Kunde."
      },
      {
        id: "d2",
        emoji: "📦",
        title: "Pokémon TCG: Top-Trainer-Box",
        price: 44.99,
        validFrom: "2026-07-20",
        validTo: "2026-07-26",
        available: true,
        isNew: false,
        note: "Solange der Vorrat reicht."
      }
    ]
  },
  {
    id: "m2",
    chain: "rewe",
    branch: "REWE Markt",
    address: "Bahnhofstraße 3",
    offsetKm: [-1.2, 3.8],
    drops: [
      {
        id: "d3",
        emoji: "🎴",
        title: "Pokémon TCG: 3er-Booster-Blister",
        price: 12.99,
        validFrom: "2026-07-21",
        validTo: "2026-07-27",
        available: true,
        isNew: true,
        note: "Mit Promo-Münze. Ab Montag im Regal."
      }
    ]
  },
  {
    id: "m3",
    chain: "edeka",
    branch: "EDEKA Center",
    address: "Am Markt 7",
    offsetKm: [4.5, -2.2],
    drops: [
      {
        id: "d4",
        emoji: "🧸",
        title: "Pokémon Plüschfigur (Pikachu, Evoli u.a.)",
        price: 14.99,
        validFrom: "2026-07-18",
        validTo: "2026-07-25",
        available: true,
        isNew: false,
        note: "Verschiedene Figuren, ca. 20 cm."
      },
      {
        id: "d5",
        emoji: "🎴",
        title: "Pokémon TCG: Themendeck",
        price: 16.99,
        validFrom: "2026-07-18",
        validTo: "2026-07-25",
        available: false,
        isNew: false,
        note: "Aktuell ausverkauft – Nachlieferung erwartet."
      }
    ]
  },
  {
    id: "m4",
    chain: "kaufland",
    branch: "Kaufland",
    address: "Industriering 22",
    offsetKm: [-5.9, -4.1],
    drops: [
      {
        id: "d6",
        emoji: "🎁",
        title: "Pokémon TCG: Kollektions-Box (exklusive Promokarte)",
        price: 29.99,
        validFrom: "2026-07-22",
        validTo: "2026-07-29",
        available: true,
        isNew: true,
        note: "Drop startet Mittwoch, 8 Uhr."
      }
    ]
  },
  {
    id: "m5",
    chain: "lidl",
    branch: "Lidl",
    address: "Gewerbestraße 5",
    offsetKm: [7.8, 5.5],
    drops: [
      {
        id: "d7",
        emoji: "🎴",
        title: "Pokémon TCG: Booster-Bundle (6 Packs)",
        price: 24.99,
        validFrom: "2026-07-24",
        validTo: "2026-07-27",
        available: true,
        isNew: true,
        note: "Nur Donnerstag bis Sonntag, Aktionsware."
      }
    ]
  },
  {
    id: "m6",
    chain: "mueller",
    branch: "Müller Drogerie",
    address: "Fußgängerzone 9",
    offsetKm: [0.8, -8.3],
    drops: [
      {
        id: "d8",
        emoji: "🎴",
        title: "Pokémon TCG: Elite-Trainer-Box",
        price: 54.99,
        validFrom: "2026-07-19",
        validTo: "2026-08-01",
        available: true,
        isNew: false,
        note: "Große Auswahl an Einzelpacks vor Ort."
      },
      {
        id: "d9",
        emoji: "🕹️",
        title: "Pokémon Sammelfiguren-Set",
        price: 9.99,
        validFrom: "2026-07-19",
        validTo: "2026-08-01",
        available: true,
        isNew: false,
        note: ""
      }
    ]
  },
  {
    id: "m7",
    chain: "rossmann",
    branch: "Rossmann",
    address: "Lindenallee 14",
    offsetKm: [-9.6, 7.9],
    drops: [
      {
        id: "d10",
        emoji: "🎴",
        title: "Pokémon TCG: Sleeved Booster",
        price: 5.49,
        validFrom: "2026-07-20",
        validTo: "2026-07-31",
        available: true,
        isNew: false,
        note: ""
      }
    ]
  },
  {
    id: "m8",
    chain: "gamestop",
    branch: "GameStop",
    address: "City-Galerie, EG",
    offsetKm: [12.4, -10.8],
    drops: [
      {
        id: "d11",
        emoji: "💎",
        title: "Pokémon TCG: Ultra-Premium-Kollektion",
        price: 129.99,
        validFrom: "2026-07-25",
        validTo: "2026-07-25",
        available: true,
        isNew: true,
        note: "Release-Drop am Samstag – Vorbestellung empfohlen!"
      }
    ]
  }
];

/* Fallback-Standort (Kiel), falls der Nutzer die Demo ohne GPS startet. */
const FALLBACK_POSITION = { lat: 54.3233, lng: 10.1228, label: "Demo-Standort" };
