"use client";

import { getSupabase } from "@/lib/supabase";
import { buildDataset, type Dataset } from "@/lib/dataset";
import type {
  AvailabilityStatus,
  EnergyType,
  EventType,
  LiveDrop,
  Offer,
  PokeEvent,
  Product,
  ProductLanguage,
  ProductType,
  Retailer,
  Rumor,
  SourceType,
  StockSignal,
  ValidityType,
  VerificationStatus,
} from "@/types";

/**
 * Lädt den kompletten Datensatz aus Supabase und bringt ihn in exakt die
 * Formen, die die App ohnehin verwendet. Dadurch laufen Deal-Bewertung,
 * Geo-Logik und Ranking unverändert über denselben, getesteten Code.
 */

const MINUTE = 60_000;

function minutesAgo(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / MINUTE));
}

export async function fetchLiveDataset(): Promise<Dataset | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const [
      retailersRes,
      locationsRes,
      productsRes,
      offersRes,
      offerLocationsRes,
      dropsRes,
      rumorsRes,
      eventsRes,
    ] = await Promise.all([
      sb.from("retailers").select("*"),
      sb.from("retailer_locations").select("*"),
      sb.from("products").select("*, product_sets(set_name, set_code)"),
      sb.from("offers").select("*"),
      sb.from("offer_locations").select("offer_id, location_id"),
      sb.from("drops").select("*"),
      sb.from("rumors").select("*"),
      sb.from("events").select("*"),
    ]);

    const firstError = [
      retailersRes, locationsRes, productsRes, offersRes,
      offerLocationsRes, dropsRes, rumorsRes, eventsRes,
    ].find((r) => r.error)?.error;
    if (firstError) throw new Error(firstError.message);

    // --- Nachschlagetabellen für die Zuordnung ---------------------------
    const retailerById = new Map<string, { group: string; brand: string }>();
    const retailers: Retailer[] = (retailersRes.data ?? []).map((r) => {
      retailerById.set(r.id, { group: r.retailer_group, brand: r.retailer_brand });
      return {
        retailer_group: r.retailer_group,
        retailer_brand: r.retailer_brand,
        displayName: r.display_name,
        status: r.status,
        regionality: r.regionality ?? "",
        typical_products: "",
        priority: r.crawler_tier === 1 ? "sehr_hoch" : r.crawler_tier === 2 ? "hoch" : "mittel",
        crawlerTier: (r.crawler_tier ?? 3) as 1 | 2 | 3,
        brandColor: r.brand_color ?? "#888888",
        category: r.kind === "online" ? "online" : "supermarkt",
      };
    });

    // Filialen: external_store_id ist die ID, die die App kennt
    const locationIdToStoreId = new Map<string, string>();
    const stores = (locationsRes.data ?? []).map((l) => {
      const storeId = l.external_store_id ?? l.id;
      locationIdToStoreId.set(l.id, storeId);
      const ret = retailerById.get(l.retailer_id);
      const [lng, lat] = parsePoint(l.location);
      return {
        store_id: storeId,
        retailer_group: ret?.group ?? "",
        retailer_brand: ret?.brand ?? "",
        regional_company: l.regional_company ?? undefined,
        store_name: l.store_name,
        street: l.street ?? "",
        city: l.city,
        postal_code: l.postal_code ?? "",
        latitude: lat,
        longitude: lng,
      };
    });

    // Produkte: slug ist die product_id der App
    const productIdToSlug = new Map<string, string>();
    const products: Product[] = (productsRes.data ?? []).map((p) => {
      productIdToSlug.set(p.id, p.slug);
      const set = Array.isArray(p.product_sets) ? p.product_sets[0] : p.product_sets;
      return {
        product_id: p.slug,
        product_name: p.product_name,
        set_name: set?.set_name ?? "",
        set_code: set?.set_code ?? undefined,
        product_type: p.category as ProductType,
        ean: p.ean ?? undefined,
        sku: p.sku ?? undefined,
        language: p.language as ProductLanguage,
        release_date: p.release_date,
        reference_uvp: Number(p.reference_uvp),
        uvp_source: p.uvp_source ?? "",
        market_reference_price: Number(p.market_reference_price),
        good_deal_threshold: Number(p.good_deal_threshold ?? 0),
        great_deal_threshold: Number(p.great_deal_threshold ?? 0),
        price_reference_updated_at: p.price_reference_updated_at ?? "",
        availability_status: p.availability_status as AvailabilityStatus,
        pokemonArtworkId: p.pokemon_artwork_id ?? undefined,
        energyType: (p.energy_type ?? undefined) as EnergyType | undefined,
      };
    });

    // Teilnehmende Filialen je Angebot
    const storesByOffer = new Map<string, string[]>();
    for (const row of offerLocationsRes.data ?? []) {
      const storeId = locationIdToStoreId.get(row.location_id);
      if (!storeId) continue;
      const list = storesByOffer.get(row.offer_id) ?? [];
      list.push(storeId);
      storesByOffer.set(row.offer_id, list);
    }

    const offers: Offer[] = (offersRes.data ?? []).map((o) => {
      const ret = retailerById.get(o.retailer_id);
      return {
        offer_id: o.id,
        product_id: productIdToSlug.get(o.product_id) ?? o.product_id,
        retailer_group: ret?.group ?? "",
        retailer_brand: ret?.brand ?? "",
        price: Number(o.price),
        regular_price: o.regular_price != null ? Number(o.regular_price) : undefined,
        valid_from: o.valid_from,
        valid_until: o.valid_until,
        validity_type: o.validity_type as ValidityType,
        participating_store_ids: storesByOffer.get(o.id) ?? [],
        source_type: (o.source_type ?? "Prospekt") as SourceType,
        source_url: o.source_url ?? undefined,
        verification_status: o.verification_status as VerificationStatus,
        stock_signal: (o.stock_signal ?? undefined) as StockSignal | undefined,
        stock_signal_at: o.stock_signal_at ?? undefined,
        found_minutes_ago: minutesAgo(o.seen_at),
      };
    });

    const drops: LiveDrop[] = (dropsRes.data ?? []).map((d) => ({
      drop_id: d.id,
      product_id: productIdToSlug.get(d.product_id) ?? d.product_id,
      kind: d.kind,
      source_name: d.source_name ?? "Online-Händler",
      source_url: d.source_url ?? undefined,
      isPokemonCenter: Boolean(d.is_pokemon_center),
      price: d.price != null ? Number(d.price) : undefined,
      minutes_ago: minutesAgo(d.drop_at),
      availability: d.availability as StockSignal,
      hot: Boolean(d.hot),
    }));

    const rumors: Rumor[] = (rumorsRes.data ?? []).map((r) => ({
      rumor_id: r.id,
      title: r.title,
      body: r.body ?? "",
      status: r.status,
      source_type: (r.source_type ?? "Community-Fund") as SourceType,
      source_handle: r.source_handle ?? undefined,
      source_count: r.source_count ?? 1,
      posted_minutes_ago: minutesAgo(r.posted_at),
      product_id: r.product_id ? productIdToSlug.get(r.product_id) : undefined,
      confidence: Number(r.confidence),
    }));

    const events: PokeEvent[] = (eventsRes.data ?? []).map((e) => {
      const [lng, lat] = parsePoint(e.location);
      return {
        event_id: e.id,
        event_name: e.event_name,
        event_type: e.event_type as EventType,
        date_start: e.date_start,
        date_end: e.date_end ?? undefined,
        opening_hours: e.opening_hours ?? undefined,
        venue_name: e.venue_name,
        street: e.street ?? "",
        postal_code: e.postal_code ?? "",
        city: e.city,
        latitude: lat,
        longitude: lng,
        organizer: e.organizer ?? "",
        official_source: e.official_source ?? undefined,
        ticket_price: e.ticket_price != null ? Number(e.ticket_price) : undefined,
        ticket_url: e.ticket_url ?? undefined,
        pokemon_focus: e.pokemon_focus,
        trading_available: Boolean(e.trading_available),
        verification_status: e.verification_status,
        last_checked: e.last_checked ?? "",
      };
    });

    // Ohne Produkte oder Angebote waere die App leer – dann lieber Seed-Daten.
    if (products.length === 0 || offers.length === 0) return null;

    return buildDataset({ retailers, stores, products, offers, drops, rumors, events });
  } catch (err) {
    console.warn("[PokeDrop] Laden aus Supabase fehlgeschlagen, nutze Demo-Daten:", err);
    return null;
  }
}

/**
 * PostGIS liefert `geography` je nach Einstellung als GeoJSON-Objekt oder als
 * WKB-Hex-String. Beides wird hier zu [lng, lat] aufgelöst.
 */
function parsePoint(value: unknown): [number, number] {
  if (!value) return [0, 0];
  if (typeof value === "object" && value !== null && "coordinates" in value) {
    const c = (value as { coordinates: number[] }).coordinates;
    return [Number(c?.[0] ?? 0), Number(c?.[1] ?? 0)];
  }
  if (typeof value === "string") {
    // GeoJSON als Text
    if (value.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(value) as { coordinates?: number[] };
        if (parsed.coordinates) return [Number(parsed.coordinates[0]), Number(parsed.coordinates[1])];
      } catch {
        /* faellt unten durch */
      }
    }
    // WKB-Hex (Little Endian Point mit SRID)
    const wkb = decodeWkbPoint(value);
    if (wkb) return wkb;
  }
  return [0, 0];
}

function decodeWkbPoint(hex: string): [number, number] | null {
  if (!/^[0-9A-Fa-f]+$/.test(hex) || hex.length < 42) return null;
  try {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    const view = new DataView(bytes.buffer);
    const little = bytes[0] === 1;
    const type = view.getUint32(1, little);
    const hasSrid = (type & 0x20000000) !== 0;
    const offset = hasSrid ? 9 : 5;
    const lng = view.getFloat64(offset, little);
    const lat = view.getFloat64(offset + 8, little);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
    return [lng, lat];
  } catch {
    return null;
  }
}
