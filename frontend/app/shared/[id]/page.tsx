"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Share2,
  Copy,
  Check,
  Plane,
  Train,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InteractiveTripMap } from "@/components/map/InteractiveTripMap";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { getTripById, cloneTrip } from "@/lib/services/trip.service";
import { Trip } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function SharedPublicItineraryPage() {
  const params = useParams();
  const tripId = params.id as string;
  const router = useRouter();

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [isCloning, setIsCloning] = React.useState(false);

  React.useEffect(() => {
    async function loadSharedTrip() {
      try {
        const data = await getTripById(tripId);
        setTrip(data);
      } finally {
        setLoading(false);
      }
    }
    loadSharedTrip();
  }, [tripId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Public itinerary link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloneTrip = async () => {
    if (!trip) return;
    setIsCloning(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const cloned = await cloneTrip(trip.id);
    setIsCloning(false);
    toast.success(`"${trip.title}" copied to your itineraries!`);
    if (cloned) {
      router.push(`/trips/${cloned.id}/builder`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-zinc-400">
        Loading shared luxury dossier...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Compass className="h-12 w-12 text-primary" />
        <h2 className="text-2xl font-bold">Itinerary Not Found or Private</h2>
        <Link href="/">
          <Button className="rounded-2xl">Return to GlobeTrotter Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <LandingNavbar />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Read-Only Banner */}
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary dark:text-blue-400 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Public Shared Itinerary (Read-Only Mode)</span>
          </span>
          <Button
            size="sm"
            onClick={handleCloneTrip}
            disabled={isCloning}
            className="h-8 rounded-xl text-xs font-bold shadow-sm"
          >
            {isCloning ? "Copying..." : "Clone to My Trips"}
          </Button>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/30">
              <AvatarImage src={trip.collaborators[0]?.avatar} />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Curated by {trip.collaborators[0]?.name || "Alexandre Morgan"}
              </p>
              <p className="text-[11px] text-zinc-400">Verified GlobeTrotter Explorer</p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
            {trip.title}
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
            {trip.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge variant="outline" className="text-xs py-1 px-3">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
              {formatDateRange(trip.startDate, trip.endDate)} ({trip.totalDays} Days)
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3">
              <DollarSign className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
              {formatCurrency(trip.totalBudget, trip.currency)} Estimated Budget
            </Badge>
            <Badge variant="glass" className="text-xs py-1 px-3">
              {trip.travelStyle} Style
            </Badge>
          </div>
        </div>

        {/* Hero Cover Photography */}
        <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <Image src={trip.coverImage} alt={trip.title} fill className="object-cover" priority />
        </div>

        {/* Interactive Map Visualizer */}
        <InteractiveTripMap stops={trip.cities} />

        {/* Day-by-Day Agenda */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Curated Day-Wise Schedule
          </h2>

          <div className="space-y-6">
            {(trip.itinerary.length > 0 ? trip.itinerary : [
              {
                id: "d1",
                dayNumber: 1,
                cityName: "Paris",
                themeTitle: "Arrival & Saint-Germain Evening Stroll",
                items: [
                  {
                    id: "i1",
                    title: "Montmartre Artisan Pastry Walk",
                    timeSlot: "Morning",
                    startTime: "10:00 AM",
                    cost: 55,
                    locationName: "Montmartre",
                    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80",
                  },
                  {
                    id: "i2",
                    title: "Eiffel Tower Summit Sunset Access",
                    timeSlot: "Evening",
                    startTime: "06:30 PM",
                    cost: 45,
                    locationName: "Champ de Mars",
                    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&auto=format&fit=crop&q=80",
                  },
                ],
              },
              {
                id: "d2",
                dayNumber: 2,
                cityName: "Paris",
                themeTitle: "Louvre Museum Art Tour & Seine Dinner Cruise",
                items: [
                  {
                    id: "i3",
                    title: "Louvre Priority Masterclass",
                    timeSlot: "Morning",
                    startTime: "09:30 AM",
                    cost: 75,
                    locationName: "Louvre Pyramid",
                    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&auto=format&fit=crop&q=80",
                  },
                  {
                    id: "i4",
                    title: "Seine Gourmet Dinner Cruise",
                    timeSlot: "Night",
                    startTime: "08:00 PM",
                    cost: 110,
                    locationName: "Port de la Bourdonnais",
                    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop&q=80",
                  },
                ],
              },
            ]).map((day: any) => (
              <Card
                key={day.id}
                className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="h-9 w-9 rounded-2xl bg-primary text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    D{day.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                      {day.themeTitle}
                    </h3>
                    <p className="text-xs text-zinc-400">{day.cityName} • {day.items.length} Activities</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {day.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center gap-3"
                    >
                      {item.image && (
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.locationName}</p>
                        <span className="text-xs font-extrabold text-primary mt-1 block">
                          {formatCurrency(item.cost)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Share & Clone CTA Bar */}
        <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="rounded-2xl text-xs font-semibold gap-1.5 h-11"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Link Copied!" : "Copy Share Link"}</span>
            </Button>
          </div>

          <Button
            size="lg"
            onClick={handleCloneTrip}
            disabled={isCloning}
            className="rounded-2xl font-bold gap-2 text-xs h-11 shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Clone Itinerary & Customize in My Account</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
