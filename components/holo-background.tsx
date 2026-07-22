"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import { pokemonArtworkUrl } from "@/lib/images";

/**
 * Animierter Hintergrund:
 *  1) lebendige, langsam driftende Farb-Blobs (Pokémon-Energie-Palette)
 *  2) fliegende Holo-Pokémon-Karten mit Foil-Schimmer (wie in der alten PWA,
 *     nur schöner) – steigen auf, rotieren leicht in 3D
 *  3) feine funkelnde Partikel
 *
 * Läuft auf PC & Handy (reine CSS-Transforms, GPU-freundlich),
 * respektiert `prefers-reduced-motion` und pausiert im Hintergrund-Tab.
 */

// Bekannte, gut erkennbare Pokémon fürs Holo-Karten-Motiv (National-Dex-IDs).
const CARD_POOL = [
  6, 150, 25, 94, 448, 282, 384, 249, 197, 700, 658, 445, 149, 143, 133, 130, 9,
  3, 248, 257, 392, 151, 493, 487, 445,
];

interface FloatCard {
  id: number;
  dex: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  drift: number;
  hue: number;
}

function buildCards(count: number): FloatCard[] {
  const shuffled = [...CARD_POOL].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    dex: shuffled[i % shuffled.length],
    left: Math.random() * 100,
    size: 60 + Math.random() * 66,
    duration: 26 + Math.random() * 24,
    delay: (i / count) * -46 - Math.random() * 6,
    rotate: 320 + Math.random() * 420,
    drift: (Math.random() - 0.5) * 26,
    hue: Math.floor(Math.random() * 360),
  }));
}

function buildSparks(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * -8,
  }));
}

export function HoloBackground() {
  const mounted = useMounted();
  const ref = React.useRef<HTMLDivElement>(null);

  // Animationen im Hintergrund-Tab pausieren (Akku schonen).
  React.useEffect(() => {
    const onVis = () => {
      if (ref.current) ref.current.dataset.paused = document.hidden ? "true" : "false";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const { cards, sparks } = React.useMemo(() => {
    if (!mounted) return { cards: [] as FloatCard[], sparks: [] as ReturnType<typeof buildSparks> };
    const wide = window.innerWidth >= 1100;
    const mid = window.innerWidth >= 640;
    const count = reduce ? 0 : wide ? 14 : mid ? 9 : 6;
    return { cards: buildCards(count), sparks: reduce ? [] : buildSparks(mid ? 22 : 12) };
  }, [mounted, reduce]);

  return (
    <div ref={ref} className="holo-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Basis-Verlauf */}
      <div className="holo-bg__base" />

      {/* driftende Farb-Blobs */}
      <div className="holo-blob holo-blob--1" />
      <div className="holo-blob holo-blob--2" />
      <div className="holo-blob holo-blob--3" />
      <div className="holo-blob holo-blob--4" />

      {/* feines Raster für Tiefe */}
      <div className="holo-bg__grid" />

      {mounted && (
        <div className="holo-bg__cards" style={{ perspective: 1200 }}>
          {cards.map((c) => (
            <div
              key={c.id}
              className="holo-card"
              style={
                {
                  "--left": `${c.left}%`,
                  "--size": `${c.size}px`,
                  "--dur": `${c.duration}s`,
                  "--delay": `${c.delay}s`,
                  "--rot": `${c.rotate}deg`,
                  "--drift": `${c.drift}px`,
                } as React.CSSProperties
              }
            >
              <div className="holo-card__inner" style={{ filter: `hue-rotate(${c.hue}deg)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pokemonArtworkUrl(c.dex)} alt="" loading="lazy" decoding="async" />
                <span className="holo-card__foil" />
                <span className="holo-card__shine" />
              </div>
            </div>
          ))}

          {sparks.map((s) => (
            <span
              key={`s${s.id}`}
              className="holo-spark"
              style={
                {
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  "--size": `${s.size}px`,
                  "--dur": `${s.duration}s`,
                  "--delay": `${s.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Vignette + Lesbarkeits-Schleier */}
      <div className="holo-bg__veil" />
    </div>
  );
}
