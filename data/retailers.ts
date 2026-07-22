import type { Retailer } from "@/types";

/**
 * Händler-Watchlist – direkt aus der PokeDrop-Masterliste (Abschnitte 3, 4, 7).
 * Status A/B/C und Crawler-Priorität 1:1 übernommen.
 */
export const retailers: Retailer[] = [
  // ---- Stufe 1 · Status A (TCG bestätigt) ---------------------------------
  { retailer_group: "kaufland", retailer_brand: "Kaufland", displayName: "Kaufland", status: "A", regionality: "Bundesweit / teils prospektregional", typical_products: "Boosterpacks / TCG-Produkte", priority: "sehr_hoch", crawlerTier: 1, note: "Historische und aktuelle Prospektangebote nachweisbar", brandColor: "#e10915", category: "supermarkt" },
  { retailer_group: "edeka", retailer_brand: "EDEKA", displayName: "EDEKA", status: "A", regionality: "Stark regional / filialabhängig", typical_products: "Booster, Sammelkarten, Sets", priority: "sehr_hoch", crawlerTier: 1, note: "Nicht pauschal bundesweit behandeln", brandColor: "#ffd400", category: "supermarkt" },
  { retailer_group: "edeka", retailer_brand: "E-Center", displayName: "E-Center", status: "A", regionality: "Regional / filialabhängig", typical_products: "EX-Boxen, Sammelkartenspiel", priority: "sehr_hoch", crawlerTier: 1, note: "Als eigene Vertriebslinie führen", brandColor: "#0a7bc4", category: "supermarkt" },
  { retailer_group: "edeka", retailer_brand: "Marktkauf", displayName: "Marktkauf", status: "A", regionality: "Regional", typical_products: "Booster / Sammelkarten", priority: "sehr_hoch", crawlerTier: 1, note: "Separate Marke/Prospekte", brandColor: "#e2001a", category: "supermarkt" },
  { retailer_group: "edeka", retailer_brand: "Scheck-in-Center", displayName: "Scheck-in-Center", status: "A", regionality: "Regional / lokale Filialgruppen", typical_products: "Booster, Mystery Box, TCG", priority: "sehr_hoch", crawlerTier: 1, note: "Besonders wertvoll für lokale Deals", brandColor: "#00954c", category: "supermarkt" },
  { retailer_group: "rewe", retailer_brand: "REWE Center", displayName: "REWE Center", status: "A", regionality: "Regional / filialabhängig", typical_products: "EX-Boxen, Booster", priority: "sehr_hoch", crawlerTier: 1, note: "Nicht mit REWE pauschal zusammenfassen", brandColor: "#cc0000", category: "supermarkt" },
  { retailer_group: "netto_md", retailer_brand: "Netto Marken-Discount", displayName: "Netto Marken-Discount", status: "A", regionality: "Überregional + regionale Varianten", typical_products: "2er-Packs, Sets, Tins, Kollektionen", priority: "sehr_hoch", crawlerTier: 1, note: "Regelmäßig Aktionsware", brandColor: "#ffcc00", category: "discounter" },
  { retailer_group: "penny", retailer_brand: "PENNY", displayName: "PENNY", status: "A", regionality: "Überregional / regionale Prospektvarianten", typical_products: "Sammelkarten", priority: "sehr_hoch", crawlerTier: 1, note: "Aktionsangebote historisch belegt", brandColor: "#d4021d", category: "discounter" },
  { retailer_group: "rossmann", retailer_brand: "Rossmann", displayName: "Rossmann", status: "A", regionality: "Überregional / filialabhängig", typical_products: "Sammelkarten, Spezialkollektionen", priority: "sehr_hoch", crawlerTier: 1, note: "Prospekt + App-Angebote beobachten", brandColor: "#c8102e", category: "drogerie" },
  { retailer_group: "budni", retailer_brand: "Budni", displayName: "Budni", status: "A", regionality: "Stark regional (Norddeutschland)", typical_products: "Booster / Kollektionen", priority: "sehr_hoch", crawlerTier: 1, note: "Eigenes regionales Filialnetz", brandColor: "#e5006d", category: "drogerie" },
  { retailer_group: "famila", retailer_brand: "famila Nordwest", displayName: "famila Nordwest", status: "A", regionality: "Stark regional", typical_products: "Pokémon-TCG-Angebote", priority: "hoch", crawlerTier: 1, note: "Regionale Prospekte separat erfassen", brandColor: "#e30613", category: "supermarkt" },
  { retailer_group: "expert", retailer_brand: "Expert", displayName: "Expert", status: "A", regionality: "Lokal / regional, Händlerverbund", typical_products: "Sammelkarten / Booster", priority: "sehr_hoch", crawlerTier: 1, note: "Einzelne Expert-Händler separat erfassen", brandColor: "#e2001a", category: "elektronik" },
  { retailer_group: "maec_geiz", retailer_brand: "Mäc-Geiz", displayName: "Mäc-Geiz", status: "A", regionality: "Regional / Filialnetz", typical_products: "TCG-/Top-Trainer-Produkte", priority: "hoch", crawlerTier: 1, note: "Sonderposten-/Aktionslogik", brandColor: "#f39200", category: "discounter" },
  { retailer_group: "schmidts", retailer_brand: "Schmidt's Märkte", displayName: "Schmidt's Märkte", status: "A", regionality: "Regional", typical_products: "Booster Karmesin & Purpur", priority: "hoch", crawlerTier: 1, note: "Regionaler EDEKA-naher Händler; lokal erfassen", brandColor: "#004f9f", category: "supermarkt" },

  // ---- Stufe 2 · Status B (Pokémon allgemein bestätigt) -------------------
  { retailer_group: "mueller", retailer_brand: "Müller", displayName: "Müller", status: "B", regionality: "Bundesweit / Filialnetz", typical_products: "Pokémon-Sortiment und Prospektangebote", priority: "sehr_hoch", crawlerTier: 2, brandColor: "#f7911e", category: "drogerie" },
  { retailer_group: "smyths", retailer_brand: "Smyths Toys", displayName: "Smyths Toys", status: "B", regionality: "Bundesweit / Filialnetz", typical_products: "Pokémon-Spielwaren und TCG-Sortiment", priority: "sehr_hoch", crawlerTier: 2, brandColor: "#e2001a", category: "spielwaren" },
  { retailer_group: "aldi_sued", retailer_brand: "ALDI SÜD", displayName: "ALDI SÜD", status: "B", regionality: "Regionalgesellschaften", typical_products: "Pokémon-Aktionsware / Merchandise", priority: "hoch", crawlerTier: 2, brandColor: "#00538a", category: "discounter" },
  { retailer_group: "lidl", retailer_brand: "Lidl", displayName: "Lidl", status: "B", regionality: "Überregional / regionale Varianten", typical_products: "Pokémon-Aktionsware", priority: "hoch", crawlerTier: 2, brandColor: "#0050aa", category: "discounter" },
  { retailer_group: "mediamarkt", retailer_brand: "MediaMarkt", displayName: "MediaMarkt", status: "B", regionality: "Bundesweit / lokale Marktaktionen", typical_products: "Pokémon-Produkte, Games, Merchandise", priority: "hoch", crawlerTier: 2, brandColor: "#df0000", category: "elektronik" },
  { retailer_group: "galeria", retailer_brand: "Galeria", displayName: "Galeria", status: "B", regionality: "Filialnetz", typical_products: "Pokémon-Produkte", priority: "mittel", crawlerTier: 2, brandColor: "#e3000f", category: "warenhaus" },
  { retailer_group: "kodi", retailer_brand: "KODi", displayName: "KODi", status: "B", regionality: "Regional / NRW-Schwerpunkt", typical_products: "Pokémon-Produkte", priority: "hoch", crawlerTier: 2, brandColor: "#e30613", category: "discounter" },

  // ---- Stufe 3 · Status C (Spielwaren / TCG-Fachhandel) -------------------
  { retailer_group: "rofu", retailer_brand: "ROFU Kinderland", displayName: "ROFU Kinderland", status: "C", regionality: "Regional / Filialnetz", typical_products: "Pokémon-Spielwaren", priority: "mittel", crawlerTier: 3, brandColor: "#e5007d", category: "spielwaren" },
  { retailer_group: "gate", retailer_brand: "Gate to the Games", displayName: "Gate to the Games", status: "C", regionality: "TCG-Fachhandel", typical_products: "Displays, ETB, Booster", priority: "mittel", crawlerTier: 3, brandColor: "#7b2ff7", category: "tcg_shop" },
  { retailer_group: "fantasywelt", retailer_brand: "FantasyWelt", displayName: "FantasyWelt", status: "C", regionality: "TCG-Fachhandel", typical_products: "Displays, Boosterboxen", priority: "mittel", crawlerTier: 3, brandColor: "#1f7a3f", category: "tcg_shop" },
  { retailer_group: "games_island", retailer_brand: "Games Island", displayName: "Games Island", status: "C", regionality: "TCG-Fachhandel", typical_products: "Booster, Sammelkarten", priority: "mittel", crawlerTier: 3, brandColor: "#0a84ff", category: "tcg_shop" },

  // ---- Online-Quellen (Live Drops) ---------------------------------------
  { retailer_group: "pokemon_center", retailer_brand: "Pokémon Center", displayName: "Pokémon Center", status: "A", regionality: "Online (offiziell)", typical_products: "Exklusive TCG-Produkte, Drops, Restocks", priority: "sehr_hoch", crawlerTier: 1, note: "Zentrale Drop-Quelle (Masterliste 18.4)", brandColor: "#ffcb05", category: "online" },
];

export const retailersByBrand = new Map(retailers.map((r) => [r.retailer_brand, r]));
