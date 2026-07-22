"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Zap } from "lucide-react";
import type { LiveDrop } from "@/types";
import { productsById } from "@/data/products";
import { productImageUrl } from "@/lib/images";
import { cn, formatEuro, relativeTime } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";

const KIND_LABEL: Record<LiveDrop["kind"], string> = {
  drop: "DROP",
  restock: "RESTOCK",
  new_product: "NEU",
};

const AVAIL = {
  verfuegbar: { label: "verfügbar", cls: "text-emerald-400", dot: "bg-emerald-400" },
  wenig_bestand: { label: "wenig Bestand", cls: "text-amber-400", dot: "bg-amber-400" },
  ausverkauft: { label: "ausverkauft", cls: "text-red-400", dot: "bg-red-400" },
} as const;

export function LiveDropCard({ drop, index = 0 }: { drop: LiveDrop; index?: number }) {
  const product = productsById.get(drop.product_id);
  if (!product) return null;
  const avail = AVAIL[drop.availability];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-card transition hover:shadow-glow",
        drop.hot ? "border-secondary/40" : "border-border",
      )}
    >
      <SmartImage
        src={productImageUrl(product)}
        alt={product.product_name}
        energyType={product.energyType}
        className="h-16 w-14 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              drop.hot ? "bg-secondary/20 text-secondary" : "bg-primary/15 text-primary",
            )}
          >
            {drop.hot && <Zap className="h-3 w-3" />}
            {KIND_LABEL[drop.kind]}
          </span>
          {drop.isPokemonCenter && (
            <span className="rounded-full bg-poke-yellow/15 px-2 py-0.5 text-[10px] font-bold text-poke-yellow">
              Pokémon Center
            </span>
          )}
        </div>
        <Link
          href={`/product/${product.product_id}`}
          className="mt-1 block truncate text-sm font-semibold hover:text-primary"
        >
          {product.product_name}
        </Link>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className={cn("inline-flex items-center gap-1", avail.cls)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", avail.dot, drop.availability !== "ausverkauft" && "animate-pulse-live")} />
            {avail.label}
          </span>
          <span>· {drop.source_name}</span>
          <span>· {relativeTime(drop.minutes_ago)}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        {drop.price != null && (
          <p className="font-display text-sm font-bold">{formatEuro(drop.price)}</p>
        )}
        {drop.source_url && (
          <a
            href={drop.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
          >
            ansehen <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
