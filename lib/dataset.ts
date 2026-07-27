"use client";

import { create } from "zustand";
import { retailers as seedRetailers } from "@/data/retailers";
import { stores as seedStores } from "@/data/stores";
import { products as seedProducts } from "@/data/products";
import { offers as seedOffers } from "@/data/offers";
import { liveDrops as seedDrops } from "@/data/drops";
import { rumors as seedRumors } from "@/data/rumors";
import { events as seedEvents } from "@/data/events";
import type {
  LiveDrop,
  Offer,
  PokeEvent,
  Product,
  Retailer,
  Rumor,
  Store,
} from "@/types";

/**
 * Aktive Datenquelle der App.
 *
 * Start immer mit den mitgelieferten Seed-Daten – dadurch ist die erste
 * Darstellung sofort da und identisch mit dem serverseitig erzeugten HTML
 * (keine Hydration-Konflikte). Ist Supabase konfiguriert, werden die echten
 * Daten nachgeladen und ersetzen den Datensatz; schlägt das fehl, bleibt es
 * bei den Seed-Daten.
 */

export interface Dataset {
  retailers: Retailer[];
  stores: Store[];
  products: Product[];
  offers: Offer[];
  drops: LiveDrop[];
  rumors: Rumor[];
  events: PokeEvent[];
  // abgeleitete Nachschlagetabellen
  storesById: Map<string, Store>;
  productsById: Map<string, Product>;
  retailersByBrand: Map<string, Retailer>;
}

export function buildDataset(input: {
  retailers: Retailer[];
  stores: Store[];
  products: Product[];
  offers: Offer[];
  drops: LiveDrop[];
  rumors: Rumor[];
  events: PokeEvent[];
}): Dataset {
  return {
    ...input,
    storesById: new Map(input.stores.map((s) => [s.store_id, s])),
    productsById: new Map(input.products.map((p) => [p.product_id, p])),
    retailersByBrand: new Map(input.retailers.map((r) => [r.retailer_brand, r])),
  };
}

const seedDataset = buildDataset({
  retailers: seedRetailers,
  stores: seedStores,
  products: seedProducts,
  offers: seedOffers,
  drops: seedDrops,
  rumors: seedRumors,
  events: seedEvents,
});

/**
 * Modulweite Referenz auf den aktuellen Datensatz.
 * Die reinen Query-Funktionen in lib/data.ts lesen hierüber, damit sie
 * unverändert (nicht als Hooks) nutzbar bleiben.
 */
let current: Dataset = seedDataset;

export function getDataset(): Dataset {
  return current;
}

export type DataSource = "seed" | "db";

interface DatasetState {
  /** erhöht sich, sobald ein neuer Datensatz aktiv wird – als Render-Auslöser */
  version: number;
  source: DataSource;
  loading: boolean;
  error: string | null;
  applyDataset: (d: Dataset, source: DataSource) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
}

export const useDatasetState = create<DatasetState>((set) => ({
  version: 0,
  source: "seed",
  loading: false,
  error: null,
  applyDataset: (d, source) => {
    current = d;
    set((s) => ({ version: s.version + 1, source, loading: false, error: null }));
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));

/**
 * Komponenten, die aus dem Datensatz lesen, rufen dies auf und hängen den
 * Rückgabewert in ihre useMemo-Abhängigkeiten – so rechnen sie neu, sobald
 * die Datenbankdaten eintreffen.
 */
export function useDatasetVersion(): number {
  return useDatasetState((s) => s.version);
}
