"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Clock, MapPin, Plus, Check, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types/activity";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface ActivityCardProps {
  activity: Activity;
  onAdd?: (activity: Activity) => void;
  isAdded?: boolean;
}

const categoryColors: Record<string, string> = {
  Food: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Adventure: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  Nature: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Nightlife: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Shopping: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20",
  Culture: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

export function ActivityCard({ activity, onAdd, isAdded = false }: ActivityCardProps) {
  return (
    <Card className="group overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 hover:shadow-card-hover transition-all duration-300 flex flex-col">
      {/* Activity Image */}
      <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge & Rating */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Badge
            variant="outline"
            className={`text-[10px] font-bold uppercase backdrop-blur-md ${
              categoryColors[activity.category] || ""
            }`}
          >
            {activity.category}
          </Badge>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-amber-400 border border-white/10">
            <Star className="h-3 w-3 fill-amber-400" />
            <span>{activity.rating}</span>
          </div>
        </div>

        {/* Location & Time of Day */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
          <span className="flex items-center gap-1 drop-shadow-sm truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {activity.cityName}
          </span>
          <span className="font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
            {activity.timeOfDay}
          </span>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {activity.title}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {activity.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2.5">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              {activity.durationText}
            </span>
            {activity.bookingRequired && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50">
                Booking required
              </span>
            )}
          </div>
        </div>

        {/* Price Tag & Add Action */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 font-medium block">Ticket / Cost</span>
            <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
              {activity.cost === 0 ? "Free Entry" : formatCurrency(activity.cost)}
            </span>
          </div>

          <Button
            size="sm"
            variant={isAdded ? "outline" : "default"}
            onClick={() => {
              if (onAdd) onAdd(activity);
              toast.success(`"${activity.title}" added to itinerary!`);
            }}
            className="rounded-xl text-xs font-semibold gap-1.5 h-8"
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Add to Day</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
