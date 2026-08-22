"use client";

import * as React from "react";
import { LucideIcon, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface BudgetCardProps {
  title: string;
  amount: number;
  currency?: string;
  totalLimit?: number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function BudgetCard({
  title,
  amount,
  currency = "USD",
  totalLimit,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
}: BudgetCardProps) {
  const percent = totalLimit ? Math.min(100, Math.round((amount / totalLimit) * 100)) : null;

  const colorVariants: Record<string, string> = {
    default: "text-primary bg-primary/10",
    success: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-rose-500 bg-rose-500/10",
  };

  return (
    <Card className="rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
            {formatCurrency(amount, currency)}
          </h3>
        </div>
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${colorVariants[variant] || colorVariants.default}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {percent !== null && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{percent}% of limit</span>
            {totalLimit && <span>Max: {formatCurrency(totalLimit, currency)}</span>}
          </div>
          <Progress value={percent} className="h-2" />
        </div>
      )}

      {subtitle && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          {subtitle}
        </p>
      )}

      {trend && (
        <div className="flex items-center gap-1 text-xs pt-1">
          {trend.isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
          )}
          <span className={trend.isPositive ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
            {trend.value}
          </span>
          <span className="text-zinc-400 ml-1">vs last trip</span>
        </div>
      )}
    </Card>
  );
}
