import * as React from "react";
import Link from "next/link";
import { Compass, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Compass,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button className="rounded-2xl shadow-md">{actionText}</Button>
        </Link>
      )}
      {actionText && onAction && !actionHref && (
        <Button onClick={onAction} className="rounded-2xl shadow-md">
          {actionText}
        </Button>
      )}
    </div>
  );
}
