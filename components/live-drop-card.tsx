"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { LiveDrop } from "@/types";
import { getDataset } from "@/lib/dataset";
import { productImageUrl } from "@/lib/images";
import { cn, formatEuro, relativeTime } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";

const KIND: Record<LiveDrop["kind"], string> = {
  drop: "DROP",
  restock: "RESTOCK",
  new_product: "NEU",
};

const AVAIL = {
  verfuegbar: { label: "verfügbar", cls: "text-[var(--radar-near)]" },
  wenig_bestand: { label: "wenig", cls: "text-[var(--heat-1)]" },
  ausverkauft: { label: "weg", cls: "text-muted-foreground" },
} as const;

/**
 * Live-Drop im Leitbild "RADAR": kompakte Ortungsmeldung.
 * Feste Zeilen statt umbrechender Textblöcke, damit die Karte auch auf
 * schmalen Bildschirmen ruhig bleibt.
 */
export function LiveDropCard({ drop, index = 0 }: { drop: LiveDrop; index?: number }) {
  const product = getDataset().productsById.get(drop.product_id);
  if (!product) return null;
  const avail = AVAIL[drop.availability];
  const soldOut = drop.availability === "ausverkauft";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[var(--radius)] border bg-card/90 p-3 transition-colors duration-200",
        drop.hot ? "border-[var(--heat-3)]/40" : "border-border",
        soldOut && "opacity-55",
      )}
    >
      <Link href={`/product/${product.product_id}`} className="flex items-start gap-3">
        {/* Bild mit Ping-Rahmen bei frischen Funden */}
        <div className="relative shrink-0">
          <SmartImage
            src={productImageUrl(product)}
            alt=""
            energyType={product.energyType}
            className="h-14 w-12 rounded-lg"
          />
          {drop.hot && !soldOut && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--heat-3)] shadow-[0_0_8px_var(--heat-3)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Kopfzeile: Art + Quelle, eine Zeile */}
          <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className={drop.hot ? "text-[var(--heat-3)]" : "text-primary"}>
              {KIND[drop.kind]}
            </span>
            <span className="truncate font-sans font-medium normal-case tracking-normal text-muted-foreground">
              {drop.source_name}
            </span>
          </p>

          <h3 className="mt-0.5 truncate text-[13px] font-semibold leading-snug">
            {product.product_name}
          </h3>

          {/* Statuszeile: Verfügbarkeit + Zeit + Preis */}
          <div className="mt-1.5 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-wide">
            <span className={avail.cls}>{avail.label}</span>
            <span className="text-muted-foreground">{relativeTime(drop.minutes_ago)}</span>
            {drop.price != null && (
              <span className="ml-auto text-sm font-bold tabular-nums text-foreground">
                {formatEuro(drop.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {drop.source_url && (
        <a
          href={drop.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-primary transition hover:underline"
        >
          zur Quelle <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </motion.article>
  );
}
