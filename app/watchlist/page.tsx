"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Bell, CalendarCheck, Settings, Trash2, RotateCcw, Crown } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { productsById } from "@/data/products";
import { events as allEvents } from "@/data/events";
import { getOffersForProduct, getDealViewForOffer } from "@/lib/data";
import { DealCard } from "@/components/deal-card";
import { EventCard } from "@/components/event-card";
import { LocationRadius } from "@/components/location-radius";
import { SectionHeading, EmptyState } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatEuro } from "@/lib/utils";
import { productImageUrl } from "@/lib/images";
import { SmartImage } from "@/components/smart-image";

export default function WatchlistPage() {
  const mounted = useMounted();
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const watchlist = usePokeStore((s) => s.watchlist);
  const savedEvents = usePokeStore((s) => s.savedEvents);
  const alertRules = usePokeStore((s) => s.alertRules);
  const removeAlertRule = usePokeStore((s) => s.removeAlertRule);
  const premium = usePokeStore((s) => s.premium);
  const setPremium = usePokeStore((s) => s.setPremium);
  const theme = usePokeStore((s) => s.theme);
  const toggleTheme = usePokeStore((s) => s.toggleTheme);
  const resetOnboarding = usePokeStore((s) => s.resetOnboarding);

  const watchedDeals = React.useMemo(() => {
    if (!mounted) return [];
    return watchlist
      .map((pid) => {
        const offers = getOffersForProduct(pid);
        const views = offers
          .map((o) => getDealViewForOffer(o, location, radiusKm))
          .filter((v): v is NonNullable<typeof v> => Boolean(v))
          .sort((a, b) => b.rankScore - a.rankScore);
        return views[0];
      })
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
  }, [mounted, watchlist, location, radiusKm]);

  const savedEventObjs = mounted
    ? allEvents.filter((e) => savedEvents.includes(e.event_id))
    : [];

  if (!mounted) {
    return <div className="py-20 text-center text-muted-foreground">Lädt…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Merkliste & Einstellungen</h1>
        <p className="text-sm text-muted-foreground">Deine gemerkten Produkte, Events, Alerts und Präferenzen.</p>
      </div>

      {/* Gemerkte Produkte */}
      <section>
        <SectionHeading title="Gemerkte Produkte" subtitle={`${watchlist.length} in der Merkliste`} icon={<Heart className="h-4 w-4" />} />
        {watchedDeals.length === 0 ? (
          <EmptyState emoji="💛" title="Noch nichts gemerkt" hint="Tippe bei einem Deal auf das Herz, um es hier zu sammeln." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {watchedDeals.map((v, i) => (
              <DealCard key={v.offer.offer_id} view={v} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Aktive Alerts */}
      <section>
        <SectionHeading title="Aktive Alerts" subtitle="Benachrichtige-mich-Regeln" icon={<Bell className="h-4 w-4" />} />
        {alertRules.length === 0 ? (
          <EmptyState emoji="🔔" title="Keine Alerts aktiv" hint="Lege bei einem Produkt einen Preis- oder Restock-Alert an." />
        ) : (
          <div className="space-y-2">
            {alertRules.map((rule) => {
              const product = productsById.get(rule.product_id);
              if (!product) return null;
              return (
                <div key={rule.product_id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                  <SmartImage src={productImageUrl(product)} alt={product.product_name} energyType={product.energyType} className="h-12 w-11 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${product.product_id}`} className="block truncate text-sm font-semibold hover:text-primary">
                      {product.product_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {rule.mode === "uvp" && "Bei UVP oder günstiger"}
                      {rule.mode === "wunschpreis" && `Unter ${formatEuro(rule.wunschpreis ?? 0)}`}
                      {rule.mode === "restock" && "Bei jedem Restock"}
                      {" · "}
                      {rule.scope === "lokal" ? "lokal" : "deutschlandweit"}
                    </p>
                  </div>
                  <button onClick={() => removeAlertRule(rule.product_id)} className="rounded-full p-2 text-muted-foreground transition hover:bg-surface-2 hover:text-red-400" aria-label="Alert entfernen">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Gespeicherte Events */}
      <section>
        <SectionHeading title="Gespeicherte Events" subtitle={`${savedEventObjs.length} im Kalender`} icon={<CalendarCheck className="h-4 w-4" />} />
        {savedEventObjs.length === 0 ? (
          <EmptyState emoji="📅" title="Keine Events gespeichert" hint="Füge Tauschbörsen und Card Shows zum Kalender hinzu." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedEventObjs.map((e, i) => (
              <EventCard key={e.event_id} event={e} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Einstellungen */}
      <section>
        <SectionHeading title="Einstellungen" icon={<Settings className="h-4 w-4" />} />
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Standard-Standort & -Radius</p>
            <LocationRadius />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
            <div>
              <p className="text-sm font-semibold">Dark-Mode</p>
              <p className="text-xs text-muted-foreground">Standard ist dunkel; Light-Mode optional.</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Crown className="h-4 w-4 text-poke-yellow" /> Premium (Demo)
              </p>
              <p className="text-xs text-muted-foreground">Schaltet Premium-UI frei. Echt via Stripe.</p>
            </div>
            <Switch checked={premium} onCheckedChange={setPremium} />
          </div>

          <button
            onClick={resetOnboarding}
            className="flex w-full items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-card transition hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Onboarding erneut anzeigen
          </button>
        </div>
      </section>
    </div>
  );
}
