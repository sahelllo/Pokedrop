"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Crosshair, MapPin, Sparkles } from "lucide-react";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { KNOWN_CITIES } from "@/data/stores";
import { ALL_SETS } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OnboardingGate() {
  const mounted = useMounted();
  const onboarded = usePokeStore((s) => s.onboarded);
  if (!mounted || onboarded) return null;
  return <Onboarding />;
}

function Onboarding() {
  const [step, setStep] = React.useState(0);
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const setLocation = usePokeStore((s) => s.setLocation);
  const setRadius = usePokeStore((s) => s.setRadius);
  const favoriteSets = usePokeStore((s) => s.favoriteSets);
  const toggleFavoriteSet = usePokeStore((s) => s.toggleFavoriteSet);
  const complete = usePokeStore((s) => s.completeOnboarding);

  const steps = ["Willkommen", "Standort", "Umkreis", "Lieblings-Sets"];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-glow"
      >
        {/* Progress */}
        <div className="flex gap-1.5 p-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-surface-2",
              )}
            />
          ))}
        </div>

        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-primary text-3xl shadow-glow-red">
                    ⚡
                  </div>
                  <h2 className="font-display text-2xl font-bold">
                    Willkommen bei Poke<span className="text-primary">Drop</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Der Live-Radar für Pokémon-TCG-Deals, Drops und Events in deiner Nähe –
                    zur UVP oder günstiger. In 3 Schritten personalisiert.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <StepTitle icon={<MapPin className="h-5 w-5" />} title="Wo bist du?" subtitle="Für Deals & Events in deiner Nähe." />
                  <Button
                    variant="outline"
                    className="mb-3 w-full justify-start"
                    onClick={() => {
                      if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) =>
                            setLocation({ name: "Mein Standort", latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                          () => {},
                        );
                      }
                    }}
                  >
                    <Crosshair className="h-4 w-4" /> Standort automatisch verwenden
                  </Button>
                  <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto">
                    {KNOWN_CITIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setLocation({ name: c.name, postal_code: c.postal_code, latitude: c.latitude, longitude: c.longitude })}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-left text-sm transition",
                          location.name === c.name
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border bg-surface/60 hover:bg-surface-2",
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <StepTitle icon={<Crosshair className="h-5 w-5" />} title="Wie weit suchen?" subtitle="Größerer Radius = mehr Deals & Events." />
                  <div className="rounded-2xl border border-border bg-surface/60 p-5 text-center">
                    <span className="font-display text-4xl font-bold text-primary">{radiusKm}</span>
                    <span className="ml-1 text-lg text-muted-foreground">km</span>
                    <Slider
                      value={[radiusKm]}
                      min={5}
                      max={500}
                      step={5}
                      onValueChange={(v) => setRadius(v[0])}
                      className="mt-5"
                    />
                    <div className="mt-3 flex justify-center gap-1.5">
                      {[50, 100, 300, 500].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadius(r)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs transition",
                            radiusKm === r ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground",
                          )}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <StepTitle icon={<Sparkles className="h-5 w-5" />} title="Deine Lieblings-Sets" subtitle="Optional – für passende Alerts. Später änderbar." />
                  <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto">
                    {ALL_SETS.map((s) => {
                      const active = favoriteSets.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleFavoriteSet(s)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition",
                            active
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border bg-surface/60 text-muted-foreground",
                          )}
                        >
                          {active && <Check className="h-3 w-3" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={complete}
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Überspringen
            </button>
            <Button
              onClick={() => (step < 3 ? setStep(step + 1) : complete())}
              className="min-w-28"
            >
              {step < 3 ? "Weiter" : "Los geht's"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StepTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
