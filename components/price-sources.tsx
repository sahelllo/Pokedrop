"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingDown } from "lucide-react";
import type { Product } from "@/types";
import { getPriceSources } from "@/lib/price-sources";
import { cn, formatEuro } from "@/lib/utils";

/**
 * Live-Preisaggregation über mehrere Quellen mit Bestpreis-Hervorhebung.
 */
export function PriceSources({ product }: { product: Product }) {
  const sources = getPriceSources(product);
  const lowest = sources.find((s) => s.isLowest);

  return (
    <div className="space-y-2">
      {sources.map((s, i) => (
        <motion.a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-3 transition hover:shadow-glow",
            s.isLowest ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card",
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-lg">
            {s.logo}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              {s.name}
              {s.isLowest && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <TrendingDown className="h-3 w-3" /> Bestpreis
                </span>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {s.note}
              {" · "}
              {s.inStock ? (
                <span className="text-emerald-400">verfügbar</span>
              ) : (
                <span className="text-muted-foreground">nicht verfügbar</span>
              )}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={cn("font-display text-base font-bold", s.isLowest && "text-emerald-400")}>
              {formatEuro(s.price)}
            </p>
            <span className="inline-flex items-center gap-0.5 text-[11px] text-primary">
              öffnen <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </motion.a>
      ))}
      <p className="pt-1 text-center text-[11px] text-muted-foreground">
        Preise aus mehreren Quellen aggregiert{lowest && <> · Bestpreis {formatEuro(lowest.price)}</>}. Demo-/Referenzdaten.
      </p>
    </div>
  );
}
