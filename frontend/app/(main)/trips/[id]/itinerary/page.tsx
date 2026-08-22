"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  List,
  CalendarDays,
  ArrowLeft,
  Share2,
  Download,
  Plus,
  Train,
  Plane,
  Bed,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineItem } from "@/components/trip/TimelineItem";
import { getTripById } from "@/lib/services/trip.service";
import { Trip, ItineraryDay } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";

export default function DayWiseItineraryPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"list" | "timeline">("list");
  const [selectedDayNumber, setSelectedDayNumber] = React.useState<number>(1);

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
    return <div className="p-12 text-center text-xs text-zinc-400">Loading day-wise schedule...</div>;
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/trips/${trip.id}/builder`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Builder</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Day-by-Day Agenda
            </span>
            <Badge variant="outline" className="text-xs">
              {trip.itinerary.length > 0 ? trip.itinerary.length : trip.totalDays} Days Structured
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            {trip.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            {formatDateRange(trip.startDate, trip.endDate)} • Total Budget:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {formatCurrency(trip.totalBudget, trip.currency)}
            </strong>
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-2xl text-xs gap-1.5 h-9"
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
            className="rounded-2xl text-xs gap-1.5 h-9"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Timeline View</span>
          </Button>
        </div>
      </div>

      {/* Day-Wise Breakdown Content */}
      <div className="space-y-6">
        {(trip.itinerary.length > 0 ? trip.itinerary : [
          {
            id: "day-1",
            dayNumber: 1,
            date: trip.startDate,
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
            date: "2026-09-13",
            cityId: "city-paris",
            cityName: "Paris",
            themeTitle: "Louvre Museum Art Tour & Seine Dinner Cruise",
            items: [
              {
                id: "i3",
                title: "Louvre Priority Masterclass",
                category: "Culture",
                timeSlot: "Morning",
                startTime: "09:30 AM",
                endTime: "12:30 PM",
                cost: 75,
                locationName: "Louvre Courtyard",
                image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80",
              },
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
        ]).map((day: any) => (
          <Card
            key={day.id}
            className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-2">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-primary/20">
                  D{day.dayNumber}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">
                      {day.date || "Scheduled Date"}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {day.cityName}
                    </Badge>
                  </div>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                    {day.themeTitle}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {day.items.length} Activities Planned
                </span>
              </div>
            </div>

            {/* Activities List for Day */}
            <div className="space-y-1">
              {day.items.map((item: any) => (
                <TimelineItem key={item.id} item={item} />
              ))}
            </div>

            {/* Transport leg if present */}
            {day.transportLeg && (
              <div className="mt-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-semibold">
                  <Train className="h-4 w-4 text-primary" />
                  {day.transportLeg.carrier}: {day.transportLeg.fromCity} → {day.transportLeg.toCity} ({day.transportLeg.duration})
                </span>
                <span className="font-bold">{formatCurrency(day.transportLeg.cost)}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
