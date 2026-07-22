"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Product } from "@/types";
import { buildPriceHistory } from "@/lib/price-history";
import { formatEuro } from "@/lib/utils";

export function PriceChart({ product }: { product: Product }) {
  const data = buildPriceHistory(product);
  const low = Math.min(...data.map((d) => d.bestDeal)) * 0.92;
  const high = Math.max(...data.map((d) => d.market), product.reference_uvp) * 1.06;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="dealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#31d158" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#31d158" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[Math.floor(low), Math.ceil(high)]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => `${v}€`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value: number, name) => [formatEuro(value), labelFor(name as string)]}
          />
          <Area
            type="monotone"
            dataKey="bestDeal"
            stroke="#31d158"
            strokeWidth={2}
            fill="url(#dealGrad)"
            name="bestDeal"
          />
          <Line type="monotone" dataKey="market" stroke="#f0b429" strokeWidth={2} dot={false} name="market" />
          <Line
            type="monotone"
            dataKey="uvp"
            stroke="#3aa0ff"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            name="uvp"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-4 text-[11px] text-muted-foreground">
        <Legend color="#3aa0ff" label="UVP" dashed />
        <Legend color="#f0b429" label="Markt-Referenz" />
        <Legend color="#31d158" label="PokeDrop-Dealpreis" />
      </div>
    </div>
  );
}

function labelFor(name: string): string {
  if (name === "uvp") return "UVP";
  if (name === "market") return "Markt-Referenz";
  return "PokeDrop-Dealpreis";
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-0.5 w-4"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 5px, transparent 5px 9px)`
            : color,
        }}
      />
      {label}
    </span>
  );
}
