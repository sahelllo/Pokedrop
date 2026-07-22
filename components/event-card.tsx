"use client";

import { motion } from "framer-motion";
import {
  CalendarPlus,
  Clock,
  MapPin,
  Repeat,
  Ticket,
  Users,
  Star,
} from "lucide-react";
import type { EventType, PokeEvent, EventVerification } from "@/types";
import { usePokeStore } from "@/lib/store";
import { useToast } from "@/components/toast";
import { cn, formatDateDE, formatEuro, formatKm } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TYPE_META: Record<EventType, { emoji: string; color: string }> = {
  Tauschbörse: { emoji: "🔄", color: "text-primary" },
  "Card Show": { emoji: "⭐", color: "text-poke-yellow" },
  Sammelkartenmesse: { emoji: "🏟️", color: "text-secondary" },
  "Community-Treffen": { emoji: "👥", color: "text-emerald-400" },
  Turnier: { emoji: "🏆", color: "text-amber-400" },
  Sammlerbörse: { emoji: "📦", color: "text-muted-foreground" },
};

const VERIF: Record<EventVerification, { label: string; cls: string }> = {
  bestaetigt: { label: "bestätigt", cls: "text-emerald-400" },
  wahrscheinlich: { label: "wahrscheinlich", cls: "text-amber-400" },
  unbestaetigt: { label: "unbestätigt", cls: "text-muted-foreground" },
  abgesagt: { label: "abgesagt", cls: "text-red-400 line-through" },
};

export function EventCard({
  event,
  distanceKm,
  index = 0,
}: {
  event: PokeEvent;
  distanceKm?: number;
  index?: number;
}) {
  const type = TYPE_META[event.event_type];
  const verif = VERIF[event.verification_status];
  const saved = usePokeStore((s) => s.savedEvents.includes(event.event_id));
  const toggleSaved = usePokeStore((s) => s.toggleSavedEvent);
  const premium = usePokeStore((s) => s.premium);
  const { push } = useToast();

  function handleCalendar() {
    toggleSaved(event.event_id);
    push({
      title: saved ? "Aus Kalender entfernt" : "Zum Kalender hinzugefügt",
      description: premium
        ? `${event.event_name} · Erinnerung 1 Tag vorher`
        : `${event.event_name} · Premium: eigene Erinnerungszeiten`,
      kind: premium ? "success" : "premium",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-glow"
    >
      <div className="flex">
        {/* Datum-Spalte */}
        <div className="flex w-20 shrink-0 flex-col items-center justify-center border-r border-border bg-surface-2 p-3 text-center">
          <span className="text-2xl">{type.emoji}</span>
          <span className="mt-1 font-display text-lg font-bold leading-none">
            {new Date(event.date_start).getDate()}
          </span>
          <span className="text-[11px] uppercase text-muted-foreground">
            {new Date(event.date_start).toLocaleDateString("de-DE", { month: "short" })}
          </span>
        </div>

        <div className="min-w-0 flex-1 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-sm font-semibold leading-snug">{event.event_name}</h3>
            <span className={cn("shrink-0 text-[10px] font-medium", verif.cls)}>{verif.label}</span>
          </div>
          <p className={cn("text-xs font-medium", type.color)}>{event.event_type}</p>

          <div className="mt-2 grid gap-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {event.venue_name}, {event.city}
              {distanceKm !== undefined && ` · ${formatKm(distanceKm)}`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {formatDateDE(event.date_start)}
              {event.date_end && ` – ${formatDateDE(event.date_end)}`}
              {event.opening_hours && ` · ${event.opening_hours}`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              {event.organizer}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {event.trading_available && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                <Repeat className="h-3 w-3" /> Tauschen möglich
              </span>
            )}
            {event.pokemon_focus === "pokemon_only" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] text-secondary">
                <Star className="h-3 w-3" /> Pokémon-only
              </span>
            )}
            {event.ticket_price != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">
                <Ticket className="h-3 w-3" />
                {event.ticket_price === 0 ? "frei" : formatEuro(event.ticket_price)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <Button
              size="sm"
              variant={saved ? "subtle" : "outline"}
              onClick={handleCalendar}
              className="h-8"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              {saved ? "Gespeichert" : "Zum Kalender"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
