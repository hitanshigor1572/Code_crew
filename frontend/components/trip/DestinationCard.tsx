"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Sun, Heart, Plus, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { City } from "@/types/city";
import { formatCurrency, getCostLevelBadge } from "@/lib/utils";
import { toast } from "sonner";

interface DestinationCardProps {
  city: City;
  isSaved?: boolean;
  onToggleSave?: (cityId: string) => void;
  onAddToTrip?: (city: City) => void;
}

export function DestinationCard({
  city,
  isSaved = false,
  onToggleSave,
  onAddToTrip,
}: DestinationCardProps) {
  return (
    <Card className="group overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 hover:shadow-card-hover transition-all duration-300 flex flex-col">
      {/* City Hero Photo */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <Badge variant="glass" className="text-[11px] font-bold">
            {getCostLevelBadge(city.costIndex)}
          </Badge>

          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleSave(city.id);
                toast(isSaved ? "Removed from Wishlist" : "Saved to Wishlist!");
              }}
              className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isSaved ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>
          )}
        </div>

        {/* Climate & Rating Pill on Image */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
              <span>{city.country}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                {city.climate.temp}°C {city.climate.condition}
              </span>
            </div>
            <h3 className="font-extrabold text-xl text-white tracking-tight leading-tight">
              {city.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-400 border border-white/10">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{city.rating}</span>
          </div>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {city.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {city.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer & Budget Info */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 font-medium block">Avg. Daily Spend</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(city.avgDailyBudget)} <span className="text-xs font-normal text-zinc-400">/day</span>
            </span>
          </div>

          {onAddToTrip ? (
            <Button
              size="sm"
              onClick={() => onAddToTrip(city)}
              className="rounded-xl text-xs font-semibold gap-1.5 h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Stop</span>
            </Button>
          ) : (
            <Link href={`/trips/create?city=${city.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold gap-1.5 h-8 hover:bg-primary hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Plan Trip</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
