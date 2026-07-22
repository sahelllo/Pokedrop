"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Sparkles, Zap, ChevronRight, Quote } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { getDealViews, type DealFilters } from "@/lib/data";
import { liveDrops } from "@/data/drops";
import { testimonials, featuredIn, communityStats } from "@/data/community";
import { DealCard } from "@/components/deal-card";
import { LiveDropCard } from "@/components/live-drop-card";
import { FilterBar } from "@/components/filter-bar";
import { LocationRadius } from "@/components/location-radius";
import { StatsStrip } from "@/components/stats-strip";
import { SectionHeading, EmptyState, DealCardSkeleton } from "@/components/section";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/smart-image";
import { avatarUrl } from "@/lib/images";
import { CountUp } from "@/components/count-up";

export default function HomePage() {
  const mounted = useMounted();
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const [filters, setFilters] = React.useState<DealFilters>({});

  const views = React.useMemo(() => {
    if (!mounted) return [];
    return getDealViews(location, radiusKm, filters);
  }, [mounted, location, radiusKm, filters]);

  const topDeals = views.filter((v) => v.evaluation.badge === "TOP_DEAL").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live-Radar aktiv ·{" "}
            <span className="font-semibold text-foreground">
              <CountUp to={communityStats.dealsToday} /> Deals
            </span>{" "}
            heute gefunden
          </div>
          <h1 className="max-w-2xl font-display text-2xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">
            Pokémon-Karten zur <span className="text-primary">UVP oder günstiger</span> – in deiner Nähe.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            PokeDrop scannt Prospekte, Händler, Pokémon-Center-Restocks und Social Media. Deals,
            Drops und Events – standortbezogen, mit echter UVP- vs. Marktpreis-Bewertung.
          </p>
        </div>
      </section>

      {/* Standort + Radius */}
      <LocationRadius />

      {/* Community-Statistiken */}
      <StatsStrip />

      {/* Live-Vorschau */}
      <section>
        <SectionHeading
          title="Live Drops & Restocks"
          subtitle="Pokémon Center & große Online-Händler – gerade eben"
          icon={<Zap className="h-4 w-4" />}
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/live">
                Alle <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {liveDrops.slice(0, 6).map((drop, i) => (
            <div key={drop.drop_id} className="w-[290px] shrink-0">
              <LiveDropCard drop={drop} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Filter */}
      <div id="feed">
        <SectionHeading
          title="Deals in deiner Nähe"
          subtitle={`Standort: ${mounted ? location.name : "…"} · ${radiusKm} km Umkreis`}
          icon={<Flame className="h-4 w-4" />}
        />
        <FilterBar filters={filters} onChange={setFilters} resultCount={views.length} />
      </div>

      {/* Top-Deals-Highlight */}
      {mounted && topDeals.length > 0 && (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-secondary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-secondary">
              Top Deals im Radius
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {topDeals.map((v, i) => (
              <DealCard key={v.offer.offer_id} view={v} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Feed */}
      <section>
        {!mounted ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        ) : views.length === 0 ? (
          <EmptyState
            title="Keine Angebote im aktuellen Radius"
            hint="Erhöhe den Umkreis oder setze die Filter zurück – z. B. 300–500 km für seltene Deals."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {views.map((v, i) => (
              <DealCard key={v.offer.offer_id} view={v} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Premium-CTA */}
      <PremiumTeaser />

      {/* Social Proof */}
      <section>
        <SectionHeading title="Von Sammlern geliebt" icon={<Sparkles className="h-4 w-4" />} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <Quote className="h-5 w-5 text-primary/50" />
              <p className="mt-2 text-sm">{t.text}</p>
              <div className="mt-3 flex items-center gap-2">
                <SmartImage src={avatarUrl(t.avatarSeed)} alt={t.name} className="h-8 w-8 rounded-full" />
                <div>
                  <p className="text-xs font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.handle} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 opacity-70">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Bekannt aus</span>
          {featuredIn.map((f) => (
            <span key={f} className="font-display text-sm font-semibold text-muted-foreground">
              {f}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function PremiumTeaser() {
  const premium = usePokeStore((s) => s.premium);
  if (premium) return null;
  return (
    <section className="relative overflow-hidden rounded-3xl border border-poke-yellow/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 shadow-card sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-poke-yellow/20 blur-3xl" />
      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-poke-yellow/20 px-2.5 py-0.5 text-xs font-bold text-poke-yellow">
            <Sparkles className="h-3.5 w-3.5" /> PokeDrop Premium
          </div>
          <h3 className="mt-2 font-display text-xl font-bold">
            Sei als Erste:r dran – Instant Drop Alerts
          </h3>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            PokéRadar, Smart Local Alerts, Kalender-Integration und Deal Intelligence.
            Bei Produkten, die in Minuten weg sind, entscheidet Geschwindigkeit.
          </p>
        </div>
        <Button asChild variant="premium" size="lg" className="shrink-0">
          <Link href="/premium">
            Premium ansehen <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
