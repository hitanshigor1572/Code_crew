"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Compass,
  Sparkles,
  Plane,
  Train,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTrips } from "@/lib/services/trip.service";
import { Trip } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";

export default function CalendarTimelinePage() {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [selectedDate, setSelectedDate] = React.useState("2026-09-12");
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date(2026, 8, 1));

  React.useEffect(() => {
    async function loadTrips() {
      const data = await getTrips();
      setTrips(data);
    }
    loadTrips();
  }, []);

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const monthStartOffset = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const itineraryEvents = trips.flatMap((trip) => trip.itinerary.flatMap((day) => day.items.map((item) => ({
    date: day.date,
    time: item.startTime && item.endTime ? `${item.startTime} – ${item.endTime}` : day.cityName,
    title: item.title,
    category: item.category,
    cost: item.cost,
    location: item.locationName,
    image: item.image || trip.coverImage,
    tripTitle: trip.title,
  }))));
  const activeDayActivities = itineraryEvents.filter((event) => event.date === selectedDate);
  const selectedTrip = trips.find((trip) => selectedDate >= trip.startDate && selectedDate <= trip.endDate);
  const selectedDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const shiftMonth = (offset: number) => setCurrentMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Global Schedule
            </span>
            <Badge variant="outline" className="text-xs">
              Synchronized Timelines
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Trip Calendar & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Monthly overview and interactive daily schedules with conflict detection.
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-2xl shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => shiftMonth(-1)}
            className="h-8 w-8 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold px-3 text-zinc-800 dark:text-zinc-200">
            {monthLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => shiftMonth(1)}
            className="h-8 w-8 rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Monthly Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                {monthLabel} Monthly View
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <span className="h-2 w-2 rounded-full bg-primary" /> {trips.length} planned trip{trips.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-400 py-1 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: monthStartOffset }, (_, index) => <div key={`offset-${index}`} className="h-20 rounded-2xl bg-transparent" />)}

              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const date = `${monthKey}-${String(day).padStart(2, "0")}`;
                const dayEvents = itineraryEvents.filter((event) => event.date === date);
                const isTripDay = dayEvents.length > 0 || trips.some((trip) => date >= trip.startDate && date <= trip.endDate);
                const isSelected = selectedDate === date;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`h-20 rounded-2xl p-2 text-left border transition-all duration-200 flex flex-col justify-between relative group ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/40 bg-primary/10"
                        : isTripDay
                        ? "border-primary/30 bg-primary/5 hover:border-primary"
                        : "border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? "text-primary" : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {day}
                      </span>
                      {isTripDay && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>

                    {isTripDay && (
                      <div className="truncate">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary text-white block truncate">
                            {dayEvents[0]?.title || trips.find((trip) => date >= trip.startDate && date <= trip.endDate)?.title || "Trip day"}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Day Inspector Drawer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Day Inspector
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {selectedDateLabel}
                </h3>
              </div>
              <Badge variant={selectedTrip ? "default" : "outline"} className="text-xs">
                {selectedTrip ? "Trip Day" : "Free Day"}
              </Badge>
            </div>

            {/* Hourly Agenda */}
            <div className="space-y-4">
              {activeDayActivities.length > 0 ? (
                activeDayActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 space-y-2 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {act.time}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {act.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={act.image} alt={act.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-50 truncate">
                          {act.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3" />
                          {act.location}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Estimated Cost:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(act.cost)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <CalendarIcon className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    No scheduled travel events for {selectedDateLabel}
                  </p>
                  <Link href="/trips/create">
                    <Button size="sm" variant="outline" className="rounded-xl text-xs mt-3">
                      Schedule Trip on this Date
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
