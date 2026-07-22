"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clock, Heart, MapPin, Store as StoreIcon, TrendingDown } from "lucide-react";
import type { DealView } from "@/types";
import { productImageUrl } from "@/lib/images";
import { VALIDITY_LABEL } from "@/lib/geo";
import { cn, formatEuro, formatKm, relativeTime } from "@/lib/utils";
import { DealBadgePill, VerificationPill } from "@/components/deal-badge";
import { SmartImage } from "@/components/smart-image";
import { usePokeStore } from "@/lib/store";
import { fireTopDealConfetti } from "@/lib/confetti";

const SIGNAL_META = {
  verfuegbar: { label: "auf Lager", cls: "text-emerald-400", dot: "bg-emerald-400" },
  wenig_bestand: { label: "wenig Bestand", cls: "text-amber-400", dot: "bg-amber-400" },
  ausverkauft: { label: "ausverkauft", cls: "text-red-400", dot: "bg-red-400" },
} as const;

export function DealCard({ view, index = 0 }: { view: DealView; index?: number }) {
  const { offer, product, evaluation, distanceKm, nearestStore, daysLeft } = view;
  const watched = usePokeStore((s) => s.watchlist.includes(product.product_id));
  const toggleWatch = usePokeStore((s) => s.toggleWatch);

  // Hover-Tilt (Desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 18 });

  const isTop = evaluation.badge === "TOP_DEAL";
  const signal = offer.stock_signal ? SIGNAL_META[offer.stock_signal] : undefined;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  function handleWatch(e: React.MouseEvent) {
    e.preventDefault();
    if (!watched && isTop) {
      fireTopDealConfetti({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    }
    toggleWatch(product.product_id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative"
    >
      <Link href={`/product/${product.product_id}?offer=${offer.offer_id}`}>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 group-hover:shadow-glow",
            isTop ? "border-deal-top/40" : "border-border",
          )}
        >
          {isTop && (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 40px -10px rgba(255,77,109,0.6)" }} />
          )}

          <div className="flex gap-3 p-3">
            {/* Bild */}
            <div className="relative shrink-0">
              <SmartImage
                src={productImageUrl(product)}
                alt={product.product_name}
                energyType={product.energyType}
                className="h-28 w-24 rounded-xl"
                label={product.set_name}
              />
              <div className="absolute -left-1 -top-1">
                <DealBadgePill badge={evaluation.badge} size="sm" />
              </div>
            </div>

            {/* Inhalt */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-sm font-semibold leading-tight">
                    {product.product_name}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {product.set_name} · {product.product_type} · {product.language}
                  </p>
                </div>
                <button
                  onClick={handleWatch}
                  aria-label={watched ? "Von Merkliste entfernen" : "Merken"}
                  className="shrink-0 rounded-full p-1.5 transition hover:bg-surface-2"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition",
                      watched ? "fill-secondary text-secondary" : "text-muted-foreground",
                    )}
                  />
                </button>
              </div>

              {/* Preis */}
              <div className="mt-1.5 flex items-end gap-2">
                <span className="font-display text-xl font-bold">
                  {formatEuro(offer.price)}
                </span>
                {offer.regular_price && offer.regular_price > offer.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatEuro(offer.regular_price)}
                  </span>
                )}
                {evaluation.savingsVsUvp > 0 && (
                  <span className="mb-0.5 inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
                    <TrendingDown className="h-3 w-3" />
                    {Math.round(evaluation.savingsPct)}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {evaluation.referenceLabel}: {formatEuro(evaluation.referencePrice)}
              </p>

              {/* Meta-Zeile */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <StoreIcon className="h-3 w-3" />
                  {offer.retailer_brand}
                </span>
                {offer.validity_type === "ONLINE" ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Online
                  </span>
                ) : (
                  nearestStore && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {nearestStore.city}
                      {distanceKm !== undefined && ` · ${formatKm(distanceKm)}`}
                    </span>
                  )
                )}
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    daysLeft <= 2 ? "text-amber-400" : "",
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {daysLeft <= 0 ? "läuft ab" : `noch ${daysLeft} Tg.`}
                </span>
              </div>

              {/* Footer: Gültigkeit, Verifizierung, Crowd-Signal */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {VALIDITY_LABEL[offer.validity_type]}
                </span>
                <VerificationPill status={offer.verification_status} />
                {signal && (
                  <span className={cn("inline-flex items-center gap-1 text-[10px]", signal.cls)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", signal.dot)} />
                    {signal.label}
                  </span>
                )}
                {offer.found_minutes_ago !== undefined && offer.found_minutes_ago < 60 && (
                  <span className="text-[10px] text-muted-foreground">
                    · {relativeTime(offer.found_minutes_ago)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
