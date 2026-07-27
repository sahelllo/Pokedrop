import {
  Calendar,
  Flame,
  Home,
  Radar,
  Sparkles,
  Store,
  Heart,
  Zap,
  ScanLine,
  Wallet,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  /** in der mobilen Bottom-Nav zeigen? */
  mobile?: boolean;
}

/**
 * Reihenfolge = Wichtigkeit. Die ersten fünf mit `mobile: true` stehen
 * unten in der Handy-Leiste; alles Weitere erreicht man über die Kacheln
 * auf der Startseite, also mit höchstens zwei Tipps.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Start", icon: Home, mobile: true },
  { href: "/deals", label: "Angebote", icon: Flame, mobile: true },
  { href: "/live", label: "Live", icon: Zap, mobile: true },
  { href: "/events", label: "Events", icon: Calendar, mobile: true },
  { href: "/portfolio", label: "Sammlung", icon: Wallet, mobile: true },
  { href: "/scanner", label: "Scanner", icon: ScanLine },
  { href: "/pokemon-center", label: "Pokémon Center", icon: Store },
  { href: "/rumors", label: "Gerüchte", icon: Radar },
  { href: "/watchlist", label: "Merkliste", icon: Heart },
  { href: "/premium", label: "Premium", icon: Sparkles },
];

export const HOT_ICON = Flame;
