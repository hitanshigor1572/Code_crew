"use client";

import * as React from "react";
import Image from "next/image";
import { Clock, MapPin, CheckCircle2, Trash2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ItineraryItem } from "@/types/trip";
import { formatCurrency } from "@/lib/utils";

interface TimelineItemProps {
  item: ItineraryItem;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SLOT_STYLES: Record<string, { border: string; icon: string; badge: string; dot: string }> = {
  Morning:   { border: "border-l-amber-400",   icon: "🌅", badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",   dot: "bg-amber-400" },
  Afternoon: { border: "border-l-orange-400",  icon: "☀️", badge: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",  dot: "bg-orange-400" },
  Evening:   { border: "border-l-violet-500",  icon: "🌆", badge: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800",  dot: "bg-violet-500" },
  Night:     { border: "border-l-indigo-500",  icon: "🌙", badge: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800",  dot: "bg-indigo-500" },
};

export function TimelineItem({ item, onToggleComplete, onDelete }: TimelineItemProps) {
  const slotStyle = SLOT_STYLES[item.timeSlot] || SLOT_STYLES.Morning;

  return (
    <div className="relative flex gap-3 group">
      {/* Completion toggle bullet */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleComplete && onToggleComplete(item.id)}
          className={`focus:outline-none transition-transform hover:scale-110 ${onToggleComplete ? "cursor-pointer" : "cursor-default"}`}
          disabled={!onToggleComplete}
        >
          {item.isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <div className={`h-5 w-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center`}>
              <div className={`h-2 w-2 rounded-full ${slotStyle.dot}`} />
            </div>
          )}
        </button>
        <div className="w-0.5 flex-1 bg-zinc-100 dark:bg-zinc-800/80 my-1 group-last:hidden min-h-[12px]" />
      </div>

      {/* Activity Card */}
      <div
        className={`flex-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 mb-3 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 ${slotStyle.border} ${
          item.isCompleted ? "opacity-60" : ""
        }`}
      >
        <div className="flex gap-3 p-3.5 items-start sm:items-center">
          {/* Image */}
          {item.image && (
            <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              {item.isCompleted && (
                <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Time slot + Category badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${slotStyle.badge}`}>
                <span>{slotStyle.icon}</span>
                {item.startTime ? `${item.startTime}${item.endTime ? ` – ${item.endTime}` : ""}` : item.timeSlot}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 h-4">
                {item.category}
              </Badge>
              {item.isCompleted && (
                <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                  ✓ Done
                </Badge>
              )}
            </div>

            <h5
              className={`font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-tight ${
                item.isCompleted ? "line-through text-zinc-400" : ""
              }`}
            >
              {item.title}
            </h5>

            {item.locationName && (
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 truncate">
                <MapPin className="h-3 w-3 shrink-0 text-zinc-300" />
                {item.locationName}
              </p>
            )}
          </div>

          {/* Cost + Delete */}
          <div className="flex flex-col items-end gap-2 shrink-0 pl-2">
            <div className="text-right">
              <span className={`text-sm font-extrabold ${item.cost === 0 ? "text-emerald-500" : "text-zinc-900 dark:text-zinc-100"}`}>
                {item.cost === 0 ? "Free" : formatCurrency(item.cost)}
              </span>
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Remove activity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
