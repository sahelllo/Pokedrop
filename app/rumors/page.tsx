"use client";

import * as React from "react";
import { Radar, AlertTriangle } from "lucide-react";
import { rumors } from "@/data/rumors";
import { RumorCard } from "@/components/rumor-card";
import { SectionHeading } from "@/components/section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { RumorStatus } from "@/types";

const FILTERS: { value: string; label: string; match?: RumorStatus[] }[] = [
  { value: "all", label: "Alle" },
  { value: "confirmed", label: "Bestätigt", match: ["CONFIRMED"] },
  { value: "likely", label: "Wahrscheinlich", match: ["LIKELY"] },
  { value: "rumor", label: "Gerüchte", match: ["RUMOR", "MULTI_SOURCE_RUMOR"] },
];

export default function RumorsPage() {
  const sorted = [...rumors].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 shadow-card">
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">
            <Radar className="h-3.5 w-3.5" /> Frühwarn-Radar
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold">Gerüchte & frühe Hinweise</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Mögliche kommende Drops aus Social Media und Community – klar getrennt vom
            verifizierten Deal-Feed.
          </p>
        </div>
      </div>

      {/* Wichtiger Trennungs-Hinweis */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-3.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Nicht bestätigt.</span> Diese Hinweise
          sind ein zusätzlicher Frühwarnkanal – keine Tatsachen. Erst mit Status{" "}
          <span className="font-semibold text-emerald-400">CONFIRMED</span> wandert ein Hinweis in
          den regulären Deal-/Drop-Bereich.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar sm:w-auto">
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {FILTERS.map((f) => {
          const items = f.match ? sorted.filter((r) => f.match!.includes(r.status)) : sorted;
          return (
            <TabsContent key={f.value} value={f.value}>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((r, i) => (
                  <RumorCard key={r.rumor_id} rumor={r} index={i} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
