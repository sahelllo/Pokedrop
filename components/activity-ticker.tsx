"use client";

import { activityTicker } from "@/data/community";
import { relativeTime } from "@/lib/utils";

/** Sich bewegender "gerade gefunden"-Ticker (Abschnitt 7). */
export function ActivityTicker() {
  const items = [...activityTicker, ...activityTicker]; // nahtlose Schleife

  return (
    <div className="relative flex items-center gap-2 overflow-hidden">
      <span className="z-10 hidden shrink-0 items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-secondary sm:inline-flex">
        <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-secondary" />
        Live
      </span>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-ticker items-center gap-6">
          {items.map((item, i) => (
            <span key={`${item.id}-${i}`} className="flex shrink-0 items-center gap-1.5 text-xs">
              <span>{item.emoji}</span>
              <span className="text-foreground/90">{item.text}</span>
              <span className="text-muted-foreground">
                in {item.city} · {relativeTime(item.minutes_ago)}
              </span>
              <span className="text-muted-foreground/40">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
