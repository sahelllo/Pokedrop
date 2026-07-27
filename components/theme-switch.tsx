"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

/**
 * Eigener, animierter Dark-/Light-Switch.
 * Nachthimmel mit Sternen ↔ Taghimmel mit Sonne; der Knopf gleitet weich.
 */
export function ThemeSwitch({ full = false }: { full?: boolean }) {
  const mounted = useMounted();
  const theme = usePokeStore((s) => s.theme);
  const toggleTheme = usePokeStore((s) => s.toggleTheme);
  const isDark = mounted ? theme === "dark" : true;

  const toggle = (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? "Zu Light-Mode wechseln" : "Zu Dark-Mode wechseln"}
      className={cn(
        "relative flex h-8 w-[58px] shrink-0 items-center rounded-full border p-1 transition-colors duration-500",
        isDark
          ? "border-primary/25 bg-surface-2"
          : "border-black/10 bg-[#d7ead9]",
      )}
    >
      {/* Sterne (dark) */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="absolute left-2 top-2 h-0.5 w-0.5 rounded-full bg-white/90" />
        <span className="absolute left-4 top-4 h-[3px] w-[3px] rounded-full bg-white/80" />
        <span className="absolute left-6 top-1.5 h-0.5 w-0.5 rounded-full bg-white/70" />
      </span>
      {/* Wolke (light) */}
      <span
        className={cn(
          "pointer-events-none absolute right-1.5 top-2 h-2 w-4 rounded-full bg-white/80 transition-opacity duration-500",
          isDark ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Knopf */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn(
          "relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md",
          isDark
            ? "ml-0 bg-primary text-primary-foreground"
            : "ml-auto bg-[var(--radar-near)]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -60, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Moon className="h-3.5 w-3.5 text-[hsl(var(--primary-foreground))]" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-[#0b3a24]" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );

  if (!full) return toggle;

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-border bg-surface/60 px-3 py-2">
      <span className="text-sm font-medium text-muted-foreground">
        {isDark ? "Dark-Mode" : "Light-Mode"}
      </span>
      {toggle}
    </div>
  );
}
