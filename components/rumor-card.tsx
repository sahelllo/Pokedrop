"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Instagram, Facebook, Users, Radio } from "lucide-react";
import type { Rumor, RumorStatus } from "@/types";
import { cn, relativeTime } from "@/lib/utils";

const STATUS_META: Record<RumorStatus, { label: string; color: string; bg: string }> = {
  RUMOR: { label: "Gerücht", color: "#9aa3b2", bg: "rgba(154,163,178,0.14)" },
  MULTI_SOURCE_RUMOR: { label: "Mehrere Quellen", color: "#f0b429", bg: "rgba(240,180,41,0.14)" },
  LIKELY: { label: "Wahrscheinlich", color: "#3aa0ff", bg: "rgba(58,160,255,0.14)" },
  CONFIRMED: { label: "Bestätigt", color: "#31d158", bg: "rgba(49,209,88,0.14)" },
};

function SourceIcon({ type }: { type: Rumor["source_type"] }) {
  if (type === "Instagram") return <Instagram className="h-3.5 w-3.5" />;
  if (type === "Facebook") return <Facebook className="h-3.5 w-3.5" />;
  if (type === "Community-Fund") return <Users className="h-3.5 w-3.5" />;
  return <Radio className="h-3.5 w-3.5" />;
}

export function RumorCard({ rumor, index = 0 }: { rumor: Rumor; index?: number }) {
  const meta = STATUS_META[rumor.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="rounded-2xl border border-dashed border-border bg-card/80 p-4 shadow-card"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          style={{ color: meta.color, background: meta.bg }}
        >
          {rumor.status !== "CONFIRMED" && <AlertTriangle className="h-3 w-3" />}
          {meta.label}
        </span>
        <span className="text-[11px] text-muted-foreground">{relativeTime(rumor.posted_minutes_ago)}</span>
      </div>

      <h3 className="font-display text-sm font-semibold leading-snug">{rumor.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{rumor.body}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <SourceIcon type={rumor.source_type} />
          {rumor.source_handle}
          {rumor.source_count > 1 && <span>· {rumor.source_count} Quellen</span>}
        </span>
        {rumor.status !== "CONFIRMED" && (
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            nicht bestätigt
          </span>
        )}
      </div>

      {/* Confidence-Balken */}
      <div className="mt-2.5">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.round(rumor.confidence * 100)}%`, background: meta.color }}
          />
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Vertrauen: {Math.round(rumor.confidence * 100)}%
        </p>
      </div>
    </motion.div>
  );
}
