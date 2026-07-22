"use client";

import * as React from "react";
import { Zap, Flame } from "lucide-react";
import { liveDrops } from "@/data/drops";
import { LiveDropCard } from "@/components/live-drop-card";
import { SectionHeading } from "@/components/section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDemoButton } from "@/components/alert-demo";

export default function LivePage() {
  const sorted = [...liveDrops].sort((a, b) => a.minutes_ago - b.minutes_ago);
  const drops = sorted.filter((d) => d.kind === "drop");
  const restocks = sorted.filter((d) => d.kind === "restock");
  const news = sorted.filter((d) => d.kind === "new_product");

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-secondary/30 bg-gradient-to-br from-secondary/10 via-card to-card p-5 shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-bold text-secondary">
              <span className="h-2 w-2 animate-pulse-live rounded-full bg-secondary" /> LIVE
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold">Live Drops & Restocks</h1>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Neue Verfügbarkeiten in Echtzeit – Pokémon Center und große Online-Händler.
              Free: Live-Bereich sehen. Premium: sofortige Push-Alerts.
            </p>
          </div>
          <AlertDemoButton />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar sm:w-auto">
          <TabsTrigger value="all">Alle ({sorted.length})</TabsTrigger>
          <TabsTrigger value="drops">Drops ({drops.length})</TabsTrigger>
          <TabsTrigger value="restocks">Restocks ({restocks.length})</TabsTrigger>
          <TabsTrigger value="new">Neu ({news.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DropList items={sorted} />
        </TabsContent>
        <TabsContent value="drops">
          <DropList items={drops} />
        </TabsContent>
        <TabsContent value="restocks">
          <DropList items={restocks} />
        </TabsContent>
        <TabsContent value="new">
          <DropList items={news} />
        </TabsContent>
      </Tabs>

      <section>
        <SectionHeading
          title="Besonders begehrt"
          subtitle="Erhöhte Überwachungspriorität"
          icon={<Flame className="h-4 w-4" />}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sorted
            .filter((d) => d.hot)
            .map((d, i) => (
              <LiveDropCard key={d.drop_id} drop={d} index={i} />
            ))}
        </div>
      </section>
    </div>
  );
}

function DropList({ items }: { items: typeof liveDrops }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((d, i) => (
        <LiveDropCard key={d.drop_id} drop={d} index={i} />
      ))}
    </div>
  );
}
