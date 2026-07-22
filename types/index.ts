/**
 * PokeDrop – zentrale Typdefinitionen.
 *
 * Die Feldnamen und Status-Werte sind bewusst 1:1 aus der
 * "PokeDrop Händler-Masterliste Deutschland" übernommen
 * (Abschnitte 6, 8, 11, 14, 17, 18, 19), damit später ein echtes
 * Backend/DB angeflanscht werden kann, ohne die UI umzubauen.
 */

/* ------------------------------------------------------------------ */
/*  1. Händler / Filialen (bestimmt WO ein Angebot gilt)              */
/* ------------------------------------------------------------------ */

/** Watchlist-Status aus Masterliste Abschnitt 2. */
export type RetailerStatus = "A" | "B" | "C";

/** Crawler-Priorität aus Masterliste Abschnitt 7. */
export type CrawlerPriority = "sehr_hoch" | "hoch" | "mittel" | "niedrig";

export interface Retailer {
  /** z. B. "edeka" */
  retailer_group: string;
  /** z. B. "E-Center" oder "Marktkauf" */
  retailer_brand: string;
  displayName: string;
  status: RetailerStatus;
  /** Freitext-Regionalität aus der Masterliste */
  regionality: string;
  /** typische / belegte Produkte */
  typical_products: string;
  priority: CrawlerPriority;
  /** Stufe 1/2/3 aus Masterliste Abschnitt 7 */
  crawlerTier: 1 | 2 | 3;
  note?: string;
  /** Markenfarbe für die UI */
  brandColor: string;
  category:
    | "supermarkt"
    | "discounter"
    | "drogerie"
    | "elektronik"
    | "spielwaren"
    | "tcg_shop"
    | "warenhaus"
    | "baumarkt"
    | "online";
}

export type ValidityType =
  | "NATIONAL"
  | "REGIONAL"
  | "STORE_GROUP"
  | "LOCAL"
  | "ONLINE";

export interface Store {
  store_id: string;
  retailer_group: string;
  retailer_brand: string;
  regional_company?: string;
  store_name: string;
  street: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

/* ------------------------------------------------------------------ */
/*  2. Produkt- / UVP- / Preisreferenz (bestimmt WIE GUT der Preis)   */
/* ------------------------------------------------------------------ */

export type ProductType =
  | "Booster"
  | "Booster Bundle"
  | "Display"
  | "ETB"
  | "Tin"
  | "Mini Tin"
  | "Collection"
  | "Premium Collection"
  | "Bundle"
  | "Blister";

export type ProductLanguage = "Deutsch" | "Englisch" | "Japanisch";

export type AvailabilityStatus =
  | "aktuell"
  | "out_of_print"
  | "aeltere_kollektion"
  | "sonderprodukt";

export interface Product {
  product_id: string;
  product_name: string;
  set_name: string;
  set_code?: string;
  product_type: ProductType;
  ean?: string;
  sku?: string;
  language: ProductLanguage;
  /** ISO date */
  release_date: string;
  /** offizielle / belastbare UVP in EUR */
  reference_uvp: number;
  uvp_source: string;
  /** aktueller Markt-Referenzpreis (v. a. für ältere Produkte) */
  market_reference_price: number;
  /** Preisgrenze "guter Deal" (individuell je Produkt) */
  good_deal_threshold: number;
  /** Preisgrenze "besonders attraktiv" */
  great_deal_threshold: number;
  price_reference_updated_at: string;
  availability_status: AvailabilityStatus;
  /** National-Dex-ID für PokéAPI-Artwork (Deko/Hero) */
  pokemonArtworkId?: number;
  /** optionale echte TCG-Kartenbild-URL */
  tcgImage?: string;
  /** dominante Energie-Typ-Welt für Akzentfarbe */
  energyType?: EnergyType;
  /** PokeDrop-Tiefstpreis (Preisverlauf-Chart) */
  pokedrop_lowest?: number;
}

/* ------------------------------------------------------------------ */
/*  3. Angebote (Offer) – verbindet Produkt + Filiale + Gültigkeit     */
/* ------------------------------------------------------------------ */

export type VerificationStatus =
  | "VERIFIED"
  | "REGIONAL_CONFIRMED"
  | "PROBABLE"
  | "COMMUNITY_UNVERIFIED";

export type SourceType =
  | "Prospekt"
  | "App"
  | "Händlerseite"
  | "Online-Shop"
  | "Community-Fund"
  | "Instagram"
  | "Facebook";

/** Crowd-Intelligence-Signale (Masterliste 19.10). */
export type StockSignal = "verfuegbar" | "wenig_bestand" | "ausverkauft";

export interface Offer {
  offer_id: string;
  product_id: string;
  retailer_group: string;
  retailer_brand: string;
  regional_company?: string;
  price: number;
  regular_price?: number;
  /** ISO date */
  valid_from: string;
  valid_until: string;
  validity_type: ValidityType;
  /** Liste gültiger Filialen (leer bei ONLINE) */
  participating_store_ids: string[];
  source_type: SourceType;
  source_url?: string;
  verification_status: VerificationStatus;
  /** Crowd-Signal + Zeitpunkt (Crowd Intelligence) */
  stock_signal?: StockSignal;
  stock_signal_at?: string;
  /** Minuten seit Fund – für "vor X Min." Anzeige */
  found_minutes_ago?: number;
}

/* ------------------------------------------------------------------ */
/*  4. Live Drops & Restocks (Masterliste 18.4 / 18.5)                */
/* ------------------------------------------------------------------ */

export type DropKind = "drop" | "restock" | "new_product";

export interface LiveDrop {
  drop_id: string;
  product_id: string;
  kind: DropKind;
  /** z. B. "Pokémon Center", "Online-Händler" */
  source_name: string;
  source_url?: string;
  isPokemonCenter: boolean;
  price?: number;
  minutes_ago: number;
  availability: StockSignal;
  /** erhöhte Priorität für begehrte Produkte */
  hot: boolean;
}

/* ------------------------------------------------------------------ */
/*  5. Gerüchte & frühe Hinweise (Masterliste 18.3)                   */
/* ------------------------------------------------------------------ */

export type RumorStatus =
  | "RUMOR"
  | "MULTI_SOURCE_RUMOR"
  | "LIKELY"
  | "CONFIRMED";

export interface Rumor {
  rumor_id: string;
  title: string;
  body: string;
  status: RumorStatus;
  source_type: SourceType;
  source_handle?: string;
  /** Anzahl unabhängiger Quellen */
  source_count: number;
  posted_minutes_ago: number;
  /** optionale Produktzuordnung */
  product_id?: string;
  confidence: number; // 0..1
}

/* ------------------------------------------------------------------ */
/*  6. Events (Masterliste 19)                                        */
/* ------------------------------------------------------------------ */

export type EventType =
  | "Tauschbörse"
  | "Card Show"
  | "Sammelkartenmesse"
  | "Community-Treffen"
  | "Turnier"
  | "Sammlerbörse";

export type PokemonFocus = "pokemon_only" | "starker_anteil" | "multi_tcg";

export type EventVerification =
  | "bestaetigt"
  | "wahrscheinlich"
  | "unbestaetigt"
  | "abgesagt";

export interface PokeEvent {
  event_id: string;
  event_name: string;
  event_type: EventType;
  date_start: string;
  date_end?: string;
  opening_hours?: string;
  venue_name: string;
  street: string;
  postal_code: string;
  city: string;
  latitude: number;
  longitude: number;
  organizer: string;
  official_source?: string;
  social_sources?: string[];
  ticket_price?: number;
  ticket_url?: string;
  pokemon_focus: PokemonFocus;
  vendors?: string[];
  trading_available: boolean;
  verification_status: EventVerification;
  last_checked: string;
}

/* ------------------------------------------------------------------ */
/*  Deal-Bewertung (Masterliste 12–14)                               */
/* ------------------------------------------------------------------ */

export type DealBadge =
  | "TOP_DEAL"
  | "UVP_DEAL"
  | "GUTER_DEAL"
  | "MARKTPREIS"
  | "UEBER_MARKT";

export interface DealEvaluation {
  badge: DealBadge;
  /** Referenz, gegen die bewertet wurde */
  referenceLabel: string;
  referencePrice: number;
  /** Ersparnis ggü. UVP in EUR (kann negativ sein) */
  savingsVsUvp: number;
  savingsPct: number;
  /** ist das Produkt jünger als 12 Monate? */
  isCurrent: boolean;
}

/** Energie-Typ-Welten als Akzentsystem (aus PokéAPI-Typen). */
export type EnergyType =
  | "fire"
  | "water"
  | "grass"
  | "lightning"
  | "psychic"
  | "fighting"
  | "darkness"
  | "metal"
  | "dragon"
  | "fairy"
  | "colorless";

/* ------------------------------------------------------------------ */
/*  Abgeleitete View-Modelle (aus dem Data-Layer, /lib/data.ts)       */
/* ------------------------------------------------------------------ */

export interface DealView {
  offer: Offer;
  product: Product;
  retailer: Retailer;
  /** die nächstgelegene teilnehmende Filiale (bzi. ONLINE: undefined) */
  nearestStore?: Store;
  /** Entfernung in km zur nächsten teilnehmenden Filiale */
  distanceKm?: number;
  evaluation: DealEvaluation;
  /** Rang-Score fürs Feed-Sorting (höher = besser) */
  rankScore: number;
  /** Tage bis Ablauf */
  daysLeft: number;
}
