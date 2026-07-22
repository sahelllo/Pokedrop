"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PokeEvent } from "@/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

/** Monatskalender mit markierten Event-Tagen (Masterliste 19.5). */
export function EventCalendar({
  events,
  onSelectDay,
}: {
  events: (PokeEvent & { distanceKm: number })[];
  onSelectDay?: (iso: string) => void;
}) {
  const [cursor, setCursor] = React.useState(() => new Date("2026-07-01"));

  const byDay = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const ev of events) {
      const key = ev.date_start.slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Mo=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded-full p-1.5 transition hover:bg-surface-2"
          aria-label="Vorheriger Monat"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-display font-semibold">
          {first.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="rounded-full p-1.5 transition hover:bg-surface-2"
          aria-label="Nächster Monat"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = byDay.get(iso) ?? 0;
          return (
            <button
              key={i}
              onClick={() => count > 0 && onSelectDay?.(iso)}
              disabled={count === 0}
              className={cn(
                "relative aspect-square rounded-lg text-sm transition",
                count > 0
                  ? "bg-primary/15 font-semibold text-primary hover:bg-primary/25"
                  : "text-muted-foreground",
              )}
            >
              {day}
              {count > 0 && (
                <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {Array.from({ length: Math.min(count, 3) }).map((_, k) => (
                    <span key={k} className="h-1 w-1 rounded-full bg-primary" />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
