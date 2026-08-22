"use client";

import * as React from "react";
import Image from "next/image";
import {
  GripVertical,
  MapPin,
  Calendar,
  Building,
  Plane,
  Train,
  Car,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Bed,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CityStop, TransportType } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";

interface ItineraryStopBlockProps {
  stop: CityStop;
  index: number;
  totalStops: number;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDelete?: (id: string) => void;
  onAddHotel?: (stopId: string) => void;
}

const transportIconMap: Record<string, any> = {
  flight: Plane,
  train: Train,
  car: Car,
};

export function ItineraryStopBlock({
  stop,
  index,
  totalStops,
  onMoveUp,
  onMoveDown,
  onDelete,
  onAddHotel,
}: ItineraryStopBlockProps) {
  return (
    <div className="relative">
      {/* City Stop Card */}
      <Card className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Left info & Drag Handle */}
          <div className="flex items-center gap-3.5">
            <div className="flex flex-col items-center gap-1 text-zinc-400">
              <span className="h-7 w-7 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-primary/30">
                {index + 1}
              </span>
            </div>

            <div className="relative h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
              <Image
                src={stop.coverImage}
                alt={stop.cityName}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                  {stop.cityName}
                </h4>
                <Badge variant="outline" className="text-[10px]">
                  {stop.country}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3 text-primary" />
                {formatDateRange(stop.arrivalDate, stop.departureDate)} • {stop.stayDurationDays} Nights
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            {onMoveUp && index > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMoveUp(index)}
                className="h-8 w-8 rounded-xl text-zinc-500"
                aria-label="Move stop up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}

            {onMoveDown && index < totalStops - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMoveDown(index)}
                className="h-8 w-8 rounded-xl text-zinc-500"
                aria-label="Move stop down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}

            {onDelete && totalStops > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(stop.id)}
                className="h-8 w-8 rounded-xl text-zinc-400 hover:text-danger hover:bg-danger/10"
                aria-label="Delete stop"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Hotel Accommodation Block */}
        {stop.hotel ? (
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-50/80 dark:bg-zinc-800/50 p-3 rounded-2xl gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center shrink-0">
                <Bed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {stop.hotel.name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                  {stop.hotel.address}
                </p>
              </div>
            </div>
            <div className="text-right self-end sm:self-center">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(stop.hotel.totalCost)}
              </span>
              <span className="text-[10px] text-zinc-400 block">
                {formatCurrency(stop.hotel.costPerNight)}/night
              </span>
            </div>
          </div>
        ) : (
          onAddHotel && (
            <div className="mt-3 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => onAddHotel(stop.id)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 border border-dashed border-primary/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Hotel or Accommodation Booking</span>
              </button>
            </div>
          )
        )}
      </Card>

      {/* Transit Connector between stops */}
      {index < totalStops - 1 && (
        <div className="flex items-center justify-center my-3 relative">
          <div className="h-8 w-0.5 bg-gradient-to-b from-primary to-secondary absolute -top-3 z-0" />
          <Badge
            variant="glass"
            className="z-10 text-[11px] font-semibold gap-1.5 px-3 py-1 shadow-sm border border-zinc-200 dark:border-zinc-800"
          >
            <Train className="h-3 w-3 text-secondary" />
            <span>High-Speed Rail / Flight Connection (~2-4 hrs)</span>
          </Badge>
        </div>
      )}
    </div>
  );
}
