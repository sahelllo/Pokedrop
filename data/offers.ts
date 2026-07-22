import type { Offer, StockSignal, ValidityType, VerificationStatus } from "@/types";
import { stores } from "./stores";

/**
 * Angebots-Seed (Masterliste 6 + 17).
 * Kombination aus handkuratierten "Hero"-Angeboten (inkl. dem
 * Oberhausen→Ludwigsburg-Fall) und deterministisch erzeugten Angeboten,
 * damit der Feed von der ersten Sekunde an voll wirkt.
 *
 * WICHTIG: alle Zeit-/Zufallswerte sind deterministisch (seeded), damit
 * Server- und Client-Render identisch sind (keine Hydration-Mismatches).
 */

const NOW_ISO = "2026-07-22";

function daysFrom(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---- Handkuratierte Hero-Angebote --------------------------------------
const baseOffers: Offer[] = [
  // ⭐ Der Masterlisten-Beispielfall (17.7): LOCAL-Angebot in Ludwigsburg,
  // sichtbar für einen Nutzer in Oberhausen mit großem Radius – obwohl der
  // Oberhausener EDEKA dieselbe Aktion NICHT hat.
  {
    offer_id: "of-lb-hero",
    product_id: "p-reisegefaehrten-etb",
    retailer_group: "edeka",
    retailer_brand: "Scheck-in-Center",
    regional_company: "EDEKA Südwest",
    price: 42.99,
    regular_price: 54.99,
    valid_from: daysFrom(NOW_ISO, -2),
    valid_until: daysFrom(NOW_ISO, 4),
    validity_type: "LOCAL",
    participating_store_ids: ["scheckin-lb-1"],
    source_type: "Prospekt",
    source_url: "https://www.prospektangebote.de/geschaefte/edeka/angebote/pokemon-sammelkarten-angebot-56374012/",
    verification_status: "REGIONAL_CONFIRMED",
    stock_signal: "wenig_bestand",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 14,
  },
  {
    offer_id: "of-kaufland-dunkelnacht-display",
    product_id: "p-dunkelnacht-display",
    retailer_group: "kaufland",
    retailer_brand: "Kaufland",
    price: 149.0,
    regular_price: 179.99,
    valid_from: daysFrom(NOW_ISO, -1),
    valid_until: daysFrom(NOW_ISO, 6),
    validity_type: "NATIONAL",
    participating_store_ids: ["kaufland-ob-1", "kaufland-du-1", "kaufland-s-1", "kaufland-m-1", "kaufland-b-1", "kaufland-l-1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 41,
  },
  {
    offer_id: "of-netto-dunkelnacht-etb",
    product_id: "p-dunkelnacht-etb",
    retailer_group: "netto_md",
    retailer_brand: "Netto Marken-Discount",
    price: 44.99,
    regular_price: 54.99,
    valid_from: daysFrom(NOW_ISO, 0),
    valid_until: daysFrom(NOW_ISO, 5),
    validity_type: "NATIONAL",
    participating_store_ids: ["netto-ms-1", "netto-hb-1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 8,
  },
  {
    offer_id: "of-mueller-151-upc",
    product_id: "p-151-upc",
    retailer_group: "mueller",
    retailer_brand: "Müller",
    price: 164.99,
    regular_price: 229.0,
    valid_from: daysFrom(NOW_ISO, -3),
    valid_until: daysFrom(NOW_ISO, 9),
    validity_type: "STORE_GROUP",
    participating_store_ids: ["mueller-koeln-1", "mueller-ka-1"],
    source_type: "App",
    verification_status: "VERIFIED",
    stock_signal: "wenig_bestand",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 22,
  },
  {
    offer_id: "of-gate-obsidian-etb",
    product_id: "p-obsidianflammen-etb",
    retailer_group: "gate",
    retailer_brand: "Gate to the Games",
    price: 47.9,
    regular_price: 64.9,
    valid_from: daysFrom(NOW_ISO, -5),
    valid_until: daysFrom(NOW_ISO, 20),
    validity_type: "LOCAL",
    participating_store_ids: ["gate-do-1"],
    source_type: "Händlerseite",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 61,
  },
  {
    offer_id: "of-online-verlorener-display",
    product_id: "p-verlorener-ursprung-display",
    retailer_group: "fantasywelt",
    retailer_brand: "FantasyWelt",
    price: 219.0,
    regular_price: 299.0,
    valid_from: daysFrom(NOW_ISO, -1),
    valid_until: daysFrom(NOW_ISO, 14),
    validity_type: "ONLINE",
    participating_store_ids: [],
    source_type: "Online-Shop",
    verification_status: "VERIFIED",
    stock_signal: "wenig_bestand",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 3,
  },
  {
    offer_id: "of-rossmann-zeitlose-blister",
    product_id: "p-zeitlose-rivalen-blister",
    retailer_group: "rossmann",
    retailer_brand: "Rossmann",
    price: 11.99,
    regular_price: 14.99,
    valid_from: daysFrom(NOW_ISO, 0),
    valid_until: daysFrom(NOW_ISO, 7),
    validity_type: "NATIONAL",
    participating_store_ids: ["rossmann-e-1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 17,
  },
  {
    offer_id: "of-penny-fpc3",
    product_id: "p-fpc3-collection",
    retailer_group: "penny",
    retailer_brand: "PENNY",
    price: 31.99,
    regular_price: 39.99,
    valid_from: daysFrom(NOW_ISO, -1),
    valid_until: daysFrom(NOW_ISO, 3),
    validity_type: "NATIONAL",
    participating_store_ids: ["penny-d-1", "penny-dd-1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 33,
  },
  {
    offer_id: "of-marktkauf-paldeas-etb",
    product_id: "p-paldeas-schicksale-etb",
    retailer_group: "edeka",
    retailer_brand: "Marktkauf",
    regional_company: "EDEKA Südwest",
    price: 57.99,
    regular_price: 82.9,
    valid_from: daysFrom(NOW_ISO, -2),
    valid_until: daysFrom(NOW_ISO, 5),
    validity_type: "REGIONAL",
    participating_store_ids: ["marktkauf-ma-1", "marktkauf-do-1"],
    source_type: "Prospekt",
    verification_status: "REGIONAL_CONFIRMED",
    stock_signal: "wenig_bestand",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 52,
  },
  {
    offer_id: "of-scheckin-mega-forces-tin",
    product_id: "p-mega-forces-tin",
    retailer_group: "edeka",
    retailer_brand: "Scheck-in-Center",
    regional_company: "EDEKA Südwest",
    price: 18.99,
    regular_price: 24.99,
    valid_from: daysFrom(NOW_ISO, 0),
    valid_until: daysFrom(NOW_ISO, 6),
    validity_type: "STORE_GROUP",
    participating_store_ids: ["scheckin-lb-1", "ecenter-s-1"],
    source_type: "Prospekt",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 5,
  },
  {
    offer_id: "of-galeria-brillante-etb",
    product_id: "p-brillante-sterne-etb",
    retailer_group: "galeria",
    retailer_brand: "Galeria",
    price: 74.0,
    regular_price: 104.0,
    valid_from: daysFrom(NOW_ISO, -4),
    valid_until: daysFrom(NOW_ISO, 11),
    validity_type: "STORE_GROUP",
    participating_store_ids: ["galeria-koeln-1", "galeria-f-1"],
    source_type: "Händlerseite",
    verification_status: "PROBABLE",
    stock_signal: "wenig_bestand",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 74,
  },
  {
    offer_id: "of-community-celebrations",
    product_id: "p-celebrations-etb",
    retailer_group: "smyths",
    retailer_brand: "Smyths Toys",
    price: 94.9,
    regular_price: 139.0,
    valid_from: daysFrom(NOW_ISO, -1),
    valid_until: daysFrom(NOW_ISO, 8),
    validity_type: "LOCAL",
    participating_store_ids: ["smyths-do-1"],
    source_type: "Community-Fund",
    verification_status: "COMMUNITY_UNVERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 26,
  },
  {
    offer_id: "of-ecenter-stellarkrone",
    product_id: "p-stellarkrone-etb",
    retailer_group: "edeka",
    retailer_brand: "E-Center",
    regional_company: "EDEKA Minden-Hannover",
    price: 46.99,
    regular_price: 58.9,
    valid_from: daysFrom(NOW_ISO, -1),
    valid_until: daysFrom(NOW_ISO, 5),
    validity_type: "REGIONAL",
    participating_store_ids: ["ecenter-h-1", "ecenter-e-1"],
    source_type: "Prospekt",
    verification_status: "REGIONAL_CONFIRMED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 12,
  },
  {
    offer_id: "of-games-island-paradox",
    product_id: "p-paradoxrift-premium",
    retailer_group: "games_island",
    retailer_brand: "Games Island",
    price: 37.99,
    regular_price: 51.0,
    valid_from: daysFrom(NOW_ISO, -6),
    valid_until: daysFrom(NOW_ISO, 15),
    validity_type: "LOCAL",
    participating_store_ids: ["games-island-m-1"],
    source_type: "Instagram",
    verification_status: "PROBABLE",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 47,
  },
  {
    offer_id: "of-budni-maskerade",
    product_id: "p-maskerade-bundle",
    retailer_group: "budni",
    retailer_brand: "Budni",
    price: 24.99,
    regular_price: 33.5,
    valid_from: daysFrom(NOW_ISO, 0),
    valid_until: daysFrom(NOW_ISO, 4),
    validity_type: "REGIONAL",
    participating_store_ids: ["budni-hh-1"],
    source_type: "App",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 19,
  },
  {
    offer_id: "of-famila-reisegef-display",
    product_id: "p-reisegefaehrten-display",
    retailer_group: "famila",
    retailer_brand: "famila Nordwest",
    price: 154.99,
    regular_price: 184.99,
    valid_from: daysFrom(NOW_ISO, -2),
    valid_until: daysFrom(NOW_ISO, 6),
    validity_type: "REGIONAL",
    participating_store_ids: ["famila-hh-1", "famila-ki-1"],
    source_type: "Prospekt",
    verification_status: "REGIONAL_CONFIRMED",
    stock_signal: "wenig_bestand",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 55,
  },
  // Ein bewusst schwaches Angebot (🔴 ÜBER MARKT) fürs Filtern/Runterranken.
  {
    offer_id: "of-mediamarkt-dunkelnacht-over",
    product_id: "p-dunkelnacht-etb",
    retailer_group: "mediamarkt",
    retailer_brand: "MediaMarkt",
    price: 64.99,
    regular_price: 54.99,
    valid_from: daysFrom(NOW_ISO, -1),
    valid_until: daysFrom(NOW_ISO, 30),
    validity_type: "ONLINE",
    participating_store_ids: [],
    source_type: "Online-Shop",
    verification_status: "VERIFIED",
    stock_signal: "verfuegbar",
    stock_signal_at: NOW_ISO,
    found_minutes_ago: 120,
  },
];

// ---- Deterministischer Generator ---------------------------------------
// Erzeugt zusätzliche Angebote über viele Filialen, damit der Feed voll ist.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GEN_PRODUCTS: { id: string; base: number }[] = [
  { id: "p-dunkelnacht-etb", base: 54.99 },
  { id: "p-reisegefaehrten-etb", base: 54.99 },
  { id: "p-zeitlose-rivalen-blister", base: 14.99 },
  { id: "p-mega-forces-tin", base: 24.99 },
  { id: "p-fpc3-collection", base: 39.99 },
  { id: "p-obsidianflammen-etb", base: 64.9 },
  { id: "p-paldeas-schicksale-etb", base: 82.9 },
  { id: "p-stellarkrone-etb", base: 58.9 },
  { id: "p-maskerade-bundle", base: 33.5 },
  { id: "p-paradoxrift-premium", base: 51.0 },
  { id: "p-brillante-sterne-etb", base: 104.0 },
  { id: "p-151-upc", base: 229.0 },
];

const VALIDITIES: ValidityType[] = ["LOCAL", "REGIONAL", "STORE_GROUP", "NATIONAL"];
const VERIFS: VerificationStatus[] = ["VERIFIED", "REGIONAL_CONFIRMED", "PROBABLE", "COMMUNITY_UNVERIFIED"];
const SIGNALS: StockSignal[] = ["verfuegbar", "verfuegbar", "wenig_bestand", "ausverkauft"];
const SOURCES = ["Prospekt", "App", "Händlerseite", "Instagram", "Community-Fund"] as const;

function generateOffers(count: number): Offer[] {
  const rnd = mulberry32(20260722);
  const out: Offer[] = [];
  const physicalStores = stores.filter((s) => s.retailer_group !== "pokemon_center");

  for (let i = 0; i < count; i++) {
    const prod = GEN_PRODUCTS[Math.floor(rnd() * GEN_PRODUCTS.length)];
    const store = physicalStores[Math.floor(rnd() * physicalStores.length)];
    // Preis-Faktor zwischen 0.78 und 1.12 der Basis → Mix aller Badges.
    const factor = 0.78 + rnd() * 0.34;
    const price = Math.round(prod.base * factor * 100) / 100 - 0.01;
    const validity = VALIDITIES[Math.floor(rnd() * VALIDITIES.length)];
    const verif = VERIFS[Math.floor(rnd() * VERIFS.length)];
    const signal = SIGNALS[Math.floor(rnd() * SIGNALS.length)];
    const startOffset = -Math.floor(rnd() * 6);
    const duration = 3 + Math.floor(rnd() * 12);

    // Teilnehmende Filialen abhängig von der Gültigkeit.
    let participating: string[] = [store.store_id];
    if (validity === "NATIONAL" || validity === "REGIONAL" || validity === "STORE_GROUP") {
      const extras = physicalStores
        .filter((s) => s.retailer_group === store.retailer_group && s.store_id !== store.store_id)
        .slice(0, validity === "NATIONAL" ? 6 : validity === "REGIONAL" ? 3 : 2);
      participating = [store.store_id, ...extras.map((s) => s.store_id)];
    }

    out.push({
      offer_id: `of-gen-${i}`,
      product_id: prod.id,
      retailer_group: store.retailer_group,
      retailer_brand: store.retailer_brand,
      regional_company: store.regional_company,
      price: Math.max(price, prod.base * 0.55),
      regular_price: prod.base,
      valid_from: daysFrom(NOW_ISO, startOffset),
      valid_until: daysFrom(NOW_ISO, startOffset + duration),
      validity_type: validity,
      participating_store_ids: participating,
      source_type: SOURCES[Math.floor(rnd() * SOURCES.length)],
      verification_status: verif,
      stock_signal: signal,
      stock_signal_at: NOW_ISO,
      found_minutes_ago: Math.floor(rnd() * 600),
    });
  }
  return out;
}

export const offers: Offer[] = [...baseOffers, ...generateOffers(64)];
