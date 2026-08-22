"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { DailySpend } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";

interface SpendingBarChartProps {
  dailySpending: DailySpend[];
  currency?: string;
}

export function SpendingBarChart({
  dailySpending,
  currency = "USD",
}: SpendingBarChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-zinc-400">
        Loading daily spending trends...
      </div>
    );
  }

  const avgLimit = dailySpending.length > 0 ? dailySpending[0].budgetLimit : 400;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dailySpending}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis
            dataKey="dayLabel"
            tick={{ fontSize: 11, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as DailySpend;
                const isOver = item.spent > item.budgetLimit;
                return (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl backdrop-blur-xl text-xs">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">{item.dayLabel}</p>
                    <p className={`font-extrabold mt-1 ${isOver ? "text-danger" : "text-primary"}`}>
                      Spent: {formatCurrency(item.spent, currency)}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Daily Cap: {formatCurrency(item.budgetLimit, currency)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            y={avgLimit}
            stroke="#EF4444"
            strokeDasharray="4 4"
            label={{
              value: "Target Cap",
              fill: "#EF4444",
              fontSize: 10,
              position: "top",
            }}
          />
          <Bar
            dataKey="spent"
            fill="#2563EB"
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
