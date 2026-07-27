"use client";

import * as React from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useDatasetState } from "@/lib/dataset";
import { fetchLiveDataset } from "@/lib/live-data";

/**
 * Lädt nach dem ersten Rendern die echten Daten aus Supabase und ersetzt
 * damit die Seed-Daten. Läuft genau einmal und ist bewusst still: schlägt
 * etwas fehl, bleibt die App auf den Demo-Daten und funktioniert weiter.
 */
export function DatasetLoader() {
  const applyDataset = useDatasetState((s) => s.applyDataset);
  const setLoading = useDatasetState((s) => s.setLoading);
  const setError = useDatasetState((s) => s.setError);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current || !isSupabaseConfigured) return;
    started.current = true;

    setLoading(true);
    fetchLiveDataset()
      .then((dataset) => {
        if (dataset) applyDataset(dataset, "db");
        else setError("Datenbank lieferte keine verwertbaren Daten");
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Unbekannter Fehler"));
  }, [applyDataset, setLoading, setError]);

  return null;
}
