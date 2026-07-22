"use client";

import { motion } from "framer-motion";
import { Coins, Package, TrendingUp, Users } from "lucide-react";
import { communityStats } from "@/data/community";
import { CountUp } from "@/components/count-up";

const STATS = [
  { icon: Users, label: "Aktive Sammler", value: communityStats.activeUsers, color: "text-primary" },
  { icon: Package, label: "Deals heute", value: communityStats.dealsToday, color: "text-secondary" },
  { icon: Coins, label: "Gespart (gesamt)", value: communityStats.savedEuroTotal, prefix: "", suffix: " €", color: "text-poke-yellow" },
  { icon: TrendingUp, label: "Beobachtete Filialen", value: communityStats.watchedStores, color: "text-emerald-400" },
];

export function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-3.5 shadow-card"
          >
            <Icon className={`h-4 w-4 ${s.color}`} />
            <p className="mt-2 font-display text-xl font-bold tabular-nums">
              <CountUp to={s.value} suffix={s.suffix} prefix={s.prefix} />
            </p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
