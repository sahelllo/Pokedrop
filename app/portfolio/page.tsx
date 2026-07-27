"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  Layers,
  ScanLine,
} from "lucide-react";
import type { Product } from "@/types";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { useDatasetVersion, getDataset } from "@/lib/dataset";
import { productImageUrl } from "@/lib/images";
import { cn, formatEuro } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";
import { CountUp } from "@/components/count-up";
import { EmptyState } from "@/components/section";
import { PageHeader, StatReadout } from "@/components/page-header";
import { RarityPill } from "@/components/rarity-pill";
import { RARITY_META, RARITY_ORDER, rarityOf, type RarityTier } from "@/lib/rarity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SortMode = "seltenheit" | "wert" | "neueste";

const SORT_LABEL: Record<SortMode, string> = {
  seltenheit: "Seltenheit",
  wert: "Wert",
  neueste: "Neueste",
};

export default function PortfolioPage() {
  const mounted = useMounted();
  const dataVersion = useDatasetVersion();
  const portfolio = usePokeStore((s) => s.portfolio);
  const addToPortfolio = usePokeStore((s) => s.addToPortfolio);
  const removeFromPortfolio = usePokeStore((s) => s.removeFromPortfolio);
  const setPortfolioQty = usePokeStore((s) => s.setPortfolioQty);
  const [sort, setSort] = React.useState<SortMode>("seltenheit");

  /* eslint-disable react-hooks/exhaustive-deps */
  const holdings = React.useMemo(() => {
    const ds = getDataset();
    return portfolio
      .map((item) => {
        const product = ds.productsById.get(item.product_id);
        if (!product) return null;
        const unit = product.market_reference_price || product.reference_uvp;
        const cost = product.reference_uvp;
        return {
          item,
          product,
          rarity: rarityOf(product),
          unit,
          cost,
          value: unit * item.qty,
          costTotal: cost * item.qty,
        };
      })
      .filter((h): h is NonNullable<typeof h> => Boolean(h));
  }, [portfolio, dataVersion]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const sorted = React.useMemo(() => {
    const list = [...holdings];
    if (sort === "wert") return list.sort((a, b) => b.value - a.value);
    if (sort === "neueste")
      return list.sort((a, b) => (b.item.addedAt ?? "").localeCompare(a.item.addedAt ?? ""));
    // Seltenheit: seltenstes zuerst, bei Gleichstand der höhere Aufschlag
    return list.sort((a, b) => {
      const d = RARITY_META[b.rarity.tier].order - RARITY_META[a.rarity.tier].order;
      return d !== 0 ? d : b.rarity.premiumPct - a.rarity.premiumPct;
    });
  }, [holdings, sort]);

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalCost = holdings.reduce((s, h) => s + h.costTotal, 0);
  const totalItems = holdings.reduce((s, h) => s + h.item.qty, 0);
  const scannedItems = holdings
    .filter((h) => h.item.source === "scan")
    .reduce((s, h) => s + h.item.qty, 0);
  const gain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;

  /** Wertanteil je Seltenheitsstufe – zeigt, worin das Geld wirklich steckt. */
  const byRarity = React.useMemo(() => {
    const map = new Map<RarityTier, { value: number; qty: number }>();
    for (const h of holdings) {
      const cur = map.get(h.rarity.tier) ?? { value: 0, qty: 0 };
      map.set(h.rarity.tier, { value: cur.value + h.value, qty: cur.qty + h.item.qty });
    }
    return RARITY_ORDER.filter((t) => map.has(t)).map((t) => ({
      tier: t,
      ...map.get(t)!,
    }));
  }, [holdings]);

  if (!mounted) {
    return <div className="py-20 text-center text-muted-foreground">Lädt…</div>;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        status="Deine Sammlung"
        title="Sammlung & Wert"
        subtitle="Alles, was du gescannt oder hinzugefügt hast – nach Seltenheit sortiert."
        action={<AddDialog onAdd={addToPortfolio} />}
      />

      {/* Gesamtwert */}
      <section className="rounded-[var(--radius)] border border-border bg-card p-4 shadow-card sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Gesamtwert
        </p>
        <p className="font-mono text-4xl font-bold tabular-nums leading-none sm:text-5xl">
          <CountUp to={totalValue} decimals={2} suffix=" €" />
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-xs font-semibold",
              gain >= 0
                ? "bg-primary/15 text-primary"
                : "bg-[color-mix(in_srgb,var(--heat-4)_15%,transparent)] text-[var(--heat-4)]",
            )}
          >
            {gain >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {gain >= 0 ? "+" : ""}
            {formatEuro(gain)} ({gainPct >= 0 ? "+" : ""}
            {gainPct.toFixed(1)}%)
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            UVP-Einstand {formatEuro(totalCost)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <StatReadout value={holdings.length} label="Produkte" />
          <StatReadout value={totalItems} label="Stück" />
          <StatReadout
            value={scannedItems}
            label="gescannt"
            accent="var(--radar-online)"
          />
        </div>
      </section>

      {/* Wert nach Seltenheit */}
      {byRarity.length > 0 && (
        <section className="rounded-[var(--radius)] border border-border bg-card p-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Wert nach Seltenheit
          </h2>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            {byRarity.map((r) => (
              <span
                key={r.tier}
                style={{
                  width: `${totalValue > 0 ? (r.value / totalValue) * 100 : 0}%`,
                  background: RARITY_META[r.tier].color,
                }}
              />
            ))}
          </div>
          <ul className="mt-2.5 space-y-1">
            {byRarity.map((r) => (
              <li key={r.tier} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: RARITY_META[r.tier].color }}
                />
                <span className="min-w-0 flex-1 truncate">
                  {RARITY_META[r.tier].label}
                  <span className="text-muted-foreground"> · {r.qty} Stück</span>
                </span>
                <span className="shrink-0 font-mono font-semibold tabular-nums">
                  {formatEuro(r.value)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Liste */}
      <section>
        {/* Überschrift und Sortierung untereinander: nebeneinander bricht der
            Titel auf schmalen Handys um. */}
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Layers className="h-3.5 w-3.5" /> Deine Produkte
          </h2>
          <div className="flex gap-1" role="group" aria-label="Sortierung">
            {(Object.keys(SORT_LABEL) as SortMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSort(m)}
                aria-pressed={sort === m}
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition",
                  sort === m
                    ? "bg-primary/15 text-primary"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground",
                )}
              >
                {SORT_LABEL[m]}
              </button>
            ))}
          </div>
        </div>

        {holdings.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Noch nichts in der Sammlung"
            hint="Scanne den Strichcode einer Packung – das Produkt landet mit Preis und Seltenheit direkt hier."
          />
        ) : (
          <div className="space-y-2.5">
            {sorted.map((h, i) => {
              const perGain = (h.unit - h.cost) * h.item.qty;
              return (
                <motion.div
                  key={h.product.product_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.24 }}
                  className="flex items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-3 shadow-card"
                >
                  <SmartImage
                    src={productImageUrl(h.product)}
                    alt=""
                    energyType={h.product.energyType}
                    className="h-16 w-14 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${h.product.product_id}`}
                      className="block truncate text-sm font-semibold hover:text-primary"
                    >
                      {h.product.product_name}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <RarityPill product={h.product} />
                      {h.item.source === "scan" && (
                        <span
                          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-[var(--radar-online)]"
                          title="per Strichcode erfasst"
                        >
                          <ScanLine className="h-3 w-3" /> gescannt
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {formatEuro(h.unit)}/Stk
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[10px] font-semibold",
                          perGain >= 0 ? "text-primary" : "text-[var(--heat-4)]",
                        )}
                      >
                        {perGain >= 0 ? "+" : ""}
                        {formatEuro(perGain)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                      {h.rarity.reason}
                    </p>

                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-0.5">
                      <button
                        onClick={() => setPortfolioQty(h.product.product_id, h.item.qty - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-surface-2"
                        aria-label={`Weniger ${h.product.product_name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center font-mono text-sm font-semibold tabular-nums">
                        {h.item.qty}
                      </span>
                      <button
                        onClick={() => setPortfolioQty(h.product.product_id, h.item.qty + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-surface-2"
                        aria-label={`Mehr ${h.product.product_name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-base font-bold tabular-nums">
                      {formatEuro(h.value)}
                    </p>
                    <button
                      onClick={() => removeFromPortfolio(h.product.product_id)}
                      className="mt-1 rounded-full p-1.5 text-muted-foreground transition hover:bg-surface-2 hover:text-[var(--heat-4)]"
                      aria-label={`${h.product.product_name} entfernen`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function AddDialog({ onAdd }: { onAdd: (id: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const dataVersion = useDatasetVersion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const all = React.useMemo(() => getDataset().products, [dataVersion]);
  const filtered: Product[] = all.filter(
    (p) =>
      p.product_name.toLowerCase().includes(q.toLowerCase()) ||
      p.set_name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Produkt zur Sammlung hinzufügen</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Produkt oder Set suchen…"
            className="pl-10"
          />
        </div>
        <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {filtered.map((p) => (
            <button
              key={p.product_id}
              onClick={() => onAdd(p.product_id)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-surface-2"
            >
              <SmartImage
                src={productImageUrl(p)}
                alt=""
                energyType={p.energyType}
                className="h-12 w-10 shrink-0 rounded-md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.product_name}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {formatEuro(p.market_reference_price || p.reference_uvp)} ·{" "}
                  {RARITY_META[rarityOf(p).tier].label}
                </p>
              </div>
              <Plus className="h-4 w-4 text-primary" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
