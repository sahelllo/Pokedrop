"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Kategorie-Kachel der Startseite.
 *
 * Aufbau bewusst immer gleich, damit man nach der ersten Kachel alle
 * versteht: Symbol links, große Zahl rechts, darunter Name und ein
 * kurzer Satz. Mindesthöhe 84 px, damit man mit dem Daumen sicher trifft.
 */
export function CategoryTile({
  href,
  icon: Icon,
  label,
  hint,
  count,
  accent,
  index = 0,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
  /** Zahl oben rechts. `undefined` = keine Zahl anzeigen. */
  count?: number;
  accent: string;
  index?: number;
  /** wird vor dem Seitenwechsel ausgeführt, z. B. um die Kategorie zu setzen */
  onNavigate?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.24,
        delay: Math.min(index * 0.03, 0.24),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="min-w-0"
    >
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "group relative flex min-h-[84px] min-w-0 flex-col justify-between overflow-hidden",
          "rounded-[var(--radius)] border border-border bg-card/90 p-3",
          "transition-[border-color,background] duration-200 ease-out",
          "hover:border-primary/40 active:bg-surface-2",
        )}
      >
        {/* dünne Signalkante – dasselbe Motiv wie im Seitenkopf */}
        <span
          className="absolute inset-x-0 top-0 h-px opacity-70"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent 70%)` }}
          aria-hidden
        />

        <div className="flex items-start justify-between gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
            style={{
              color: accent,
              borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            }}
          >
            <Icon className="h-4 w-4" />
          </span>
          {count != null && (
            <span
              className="font-mono text-xl font-bold leading-none tabular-nums"
              style={{ color: accent }}
            >
              {count}
            </span>
          )}
        </div>

        <div className="mt-2 min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight">{label}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
            {hint}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/** Überschrift über einer Kachelgruppe – im Geräte-Stil, klein und ruhig. */
export function TileGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">{children}</div>
    </section>
  );
}
