"use client";

import * as React from "react";
import { Sun, Cloud, CloudRain, Wind, Droplets, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  cityName?: string;
  temp?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: string;
}

export function WeatherCard({
  cityName = "Paris, France",
  temp = 21,
  condition = "Partly Sunny",
  humidity = 58,
  windSpeed = "12 km/h",
}: WeatherCardProps) {
  const forecast = [
    { day: "Today", temp: "21°", icon: Sun, label: "Sunny" },
    { day: "Tomorrow", temp: "19°", icon: Cloud, label: "Partly Cloudy" },
    { day: "Wed", temp: "23°", icon: Sun, label: "Sunny" },
    { day: "Thu", temp: "18°", icon: CloudRain, label: "Showers" },
    { day: "Fri", temp: "20°", icon: Sun, label: "Clear" },
  ];

  return (
    <Card className="rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-sky-500/10 via-primary/5 to-transparent backdrop-blur-xl relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider mb-2">
            Live Destination Weather
          </Badge>
          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{cityName}</h4>
          <p className="text-xs text-zinc-500">{condition} • Ideal for sightseeing</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <Sun className="h-8 w-8 text-amber-500 animate-[spin_20s_linear_infinite]" />
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {temp}°C
            </span>
          </div>
        </div>
      </div>

      {/* Atmospheric Indicators */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-xs text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-sky-500" />
          <span>Humidity: {humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-teal-500" />
          <span>Wind: {windSpeed}</span>
        </div>
      </div>

      {/* 5-Day Mini Forecast */}
      <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center">
        {forecast.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="p-1.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
              <span className="text-[10px] text-zinc-400 font-medium block">{f.day}</span>
              <Icon className="h-4 w-4 mx-auto my-1 text-primary" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{f.temp}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
