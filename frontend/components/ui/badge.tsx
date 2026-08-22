import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        accent:
          "border-transparent bg-accent text-accent-foreground shadow-sm hover:bg-accent/80",
        destructive:
          "border-transparent bg-danger text-white shadow-sm hover:bg-danger/80",
        outline: "text-foreground border-border/80 bg-background/50",
        success: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        info: "border-transparent bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20",
        glass: "bg-white/70 dark:bg-zinc-800/70 border-white/40 dark:border-zinc-700/50 backdrop-blur-md text-foreground shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
