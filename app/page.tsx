"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { useDatasetVersion } from "@/lib/dataset";
import { getDealViews, getEventsInRadius, allDrops, allRumors } from "@/lib/data";
import {
  DEAL_CATEGORIES,
  DISCOVER_TILES,
  MY_TILES,
  countByCategory,
  matchesCategory,
} from "@/lib/categories";

import { DealCard } from "@/components/deal-card";
import { LocationRadius } from "@/components/location-radius";
import { CategoryTile, TileGroup } from "@/components/category-tile";
import { PageHeader } from "@/components/page-header";
import { EmptyState, DealCardSkeleton } from "@/components/section";
import { Button } from "@/components/ui/button";

/**
 * Startseite = Übersicht, kein endloser Angebotsstrom.
 *
 * Vorher scrollte man auf dem Handy durch alle 80 Angebote, bevor man
 * überhaupt sah, was die App sonst noch kann. Jetzt steht oben, wo man
 * sucht, darunter Kacheln pro Kategorie mit Zahl, ganz unten die drei
 * besten Angebote als Kostprobe. Alles Weitere ist einen Tipp entfernt.
 */
export default function HomePage() {
  const mounted = useMounted();
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const watchlistCount = usePokeStore((s) => s.watchlist.length);
  const portfolioCount = usePokeStore((s) => s.portfolio.length);
  const setDealCategory = usePokeStore((s) => s.setDealCategory);
  const dataVersion = useDatasetVersion();

  /* eslint-disable react-hooks/exhaustive-deps */
  const views = React.useMemo(() => {
    if (!mounted) return [];
    return getDealViews(location, radiusKm);
  }, [mounted, location, radiusKm, dataVersion]);

  const eventCount = React.useMemo(() => {
    if (!mounted) return 0;
    return getEventsInRadius(location, radiusKm).length;
  }, [mounted, location, radiusKm, dataVersion]);

  // dataVersion ist bewusst der Ausloeser: die Daten kommen ueber eine
  // Modulreferenz, nicht als Argument.
  const dropCount = React.useMemo(() => allDrops().length, [dataVersion]);
  const rumorCount = React.useMemo(() => allRumors().length, [dataVersion]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const counts = React.useMemo(() => countByCategory(views), [views]);
  const best = React.useMemo(
    () =>
      (views.filter((v) => matchesCategory(v, "top")).length >= 3
        ? views.filter((v) => matchesCategory(v, "top"))
        : views
      ).slice(0, 3),
    [views],
  );

  const discoverCounts: Record<string, number | undefined> = {
    "/live": dropCount,
    "/events": mounted ? eventCount : undefined,
    "/rumors": rumorCount,
    "/pokemon-center": undefined,
  };
  const myCounts: Record<string, number | undefined> = {
    "/watchlist": mounted ? watchlistCount : undefined,
    "/portfolio": mounted ? portfolioCount : undefined,
    "/scanner": undefined,
    "/premium": undefined,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        status="Radar aktiv"
        live
        title="Was gibt es in deiner Nähe?"
        subtitle="Jede Kachel zeigt, wie viel es gerade gibt."
      />

      {/* Wo gesucht wird – steht ganz oben, weil alle Zahlen davon abhängen */}
      <LocationRadius variant="bar" />

      <TileGroup title="Angebote">
        {DEAL_CATEGORIES.map((c, i) => (
          <CategoryTile
            key={c.id}
            href="/deals"
            icon={c.icon}
            label={c.label}
            hint={c.hint}
            count={mounted ? counts[c.id] : undefined}
            accent={c.accent}
            index={i}
            onNavigate={() => setDealCategory(c.id)}
          />
        ))}
      </TileGroup>

      <TileGroup title="Entdecken">
        {DISCOVER_TILES.map((t, i) => (
          <CategoryTile
            key={t.href}
            href={t.href}
            icon={t.icon}
            label={t.label}
            hint={t.hint}
            count={discoverCounts[t.href]}
            accent={t.accent}
            index={i}
          />
        ))}
      </TileGroup>

      <TileGroup title="Meine Sachen">
        {MY_TILES.map((t, i) => (
          <CategoryTile
            key={t.href}
            href={t.href}
            icon={t.icon}
            label={t.label}
            hint={t.hint}
            count={myCounts[t.href]}
            accent={t.accent}
            index={i}
          />
        ))}
      </TileGroup>

      {/* Kostprobe: drei Angebote, nicht achtzig */}
      <section>
        <div className="mb-2 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Flame className="h-3.5 w-3.5" style={{ color: "var(--heat-4)" }} />
              Beste Angebote gerade
            </h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {mounted ? location.name : "…"} · {radiusKm} km Umkreis
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/deals" onClick={() => setDealCategory("alle")}>
              Alle <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {!mounted ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        ) : best.length === 0 ? (
          <EmptyState
            title="Keine Angebote im aktuellen Radius"
            hint="Stelle den Umkreis oben größer – zum Beispiel auf 300 km."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {best.map((v, i) => (
                <DealCard key={v.offer.offer_id} view={v} index={i} />
              ))}
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link href="/deals" onClick={() => setDealCategory("alle")}>
                Alle {counts.alle} Angebote ansehen
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
