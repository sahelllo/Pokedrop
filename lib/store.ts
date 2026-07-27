"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DealCategoryId } from "@/lib/categories";

export interface UserLocation {
  name: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
}

export interface AlertRule {
  product_id: string;
  mode: "uvp" | "wunschpreis" | "restock";
  wunschpreis?: number;
  scope: "lokal" | "deutschlandweit";
}

export interface PortfolioItem {
  product_id: string;
  qty: number;
  /** ISO-Zeitpunkt der Aufnahme in die Sammlung (ältere Einträge haben ihn nicht) */
  addedAt?: string;
  /** wie es in die Sammlung kam */
  source?: "scan" | "manuell";
  /** der gescannte Strichcode, falls per Kamera erfasst */
  barcode?: string;
}

interface PokeDropState {
  // Standort & Radius (Masterliste 6 / 17)
  location: UserLocation;
  radiusKm: number;
  setLocation: (loc: UserLocation) => void;
  setRadius: (km: number) => void;

  // Lieblings-Sets (Onboarding-Personalisierung)
  favoriteSets: string[];
  toggleFavoriteSet: (set: string) => void;

  // Watchlist
  watchlist: string[]; // product_ids
  toggleWatch: (productId: string) => void;
  isWatched: (productId: string) => boolean;

  // gespeicherte Events
  savedEvents: string[];
  toggleSavedEvent: (eventId: string) => void;

  // Alert-Regeln (Benachrichtige-mich)
  alertRules: AlertRule[];
  setAlertRule: (rule: AlertRule) => void;
  removeAlertRule: (productId: string) => void;

  // Eigene Barcode-Zuordnungen: Strichcode -> product_id.
  // Damit lernt der Scanner Produkte, deren EAN noch nicht im Katalog steht.
  barcodeMappings: Record<string, string>;
  addBarcodeMapping: (barcode: string, productId: string) => void;
  removeBarcodeMapping: (barcode: string) => void;

  // Portfolio / Sammlung (Collection-Tracking)
  portfolio: PortfolioItem[];
  addToPortfolio: (productId: string, meta?: Pick<PortfolioItem, "source" | "barcode">) => void;
  removeFromPortfolio: (productId: string) => void;
  setPortfolioQty: (productId: string, qty: number) => void;
  isInPortfolio: (productId: string) => boolean;

  // Premium (nur Demo-Anzeige – echter Status käme serverseitig)
  premium: boolean;
  setPremium: (v: boolean) => void;

  // Gewählte Angebots-Kategorie (Startseite -> Angebotsseite).
  // Bewusst NICHT gespeichert: Beim nächsten Besuch soll wieder "Alle"
  // stehen, sonst wundert man sich, warum die Liste kurz ist.
  dealCategory: DealCategoryId;
  setDealCategory: (id: DealCategoryId) => void;

  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Onboarding
  onboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const DEFAULT_LOCATION: UserLocation = {
  name: "Oberhausen",
  postal_code: "46045",
  latitude: 51.4696,
  longitude: 6.8514,
};

export const usePokeStore = create<PokeDropState>()(
  persist(
    (set, get) => ({
      location: DEFAULT_LOCATION,
      radiusKm: 100,
      setLocation: (location) => set({ location }),
      setRadius: (radiusKm) => set({ radiusKm }),

      favoriteSets: [],
      toggleFavoriteSet: (s) =>
        set((state) => ({
          favoriteSets: state.favoriteSets.includes(s)
            ? state.favoriteSets.filter((x) => x !== s)
            : [...state.favoriteSets, s],
        })),

      watchlist: [],
      toggleWatch: (productId) =>
        set((state) => ({
          watchlist: state.watchlist.includes(productId)
            ? state.watchlist.filter((x) => x !== productId)
            : [...state.watchlist, productId],
        })),
      isWatched: (productId) => get().watchlist.includes(productId),

      savedEvents: [],
      toggleSavedEvent: (eventId) =>
        set((state) => ({
          savedEvents: state.savedEvents.includes(eventId)
            ? state.savedEvents.filter((x) => x !== eventId)
            : [...state.savedEvents, eventId],
        })),

      alertRules: [],
      setAlertRule: (rule) =>
        set((state) => ({
          alertRules: [
            ...state.alertRules.filter((r) => r.product_id !== rule.product_id),
            rule,
          ],
        })),
      removeAlertRule: (productId) =>
        set((state) => ({
          alertRules: state.alertRules.filter((r) => r.product_id !== productId),
        })),

      barcodeMappings: {},
      addBarcodeMapping: (barcode, productId) =>
        set((state) => ({
          barcodeMappings: { ...state.barcodeMappings, [barcode]: productId },
        })),
      removeBarcodeMapping: (barcode) =>
        set((state) => {
          const next = { ...state.barcodeMappings };
          delete next[barcode];
          return { barcodeMappings: next };
        }),

      portfolio: [],
      addToPortfolio: (productId, meta) =>
        set((state) =>
          state.portfolio.find((p) => p.product_id === productId)
            ? {
                portfolio: state.portfolio.map((p) =>
                  p.product_id === productId
                    ? {
                        ...p,
                        qty: p.qty + 1,
                        // Ein späterer Scan darf die Herkunft ergänzen, aber
                        // das ursprüngliche Aufnahmedatum nicht überschreiben.
                        source: p.source ?? meta?.source,
                        barcode: p.barcode ?? meta?.barcode,
                      }
                    : p,
                ),
              }
            : {
                portfolio: [
                  ...state.portfolio,
                  {
                    product_id: productId,
                    qty: 1,
                    addedAt: new Date().toISOString(),
                    source: meta?.source ?? "manuell",
                    barcode: meta?.barcode,
                  },
                ],
              },
        ),
      removeFromPortfolio: (productId) =>
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.product_id !== productId),
        })),
      setPortfolioQty: (productId, qty) =>
        set((state) =>
          qty <= 0
            ? { portfolio: state.portfolio.filter((p) => p.product_id !== productId) }
            : {
                portfolio: state.portfolio.map((p) =>
                  p.product_id === productId ? { ...p, qty } : p,
                ),
              },
        ),
      isInPortfolio: (productId) => get().portfolio.some((p) => p.product_id === productId),

      premium: false,
      setPremium: (premium) => set({ premium }),

      dealCategory: "alle",
      setDealCategory: (dealCategory) => set({ dealCategory }),

      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      onboarded: false,
      completeOnboarding: () => set({ onboarded: true }),
      resetOnboarding: () => set({ onboarded: false }),
    }),
    {
      name: "pokedrop-store",
      // Nur Nutzereinstellungen persistieren (localStorage ist im echten
      // Next.js-Projekt für Standort/Radius/Watchlist völlig ok, Abschnitt 3).
      partialize: (s) => ({
        location: s.location,
        radiusKm: s.radiusKm,
        favoriteSets: s.favoriteSets,
        watchlist: s.watchlist,
        savedEvents: s.savedEvents,
        alertRules: s.alertRules,
        portfolio: s.portfolio,
        barcodeMappings: s.barcodeMappings,
        premium: s.premium,
        theme: s.theme,
        onboarded: s.onboarded,
      }),
    },
  ),
);
