"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Einheitlicher Seitenkopf im Leitbild "RADAR".
 *
 * Ersetzt die früheren Verlaufs-Banner mit Farbklecksen. Aufbau immer gleich:
 * eine kleine Statuszeile in Monospace (wie eine Geräteanzeige), darunter der
 * Titel, darunter ein knapper Satz. Rechts optional eine Hauptaktion.
 */
export function PageHeader({
  status,
  title,
  subtitle,
  action,
  accent = "var(--radar-near)",
  live = false,
}: {
  status: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  accent?: string;
  live?: boolean;
}) {
  return (
    <header className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-card/80 p-4 sm:p-5">
      {/* dünne Signalkante oben – ersetzt den früheren Farbverlauf */}
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent 70%)` }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            {live ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <motion.span
                  className="absolute inline-flex h-2 w-2 rounded-full"
                  style={{ background: accent }}
                  animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
              </span>
            ) : (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            )}
            {status}
          </p>

          <h1 className="mt-2 font-display text-xl font-bold leading-tight sm:text-2xl">{title}</h1>

          {subtitle && (
            <p className="measure mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

/** Kennzahl im Geräte-Stil: große Monospace-Zahl mit kleiner Beschriftung. */
export function StatReadout({
  value,
  label,
  accent,
  className,
}: {
  value: React.ReactNode;
  label: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[var(--radius)] border border-border bg-card/80 p-3", className)}>
      <p
        className="font-mono text-xl font-bold tabular-nums leading-none"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
