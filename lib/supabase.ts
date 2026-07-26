import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase-Anbindung – optional.
 *
 * Sind die beiden öffentlichen Umgebungsvariablen gesetzt, spricht die App
 * direkt aus dem Browser mit Supabase (REST + PostgREST). Das funktioniert
 * auch beim statischen Export auf GitHub Pages, weil kein Server nötig ist.
 * Geschützt wird der Zugriff durch die Row Level Security aus
 * db/migrations/0002_views_rls.sql.
 *
 * Fehlen die Variablen, bleibt der Client `null` und die App läuft
 * unverändert auf den typisierten Seed-Daten in /data weiter.
 *
 * WICHTIG: Hier gehört ausschließlich der öffentliche `anon`-Key hin.
 * Der `service_role`-Key darf niemals ins Frontend.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
      global: { headers: { "x-application-name": "pokedrop" } },
    });
  }
  return client;
}

/** Kurzer Statustext für die Einstellungen-Seite. */
export function supabaseStatus(): { connected: boolean; label: string; host?: string } {
  if (!isSupabaseConfigured) {
    return { connected: false, label: "Demo-Daten (keine Datenbank verbunden)" };
  }
  let host: string | undefined;
  try {
    host = new URL(url!).host;
  } catch {
    host = undefined;
  }
  return { connected: true, label: "Mit Supabase verbunden", host };
}
