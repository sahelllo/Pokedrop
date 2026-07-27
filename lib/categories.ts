import {
  Calendar,
  Flame,
  Globe,
  Heart,
  LayoutGrid,
  Radar,
  ScanLine,
  ShieldCheck,
  Store,
  Tag,
  Wallet,
  Zap,
} from "lucide-react";
import type { DealView } from "@/types";

/**
 * Kategorien der Startseite.
 *
 * Hintergrund: Die Startseite war ein einziger langer Strom aus Angeboten –
 * auf dem Handy kaum überschaubar. Stattdessen gibt es jetzt eine Übersicht
 * aus Kacheln: pro Kategorie eine Kachel mit Zahl. Man sieht auf einen Blick,
 * was es gerade gibt, und tippt gezielt weiter.
 *
 * Damit Kachel-Zahl und gefilterte Liste garantiert zusammenpassen, gibt es
 * genau eine Regel pro Kategorie: `matchesCategory`. Sie wird sowohl fürs
 * Zählen als auch fürs Filtern benutzt.
 */

export type DealCategoryId = "alle" | "top" | "uvp" | "laden" | "online";

export interface DealCategory {
  id: DealCategoryId;
  /** Beschriftung auf Kachel und Filter-Chip */
  label: string;
  /** Ein Satz Alltagssprache – erklärt die Kategorie ohne Fachwörter */
  hint: string;
  icon: typeof Flame;
  accent: string;
}

export const DEAL_CATEGORIES: DealCategory[] = [
  {
    id: "top",
    label: "Top-Deals",
    hint: "Weit unter Normalpreis",
    icon: Flame,
    accent: "var(--heat-4)",
  },
  {
    id: "uvp",
    label: "Unter UVP",
    hint: "Höchstens Packungspreis",
    icon: Tag,
    accent: "var(--radar-near)",
  },
  {
    id: "laden",
    label: "Im Laden",
    hint: "Zum Abholen in der Nähe",
    icon: Store,
    accent: "var(--radar-mid)",
  },
  {
    id: "online",
    label: "Online",
    hint: "Nach Hause bestellen",
    icon: Globe,
    accent: "var(--radar-online)",
  },
];

/** Zusätzlicher Chip auf der Angebotsseite: "alles anzeigen". */
export const CATEGORY_ALL: DealCategory = {
  id: "alle",
  label: "Alle",
  hint: "Alles im Umkreis",
  icon: LayoutGrid,
  accent: "var(--radar-far)",
};

export const ALL_CATEGORY_CHIPS: DealCategory[] = [CATEGORY_ALL, ...DEAL_CATEGORIES];

/** Die eine Regel pro Kategorie – für Zählen und Filtern identisch. */
export function matchesCategory(v: DealView, id: DealCategoryId): boolean {
  switch (id) {
    case "alle":
      return true;
    case "top":
      return v.evaluation.badge === "TOP_DEAL";
    case "uvp":
      // Cent-Toleranz, damit 54,99 € bei UVP 54,99 € nicht durchfällt.
      return v.offer.price <= v.product.reference_uvp + 0.01;
    case "laden":
      return v.offer.validity_type !== "ONLINE";
    case "online":
      return v.offer.validity_type === "ONLINE";
  }
}

export function countByCategory(
  views: DealView[],
): Record<DealCategoryId, number> {
  const out: Record<DealCategoryId, number> = {
    alle: views.length,
    top: 0,
    uvp: 0,
    laden: 0,
    online: 0,
  };
  for (const v of views) {
    for (const c of DEAL_CATEGORIES) {
      if (matchesCategory(v, c.id)) out[c.id] += 1;
    }
  }
  return out;
}

/* ---- Bereiche der App (zweite und dritte Kachelgruppe) ---------------- */

export interface HubTile {
  href: string;
  label: string;
  hint: string;
  icon: typeof Flame;
  accent: string;
}

export const DISCOVER_TILES: HubTile[] = [
  {
    href: "/live",
    label: "Live Drops",
    hint: "Gerade wieder verfügbar",
    icon: Zap,
    accent: "var(--heat-3)",
  },
  {
    href: "/events",
    label: "Events",
    hint: "Turniere & Tauschtreffen",
    icon: Calendar,
    accent: "var(--radar-online)",
  },
  {
    href: "/rumors",
    label: "Gerüchte",
    hint: "Was bald kommen soll",
    icon: Radar,
    accent: "var(--heat-1)",
  },
  {
    href: "/pokemon-center",
    label: "Pokémon Center",
    hint: "Der offizielle Shop",
    icon: Store,
    accent: "var(--radar-mid)",
  },
];

export const MY_TILES: HubTile[] = [
  {
    href: "/watchlist",
    label: "Merkliste",
    hint: "Deine gemerkten Produkte",
    icon: Heart,
    accent: "var(--heat-4)",
  },
  {
    href: "/portfolio",
    label: "Sammlung",
    hint: "Was du besitzt, plus Wert",
    icon: Wallet,
    accent: "var(--radar-near)",
  },
  {
    href: "/scanner",
    label: "Scanner",
    hint: "Mit der Kamera erkennen",
    icon: ScanLine,
    accent: "var(--radar-online)",
  },
  {
    href: "/premium",
    label: "Premium",
    hint: "Alarm ohne Verzögerung",
    icon: ShieldCheck,
    accent: "var(--heat-1)",
  },
];
