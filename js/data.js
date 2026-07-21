/*
 * PokéDrop – Echte Release- und Händlerdaten (Deutschland)
 *
 * Quellen: pokemon.com/de, ICv2-Produktkalender 2026, deutsche
 * Release-Kalender und Händler-Produktseiten. Stand: 21.07.2026.
 *
 * Eingebauter Fallback – die App lädt zusätzlich data/drops.json und
 * prüft jede Minute auf Updates.
 */

const DROP_DATA = {
  lastUpdated: "2026-07-21T10:30:00+02:00",
  sets: [
    {
      id: "dunkelnacht",
      art: "dunkelnacht",
      series: "Mega-Entwicklung · Hauptset Nr. 5",
      name: "Dunkelnacht",
      date: "2026-07-17T00:00:00+02:00",
      tagline: "Mega-Darkrai-ex erscheint zum ersten Mal – das dunkelste Set der Mega-Entwicklung-Reihe.",
      facts: [
        "120 Karten + 36 Secret Rares",
        "Mega-Darkrai-ex, Mega-Zeraora-ex, Mega-Skelabra-ex, Mega-Stalobor-ex",
        "Top-Trainer-Box mit 9 Boosterpacks und exklusiver Zarude-Promokarte"
      ],
      products: [
        { name: "Boosterpack", price: "ca. 4,99 €" },
        { name: "Top-Trainer-Box", price: "ca. 54,99 €" },
        { name: "Kollektionen & Blister", price: "ab ca. 12,99 €" }
      ],
      shops: [
        { name: "Müller", type: "Filialhandel", url: "https://www.mueller.de/c/spielwaren/spiele-puzzles/spiele/sammelkarten/pokemon/" },
        { name: "Elbenwald", type: "Fanshop", url: "https://www.elbenwald.de/pokemon/pokemon-mega-entwicklung-dunkelnacht-top-trainer-box" },
        { name: "Gate to the Games", type: "TCG-Fachhändler", url: "https://www.gate-to-the-games.de/Pokemon-Mega-Entwicklung-Dunkelnacht-Top-Trainer-Box-deutsch" },
        { name: "Card-Corner", type: "TCG-Fachhändler", url: "https://www.card-corner.de/Pokemon-Dunkelnacht-Top-Trainer-Box" },
        { name: "Cardmarket", type: "Preisvergleich", url: "https://www.cardmarket.com/de/Pokemon" }
      ],
      info: [
        { label: "Offizielle Ankündigung", url: "https://www.pokemon.com/de/news/die-erweiterung-mega-entwicklung-dunkelnacht-des-pokemon-sammelkartenspiels-erscheint-am-17-juli-2026" },
        { label: "Alle Boxen im Überblick (PokeZentrum)", url: "https://pokezentrum.de/pokemon-karten-news/pokemon-dunkelnacht-kaufen-alle-boxen-und-kollektionen/" }
      ]
    },
    {
      id: "first-partner-3",
      art: "partner",
      series: "Sammel-Kollektion",
      name: "First Partner Collection – Serie 3",
      date: "2026-08-07T00:00:00+02:00",
      tagline: "Dritte Runde der Jumbo-Karten-Kollektion mit den Starter-Pokémon.",
      facts: ["Jumbo-Karten im Übergrößen-Format", "Teil der Reihe zum 30-jährigen Jubiläum"],
      products: [{ name: "Kollektions-Box", price: "Preis noch offen" }],
      shops: [
        { name: "Müller", type: "Filialhandel", url: "https://www.mueller.de/c/spielwaren/spiele-puzzles/spiele/sammelkarten/pokemon/" },
        { name: "GameStop", type: "Filialhandel", url: "https://www.gamestop.de/SearchResult/QuickSearch?q=pokemon" },
        { name: "Gate to the Games", type: "TCG-Fachhändler", url: "https://www.gate-to-the-games.de/Pokemon-Karten" }
      ],
      info: [
        { label: "Produktkalender 2026 (ICv2)", url: "https://icv2.com/articles/news/view/61079/pokemon-tcg-2026-product-calendar" }
      ]
    },
    {
      id: "mega-forces-tins",
      art: "tins",
      series: "Tin-Boxen",
      name: "Mega Forces Tins",
      date: "2026-08-28T00:00:00+02:00",
      tagline: "Neue Sammel-Tins zur Mega-Entwicklung-Reihe mit Boosterpacks und Promokarte.",
      facts: ["Metallboxen mit Boosterpacks", "Motive aus der Mega-Entwicklung-Serie"],
      products: [{ name: "Tin-Box", price: "ca. 29,99 €" }],
      shops: [
        { name: "Müller", type: "Filialhandel", url: "https://www.mueller.de/c/spielwaren/spiele-puzzles/spiele/sammelkarten/pokemon/" },
        { name: "Amazon", type: "Marktplatz", url: "https://www.amazon.de/s?k=pokemon+mega+forces+tin" },
        { name: "Gate to the Games", type: "TCG-Fachhändler", url: "https://www.gate-to-the-games.de/Pokemon-Karten" }
      ],
      info: [
        { label: "Produktkalender 2026 (ICv2)", url: "https://icv2.com/articles/news/view/61079/pokemon-tcg-2026-product-calendar" }
      ]
    },
    {
      id: "30-jahre",
      art: "jubilee",
      series: "Spezialset · Jubiläum",
      name: "30 Jahre Pokémon",
      date: "2026-09-16T00:00:00+02:00",
      tagline: "Das große Jubiläums-Set: erster weltweit zeitgleicher Release der TCG-Geschichte.",
      facts: [
        "Nostalgie-Reise durch 30 Jahre Sammelkartenspiel",
        "Komplett-Foil-Set folgt am 18.09.2026 – jede Karte glänzt",
        "Ab Oktober: 9 Jubiläums-Kartensets, eines pro Generation"
      ],
      products: [
        { name: "Jubiläums-Boosterpacks", price: "Preis noch offen" },
        { name: "All-Foil-Set (ab 18.09.)", price: "Preis noch offen" }
      ],
      shops: [
        { name: "GameStop", type: "Filialhandel", url: "https://www.gamestop.de/SearchResult/QuickSearch?q=pokemon" },
        { name: "Elbenwald", type: "Fanshop", url: "https://www.elbenwald.de/search?query=pokemon" },
        { name: "Gate to the Games", type: "TCG-Fachhändler", url: "https://www.gate-to-the-games.de/Pokemon-Karten" }
      ],
      info: [
        { label: "Release-Kalender (Kaisaking TCG)", url: "https://www.kaisaking-tcg.de/pokemon/release-kalender" },
        { label: "Produktkalender 2026 (ICv2)", url: "https://icv2.com/articles/news/view/61079/pokemon-tcg-2026-product-calendar" }
      ]
    }
  ],

  /* Kuratierte, etablierte Händler mit Pokémon-TCG-Sortiment. */
  retailers: [
    { name: "Müller", type: "Filialhandel", note: "Offizielle Pokémon-Kategorie, Abholung in der Filiale möglich", url: "https://www.mueller.de/c/spielwaren/spiele-puzzles/spiele/sammelkarten/pokemon/" },
    { name: "Rossmann", type: "Filialhandel", note: "Booster & Blister, oft Aktionspreise", url: "https://www.rossmann.de/de/search?text=pokemon" },
    { name: "GameStop", type: "Filialhandel", note: "Release-Drops & Vorbestellungen", url: "https://www.gamestop.de/SearchResult/QuickSearch?q=pokemon" },
    { name: "Elbenwald", type: "Fanshop", note: "Etablierter Fanartikel-Shop mit TCG-Sortiment", url: "https://www.elbenwald.de/search?query=pokemon" },
    { name: "Gate to the Games", type: "TCG-Fachhändler", note: "Großer deutscher TCG-Spezialist", url: "https://www.gate-to-the-games.de/Pokemon-Karten" },
    { name: "Card-Corner", type: "TCG-Fachhändler", note: "Fachhändler mit aktuellen Sets", url: "https://www.card-corner.de/pokemon-dunkelnacht" },
    { name: "Cardmarket", type: "Preisvergleich", note: "Europas größter TCG-Marktplatz – Preise vergleichen", url: "https://www.cardmarket.com/de/Pokemon" },
    { name: "idealo", type: "Preisvergleich", note: "Preisvergleich über viele Shops", url: "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=pokemon+karten" }
  ],

  /* Prospekt-Suche: echte aktuelle Angebote der Märkte in der Nähe. */
  flyers: [
    { name: "marktguru", note: "Pokémon-Angebote aus allen aktuellen Prospekten deiner Umgebung", url: "https://www.marktguru.de/search?q=pokemon" },
    { name: "kaufDA", note: "Prospekte von Marktkauf, REWE, EDEKA & Co. durchsuchen", url: "https://www.kaufda.de/webapp/search?query=pokemon" }
  ]
};
