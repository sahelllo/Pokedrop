import type { Product } from "@/types";
import { RARITY_META, rarityOf, type RarityTier } from "@/lib/rarity";
import { cn } from "@/lib/utils";

/**
 * Seltenheits-Abzeichen.
 *
 * Wie die Deal-Badges eine feste Form: kleiner Punkt in der Stufenfarbe,
 * daneben das Wort. Die Farbskala ist dieselbe wie beim Deal-Heat-Balken –
 * blaugrau ist gewöhnlich, rot ist heiß.
 */
export function RarityPill({
  product,
  tier,
  className,
  showReason = false,
}: {
  product?: Product;
  tier?: RarityTier;
  className?: string;
  /** zusätzlich den Klartext-Grund darunter zeigen */
  showReason?: boolean;
}) {
  const info = product ? rarityOf(product) : undefined;
  const t = tier ?? info?.tier ?? "standard";
  const meta = RARITY_META[t];

  return (
    <span className={cn("inline-flex flex-col gap-0.5", className)}>
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
        style={{
          color: meta.color,
          borderColor: `color-mix(in srgb, ${meta.color} 45%, transparent)`,
          background: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
        {meta.label}
      </span>
      {showReason && info && (
        <span className="text-[10px] leading-snug text-muted-foreground">{info.reason}</span>
      )}
    </span>
  );
}
