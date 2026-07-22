import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionHeading({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-primary">
            {icon}
          </span>
        )}
        <div>
          <h2 className="font-display text-lg font-bold leading-tight tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  emoji = "🔍",
  title,
  hint,
}: {
  emoji?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <span className="text-4xl">{emoji}</span>
      <p className="mt-3 font-display font-semibold">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function DealCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3">
      <Skeleton className="h-28 w-24 rounded-xl" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
