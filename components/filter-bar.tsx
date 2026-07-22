"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import type { DealFilters } from "@/lib/data";
import { ALL_PRODUCT_TYPES, ALL_RETAILER_BRANDS, ALL_SETS } from "@/lib/data";
import { BADGE_META } from "@/lib/deals";
import type { DealBadge } from "@/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BADGES: DealBadge[] = ["TOP_DEAL", "UVP_DEAL", "GUTER_DEAL", "MARKTPREIS"];

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: DealFilters;
  onChange: (f: DealFilters) => void;
  resultCount: number;
}) {
  const [expanded, setExpanded] = React.useState(false);

  function toggleArray<T>(key: keyof DealFilters, value: T) {
    const current = (filters[key] as T[] | undefined) ?? [];
    const next = current.includes(value)
      ? current.filter((x) => x !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  const activeCount =
    (filters.sets?.length ?? 0) +
    (filters.productTypes?.length ?? 0) +
    (filters.retailerBrands?.length ?? 0) +
    (filters.badges?.length ?? 0) +
    (filters.onlyUnderUvp ? 1 : 0) +
    (filters.onlyVerified ? 1 : 0) +
    (filters.priceMin != null ? 1 : 0) +
    (filters.priceMax != null ? 1 : 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
      {/* Suche + Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query ?? ""}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Suchen… z. B. Glurak, Display, EDEKA, Köln"
            className="pl-10"
          />
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition",
            expanded ? "bg-primary/15 text-primary" : "bg-surface/60 text-muted-foreground",
          )}
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Schnell-Chips */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <QuickToggle
          active={!!filters.onlyUnderUvp}
          onClick={() => onChange({ ...filters, onlyUnderUvp: !filters.onlyUnderUvp })}
        >
          Nur unter UVP
        </QuickToggle>
        <QuickToggle
          active={!!filters.onlyVerified}
          onClick={() => onChange({ ...filters, onlyVerified: !filters.onlyVerified })}
        >
          Nur verifiziert
        </QuickToggle>
        {BADGES.map((b) => {
          const meta = BADGE_META[b];
          const active = filters.badges?.includes(b);
          return (
            <button
              key={b}
              onClick={() => toggleArray("badges", b)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                active ? "text-foreground" : "border-border bg-surface/60 text-muted-foreground",
              )}
              style={active ? { background: meta.bg, borderColor: meta.ring, color: meta.color } : undefined}
            >
              {meta.emoji} {meta.label}
            </button>
          );
        })}
      </div>

      {/* Erweiterte Filter */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 space-y-3 border-t border-border pt-3"
        >
          <ChipGroup
            label="Set"
            options={ALL_SETS}
            selected={filters.sets ?? []}
            onToggle={(v) => toggleArray("sets", v)}
          />
          <ChipGroup
            label="Produktart"
            options={ALL_PRODUCT_TYPES}
            selected={filters.productTypes ?? []}
            onToggle={(v) => toggleArray("productTypes", v as never)}
          />
          <ChipGroup
            label="Händler"
            options={ALL_RETAILER_BRANDS}
            selected={filters.retailerBrands ?? []}
            onToggle={(v) => toggleArray("retailerBrands", v)}
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Preis von
              <Input
                type="number"
                inputMode="decimal"
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, priceMin: e.target.value ? Number(e.target.value) : undefined })
                }
                className="h-8 w-20 px-3"
                placeholder="0 €"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              bis
              <Input
                type="number"
                inputMode="decimal"
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, priceMax: e.target.value ? Number(e.target.value) : undefined })
                }
                className="h-8 w-20 px-3"
                placeholder="∞"
              />
            </label>
          </div>
        </motion.div>
      )}

      {/* Ergebniszeile */}
      <div className="mt-2.5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{resultCount}</span> Angebote im Radius
        </p>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({ query: filters.query })}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-3 w-3" /> Filter zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}

function QuickToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border bg-surface/60 text-muted-foreground",
      )}
    >
      {active && <Check className="h-3 w-3" />}
      {children}
    </button>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition",
                active
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border bg-surface/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
