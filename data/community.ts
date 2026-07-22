/**
 * Community-Signale für den "vielbenutzt"-Eindruck (Abschnitt 7).
 * Klar erkennbare Demo-/Seed-Daten.
 */

export interface ActivityItem {
  id: string;
  emoji: string;
  text: string;
  city: string;
  minutes_ago: number;
}

export const activityTicker: ActivityItem[] = [
  { id: "a1", emoji: "🔥", text: "Dunkelnacht-Display für 149 € gefunden", city: "Duisburg", minutes_ago: 1 },
  { id: "a2", emoji: "🟢", text: "Reisegefährten-ETB unter UVP entdeckt", city: "Ludwigsburg", minutes_ago: 3 },
  { id: "a3", emoji: "⚡", text: "Pokémon-Center-Restock: 151 UPC", city: "Online", minutes_ago: 6 },
  { id: "a4", emoji: "✅", text: "Obsidianflammen-ETB unter Deal-Schwelle", city: "Dortmund", minutes_ago: 9 },
  { id: "a5", emoji: "🔥", text: "Mega-Forces-Tin für 18,99 € gemeldet", city: "Stuttgart", minutes_ago: 12 },
  { id: "a6", emoji: "🟢", text: "Zeitlose-Rivalen-Blister zur Bestpreis", city: "Essen", minutes_ago: 15 },
  { id: "a7", emoji: "📅", text: "Neue Tauschbörse eingetragen", city: "Berlin", minutes_ago: 18 },
  { id: "a8", emoji: "🔥", text: "Verlorener-Ursprung-Display 219 € (−27 %)", city: "Online", minutes_ago: 22 },
  { id: "a9", emoji: "✅", text: "Paldeas-Schicksale-ETB als guter Deal bestätigt", city: "Mannheim", minutes_ago: 27 },
  { id: "a10", emoji: "🟢", text: "FPC3 für 31,99 € entdeckt", city: "Düsseldorf", minutes_ago: 31 },
  { id: "a11", emoji: "⚡", text: "Pokémon-Center-Drop: Dunkelnacht-Display", city: "Online", minutes_ago: 41 },
  { id: "a12", emoji: "🔥", text: "Celebrations-ETB für 94,90 € gemeldet", city: "Dortmund", minutes_ago: 48 },
];

export const communityStats = {
  activeUsers: 18420,
  dealsToday: 214,
  savedEuroTotal: 128940,
  premiumMembers: 2360,
  watchedStores: 640,
  eventsTracked: 132,
};

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  city: string;
  avatarSeed: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Jan K.", handle: "@jan.collects", city: "Köln", avatarSeed: 6, text: "Hab meine Dunkelnacht-ETB dank Smart Local Alert 12 € unter UVP im Nachbarort abgegriffen. Wahnsinn." },
  { id: "t2", name: "Melis A.", handle: "@melis.tcg", city: "Hamburg", avatarSeed: 700, text: "Der Gerüchte-Bereich ist Gold wert – ich war beim 151-Restock als eine der Ersten dran." },
  { id: "t3", name: "Tobias R.", handle: "@tobi.pulls", city: "München", avatarSeed: 448, text: "Endlich ein Radar, der wirklich zeigt, wo es lokal was gibt. Der Ludwigsburg-Fund war 340 km weg – und hat sich gelohnt." },
  { id: "t4", name: "Sarah W.", handle: "@sarah.pokemom", city: "Leipzig", avatarSeed: 133, text: "Nutze PokeDrop für die Events – die Kalenderfunktion hat mir schon zwei Tauschbörsen gerettet." },
  { id: "t5", name: "Deniz Y.", handle: "@deniz.deals", city: "Stuttgart", avatarSeed: 384, text: "Premium ist die 4,99 € locker wert. Instant Alerts sind echt instant." },
  { id: "t6", name: "Lena M.", handle: "@lena.cardart", city: "Berlin", avatarSeed: 282, text: "Die Deal-Bewertung mit UVP vs. Marktpreis erklärt endlich, ob ein alter Set-Preis fair ist." },
];

export const featuredIn = ["PokéMag", "TCG Weekly", "CardHype", "Sammler-News", "DropWatch DE"];
