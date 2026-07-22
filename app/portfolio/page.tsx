"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  Trash2,
  Wallet,
  TrendingUp,
  TrendingDown,
  Search,
  Layers,
} from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { products, productsById } from "@/data/products";
import { productImageUrl } from "@/lib/images";
import { cn, formatEuro } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";
import { CountUp } from "@/components/count-up";
import { SectionHeading, EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PortfolioPage() {
  const mounted = useMounted();
  const portfolio = usePokeStore((s) => s.portfolio);
  const addToPortfolio = usePokeStore((s) => s.addToPortfolio);
  const removeFromPortfolio = usePokeStore((s) => s.removeFromPortfolio);
  const setPortfolioQty = usePokeStore((s) => s.setPortfolioQty);

  const holdings = React.useMemo(
    () =>
      portfolio
        .map((item) => {
          const product = productsById.get(item.product_id);
          if (!product) return null;
          const unit = product.market_reference_price || product.reference_uvp;
          const cost = product.reference_uvp;
          return {
            item,
            product,
            unit,
            cost,
            value: unit * item.qty,
            costTotal: cost * item.qty,
          };
        })
        .filter((h): h is NonNullable<typeof h> => Boolean(h)),
    [portfolio],
  );

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalCost = holdings.reduce((s, h) => s + h.costTotal, 0);
  const totalItems = holdings.reduce((s, h) => s + h.item.qty, 0);
  const gain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;

  if (!mounted) {
    return <div className="py-20 text-center text-muted-foreground">Lädt…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Wert-Hero (Fintech-Optik) */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
            <Wallet className="h-3.5 w-3.5" /> Mein Portfolio
          </div>
          <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Gesamtwert</p>
          <p className="font-display text-4xl font-bold sm:text-5xl">
            <CountUp to={totalValue} decimals={2} suffix=" €" />
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold",
                gain >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
              )}
            >
              {gain >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {gain >= 0 ? "+" : ""}
              {formatEuro(gain)} ({gainPct >= 0 ? "+" : ""}
              {gainPct.toFixed(1)}%)
            </span>
            <span className="text-muted-foreground">
              vs. UVP-Einstand {formatEuro(totalCost)}
            </span>
          </div>
          <div className="mt-4 flex gap-2.5">
            <div className="rounded-xl border border-border bg-surface/60 px-3 py-2">
              <p className="font-display text-lg font-bold">{holdings.length}</p>
              <p className="text-[11px] text-muted-foreground">Produkte</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/60 px-3 py-2">
              <p className="font-display text-lg font-bold">{totalItems}</p>
              <p className="text-[11px] text-muted-foreground">Einheiten</p>
            </div>
            <AddDialog onAdd={addToPortfolio} />
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section>
        <SectionHeading title="Deine Sammlung" icon={<Layers className="h-4 w-4" />} />
        {holdings.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Noch nichts in der Sammlung"
            hint="Füge Produkte hinzu, um deinen Gesamtwert live zu verfolgen."
          />
        ) : (
          <div className="space-y-2.5">
            {holdings.map((h, i) => {
              const perGain = (h.unit - h.cost) * h.item.qty;
              return (
                <motion.div
                  key={h.product.product_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                >
                  <SmartImage
                    src={productImageUrl(h.product)}
                    alt={h.product.product_name}
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
                    <p className="text-[11px] text-muted-foreground">
                      {formatEuro(h.unit)}/Stk ·{" "}
                      <span className={perGain >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {perGain >= 0 ? "+" : ""}
                        {formatEuro(perGain)}
                      </span>
                    </p>
                    {/* Menge */}
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-0.5">
                      <button
                        onClick={() => setPortfolioQty(h.product.product_id, h.item.qty - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-surface-2"
                        aria-label="Weniger"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                        {h.item.qty}
                      </span>
                      <button
                        onClick={() => setPortfolioQty(h.product.product_id, h.item.qty + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-surface-2"
                        aria-label="Mehr"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-base font-bold">{formatEuro(h.value)}</p>
                    <button
                      onClick={() => removeFromPortfolio(h.product.product_id)}
                      className="mt-1 rounded-full p-1.5 text-muted-foreground transition hover:bg-surface-2 hover:text-red-400"
                      aria-label="Entfernen"
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
  const filtered = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(q.toLowerCase()) ||
      p.set_name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto px-4 py-2">
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
                alt={p.product_name}
                energyType={p.energyType}
                className="h-12 w-10 shrink-0 rounded-md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.product_name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {formatEuro(p.market_reference_price || p.reference_uvp)}
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
