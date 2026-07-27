"use client";

import { cn } from "@/lib/utils";

/**
 * SIGNATURE-ELEMENT 2: Deal-Heat-Balken
 *
 * Zeigt die Preisqualität als Temperatur: Je weiter der Preis unter dem
 * Referenzwert liegt, desto heißer glüht der Balken – von kühlem Blau
 * (kaum Ersparnis) bis Weißglut (Top-Deal).
 */

export function heatColor(percentBelow: number): string {
  if (percentBelow >= 25) return "var(--heat-4)";
  if (percentBelow >= 15) return "var(--heat-3)";
  if (percentBelow >= 7) return "var(--heat-2)";
  if (percentBelow > 0) return "var(--heat-1)";
  return "var(--heat-0)";
}

export function HeatBar({
  percentBelow,
  className,
  showLabel = false,
}: {
  percentBelow: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, percentBelow * 3.2));
  const color = heatColor(percentBelow);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="h-[3px] flex-1 overflow-hidden rounded-full bg-[hsl(var(--ring-track))]"
        role="img"
        aria-label={
          percentBelow > 0
            ? `${Math.round(percentBelow)} Prozent unter Referenzpreis`
            : "kein Preisvorteil"
        }
      >
        <div
          className="h-full rounded-full transition-[width,background] duration-500 ease-out"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      {showLabel && percentBelow > 0 && (
        <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color }}>
          −{Math.round(percentBelow)}%
        </span>
      )}
    </div>
  );
}
