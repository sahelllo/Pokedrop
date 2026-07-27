"use client";

import * as React from "react";
import { Crosshair, MapPin, Search } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { KNOWN_CITIES } from "@/data/stores";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

const RADIUS_PRESETS = [10, 50, 100, 300, 500];

/**
 * Standort + Umkreis.
 *
 * `variant="card"` – volle Karte mit Schieberegler (Detailseiten).
 * `variant="bar"`  – schlanke Leiste ohne Schieberegler, nur die fünf
 *   üblichen Umkreise als Knöpfe. Auf dem Handy ist das schneller zu
 *   bedienen als ein Regler, den man millimetergenau treffen muss.
 */
export function LocationRadius({
  compact = false,
  variant = "card",
}: {
  compact?: boolean;
  variant?: "card" | "bar";
}) {
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const setLocation = usePokeStore((s) => s.setLocation);
  const setRadius = usePokeStore((s) => s.setRadius);
  const { push } = useToast();

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [locating, setLocating] = React.useState(false);

  const filtered = KNOWN_CITIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.postal_code.startsWith(query),
  );

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      push({ title: "Standort nicht verfügbar", kind: "info" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Nächste bekannte Stadt als Label bestimmen.
        const nearest = KNOWN_CITIES.map((c) => ({
          c,
          d: Math.hypot(c.latitude - pos.coords.latitude, c.longitude - pos.coords.longitude),
        })).sort((a, b) => a.d - b.d)[0];
        setLocation({
          name: `Mein Standort (nahe ${nearest.c.name})`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
        setOpen(false);
        push({ title: "Standort übernommen", kind: "success" });
      },
      () => {
        setLocating(false);
        push({ title: "Standortfreigabe verweigert", description: "Wähle stattdessen eine Stadt.", kind: "info" });
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const bar = variant === "bar";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-4 shadow-card",
        compact && "p-3",
        bar && "gap-2.5 p-3",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="group flex min-w-0 items-center gap-2 text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                  Dein Standort
                </span>
                <span className="block truncate font-display text-sm font-semibold group-hover:text-primary">
                  {location.name}
                </span>
              </span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Standort wählen</DialogTitle>
            </DialogHeader>
            <Button variant="outline" onClick={useMyLocation} disabled={locating} className="justify-start">
              <Crosshair className="h-4 w-4" />
              {locating ? "Ortung läuft…" : "Meinen Standort verwenden"}
            </Button>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Stadt oder PLZ…"
                className="pl-10"
              />
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {filtered.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setLocation({ name: c.name, postal_code: c.postal_code, latitude: c.latitude, longitude: c.longitude });
                    setOpen(false);
                    push({ title: `Standort: ${c.name}`, kind: "success" });
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-surface-2"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {c.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{c.postal_code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Keine Treffer. In der Vollversion sind alle deutschen PLZ hinterlegt.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="shrink-0 text-right">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Umkreis
          </span>
          <span className="font-mono text-lg font-bold tabular-nums text-primary">
            {radiusKm} km
          </span>
        </div>
      </div>

      {!bar && (
        <Slider
          value={[radiusKm]}
          min={5}
          max={500}
          step={5}
          onValueChange={(v) => setRadius(v[0])}
          aria-label="Suchradius"
        />
      )}
      <div className="flex flex-wrap gap-1.5">
        {RADIUS_PRESETS.map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            aria-pressed={radiusKm === r}
            className={cn(
              "rounded-full font-mono text-xs font-semibold tabular-nums transition",
              bar ? "min-w-0 flex-1 px-2 py-2" : "px-3 py-1",
              radiusKm === r
                ? "bg-primary text-primary-foreground"
                : "bg-surface-2 text-muted-foreground hover:text-foreground",
            )}
          >
            {r} km
          </button>
        ))}
      </div>
    </div>
  );
}
