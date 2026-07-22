import type { Store } from "@/types";

/**
 * Filialen mit echten Geo-Koordinaten deutscher Städte.
 * Grundlage der Radius-Suche und des Oberhausen→Ludwigsburg-Falls (17.7).
 */
export const stores: Store[] = [
  // --- Ruhrgebiet / NRW ---------------------------------------------------
  { store_id: "edeka-ob-1", retailer_group: "edeka", retailer_brand: "EDEKA", regional_company: "EDEKA Rhein-Ruhr", store_name: "EDEKA Sterkrade", street: "Bahnhofstr. 112", city: "Oberhausen", postal_code: "46145", latitude: 51.5279, longitude: 6.8556 },
  { store_id: "kaufland-ob-1", retailer_group: "kaufland", retailer_brand: "Kaufland", store_name: "Kaufland Oberhausen-Centro", street: "Osterfelder Str. 12", city: "Oberhausen", postal_code: "46047", latitude: 51.4949, longitude: 6.8792 },
  { store_id: "mediamarkt-ob-1", retailer_group: "mediamarkt", retailer_brand: "MediaMarkt", store_name: "MediaMarkt CentrO", street: "Centroallee 279", city: "Oberhausen", postal_code: "46047", latitude: 51.4931, longitude: 6.8807 },
  { store_id: "rossmann-e-1", retailer_group: "rossmann", retailer_brand: "Rossmann", store_name: "Rossmann Essen Rüttenscheid", street: "Rüttenscheider Str. 154", city: "Essen", postal_code: "45131", latitude: 51.4322, longitude: 7.0056 },
  { store_id: "ecenter-e-1", retailer_group: "edeka", retailer_brand: "E-Center", regional_company: "EDEKA Rhein-Ruhr", store_name: "E-Center Essen-Steele", street: "Bochumer Str. 4", city: "Essen", postal_code: "45276", latitude: 51.4489, longitude: 7.0776 },
  { store_id: "marktkauf-do-1", retailer_group: "edeka", retailer_brand: "Marktkauf", regional_company: "EDEKA Rhein-Ruhr", store_name: "Marktkauf Dortmund-Aplerbeck", street: "Köln-Berliner-Str. 40", city: "Dortmund", postal_code: "44287", latitude: 51.4842, longitude: 7.5645 },
  { store_id: "gate-do-1", retailer_group: "gate", retailer_brand: "Gate to the Games", store_name: "Gate to the Games Dortmund", street: "Westenhellweg 95", city: "Dortmund", postal_code: "44137", latitude: 51.5142, longitude: 7.4585 },
  { store_id: "smyths-do-1", retailer_group: "smyths", retailer_brand: "Smyths Toys", store_name: "Smyths Toys Dortmund", street: "Indupark 3", city: "Dortmund", postal_code: "44149", latitude: 51.4939, longitude: 7.3922 },
  { store_id: "kaufland-du-1", retailer_group: "kaufland", retailer_brand: "Kaufland", store_name: "Kaufland Duisburg-Marxloh", street: "Weseler Str. 40", city: "Duisburg", postal_code: "47169", latitude: 51.4894, longitude: 6.7411 },
  { store_id: "kodi-bo-1", retailer_group: "kodi", retailer_brand: "KODi", store_name: "KODi Bochum City", street: "Kortumstr. 82", city: "Bochum", postal_code: "44787", latitude: 51.4805, longitude: 7.2160 },
  { store_id: "edeka-koeln-1", retailer_group: "edeka", retailer_brand: "EDEKA", regional_company: "EDEKA Rhein-Ruhr", store_name: "EDEKA Köln-Ehrenfeld", street: "Venloer Str. 389", city: "Köln", postal_code: "50825", latitude: 50.9528, longitude: 6.9070 },
  { store_id: "rewecenter-koeln-1", retailer_group: "rewe", retailer_brand: "REWE Center", store_name: "REWE Center Köln-Kalk", street: "Kalker Hauptstr. 55", city: "Köln", postal_code: "51103", latitude: 50.9403, longitude: 6.9950 },
  { store_id: "mueller-koeln-1", retailer_group: "mueller", retailer_brand: "Müller", store_name: "Müller Köln Schildergasse", street: "Schildergasse 88", city: "Köln", postal_code: "50667", latitude: 50.9359, longitude: 6.9520 },
  { store_id: "galeria-koeln-1", retailer_group: "galeria", retailer_brand: "Galeria", store_name: "Galeria Köln", street: "Hohe Str. 41", city: "Köln", postal_code: "50667", latitude: 50.9375, longitude: 6.9573 },
  { store_id: "ecenter-d-1", retailer_group: "edeka", retailer_brand: "E-Center", regional_company: "EDEKA Rhein-Ruhr", store_name: "E-Center Düsseldorf-Bilk", street: "Friedrichstr. 129", city: "Düsseldorf", postal_code: "40217", latitude: 51.2064, longitude: 6.7801 },
  { store_id: "penny-d-1", retailer_group: "penny", retailer_brand: "PENNY", store_name: "PENNY Düsseldorf-Flingern", street: "Birkenstr. 44", city: "Düsseldorf", postal_code: "40233", latitude: 51.2245, longitude: 6.8025 },
  { store_id: "fantasywelt-bn-1", retailer_group: "fantasywelt", retailer_brand: "FantasyWelt", store_name: "FantasyWelt Bonn", street: "Sternstr. 30", city: "Bonn", postal_code: "53111", latitude: 50.7360, longitude: 7.0994 },
  { store_id: "netto-ms-1", retailer_group: "netto_md", retailer_brand: "Netto Marken-Discount", store_name: "Netto MD Münster", street: "Hammer Str. 200", city: "Münster", postal_code: "48153", latitude: 51.9407, longitude: 7.6120 },

  // --- Baden-Württemberg (Ludwigsburg-Fall) -------------------------------
  { store_id: "edeka-lb-1", retailer_group: "edeka", retailer_brand: "EDEKA", regional_company: "EDEKA Südwest", store_name: "EDEKA Scheck-in Ludwigsburg", street: "Schwieberdinger Str. 74", city: "Ludwigsburg", postal_code: "71636", latitude: 48.9040, longitude: 9.1730 },
  { store_id: "scheckin-lb-1", retailer_group: "edeka", retailer_brand: "Scheck-in-Center", regional_company: "EDEKA Südwest", store_name: "Scheck-in-Center Ludwigsburg", street: "Heilbronner Str. 12", city: "Ludwigsburg", postal_code: "71638", latitude: 48.9010, longitude: 9.1955 },
  { store_id: "ecenter-s-1", retailer_group: "edeka", retailer_brand: "E-Center", regional_company: "EDEKA Südwest", store_name: "E-Center Stuttgart-Vaihingen", street: "Industriestr. 3", city: "Stuttgart", postal_code: "70565", latitude: 48.7280, longitude: 9.1120 },
  { store_id: "kaufland-s-1", retailer_group: "kaufland", retailer_brand: "Kaufland", store_name: "Kaufland Stuttgart-Bad Cannstatt", street: "Mercedesstr. 2", city: "Stuttgart", postal_code: "70372", latitude: 48.8060, longitude: 9.2280 },
  { store_id: "gate-s-1", retailer_group: "gate", retailer_brand: "Gate to the Games", store_name: "Gate to the Games Stuttgart", street: "Eberhardstr. 61", city: "Stuttgart", postal_code: "70173", latitude: 48.7710, longitude: 9.1780 },
  { store_id: "mueller-ka-1", retailer_group: "mueller", retailer_brand: "Müller", store_name: "Müller Karlsruhe", street: "Kaiserstr. 179", city: "Karlsruhe", postal_code: "76133", latitude: 49.0094, longitude: 8.3960 },
  { store_id: "marktkauf-ma-1", retailer_group: "edeka", retailer_brand: "Marktkauf", regional_company: "EDEKA Südwest", store_name: "Marktkauf Mannheim", street: "Fressgasse 4", city: "Mannheim", postal_code: "68159", latitude: 49.4880, longitude: 8.4650 },
  { store_id: "smyths-fr-1", retailer_group: "smyths", retailer_brand: "Smyths Toys", store_name: "Smyths Toys Freiburg", street: "Am Bahnhof 1", city: "Freiburg", postal_code: "79098", latitude: 47.9970, longitude: 7.8410 },

  // --- Bayern -------------------------------------------------------------
  { store_id: "kaufland-m-1", retailer_group: "kaufland", retailer_brand: "Kaufland", store_name: "Kaufland München-Riem", street: "Willy-Brandt-Platz 5", city: "München", postal_code: "81829", latitude: 48.1290, longitude: 11.6980 },
  { store_id: "mediamarkt-m-1", retailer_group: "mediamarkt", retailer_brand: "MediaMarkt", store_name: "MediaMarkt München-Euroindustriepark", street: "Otto-Hahn-Ring 6", city: "München", postal_code: "80939", latitude: 48.1980, longitude: 11.5760 },
  { store_id: "games-island-m-1", retailer_group: "games_island", retailer_brand: "Games Island", store_name: "Games Island München", street: "Schwanthalerstr. 32", city: "München", postal_code: "80336", latitude: 48.1370, longitude: 11.5560 },
  { store_id: "edeka-n-1", retailer_group: "edeka", retailer_brand: "EDEKA", regional_company: "EDEKA Nordbayern", store_name: "EDEKA Nürnberg-Mitte", street: "Königstr. 62", city: "Nürnberg", postal_code: "90402", latitude: 49.4480, longitude: 11.0790 },
  { store_id: "rofu-a-1", retailer_group: "rofu", retailer_brand: "ROFU Kinderland", store_name: "ROFU Kinderland Augsburg", street: "Bürgermeister-Ackermann-Str. 15", city: "Augsburg", postal_code: "86150", latitude: 48.3670, longitude: 10.8940 },

  // --- Norddeutschland ----------------------------------------------------
  { store_id: "budni-hh-1", retailer_group: "budni", retailer_brand: "Budni", store_name: "Budni Hamburg-Altona", street: "Ottenser Hauptstr. 10", city: "Hamburg", postal_code: "22765", latitude: 53.5510, longitude: 9.9330 },
  { store_id: "famila-hh-1", retailer_group: "famila", retailer_brand: "famila Nordwest", store_name: "famila Hamburg-Wandsbek", street: "Wandsbeker Marktstr. 73", city: "Hamburg", postal_code: "22041", latitude: 53.5720, longitude: 10.0810 },
  { store_id: "mediamarkt-hh-1", retailer_group: "mediamarkt", retailer_brand: "MediaMarkt", store_name: "MediaMarkt Hamburg-Altona", street: "Große Bergstr. 264", city: "Hamburg", postal_code: "22767", latitude: 53.5490, longitude: 9.9350 },
  { store_id: "famila-ki-1", retailer_group: "famila", retailer_brand: "famila Nordwest", store_name: "famila Kiel", street: "Holstenstr. 74", city: "Kiel", postal_code: "24103", latitude: 54.3230, longitude: 10.1350 },
  { store_id: "netto-hb-1", retailer_group: "netto_md", retailer_brand: "Netto Marken-Discount", store_name: "Netto MD Bremen", street: "Obernstr. 40", city: "Bremen", postal_code: "28195", latitude: 53.0760, longitude: 8.8070 },
  { store_id: "ecenter-h-1", retailer_group: "edeka", retailer_brand: "E-Center", regional_company: "EDEKA Minden-Hannover", store_name: "E-Center Hannover-Linden", street: "Limmerstr. 90", city: "Hannover", postal_code: "30451", latitude: 52.3760, longitude: 9.7100 },

  // --- Osten / Mitte ------------------------------------------------------
  { store_id: "kaufland-b-1", retailer_group: "kaufland", retailer_brand: "Kaufland", store_name: "Kaufland Berlin-Prenzlauer Berg", street: "Storkower Str. 139", city: "Berlin", postal_code: "10407", latitude: 52.5290, longitude: 13.4630 },
  { store_id: "gate-b-1", retailer_group: "gate", retailer_brand: "Gate to the Games", store_name: "Gate to the Games Berlin", street: "Alexanderplatz 7", city: "Berlin", postal_code: "10178", latitude: 52.5219, longitude: 13.4132 },
  { store_id: "mediamarkt-b-1", retailer_group: "mediamarkt", retailer_brand: "MediaMarkt", store_name: "MediaMarkt Berlin-Alexanderplatz", street: "Alexanderplatz 3", city: "Berlin", postal_code: "10178", latitude: 52.5215, longitude: 13.4110 },
  { store_id: "kaufland-l-1", retailer_group: "kaufland", retailer_brand: "Kaufland", store_name: "Kaufland Leipzig-Zentrum", street: "Brühl 1", city: "Leipzig", postal_code: "04109", latitude: 51.3450, longitude: 12.3760 },
  { store_id: "penny-dd-1", retailer_group: "penny", retailer_brand: "PENNY", store_name: "PENNY Dresden-Neustadt", street: "Bautzner Str. 20", city: "Dresden", postal_code: "01099", latitude: 51.0660, longitude: 13.7530 },
  { store_id: "edeka-f-1", retailer_group: "edeka", retailer_brand: "EDEKA", regional_company: "EDEKA Südwest", store_name: "EDEKA Frankfurt-Bornheim", street: "Berger Str. 125", city: "Frankfurt", postal_code: "60385", latitude: 50.1290, longitude: 8.7080 },
  { store_id: "galeria-f-1", retailer_group: "galeria", retailer_brand: "Galeria", store_name: "Galeria Frankfurt an der Hauptwache", street: "Zeil 116", city: "Frankfurt", postal_code: "60313", latitude: 50.1150, longitude: 8.6820 },
];

export const storesById = new Map(stores.map((s) => [s.store_id, s]));

/** Bekannte Nutzer-Standorte fürs Onboarding & den Standort-Picker. */
export const KNOWN_CITIES: {
  name: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}[] = [
  { name: "Oberhausen", postal_code: "46045", latitude: 51.4696, longitude: 6.8514 },
  { name: "Köln", postal_code: "50667", latitude: 50.9375, longitude: 6.9603 },
  { name: "Düsseldorf", postal_code: "40213", latitude: 51.2277, longitude: 6.7735 },
  { name: "Dortmund", postal_code: "44135", latitude: 51.5136, longitude: 7.4653 },
  { name: "Essen", postal_code: "45127", latitude: 51.4556, longitude: 7.0116 },
  { name: "Berlin", postal_code: "10178", latitude: 52.5200, longitude: 13.4050 },
  { name: "Hamburg", postal_code: "20095", latitude: 53.5511, longitude: 9.9937 },
  { name: "München", postal_code: "80331", latitude: 48.1351, longitude: 11.5820 },
  { name: "Frankfurt am Main", postal_code: "60311", latitude: 50.1109, longitude: 8.6821 },
  { name: "Stuttgart", postal_code: "70173", latitude: 48.7758, longitude: 9.1829 },
  { name: "Ludwigsburg", postal_code: "71634", latitude: 48.8976, longitude: 9.1916 },
  { name: "Leipzig", postal_code: "04109", latitude: 51.3397, longitude: 12.3731 },
  { name: "Dresden", postal_code: "01067", latitude: 51.0504, longitude: 13.7373 },
  { name: "Hannover", postal_code: "30159", latitude: 52.3759, longitude: 9.7320 },
  { name: "Nürnberg", postal_code: "90402", latitude: 49.4521, longitude: 11.0767 },
  { name: "Bremen", postal_code: "28195", latitude: 53.0793, longitude: 8.8017 },
  { name: "Kiel", postal_code: "24103", latitude: 54.3233, longitude: 10.1228 },
];
