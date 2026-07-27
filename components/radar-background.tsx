"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";

/**
 * Hintergrund im Leitbild "RADAR": Entfernungsringe, ein umlaufender
 * Sweep-Strahl und einzelne Ping-Punkte.
 *
 * Bewusst zurückhaltend: Der Hintergrund erzählt, was die App ist
 * (ein Ortungsgerät), lenkt aber nicht vom Inhalt ab. Er nutzt nur
 * transform/opacity, pausiert im Hintergrund-Tab und respektiert
 * "Bewegung reduzieren".
 */

const RINGS = [26, 48, 70, 92];

const PINGS = [
  { left: "18%", top: "26%", delay: "0.4s", dur: "7s" },
  { left: "72%", top: "18%", delay: "2.1s", dur: "8s" },
  { left: "40%", top: "58%", delay: "3.6s", dur: "7.5s" },
  { left: "86%", top: "62%", delay: "5.2s", dur: "9s" },
  { left: "8%", top: "70%", delay: "1.3s", dur: "8.5s" },
  { left: "58%", top: "36%", delay: "6.0s", dur: "7.2s" },
];

export function RadarBackground() {
  const mounted = useMounted();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onVis = () => {
      if (ref.current) ref.current.dataset.paused = document.hidden ? "true" : "false";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div ref={ref} className="radar-bg" aria-hidden>
      <div className="radar-bg__rings">
        {RINGS.map((size) => (
          <span key={size} style={{ width: `${size}%`, height: `${size}%` }} />
        ))}
      </div>

      {mounted && (
        <>
          <div className="radar-bg__sweep" />
          {PINGS.map((p, i) => (
            <span
              key={i}
              className="radar-bg__ping"
              style={
                {
                  left: p.left,
                  top: p.top,
                  "--delay": p.delay,
                  "--dur": p.dur,
                } as React.CSSProperties
              }
            />
          ))}
        </>
      )}

      <div className="radar-bg__veil" />
    </div>
  );
}
