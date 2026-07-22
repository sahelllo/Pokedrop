"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Heart,
  Info,
  Package,
  TrendingDown,
} from "lucide-react";
import { productsById } from "@/data/products";
import { getOffersForProduct, getDealViewForOffer } from "@/lib/data";
import { productAgeMonths } from "@/lib/deals";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { productImageUrl } from "@/lib/images";
import { formatDateDE, formatEuro } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";
import { DealBadgePill } from "@/components/deal-badge";
import { DealCard } from "@/components/deal-card";
import { PriceChart } from "@/components/price-chart";
import { NotifyDialog } from "@/components/notify-dialog";
import { SectionHeading, EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { energyMeta } from "@/lib/energy";

export default function ProductPageWrapper() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-muted-foreground">Lädt…</div>}>
      <ProductDetail />
    </React.Suspense>
  );
}

function ProductDetail() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const watched = usePokeStore((s) => s.watchlist.includes(params.id));
  const toggleWatch = usePokeStore((s) => s.toggleWatch);

  const product = productsById.get(params.id);

  const dealViews = React.useMemo(() => {
    if (!product) return [];
    const offers = getOffersForProduct(product.product_id);
    return offers
      .map((o) => getDealViewForOffer(o, location, radiusKm))
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .sort((a, b) => b.rankScore - a.rankScore);
  }, [product, location, radiusKm]);

  if (!product) {
    return <EmptyState emoji="❓" title="Produkt nicht gefunden" hint="Zurück zum Deal-Feed." />;
  }

  const preferredOfferId = searchParams.get("offer");
  const heroView =
    dealViews.find((v) => v.offer.offer_id === preferredOfferId) ?? dealViews[0];
  const bestOffer = heroView?.offer;
  const evaluation = heroView?.evaluation;
  const ageMonths = Math.round(productAgeMonths(product));
  const isOlder = product.availability_status !== "aktuell";
  const meta = energyMeta(product.energyType);

  const inRadius = dealViews.filter(
    (v) => v.offer.validity_type === "ONLINE" || (v.distanceKm ?? Infinity) <= radiusKm,
  );

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zum Feed
      </Link>

      {/* Hero */}
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card"
          style={{ boxShadow: `0 0 60px -30px ${meta.glow}` }}
        >
          <SmartImage
            src={productImageUrl(product)}
            alt={product.product_name}
            energyType={product.energyType}
            className="mx-auto h-72 w-full rounded-2xl"
            label={product.set_name}
          />
          <div className="absolute left-6 top-6">
            {evaluation && <DealBadgePill badge={evaluation.badge} />}
          </div>
        </motion.div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: meta.soft, color: meta.color }}>
                {meta.emoji} {product.set_name}
              </span>
              <h1 className="mt-2 font-display text-2xl font-bold leading-tight">{product.product_name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {product.product_type}</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDateDE(product.release_date)}</span>
                <span>· {product.language}</span>
              </p>
            </div>
            <button
              onClick={() => mounted && toggleWatch(product.product_id)}
              className="shrink-0 rounded-full border border-border p-2.5 transition hover:bg-surface-2"
              aria-label="Merken"
            >
              <Heart className={watched ? "h-5 w-5 fill-secondary text-secondary" : "h-5 w-5 text-muted-foreground"} />
            </button>
          </div>

          {/* UVP vs Markt transparent (Masterliste 13) */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PriceStat label="Bester Preis" value={bestOffer ? formatEuro(bestOffer.price) : "–"} accent />
            <PriceStat label="Historische UVP" value={formatEuro(product.reference_uvp)} />
            <PriceStat label="Markt-Referenz" value={formatEuro(product.market_reference_price)} />
            <PriceStat label="PokeDrop-Tiefstpreis" value={product.pokedrop_lowest ? formatEuro(product.pokedrop_lowest) : "–"} />
          </div>

          {/* Bewertungserklärung */}
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-border bg-surface/50 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              {isOlder ? (
                <>
                  Älteres Produkt ({ageMonths} Monate seit Release). Bewertet gegen{" "}
                  <span className="font-semibold text-foreground">Markt-Referenzpreis</span> und
                  individuelle Deal-Schwellen – ein Preis über der historischen UVP kann trotzdem
                  ein guter Deal sein. Good-Deal ab {formatEuro(product.good_deal_threshold)}, Top-Deal ab {formatEuro(product.great_deal_threshold)}.
                </>
              ) : (
                <>
                  Aktuelles Produkt ({ageMonths} Monate seit Release). Primäre Referenz ist die{" "}
                  <span className="font-semibold text-foreground">UVP</span> von {formatEuro(product.reference_uvp)}.
                  {evaluation && evaluation.savingsVsUvp > 0 && (
                    <> Aktuell <span className="text-emerald-400">{formatEuro(evaluation.savingsVsUvp)} unter UVP</span>.</>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <NotifyDialog product={product} />
            {evaluation && evaluation.savingsVsUvp > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-400">
                <TrendingDown className="h-4 w-4" /> {Math.round(evaluation.savingsPct)}% gespart
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preisverlauf */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-card sm:p-5">
        <SectionHeading title="Preisverlauf" subtitle="UVP · Markt-Referenz · PokeDrop-Dealpreise (12 Monate)" />
        <PriceChart product={product} />
      </section>

      {/* Angebote in der Nähe */}
      <section>
        <SectionHeading
          title="Aktuelle Angebote in der Nähe"
          subtitle={`${mounted ? location.name : "…"} · ${radiusKm} km`}
        />
        {!mounted ? (
          <EmptyState emoji="⏳" title="Lädt…" />
        ) : inRadius.length === 0 ? (
          <EmptyState emoji="📍" title="Keine Angebote im Radius" hint="Erhöhe den Umkreis für dieses Produkt." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {inRadius.map((v, i) => (
              <DealCard key={v.offer.offer_id} view={v} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PriceStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-card">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-display text-lg font-bold ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
