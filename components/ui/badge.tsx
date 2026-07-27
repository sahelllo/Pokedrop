import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        muted: "border-border bg-surface-2 text-muted-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-primary/15 text-primary",
        warning: "border-transparent bg-[color-mix(in_srgb,var(--heat-1)_15%,transparent)] text-[var(--heat-1)]",
        danger: "border-transparent bg-[color-mix(in_srgb,var(--heat-4)_15%,transparent)] text-[var(--heat-4)]",
        live: "border-transparent bg-red-500/20 text-red-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
