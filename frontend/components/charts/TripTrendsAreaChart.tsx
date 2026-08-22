"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TripTrendsAreaChartProps {
  data: { month: string; users: number; trips: number }[];
}

export function TripTrendsAreaChart({ data }: TripTrendsAreaChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-zinc-400">
        Loading analytics trend...
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val > 999 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3.5 shadow-xl backdrop-blur-xl text-xs space-y-1">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">{label}</p>
                    <p className="text-primary font-semibold flex items-center justify-between gap-4">
                      <span>Active Users:</span>
                      <strong>{payload[0]?.value?.toLocaleString()}</strong>
                    </p>
                    <p className="text-accent font-semibold flex items-center justify-between gap-4">
                      <span>Trips Planned:</span>
                      <strong>{payload[1]?.value?.toLocaleString()}</strong>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#userGrad)"
          />
          <Area
            type="monotone"
            dataKey="trips"
            stroke="#14B8A6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#tripGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
