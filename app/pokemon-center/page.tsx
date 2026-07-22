"use client";

import { Store, TrendingUp, RefreshCw } from "lucide-react";
import { liveDrops } from "@/data/drops";
import { LiveDropCard } from "@/components/live-drop-card";
import { SectionHeading, EmptyState } from "@/components/section";
import { AlertDemoButton } from "@/components/alert-demo";

export default function PokemonCenterPage() {
  const pcDrops = liveDrops
    .filter((d) => d.isPokemonCenter)
    .sort((a, b) => a.minutes_ago - b.minutes_ago);

  const restocks = pcDrops.filter((d) => d.kind === "restock");
  const drops = pcDrops.filter((d) => d.kind !== "restock");

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-poke-yellow/30 bg-gradient-to-br from-poke-yellow/10 via-card to-card p-5 shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-poke-yellow/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-poke-yellow/20 px-2.5 py-0.5 text-xs font-bold text-poke-yellow">
              <Store className="h-3.5 w-3.5" /> Offizielle Drop-Quelle
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold">Pokémon Center Monitoring</h1>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Restocks, neue Produkte und Verfügbarkeitswechsel – mit erhöhter Priorität für
              begehrte Artikel. Ausverkauft → wieder verfügbar wird als eigener Restock erkannt.
            </p>
          </div>
          <AlertDemoButton />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <StatBox icon={<RefreshCw className="h-4 w-4" />} label="Restocks (24h)" value={restocks.length + 5} />
        <StatBox icon={<TrendingUp className="h-4 w-4" />} label="Neue Produkte" value={drops.length + 2} />
        <StatBox icon={<Store className="h-4 w-4" />} label="Beobachtet" value={48} />
      </div>

      <section>
        <SectionHeading title="Aktuelle Restocks" subtitle="Wieder verfügbar" icon={<RefreshCw className="h-4 w-4" />} />
        {restocks.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="grid gap-3 sm:grid-cols-2">
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
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-poke-yellow/15 text-poke-yellow">
        {icon}
      </div>
      <p className="mt-2 font-display text-xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
