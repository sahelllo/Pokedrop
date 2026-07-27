import { describe, expect, it } from "vitest";
import {
  ALL_CATEGORY_CHIPS,
  DEAL_CATEGORIES,
  DISCOVER_TILES,
  MY_TILES,
  countByCategory,
  matchesCategory,
  type DealCategoryId,
} from "@/lib/categories";
import { getDealViews } from "@/lib/data";
import type { DealView } from "@/types";

/**
 * Die Kachel-Zahlen auf der Startseite und die gefilterte Liste auf der
 * Angebotsseite müssen zwingend übereinstimmen – sonst tippt man auf "22"
 * und bekommt 19 Karten zu sehen. Diese Tests halten das fest.
 */

const OBERHAUSEN = { latitude: 51.4696, longitude: 6.8514 };
const NOW = new Date("2026-07-27T12:00:00Z");

function views(radiusKm = 500): DealView[] {
  return getDealViews(OBERHAUSEN, radiusKm, {}, NOW);
}

describe("Kategorien", () => {
  it("liefert für jede Kategorie genau so viele Treffer wie die Kachel anzeigt", () => {
    const all = views();
    const counts = countByCategory(all);
    for (const c of DEAL_CATEGORIES) {
      const filtered = all.filter((v) => matchesCategory(v, c.id));
      expect(filtered.length, `Kategorie ${c.id}`).toBe(counts[c.id]);
    }
  });

  it("'Alle' entspricht der Gesamtzahl", () => {
    const all = views();
    expect(countByCategory(all).alle).toBe(all.length);
    expect(all.filter((v) => matchesCategory(v, "alle")).length).toBe(all.length);
  });

  it("teilt Laden und Online lückenlos und überschneidungsfrei auf", () => {
    const all = views();
    const laden = all.filter((v) => matchesCategory(v, "laden"));
    const online = all.filter((v) => matchesCategory(v, "online"));
    expect(laden.length + online.length).toBe(all.length);
    const overlap = laden.filter((v) => online.includes(v));
    expect(overlap).toHaveLength(0);
  });

  it("zeigt unter 'Online' ausschließlich Online-Angebote", () => {
    for (const v of views().filter((v) => matchesCategory(v, "online"))) {
      expect(v.offer.validity_type).toBe("ONLINE");
    }
  });

  it("zeigt unter 'Top-Deals' ausschließlich Angebote mit Top-Badge", () => {
    for (const v of views().filter((v) => matchesCategory(v, "top"))) {
      expect(v.evaluation.badge).toBe("TOP_DEAL");
    }
  });

  it("'Unter UVP' enthält alle Top-Deals, die höchstens die UVP kosten", () => {
    const all = views();
    const uvp = all.filter((v) => matchesCategory(v, "uvp"));
    for (const v of uvp) {
      expect(v.offer.price).toBeLessThanOrEqual(v.product.reference_uvp + 0.01);
    }
    // Ein Angebot exakt zur UVP darf nicht durch Rundung herausfallen.
    const exact = all.find(
      (v) => Math.abs(v.offer.price - v.product.reference_uvp) < 0.005,
    );
    if (exact) expect(matchesCategory(exact, "uvp")).toBe(true);
  });

  it("schrumpft mit kleinerem Umkreis in jeder Kategorie", () => {
    const wide = countByCategory(views(500));
    const narrow = countByCategory(views(25));
    for (const id of Object.keys(wide) as DealCategoryId[]) {
      // Online-Angebote sind überall gleich nah – sie dürfen gleich bleiben.
      expect(narrow[id], `Kategorie ${id}`).toBeLessThanOrEqual(wide[id]);
    }
  });
});

describe("Kachel-Katalog", () => {
  it("hat eindeutige Kategorie-Kennungen", () => {
    const ids = ALL_CATEGORY_CHIPS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("verlinkt jede Bereichskachel auf einen eigenen Pfad", () => {
    const hrefs = [...DISCOVER_TILES, ...MY_TILES].map((t) => t.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const h of hrefs) expect(h.startsWith("/")).toBe(true);
  });

  it("hält die Kachel-Sätze kurz genug für eine Zeile auf dem Handy", () => {
    for (const t of [...ALL_CATEGORY_CHIPS, ...DISCOVER_TILES, ...MY_TILES]) {
      expect(t.hint.length, `Text zu lang: ${t.label}`).toBeLessThanOrEqual(28);
      expect(t.label.length, `Titel zu lang: ${t.label}`).toBeLessThanOrEqual(16);
    }
  });
});
