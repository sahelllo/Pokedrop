"use client";

import * as React from "react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { useDatasetVersion } from "@/lib/dataset";
import { getDealViews, type DealFilters } from "@/lib/data";
import { ALL_CATEGORY_CHIPS, countByCategory, matchesCategory } from "@/lib/categories";

import { DealCard } from "@/components/deal-card";
import { FilterBar } from "@/components/filter-bar";
import { LocationRadius } from "@/components/location-radius";
import { PageHeader } from "@/components/page-header";
import { EmptyState, DealCardSkeleton } from "@/components/section";
import { cn } from "@/lib/utils";

/**
 * Angebotsseite: die vollständige Liste.
 *
 * Sie lag früher auf der Startseite und hat sie überladen. Oben stehen
 * jetzt die Kategorien als Reihe von Knöpfen – dieselben wie die Kacheln
 * auf der Startseite, damit man sich nicht neu orientieren muss.
 */
export default function DealsPage() {
  const mounted = useMounted();
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const category = usePokeStore((s) => s.dealCategory);
  const setCategory = usePokeStore((s) => s.setDealCategory);
  const [filters, setFilters] = React.useState<DealFilters>({});
  const dataVersion = useDatasetVersion();

  // dataVersion ist bewusst der Ausloeser: die Daten kommen ueber eine
  // Modulreferenz, nicht als Argument.
  /* eslint-disable react-hooks/exhaustive-deps */
  const all = React.useMemo(() => {
    if (!mounted) return [];
    return getDealViews(location, radiusKm, filters);
  }, [mounted, location, radiusKm, filters, dataVersion]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const counts = React.useMemo(() => countByCategory(all), [all]);
  const views = React.useMemo(
    () => all.filter((v) => matchesCategory(v, category)),
    [all, category],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        status="Angebote im Umkreis"
        title="Alle Angebote"
        subtitle="Das Beste steht oben."
      />

      <LocationRadius variant="bar" />

      {/* Kategorien als Knopfreihe */}
      <div className="-mx-4 overflow-x-auto px-4 no-scrollbar">
        <div className="flex w-max gap-2" role="group" aria-label="Kategorie">
          {ALL_CATEGORY_CHIPS.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                aria-pressed={active}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition",
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
                <span className="font-mono tabular-nums opacity-70">
                  {mounted ? counts[c.id] : "–"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} resultCount={views.length} />

      {!mounted ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <DealCardSkeleton key={i} />
          ))}
        </div>
      ) : views.length === 0 ? (
        <EmptyState
          title="Keine Angebote in dieser Kategorie"
          hint="Wähle oben „Alle“, vergrößere den Umkreis oder setze die Filter zurück."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {views.map((v, i) => (
            <DealCard key={v.offer.offer_id} view={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
