"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  List,
  CalendarDays,
  DollarSign,
  MapPin,
  Clock,
  Layers,
  Loader2,
  Train,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TimelineItem } from "@/components/trip/TimelineItem";
import { getTripById } from "@/lib/services/trip.service";
import { Trip, ItineraryDay } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";

// ─── Time Slot Config ────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { key: "Morning",   label: "Morning",   icon: "🌅", color: "bg-amber-400",   textColor: "text-amber-700",   light: "bg-amber-50 dark:bg-amber-950/30",   border: "border-amber-200 dark:border-amber-800",   barColor: "#f59e0b", startHour: 6,  endHour: 12 },
  { key: "Afternoon", label: "Afternoon", icon: "☀️", color: "bg-orange-400",  textColor: "text-orange-700",  light: "bg-orange-50 dark:bg-orange-950/30",  border: "border-orange-200 dark:border-orange-800",  barColor: "#fb923c", startHour: 12, endHour: 18 },
  { key: "Evening",   label: "Evening",   icon: "🌆", color: "bg-violet-500",  textColor: "text-violet-700",  light: "bg-violet-50 dark:bg-violet-950/30",  border: "border-violet-200 dark:border-violet-800",  barColor: "#8b5cf6", startHour: 18, endHour: 21 },
  { key: "Night",     label: "Night",     icon: "🌙", color: "bg-indigo-600",  textColor: "text-indigo-700",  light: "bg-indigo-50 dark:bg-indigo-950/30",  border: "border-indigo-200 dark:border-indigo-800",  barColor: "#4f46e5", startHour: 21, endHour: 24 },
];

// ─── Gantt / Timeline Bar Component ──────────────────────────────────────────
function DayTimelineBar({ day }: { day: ItineraryDay }) {
  // Count items per slot
  const slotCounts = TIME_SLOTS.map((slot) => ({
    ...slot,
    count: day.items.filter((item) => item.timeSlot === slot.key).length,
  }));
  const total = day.items.length;
  if (total === 0) return null;

  // 24h bar: each slot occupies its proportional width by hour range
  const totalHours = 18; // 6am to midnight
  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Daily Timeline</p>
      {/* Hour labels */}
      <div className="flex text-[9px] text-zinc-400 font-mono mb-0.5">
        {["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"].map((label) => (
          <span key={label} className="flex-1 text-center first:text-left last:text-right">
            {label}
          </span>
        ))}
      </div>
      {/* Timeline bar */}
      <div className="h-6 rounded-full overflow-hidden flex bg-zinc-100 dark:bg-zinc-800 relative">
        {TIME_SLOTS.map((slot) => {
          const slotItems = day.items.filter((i) => i.timeSlot === slot.key);
          if (!slotItems.length) return null;
          const widthPct = ((slot.endHour - slot.startHour) / totalHours) * 100;
          const leftPct = ((slot.startHour - 6) / totalHours) * 100;
          return (
            <div
              key={slot.key}
              title={`${slot.label}: ${slotItems.length} activit${slotItems.length > 1 ? "ies" : "y"}`}
              style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: slot.barColor }}
              className="absolute top-0 bottom-0 flex items-center justify-center"
            >
              <span className="text-white text-[9px] font-bold truncate px-1">
                {slot.icon} {slotItems.length}
              </span>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-1">
        {slotCounts
          .filter((s) => s.count > 0)
          .map((slot) => (
            <span key={slot.key} className="flex items-center gap-1 text-[10px] text-zinc-500">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ backgroundColor: slot.barColor }}
              />
              {slot.icon} {slot.label} ({slot.count})
            </span>
          ))}
      </div>
    </div>
  );
}

// ─── Per-slot grouping ────────────────────────────────────────────────────────
function DaySlotGroup({
  slot,
  items,
}: {
  slot: typeof TIME_SLOTS[0];
  items: ItineraryDay["items"];
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-1">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${slot.light} ${slot.border} border`}>
        <span className="text-base leading-none">{slot.icon}</span>
        <span className={`text-xs font-bold ${slot.textColor}`}>{slot.label}</span>
        <Badge variant="outline" className={`text-[10px] ml-auto ${slot.textColor}`}>
          {items.length}
        </Badge>
      </div>
      <div className="pl-3 border-l-2 space-y-1" style={{ borderColor: slot.barColor + "55" }}>
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Fallback sample days ─────────────────────────────────────────────────────
const SAMPLE_DAYS: ItineraryDay[] = [
  {
    id: "day-1",
    dayNumber: 1,
    date: new Date().toISOString().slice(0, 10),
    cityId: "city-paris",
    cityName: "Paris",
    themeTitle: "Arrival, Saint-Germain Walk & Eiffel Tower Sunset",
    items: [
      {
        id: "i1",
        title: "Montmartre Pastry & Bakery Trail",
        category: "Food",
        timeSlot: "Morning",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        cost: 45,
        locationName: "Montmartre",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "i2",
        title: "Louvre Priority Masterclass",
        category: "Culture",
        timeSlot: "Afternoon",
        startTime: "2:00 PM",
        endTime: "5:00 PM",
        cost: 75,
        locationName: "Louvre Museum",
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "i3",
        title: "Eiffel Tower Sunset Summit Access",
        category: "Culture",
        timeSlot: "Evening",
        startTime: "06:30 PM",
        endTime: "08:30 PM",
        cost: 45,
        locationName: "Champ de Mars",
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "day-2",
    dayNumber: 2,
    date: "",
    cityId: "city-paris",
    cityName: "Paris",
    themeTitle: "Louvre Museum Art Tour & Seine Dinner Cruise",
    items: [
      {
        id: "i4",
        title: "Seine Gourmet Dinner Cruise",
        category: "Food",
        timeSlot: "Night",
        startTime: "08:00 PM",
        endTime: "10:30 PM",
        cost: 110,
        locationName: "Port de la Bourdonnais",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
      },
    ],
  },
];

export default function DayWiseItineraryPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"list" | "timeline">("timeline");

  React.useEffect(() => {
    async function loadTrip() {
      try {
        const data = await getTripById(tripId);
        setTrip(data);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 gap-3 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm">Loading day-wise schedule…</span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-xl font-bold">Trip not found</h3>
        <Link href="/trips">
          <Button className="rounded-2xl">Return to My Trips</Button>
        </Link>
      </div>
    );
  }

  const days = trip.itinerary.length > 0 ? trip.itinerary : SAMPLE_DAYS;
  const totalCost = days
    .flatMap((d) => d.items)
    .reduce((sum, item) => sum + (item.cost || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href={`/trips/${trip.id}/builder`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Builder</span>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Day-by-Day Agenda
            </span>
            <Badge variant="outline" className="text-xs">
              {days.length} Days
            </Badge>
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 dark:border-emerald-800">
              {formatCurrency(totalCost)} Activities
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            {trip.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            {formatDateRange(trip.startDate, trip.endDate)} •{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {formatCurrency(trip.totalBudget, trip.currency)}
            </strong>{" "}
            Total Budget
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-2xl text-xs gap-1.5 h-9"
          >
            <List className="h-4 w-4" />
            <span>List</span>
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
            className="rounded-2xl text-xs gap-1.5 h-9"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Timeline</span>
          </Button>
        </div>
      </div>

      {/* ─── Timeline View ──────────────────────────────────────────────────── */}
      {viewMode === "timeline" && (
        <div className="space-y-6">
          {days.map((day: ItineraryDay) => {
            const dayCost = day.items.reduce((sum, i) => sum + (i.cost || 0), 0);
            return (
              <Card
                key={day.id}
                className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {day.date && (
                          <span className="text-xs font-mono text-zinc-400">
                            {day.date}
                          </span>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          <MapPin className="h-2.5 w-2.5 mr-1" />
                          {day.cityName}
                        </Badge>
                      </div>
                      <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 mt-0.5">
                        {day.themeTitle || `Day ${day.dayNumber}`}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400 font-semibold">Activities</p>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {day.items.length} planned
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400 font-semibold">Day Cost</p>
                      <p className="text-xs font-bold text-emerald-600">
                        {dayCost === 0 ? "Free" : formatCurrency(dayCost)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gantt Timeline Bar */}
                {day.items.length > 0 && <DayTimelineBar day={day} />}

                {/* Activities grouped by time slot */}
                <div className="mt-4 space-y-4">
                  {day.items.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-400 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                      No activities scheduled for this day yet.
                    </div>
                  ) : (
                    TIME_SLOTS.map((slot) => {
                      const slotItems = day.items.filter((i) => i.timeSlot === slot.key);
                      return <DaySlotGroup key={slot.key} slot={slot} items={slotItems} />;
                    })
                  )}
                </div>

                {/* Transport leg */}
                {day.transportLeg && (
                  <div className="mt-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-xs border border-zinc-200 dark:border-zinc-800">
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-semibold">
                      <Train className="h-4 w-4 text-primary" />
                      {day.transportLeg.carrier}: {day.transportLeg.fromCity} →{" "}
                      {day.transportLeg.toCity} ({day.transportLeg.duration})
                    </span>
                    <span className="font-bold">{formatCurrency(day.transportLeg.cost)}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── List View ───────────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {days.map((day: ItineraryDay) => {
            const dayCost = day.items.reduce((sum, i) => sum + (i.cost || 0), 0);
            return (
              <Card
                key={day.id}
                className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        {day.date && (
                          <span className="text-xs font-bold text-zinc-400">{day.date}</span>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {day.cityName}
                        </Badge>
                      </div>
                      <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                        {day.themeTitle || `Day ${day.dayNumber}`}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {day.items.length} Activities
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        {dayCost === 0 ? "Free" : formatCurrency(dayCost)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {day.items.length === 0 ? (
                    <p className="text-xs text-center py-4 text-zinc-400">No activities yet.</p>
                  ) : (
                    day.items.map((item: any) => (
                      <TimelineItem key={item.id} item={item} />
                    ))
                  )}
                </div>

                {day.transportLeg && (
                  <div className="mt-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-semibold">
                      <Train className="h-4 w-4 text-primary" />
                      {day.transportLeg.carrier}: {day.transportLeg.fromCity} →{" "}
                      {day.transportLeg.toCity} ({day.transportLeg.duration})
                    </span>
                    <span className="font-bold">{formatCurrency(day.transportLeg.cost)}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
