import type { LiveDrop } from "@/types";

/**
 * Live Drops & Restocks (Masterliste 18.4 / 18.5).
 * Pokémon Center als zentrale Drop-Quelle + große Online-Händler.
 */
export const liveDrops: LiveDrop[] = [
  { drop_id: "d1", product_id: "p-dunkelnacht-etb", kind: "restock", source_name: "Pokémon Center", source_url: "https://www.pokemoncenter.com/", isPokemonCenter: true, price: 54.99, minutes_ago: 2, availability: "verfuegbar", hot: true },
  { drop_id: "d2", product_id: "p-151-upc", kind: "restock", source_name: "Pokémon Center", isPokemonCenter: true, price: 119.99, minutes_ago: 6, availability: "wenig_bestand", hot: true },
  { drop_id: "d3", product_id: "p-reisegefaehrten-display", kind: "drop", source_name: "Pokémon Center", isPokemonCenter: true, price: 179.99, minutes_ago: 11, availability: "verfuegbar", hot: true },
  { drop_id: "d4", product_id: "p-mega-forces-tin", kind: "new_product", source_name: "FantasyWelt", source_url: "https://www.fantasywelt.de/", isPokemonCenter: false, price: 22.99, minutes_ago: 18, availability: "verfuegbar", hot: false },
  { drop_id: "d5", product_id: "p-fpc3-collection", kind: "restock", source_name: "Games Island", isPokemonCenter: false, price: 39.99, minutes_ago: 24, availability: "wenig_bestand", hot: false },
  { drop_id: "d6", product_id: "p-obsidianflammen-etb", kind: "restock", source_name: "Gate to the Games", isPokemonCenter: false, price: 59.9, minutes_ago: 33, availability: "verfuegbar", hot: false },
  { drop_id: "d7", product_id: "p-dunkelnacht-display", kind: "drop", source_name: "Pokémon Center", isPokemonCenter: true, price: 179.99, minutes_ago: 41, availability: "ausverkauft", hot: true },
  { drop_id: "d8", product_id: "p-paldeas-schicksale-etb", kind: "restock", source_name: "Smyths Toys Online", isPokemonCenter: false, price: 49.99, minutes_ago: 52, availability: "wenig_bestand", hot: false },
  { drop_id: "d9", product_id: "p-zeitlose-rivalen-blister", kind: "new_product", source_name: "Müller Online", isPokemonCenter: false, price: 14.99, minutes_ago: 68, availability: "verfuegbar", hot: false },
  { drop_id: "d10", product_id: "p-stellarkrone-etb", kind: "restock", source_name: "Pokémon Center", isPokemonCenter: true, price: 54.99, minutes_ago: 84, availability: "verfuegbar", hot: false },
  { drop_id: "d11", product_id: "p-paradoxrift-premium", kind: "restock", source_name: "FantasyWelt", isPokemonCenter: false, price: 34.99, minutes_ago: 96, availability: "wenig_bestand", hot: false },
  { drop_id: "d12", product_id: "p-maskerade-bundle", kind: "new_product", source_name: "Games Island", isPokemonCenter: false, price: 26.99, minutes_ago: 122, availability: "verfuegbar", hot: false },
];
