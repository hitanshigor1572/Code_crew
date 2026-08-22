"use client";

import * as React from "react";
import Image from "next/image";
import { Clock, MapPin, CheckCircle2, Circle, MoreVertical, Trash2, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ItineraryItem } from "@/types/trip";
import { formatCurrency } from "@/lib/utils";

interface TimelineItemProps {
  item: ItineraryItem;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TimelineItem({ item, onToggleComplete, onDelete }: TimelineItemProps) {
  return (
    <div className="relative flex gap-4 group">
      {/* Timeline Bullet */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onToggleComplete && onToggleComplete(item.id)}
          className="mt-1 cursor-pointer focus:outline-none"
        >
          {item.isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-primary bg-white dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
          )}
        </button>
        <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-800 my-1 group-last:hidden" />
      </div>

      {/* Activity Card Content */}
      <div
        className={`flex-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 p-4 mb-3 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
          item.isCompleted ? "opacity-60 bg-zinc-50 dark:bg-zinc-950" : ""
        }`}
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {item.image && (
            <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.startTime ? `${item.startTime} – ${item.endTime || ""}` : item.timeSlot}
              </span>
              <Badge variant="outline" className="text-[10px] py-0">
                {item.category}
              </Badge>
            </div>

            <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate mt-0.5">
              {item.title}
            </h5>

            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {item.locationName}
            </p>
          </div>
        </div>

        {/* Cost & Delete Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {item.cost === 0 ? "Free" : formatCurrency(item.cost)}
            </span>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
