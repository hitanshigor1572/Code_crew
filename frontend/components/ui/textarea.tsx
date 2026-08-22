import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 shadow-sm backdrop-blur-sm transition-all duration-200 placeholder:text-zinc-400 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-primary dark:focus-visible:ring-primary/30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
