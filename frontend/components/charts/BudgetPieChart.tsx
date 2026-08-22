"use client";

import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { BudgetCategoryBreakdown } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";

interface BudgetPieChartProps {
  categories: BudgetCategoryBreakdown[];
  currency?: string;
}

export function BudgetPieChart({ categories, currency = "USD" }: BudgetPieChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-zinc-400">
        Loading budget distribution...
      </div>
    );
  }

  const data = categories.map((cat) => ({
    name: cat.category,
    value: cat.spent,
    color: cat.color,
  }));

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <div className="relative w-full h-72 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                return (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl backdrop-blur-xl text-xs">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">{item.name}</p>
                    <p className="text-primary font-extrabold mt-0.5">
                      {formatCurrency(Number(item.value), currency)}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {Math.round((Number(item.value) / (totalSpent || 1)) * 100)}% of total
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Total Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
          Total Spent
        </span>
        <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {formatCurrency(totalSpent, currency)}
        </span>
      </div>
    </div>
  );
}
