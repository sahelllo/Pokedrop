/*
 * PokéDrop – Echte Release- und Händlerdaten (Deutschland)
 *
 * Quellen: pokemon.com/de, ICv2-Produktkalender 2026, deutsche
 * Release-Kalender (PokeZentrum, TCG-Händler). Stand: 21.07.2026.
 *
 * Diese Daten sind der eingebaute Fallback. Die App versucht zusätzlich,
 * data/drops.json vom Server zu laden und alle 60 Sekunden zu
 * aktualisieren – so erscheinen Daten-Updates im Repo sofort bei allen
 * Nutzern, ohne dass sie die Seite neu laden müssen.
 */

const DROP_DATA = {
  lastUpdated: "2026-07-21T09:00:00+02:00",
  sets: [
    {
      id: "dunkelnacht",
      series: "Mega-Entwicklung · Hauptset Nr. 5",
      name: "Dunkelnacht",
      date: "2026-07-17T00:00:00+02:00",
      tagline: "Mega-Darkrai-ex erscheint zum ersten Mal – das dunkelste Set der Mega-Entwicklung-Reihe.",
      facts: [
        "120 Karten + 36 Secret Rares",
        "Mega-Darkrai-ex, Mega-Zeraora-ex, Mega-Skelabra-ex, Mega-Stalobor-ex",
        "Top-Trainer-Box mit exklusiver Zarude-Promokarte"
      ],
      products: [
        { name: "Boosterpack", price: "ca. 4,99 €" },
        { name: "Top-Trainer-Box", price: "ca. 54,99 €" },
        { name: "Kollektionen & Blister", price: "ab ca. 12,99 €" }
      ],
      links: [
        { label: "Offizielle Ankündigung (pokemon.com)", url: "https://www.pokemon.com/de/news/die-erweiterung-mega-entwicklung-dunkelnacht-des-pokemon-sammelkartenspiels-erscheint-am-17-juli-2026" },
        { label: "Kartenliste & Galerie (PokeZentrum)", url: "https://pokezentrum.de/pokemon-karten-news/pokemon-dunkelnacht-kartenliste-und-kartengalerie/" },
        { label: "Preisvergleich (Cardmarket)", url: "https://www.cardmarket.com/de/Pokemon" }
      ]
    },
    {
      id: "first-partner-3",
      series: "Sammel-Kollektion",
      name: "First Partner Collection – Serie 3",
      date: "2026-08-07T00:00:00+02:00",
      tagline: "Dritte Runde der Jumbo-Karten-Kollektion mit den Starter-Pokémon.",
      facts: ["Jumbo-Karten im Übergrößen-Format", "Teil der Reihe zum 30-jährigen Jubiläum"],
      products: [{ name: "Kollektions-Box", price: "Preis noch offen" }],
      links: [
        { label: "Produktkalender 2026 (ICv2)", url: "https://icv2.com/articles/news/view/61079/pokemon-tcg-2026-product-calendar" }
      ]
    },
    {
      id: "mega-forces-tins",
      series: "Tin-Boxen",
      name: "Mega Forces Tins",
      date: "2026-08-28T00:00:00+02:00",
      tagline: "Neue Sammel-Tins zur Mega-Entwicklung-Reihe mit Boosterpacks und Promokarte.",
      facts: ["Metallboxen mit Boosterpacks", "Motive aus der Mega-Entwicklung-Serie"],
      products: [{ name: "Tin-Box", price: "ca. 29,99 €" }],
      links: [
        { label: "Produktkalender 2026 (ICv2)", url: "https://icv2.com/articles/news/view/61079/pokemon-tcg-2026-product-calendar" }
      ]
    },
    {
      id: "30-jahre",
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
      links: [
        { label: "Release-Kalender (Kaisaking TCG)", url: "https://www.kaisaking-tcg.de/pokemon/release-kalender" },
        { label: "Produktkalender 2026 (ICv2)", url: "https://icv2.com/articles/news/view/61079/pokemon-tcg-2026-product-calendar" }
      ]
    }
  ],

  /* Deutsche Händler mit direkten Links zum Pokémon-TCG-Sortiment. */
  retailers: [
    { name: "Müller", note: "Große TCG-Auswahl in Filialen & online", url: "https://www.mueller.de/search/?q=pok%C3%A9mon%20karten" },
    { name: "Rossmann", note: "Booster & Blister, oft Aktionspreise", url: "https://www.rossmann.de/de/search?text=pokemon" },
    { name: "Kaufland", note: "Online-Marktplatz mit vielen Anbietern", url: "https://www.kaufland.de/s/?search_value=pokemon%20karten" },
    { name: "GameStop", note: "Release-Drops & Vorbestellungen", url: "https://www.gamestop.de/SearchResult/QuickSearch?q=pokemon" },
    { name: "Amazon", note: "Schnelle Verfügbarkeits-Checks", url: "https://www.amazon.de/s?k=pokemon+karten" },
    { name: "Cardmarket", note: "Europas größter TCG-Marktplatz, Preisvergleich", url: "https://www.cardmarket.com/de/Pokemon" },
    { name: "idealo", note: "Preisvergleich über viele Shops", url: "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=pokemon+karten" },
    { name: "Card-Corner", note: "TCG-Fachhändler, aktuelle Sets", url: "https://www.card-corner.de/pokemon-dunkelnacht" }
  ],

  /* Prospekt-Suche: zeigt echte aktuelle Angebote der Märkte in der Nähe. */
  flyers: [
    { name: "marktguru", note: "Pokémon-Angebote aus allen aktuellen Prospekten deiner Umgebung", url: "https://www.marktguru.de/search?q=pokemon" },
    { name: "kaufDA", note: "Prospekte von Marktkauf, REWE, EDEKA & Co. durchsuchen", url: "https://www.kaufda.de/webapp/search?query=pokemon" }
  ]
};
