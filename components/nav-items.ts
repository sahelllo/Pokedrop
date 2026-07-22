import {
  Calendar,
  Flame,
  Home,
  Radar,
  Sparkles,
  Store,
  Heart,
  Zap,
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
  { href: "/pokemon-center", label: "Pokémon Center", icon: Store },
  { href: "/rumors", label: "Gerüchte", icon: Radar },
  { href: "/events", label: "Events", icon: Calendar, mobile: true },
  { href: "/watchlist", label: "Merkliste", icon: Heart, mobile: true },
  { href: "/premium", label: "Premium", icon: Sparkles, mobile: true },
];

export const HOT_ICON = Flame;
