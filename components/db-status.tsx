"use client";

import * as React from "react";
import { Database, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabaseStatus } from "@/lib/supabase";
import { pingSupabase } from "@/lib/remote-data";
import { useMounted } from "@/lib/use-mounted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Zeigt in den Einstellungen an, ob eine echte Datenbank verbunden ist,
 * und erlaubt einen Verbindungstest.
 */
export function DbStatus() {
  const mounted = useMounted();
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);
  const [testing, setTesting] = React.useState(false);

  if (!mounted) return null;
  const status = supabaseStatus();

  async function test() {
    setTesting(true);
    setResult(await pingSupabase());
    setTesting(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              status.connected ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted-foreground",
            )}
          >
            <Database className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Datenquelle</p>
            <p className="text-xs text-muted-foreground">
              {status.label}
              {status.host && <> · {status.host}</>}
            </p>
          </div>
        </div>
        {status.connected && (
          <Button size="sm" variant="outline" onClick={test} disabled={testing}>
            {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Testen
          </Button>
        )}
      </div>

      {!status.connected && (
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
          Die App läuft aktuell auf Demo-Daten. Zum Verbinden in Supabase ein Projekt anlegen,
          die Migrationen aus <code className="font-mono">db/migrations/</code> ausführen und die
          beiden Variablen aus <code className="font-mono">.env.example</code> setzen.
        </p>
      )}

      {result && (
        <p
          className={cn(
            "mt-3 flex items-start gap-1.5 rounded-xl px-3 py-2 text-xs",
            result.ok ? "bg-primary/10 text-primary" : "bg-[color-mix(in_srgb,var(--heat-4)_10%,transparent)] text-[var(--heat-4)]",
          )}
        >
          {result.ok ? (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          {result.message}
        </p>
      )}
    </div>
  );
}
