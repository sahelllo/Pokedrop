"use client";

import { cn } from "@/lib/utils";

/**
 * SIGNATURE-ELEMENT 1: Distanz-Ring
 *
 * Zeigt ohne Zahlenlesen, wie nah ein Angebot ist: Je voller der Ring, desto
 * näher. Ein fast geschlossener Ring heißt "praktisch um die Ecke", ein
 * schmaler Bogen heißt "weit weg".
 */
export function DistanceRing({
  distanceKm,
  radiusKm,
  size = 56,
  online = false,
  children,
  className,
}: {
  distanceKm?: number;
  radiusKm: number;
  size?: number;
  online?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  // Online-Angebote sind überall gleich nah → voller Ring in Blau.
  const fill = online
    ? 1
    : distanceKm === undefined || radiusKm <= 0
      ? 0
      : Math.max(0.04, 1 - Math.min(distanceKm, radiusKm) / radiusKm);

  const color = online
    ? "var(--radar-online)"
    : fill > 0.66
      ? "var(--radar-near)"
      : fill > 0.33
        ? "var(--radar-mid)"
        : "var(--radar-far)";

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full transition-[background] duration-500"
        style={{ background: `conic-gradient(${color} ${fill * 360}deg, hsl(var(--ring-track)) 0deg)` }}
      />
      <div className="absolute inset-[3px] grid place-items-center overflow-hidden rounded-full bg-surface">
        {children}
      </div>
    </div>
  );
}

/** Entfernung als kurzer, gut lesbarer Text. */
export function distanceLabel(distanceKm?: number, online?: boolean): string {
  if (online) return "ONLINE";
  if (distanceKm === undefined) return "—";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} M`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} KM`;
  return `${Math.round(distanceKm)} KM`;
}
