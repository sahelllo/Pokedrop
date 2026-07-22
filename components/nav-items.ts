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

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Deals", icon: Home, mobile: true },
  { href: "/live", label: "Live Drops", icon: Zap, mobile: true },
  { href: "/scanner", label: "Scanner", icon: ScanLine, mobile: true },
  { href: "/pokemon-center", label: "Pokémon Center", icon: Store },
  { href: "/rumors", label: "Gerüchte", icon: Radar },
  { href: "/events", label: "Events", icon: Calendar, mobile: true },
  { href: "/portfolio", label: "Portfolio", icon: Wallet, mobile: true },
  { href: "/watchlist", label: "Merkliste", icon: Heart },
  { href: "/premium", label: "Premium", icon: Sparkles },
];

export const HOT_ICON = Flame;
