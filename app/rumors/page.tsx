"use client";

import * as React from "react";
import { Radar, AlertTriangle } from "lucide-react";
import { allRumors } from "@/lib/data";
import { useDatasetVersion } from "@/lib/dataset";
import { RumorCard } from "@/components/rumor-card";
import { PageHeader } from "@/components/page-header";
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
  const dataVersion = useDatasetVersion();
  // dataVersion ist bewusst der Ausloeser: die Daten kommen ueber eine
  // Modulreferenz, nicht als Argument.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sorted = React.useMemo(() => allRumors(), [dataVersion]);

  return (
    <div className="space-y-5">
      <PageHeader
        accent="var(--heat-1)"
        status="Frühwarn-Kanal"
        title="Gerüchte & frühe Hinweise"
        subtitle="Mögliche kommende Drops aus Social Media und Community – strikt getrennt vom geprüften Feed."
      />

      {/* Wichtiger Trennungs-Hinweis */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--heat-1)_35%,transparent)] bg-[color-mix(in_srgb,var(--heat-1)_6%,transparent)] p-3.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--heat-1)]" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Nicht bestätigt.</span> Diese Hinweise
          sind ein zusätzlicher Frühwarnkanal – keine Tatsachen. Erst mit Status{" "}
          <span className="font-semibold text-primary">CONFIRMED</span> wandert ein Hinweis in
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
