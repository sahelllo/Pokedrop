"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/components/nav-items";
import { ActivityTicker } from "@/components/activity-ticker";
import { HoloBackground } from "@/components/holo-background";
import { ThemeSwitch } from "@/components/theme-switch";
import { ChatWidget } from "@/components/chat-widget";
import { usePokeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const premium = usePokeStore((s) => s.premium);

  return (
    <div className="relative min-h-dvh">
      <HoloBackground />
      {/* Desktop-Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border glass lg:flex">
        <div className="flex h-16 items-center gap-2 px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="side-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary/10 ring-1 ring-primary/30"
                  />
                )}
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
                {item.href === "/premium" && !premium && (
                  <span className="ml-auto rounded-full bg-poke-yellow/20 px-1.5 py-0.5 text-[10px] font-bold text-poke-yellow">
                    PRO
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <ThemeSwitch full />
        </div>
      </aside>

      {/* Topbar (mobil + Desktop-Offset) */}
      <header className="sticky top-0 z-30 border-b border-border glass lg:pl-64">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="hidden flex-1 lg:block">
            <ActivityTicker />
          </div>
          <div className="flex items-center gap-2">
            {!premium && (
              <Button asChild size="sm" variant="premium" className="hidden sm:inline-flex">
                <Link href="/premium">
                  <Sparkles className="h-3.5 w-3.5" /> Premium
                </Link>
              </Button>
            )}
            <Link
              href="/watchlist"
              aria-label="Merkliste & Einstellungen"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60 text-muted-foreground transition hover:text-foreground lg:hidden"
            >
              <Heart className="h-4 w-4" />
            </Link>
            <div className="lg:hidden">
              <ThemeSwitch />
            </div>
          </div>
        </div>
        <div className="border-t border-border/60 px-2 py-1.5 lg:hidden">
          <ActivityTicker />
        </div>
      </header>

      {/* Hauptbereich */}
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4 lg:pl-64 lg:pb-10">
        <div className="lg:pl-6">{children}</div>
      </main>

      {/* Bottom-Nav (mobil) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {NAV_ITEMS.filter((i) => i.mobile).map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
              >
                <span
                  className={cn(
                    "flex h-8 w-12 items-center justify-center rounded-full transition",
                    active ? "bg-primary/20 text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Support-Chat (global) */}
      <ChatWidget />
    </div>
  );
}

function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary text-lg shadow-glow-red">
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
        ⚡
      </span>
      {!compact ? (
        <span className="font-display text-xl font-bold tracking-tight">
          Poke<span className="text-primary">Drop</span>
        </span>
      ) : (
        <span className="font-display text-lg font-bold tracking-tight">
          Poke<span className="text-primary">Drop</span>
        </span>
      )}
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
