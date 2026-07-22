import { BADGE_META, VERIFICATION_META } from "@/lib/deals";
import type { DealBadge, VerificationStatus } from "@/types";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export function DealBadgePill({
  badge,
  className,
  size = "md",
}: {
  badge: DealBadge;
  className?: string;
  size?: "sm" | "md";
}) {
  const meta = BADGE_META[badge];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
      style={{
        color: meta.color,
        background: meta.bg,
        borderColor: meta.ring,
        boxShadow: badge === "TOP_DEAL" ? `0 0 18px -4px ${meta.ring}` : undefined,
      }}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

export function VerificationPill({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  const meta = VERIFICATION_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium",
        className,
      )}
      style={{ color: meta.color }}
      title={meta.label}
    >
      <ShieldCheck className="h-3 w-3" />
      {meta.short}
    </span>
  );
}
