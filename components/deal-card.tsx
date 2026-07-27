"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Heart, ShieldCheck } from "lucide-react";
import type { DealView } from "@/types";
import { productImageUrl } from "@/lib/images";
import { VALIDITY_LABEL } from "@/lib/geo";
import { cn, formatEuro } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";
import { DistanceRing, distanceLabel } from "@/components/signature/distance-ring";
import { HeatBar, heatColor } from "@/components/signature/heat-bar";
import { usePokeStore } from "@/lib/store";
import { BADGE_META } from "@/lib/deals";

const SIGNAL = {
  verfuegbar: { label: "auf Lager", cls: "text-[var(--radar-near)]" },
  wenig_bestand: { label: "wenig Bestand", cls: "text-[var(--heat-1)]" },
  ausverkauft: { label: "ausverkauft", cls: "text-muted-foreground" },
} as const;

/**
 * Deal-Karte im Leitbild "RADAR".
 *
 * Signature-Elemente: Distanz-Ring (links) und Deal-Heat-Balken (unten).
 * Entfernungen und Preise in Monospace, damit Zahlen untereinander
 * ausgerichtet und scanbar bleiben.
 */
export function DealCard({ view, index = 0 }: { view: DealView; index?: number }) {
  const { offer, product, evaluation, distanceKm, nearestStore, daysLeft } = view;
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const watched = usePokeStore((s) => s.watchlist.includes(product.product_id));
  const toggleWatch = usePokeStore((s) => s.toggleWatch);

  const online = offer.validity_type === "ONLINE";
  const pctBelow = Math.max(0, evaluation.savingsPct);
  const signal = offer.stock_signal ? SIGNAL[offer.stock_signal] : undefined;
  const soldOut = offer.stock_signal === "ausverkauft";
  const badge = BADGE_META[evaluation.badge];

  function handleWatch(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWatch(product.product_id);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.24,
        delay: Math.min(index * 0.035, 0.28),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative min-w-0"
    >
      <Link
        href={`/product/${product.product_id}?offer=${offer.offer_id}`}
        className="block rounded-[var(--radius)] focus-visible:outline-none"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--radius)] border bg-card/90 p-3",
            "transition-[border-color,background] duration-200 ease-out",
            "border-border group-hover:border-primary/40 group-active:bg-surface-2",
            soldOut && "opacity-55",
          )}
        >
          <div className="flex items-start gap-3">
            {/* Distanz-Ring mit Produktbild */}
            <DistanceRing distanceKm={distanceKm} radiusKm={radiusKm} online={online} size={58}>
              <SmartImage
                src={productImageUrl(product)}
                alt=""
                energyType={product.energyType}
                className="h-full w-full rounded-full"
                imgClassName="scale-[0.82]"
              />
            </DistanceRing>

            {/* Inhalt */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate text-[13px] font-semibold leading-snug">
                  {product.product_name}
                </h3>
                <button
                  onClick={handleWatch}
                  aria-label={watched ? "Von Merkliste entfernen" : "Merken"}
                  className="-m-2 shrink-0 rounded-full p-2 transition active:scale-90"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition",
                      watched ? "fill-secondary text-secondary" : "text-muted-foreground",
                    )}
                  />
                </button>
              </div>

              {/* Ortung: Entfernung + Händler, monospace */}
              <p className="mt-0.5 truncate font-mono text-[11px] font-semibold tracking-wide text-primary">
                {distanceLabel(distanceKm, online)}
                <span className="text-muted-foreground"> · </span>
                {offer.retailer_brand.toUpperCase()}
                {nearestStore && !online && (
                  <span className="font-sans font-normal text-muted-foreground">
                    {" "}· {nearestStore.city}
                  </span>
                )}
              </p>

              {/* Preis */}
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold tabular-nums">
                  {formatEuro(offer.price)}
                </span>
                {offer.regular_price && offer.regular_price > offer.price && (
                  <span className="font-mono text-[11px] text-muted-foreground line-through">
                    {formatEuro(offer.regular_price)}
                  </span>
                )}
                <span
                  className="ml-auto rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    color: pctBelow > 0 ? "hsl(var(--primary-foreground))" : badge.color,
                    background: pctBelow > 0 ? heatColor(pctBelow) : "transparent",
                    border: pctBelow > 0 ? "none" : `1px solid ${badge.ring}`,
                  }}
                >
                  {pctBelow > 0 ? `−${Math.round(pctBelow)}%` : badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Heat-Balken: Preisqualität als Temperatur */}
          <HeatBar percentBelow={pctBelow} className="mt-2.5" />

          {/* Fußzeile */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            <span>{VALIDITY_LABEL[offer.validity_type]}</span>
            {offer.verification_status === "VERIFIED" && (
              <span className="inline-flex items-center gap-1 text-[var(--radar-mid)]">
                <ShieldCheck className="h-3 w-3" /> geprüft
              </span>
            )}
            {signal && <span className={signal.cls}>{signal.label}</span>}
            <span className={cn("ml-auto inline-flex items-center gap-1", daysLeft <= 2 && "text-[var(--heat-2)]")}>
              <Clock className="h-3 w-3" />
              {daysLeft <= 0 ? "endet" : `${daysLeft}T`}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
