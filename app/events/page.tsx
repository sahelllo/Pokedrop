"use client";

import * as React from "react";
import { Calendar, List, Map as MapIcon, Repeat } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { useDatasetVersion } from "@/lib/dataset";
import { getEventsInRadius, allEventTypes, type EventFilters } from "@/lib/data";
import { EventCard } from "@/components/event-card";
import { EventCalendar } from "@/components/event-calendar";
import { LocationRadius } from "@/components/location-radius";
import { PageHeader } from "@/components/page-header";
import { SectionHeading, EmptyState } from "@/components/section";
import { DynamicMap, type MapMarker } from "@/components/map/dynamic-map";
import { cn } from "@/lib/utils";

const WINDOWS: { value: EventFilters["window"] | "all"; label: string }[] = [
  { value: "all", label: "Alle kommenden" },
  { value: "weekend", label: "Dieses Wochenende" },
  { value: "next30", label: "Nächste 30 Tage" },
];

export default function EventsPage() {
  const mounted = useMounted();
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);

  const [view, setView] = React.useState<"list" | "calendar" | "map">("list");
  const [windowSel, setWindowSel] = React.useState<EventFilters["window"] | "all">("all");
  const [types, setTypes] = React.useState<string[]>([]);
  const [onlyTrading, setOnlyTrading] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const dataVersion = useDatasetVersion();
  // dataVersion ist bewusst der Ausloeser: die Daten kommen ueber eine
  // Modulreferenz, nicht als Argument.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventTypes = React.useMemo(() => allEventTypes(), [dataVersion]);

  /* eslint-disable react-hooks/exhaustive-deps */
  const events = React.useMemo(() => {
    if (!mounted) return [];
    return getEventsInRadius(location, radiusKm, {
      window: windowSel === "all" ? undefined : windowSel,
      types: types.length ? types : undefined,
      onlyTrading,
    });
  }, [mounted, location, radiusKm, windowSel, types, onlyTrading, dataVersion]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const shown = selectedDay
    ? events.filter((e) => e.date_start.slice(0, 10) === selectedDay)
    : events;

  const markers: MapMarker[] = events.map((e) => ({
    id: e.event_id,
    lat: e.latitude,
    lng: e.longitude,
    title: e.event_name,
    subtitle: `${e.city} · ${e.event_type}`,
    color: "#00ff8c",
    emoji: "📅",
  }));

  function toggleType(t: string) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <div className="space-y-5">
      <PageHeader
        status="Event-Ortung"
        title="Tauschbörsen & Card Shows"
        subtitle="Alle Pokémon-TCG-Veranstaltungen in deinem Umkreis – als Liste, Kalender oder Karte."
      />

      <LocationRadius />

      {/* View-Umschalter */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-full bg-surface-2 p-1">
          {[
            { v: "list", icon: List, label: "Liste" },
            { v: "calendar", icon: Calendar, label: "Kalender" },
            { v: "map", icon: MapIcon, label: "Karte" },
          ].map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.v}
                onClick={() => setView(o.v as typeof view)}
                // Auf schmalen Viewports ist nur das Icon sichtbar – der
                // Button braucht trotzdem einen Namen für Screenreader.
                aria-label={o.label}
                aria-pressed={view === o.v}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                  view === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{o.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{events.length}</span> Events im Radius
        </p>
      </div>

      {/* Filter */}
      <div className="space-y-2.5 rounded-2xl border border-border bg-card p-3 shadow-card">
        <div className="flex flex-wrap gap-1.5">
          {WINDOWS.map((w) => (
            <button
              key={w.value}
              onClick={() => setWindowSel(w.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                windowSel === w.value
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border bg-surface/60 text-muted-foreground",
              )}
            >
              {w.label}
            </button>
          ))}
          <button
            onClick={() => setOnlyTrading((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition",
              onlyTrading
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border bg-surface/60 text-muted-foreground",
            )}
          >
            <Repeat className="h-3 w-3" /> Nur Tauschen
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {eventTypes.map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition",
                types.includes(t)
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border bg-surface/60 text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ansichten */}
      {!mounted ? (
        <EmptyState emoji="⏳" title="Lädt…" />
      ) : view === "map" ? (
        <DynamicMap center={[location.latitude, location.longitude]} radiusKm={radiusKm} markers={markers} />
      ) : view === "calendar" ? (
        <div className="space-y-4">
          <EventCalendar events={events} onSelectDay={(iso) => setSelectedDay(iso)} />
          {selectedDay && (
            <div>
              <SectionHeading
                title={`Events am ${new Date(selectedDay).toLocaleDateString("de-DE", { day: "numeric", month: "long" })}`}
                action={
                  <button onClick={() => setSelectedDay(null)} className="text-xs text-muted-foreground hover:text-foreground">
                    Alle anzeigen
                  </button>
                }
              />
              <div className="grid gap-3">
                {shown.map((e, i) => (
                  <EventCard key={e.event_id} event={e} distanceKm={e.distanceKm} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : events.length === 0 ? (
        <EmptyState emoji="📅" title="Keine Events im Radius" hint="Erweitere den Umkreis oder ändere die Filter." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shown.map((e, i) => (
            <EventCard key={e.event_id} event={e} distanceKm={e.distanceKm} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
