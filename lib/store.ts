"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  // Premium (nur Demo-Anzeige – echter Status käme serverseitig)
  premium: boolean;
  setPremium: (v: boolean) => void;

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

      premium: false,
      setPremium: (premium) => set({ premium }),

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
        premium: s.premium,
        theme: s.theme,
        onboarded: s.onboarded,
      }),
    },
  ),
);
