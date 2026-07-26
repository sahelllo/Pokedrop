import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Coords } from "@/lib/geo";

/**
 * Live-Abfragen gegen Supabase.
 *
 * Jede Funktion gibt `null` zurück, wenn keine Datenbank konfiguriert ist
 * oder die Abfrage fehlschlägt – die aufrufende Stelle fällt dann sauber auf
 * die Seed-Daten zurück. Die App bleibt dadurch immer funktionsfähig.
 */

export interface RemoteOfferRow {
  offer_id: string;
  product_id: string;
  price: number;
  badge: string | null;
  distance_km: number | null;
  nearest_location_id: string | null;
}

export interface RemoteEventRow {
  event_id: string;
  event_name: string;
  city: string;
  date_start: string;
  distance_km: number;
}

/**
 * Angebote im Umkreis – nutzt die SQL-Funktion offers_within_radius(),
 * die die Regionalitätslogik (nächste teilnehmende Filiale) serverseitig
 * in PostGIS abbildet.
 */
export async function fetchOffersWithinRadius(
  user: Coords,
  radiusKm: number,
): Promise<RemoteOfferRow[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("offers_within_radius", {
    user_lat: user.latitude,
    user_lng: user.longitude,
    radius_km: radiusKm,
  });

  if (error) {
    console.warn("[PokeDrop] Supabase-Abfrage fehlgeschlagen, nutze Seed-Daten:", error.message);
    return null;
  }
  return (data ?? []) as RemoteOfferRow[];
}

/** Events im Umkreis über events_within_radius(). */
export async function fetchEventsWithinRadius(
  user: Coords,
  radiusKm: number,
): Promise<RemoteEventRow[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("events_within_radius", {
    user_lat: user.latitude,
    user_lng: user.longitude,
    radius_km: radiusKm,
  });

  if (error) {
    console.warn("[PokeDrop] Supabase-Events fehlgeschlagen, nutze Seed-Daten:", error.message);
    return null;
  }
  return (data ?? []) as RemoteEventRow[];
}

/** Verbindungstest für die Einstellungen-Seite. */
export async function pingSupabase(): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Keine Datenbank konfiguriert – App läuft auf Demo-Daten." };
  }
  const supabase = getSupabase()!;
  const { error, count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (error) {
    return { ok: false, message: `Verbindung fehlgeschlagen: ${error.message}` };
  }
  return { ok: true, message: `Verbunden – ${count ?? 0} Produkte in der Datenbank.` };
}
