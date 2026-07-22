"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  Radar,
  MapPin,
  CalendarClock,
  Brain,
  Check,
  Sparkles,
  Crown,
  X,
  History,
  Filter,
  Users,
} from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { communityStats } from "@/data/community";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/count-up";
import { AlertDemoButton } from "@/components/alert-demo";
import { useToast } from "@/components/toast";
import { fireTopDealConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

// Premium-MVP (Masterliste 19.11)
const MVP = [
  { icon: BellRing, title: "Instant Drop Alerts", desc: "Sofort-Benachrichtigung bei Pokémon-Center-Drops, Online-Restocks und wichtigen Drops." },
  { icon: Radar, title: "PokéRadar", desc: "Produkt, Wunschpreis und Radius definieren – PokeDrop sucht automatisch und meldet Treffer." },
  { icon: MapPin, title: "Smart Local Alerts", desc: "Automatische Hinweise auf passende lokale und regionale Deals in deinem Umkreis." },
  { icon: CalendarClock, title: "Kalender + Release Alerts", desc: "Deals, Releases, Tauschbörsen & Messen speichern und rechtzeitig erinnert werden." },
  { icon: Brain, title: "Advanced Deal Intelligence", desc: "UVP, Marktwert, Produktalter & Deal-Qualität – auch ältere Sets clever bewertet." },
];

// Weitere Premium-Funktionen (Masterliste 19.10)
const MORE = [
  { icon: History, title: "Preisverlauf", desc: "Historische Preise, Tiefstpreise und Referenzwerte je Produkt." },
  { icon: Radar, title: "Gerüchte-Radar", desc: "Erweiterte Ansicht möglicher Drops mit Confidence-Stufe." },
  { icon: Filter, title: "Premium-Filter", desc: "Alerts nach Set, Produktart, Händler, Preis, UVP-Abweichung, Entfernung." },
  { icon: Crown, title: "Dynamischer Deal-Radius", desc: "Radius automatisch erweitern bei besonders starken Deals (z. B. −30 % UVP)." },
];

const COMPARE: { label: string; free: boolean | string; pro: boolean | string }[] = [
  { label: "Live-Bereich & Deal-Feed", free: true, pro: true },
  { label: "Standort- & Radius-Suche", free: true, pro: true },
  { label: "Merkliste", free: "3 Produkte", pro: "unbegrenzt" },
  { label: "Benachrichtigungen", free: "bis 15 Min. verzögert", pro: "sofort (Push)" },
  { label: "PokéRadar Auto-Suche", free: false, pro: true },
  { label: "Kalender-Integration & Erinnerungen", free: false, pro: true },
  { label: "Preisverlauf & Deal Intelligence", free: false, pro: true },
  { label: "Werbung", free: "mit", pro: "werbefrei" },
];

export default function PremiumPage() {
  const mounted = useMounted();
  const premium = usePokeStore((s) => s.premium);
  const setPremium = usePokeStore((s) => s.setPremium);
  const { push } = useToast();

  function upgrade() {
    setPremium(true);
    fireTopDealConfetti({ x: 0.5, y: 0.3 });
    push({
      title: "Willkommen bei Premium 🎉",
      description: "Instant Alerts, PokéRadar und Kalender sind jetzt aktiv (Demo).",
      kind: "premium",
    });
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-poke-yellow/30 bg-gradient-to-br from-amber-500/15 via-card to-card p-6 shadow-card sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-poke-yellow/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-poke-yellow/20 px-3 py-1 text-xs font-bold text-poke-yellow">
            <Sparkles className="h-3.5 w-3.5" /> PokeDrop Premium
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Sei als Erste:r dran.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Free hilft dir, Pokémon-TCG-Deals zu finden. Premium hilft dir, möglichst früh davon zu
            erfahren – Geschwindigkeit und Informationsvorsprung, wenn Produkte in Minuten weg sind.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">4,99 €</span>
              <span className="text-muted-foreground">/ Monat</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-foreground">
                <CountUp to={communityStats.premiumMembers} />
              </span>{" "}
              Premium-Mitglieder
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {mounted && premium ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-400">
                <Check className="h-4 w-4" /> Premium aktiv
              </span>
            ) : (
              <Button variant="premium" size="lg" onClick={upgrade}>
                <Crown className="h-4 w-4" /> Jetzt Premium freischalten
              </Button>
            )}
            <AlertDemoButton />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Demo-Umschalter. Im echten Betrieb via Stripe Checkout; Freischaltung serverseitig.
          </p>
        </div>
      </section>

      {/* MVP-Bausteine */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Der Premium-Kern</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MVP.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-poke-yellow/15 text-poke-yellow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Vergleich */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Free vs. Premium</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border bg-surface-2 px-4 py-3 text-sm font-semibold">
            <span>Funktion</span>
            <span className="w-20 text-center text-muted-foreground">Free</span>
            <span className="w-24 text-center text-poke-yellow">Premium</span>
          </div>
          {COMPARE.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 text-sm",
                i % 2 ? "bg-surface/40" : "",
              )}
            >
              <span>{row.label}</span>
              <span className="flex w-20 justify-center">{renderCell(row.free)}</span>
              <span className="flex w-24 justify-center font-medium">{renderCell(row.pro, true)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Weitere Funktionen */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Und mehr</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MORE.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-2 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Abschluss-CTA */}
      {mounted && !premium && (
        <section className="rounded-3xl border border-poke-yellow/30 bg-gradient-to-br from-amber-500/10 to-card p-6 text-center shadow-card">
          <h2 className="font-display text-2xl font-bold">Bereit für den Vorsprung?</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Jederzeit kündbar. Der eigentliche Hebel: Bei Produkten, die in Minuten ausverkauft
            sind, ist „15 Minuten später" wertlos.
          </p>
          <Button variant="premium" size="lg" onClick={upgrade} className="mt-4">
            <Crown className="h-4 w-4" /> Premium für 4,99 € / Monat
          </Button>
        </section>
      )}
    </div>
  );
}

function renderCell(value: boolean | string, pro?: boolean) {
  if (value === true) return <Check className={cn("h-4 w-4", pro ? "text-poke-yellow" : "text-emerald-400")} />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground/50" />;
  return <span className={cn("text-xs", pro ? "text-poke-yellow" : "text-muted-foreground")}>{value}</span>;
}
