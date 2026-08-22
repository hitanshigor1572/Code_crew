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
  const [selectedDate, setSelectedDate] = React.useState<number>(12); // Day 12 of September
  const [currentMonth, setCurrentMonth] = React.useState("September 2026");

  React.useEffect(() => {
    async function loadTrips() {
      const data = await getTrips();
      setTrips(data);
    }
    loadTrips();
  }, []);

  // 30 days of September
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Calendar activities for selected day
  const activeDayActivities = [
    {
      time: "09:30 AM – 11:00 AM",
      title: "Montmartre Artisan Bakery & Croissant Trail",
      category: "Food",
      cost: 45,
      location: "Montmartre, Paris",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80",
    },
    {
      time: "02:00 PM – 05:00 PM",
      title: "Louvre Museum Priority Masterclass",
      category: "Culture",
      cost: 75,
      location: "Louvre Courtyard",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&auto=format&fit=crop&q=80",
    },
    {
      time: "07:30 PM – 10:00 PM",
      title: "Seine River Sunset Gourmet Dinner Cruise",
      category: "Food",
      cost: 110,
      location: "Port de la Bourdonnais",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop&q=80",
    },
  ];

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
            onClick={() => setCurrentMonth("August 2026")}
            className="h-8 w-8 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold px-3 text-zinc-800 dark:text-zinc-200">
            {currentMonth}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth("October 2026")}
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
                September 2026 Monthly View
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Paris Trip (12-18)
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
              {/* 2 Empty offset days for Sep 2026 starting Tuesday */}
              <div className="h-20 rounded-2xl bg-transparent" />
              <div className="h-20 rounded-2xl bg-transparent" />

              {daysInMonth.map((day) => {
                const isTripDay = day >= 12 && day <= 18;
                const isSelected = selectedDate === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
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
                          {day === 12
                            ? "Paris Arrival"
                            : day === 15
                            ? "TGV → Nice"
                            : day === 18
                            ? "Departure"
                            : "Paris Tour"}
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
                  September {selectedDate}, 2026
                </h3>
              </div>
              <Badge variant={selectedDate >= 12 && selectedDate <= 18 ? "default" : "outline"} className="text-xs">
                {selectedDate >= 12 && selectedDate <= 18 ? "Trip Day" : "Free Day"}
              </Badge>
            </div>

            {/* Hourly Agenda */}
            <div className="space-y-4">
              {selectedDate >= 12 && selectedDate <= 18 ? (
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
                    No scheduled travel events for September {selectedDate}
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
