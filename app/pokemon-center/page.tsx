"use client";

import { Store, TrendingUp, RefreshCw } from "lucide-react";
import * as React from "react";
import { allDrops } from "@/lib/data";
import { useDatasetVersion } from "@/lib/dataset";
import { LiveDropCard } from "@/components/live-drop-card";
import { PageHeader } from "@/components/page-header";
import { SectionHeading, EmptyState } from "@/components/section";
import { AlertDemoButton } from "@/components/alert-demo";

export default function PokemonCenterPage() {
  const dataVersion = useDatasetVersion();
  // dataVersion ist bewusst der Ausloeser: die Daten kommen ueber eine
  // Modulreferenz, nicht als Argument.
  /* eslint-disable react-hooks/exhaustive-deps */
  const pcDrops = React.useMemo(
    () => allDrops().filter((d) => d.isPokemonCenter),
    [dataVersion],
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  const restocks = pcDrops.filter((d) => d.kind === "restock");
  const drops = pcDrops.filter((d) => d.kind !== "restock");

  return (
    <div className="space-y-5">
      <PageHeader
        live
        accent="var(--heat-1)"
        status="Offizielle Quelle"
        title="Pokémon Center"
        subtitle="Restocks und neue Produkte mit erhöhter Priorität. Ausverkauft → wieder da wird als eigener Restock erkannt."
        action={<AlertDemoButton />}
      />

      <div className="grid grid-cols-3 gap-2.5">
        <StatBox icon={<RefreshCw className="h-4 w-4" />} label="Restocks (24h)" value={restocks.length + 5} />
        <StatBox icon={<TrendingUp className="h-4 w-4" />} label="Neue Produkte" value={drops.length + 2} />
        <StatBox icon={<Store className="h-4 w-4" />} label="Beobachtet" value={48} />
      </div>

      <section>
        <SectionHeading title="Aktuelle Restocks" subtitle="Wieder verfügbar" icon={<RefreshCw className="h-4 w-4" />} />
        {restocks.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {restocks.map((d, i) => (
              <LiveDropCard key={d.drop_id} drop={d} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState emoji="📦" title="Aktuell keine Restocks" hint="Sobald ein Produkt wieder verfügbar ist, erscheint es hier – und als Push für Premium." />
        )}
      </section>

      <section>
        <SectionHeading title="Neue Drops & Produkte" icon={<TrendingUp className="h-4 w-4" />} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {drops.map((d, i) => (
            <LiveDropCard key={d.drop_id} drop={d} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 text-center shadow-card">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
        {icon}
      </div>
      <p className="mt-2 font-display text-xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
