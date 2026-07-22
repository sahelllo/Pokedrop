"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { energyMeta } from "@/lib/energy";
import type { EnergyType } from "@/types";

/**
 * Bild mit sauberem Fallback (Abschnitt 5): lädt echtes Bild, zeigt bei
 * Fehler/fehlender Quelle einen stimmigen Energie-Gradient statt grauem Kasten.
 */
export function SmartImage({
  src,
  alt,
  energyType,
  className,
  imgClassName,
  label,
}: {
  src?: string;
  alt: string;
  energyType?: EnergyType;
  className?: string;
  imgClassName?: string;
  label?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const meta = energyMeta(energyType);

  const showFallback = !src || failed;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 120% at 30% 0%, ${meta.soft}, transparent 70%), linear-gradient(160deg, hsl(var(--surface-2)), hsl(var(--surface)))`,
      }}
    >
      {/* dezente Holo-Sheen */}
      <div className="pointer-events-none absolute inset-0 holo-sheen opacity-40" />

      {!showFallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={cn(
            "relative z-10 h-full w-full object-contain transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}

      {showFallback && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-4xl" style={{ filter: "saturate(1.2)" }}>
            {meta.emoji}
          </span>
          {label && (
            <span className="max-w-[80%] text-xs font-medium text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
