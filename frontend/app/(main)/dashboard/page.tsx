"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  PlaneTakeoff,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Globe2,
  PieChart as PieIcon,
  Layers,
  Sun,
  Shield,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TripCard } from "@/components/trip/TripCard";
import { DestinationCard } from "@/components/trip/DestinationCard";
import { WeatherCard } from "@/components/trip/WeatherCard";
import { BudgetCard } from "@/components/trip/BudgetCard";
import { BudgetPieChart } from "@/components/charts/BudgetPieChart";
import { getTrips } from "@/lib/services/trip.service";
import { getCities } from "@/lib/services/city.service";
import { getBudgetSummary } from "@/lib/services/budget.service";
import { getCurrentUser } from "@/lib/services/user.service";
import { Trip } from "@/types/trip";
import { City } from "@/types/city";
import { BudgetSummary } from "@/types/budget";
import { UserProfile } from "@/types/user";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export default function DashboardPage() {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  const [budget, setBudget] = React.useState<BudgetSummary | null>(null);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tripsData, citiesData, budgetData, userData] = await Promise.all([
          getTrips(),
          getCities(),
          getBudgetSummary(),
          getCurrentUser(),
        ]);
        setTrips(tripsData);
        setCities(citiesData);
        setBudget(budgetData);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const upcomingTrip = trips.find((t) => t.status === "upcoming" || t.status === "in-progress") || trips[0];

  return (
    <div className="space-y-8">
      {/* 1. WELCOME SECTION & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Welcome back, {user?.name.split(" ")[0] || "Alexandre"} 👋
            </span>
            <Badge variant="glass" className="text-[10px]">
              Voyager Tier
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
            Where is your next adventure?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            You have <strong className="text-zinc-800 dark:text-zinc-200">2 upcoming journeys</strong> planned for Autumn 2026.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5">
          <Link href="/trips/create">
            <Button className="rounded-2xl gap-2 shadow-md shadow-primary/20 h-11 px-5 text-xs font-bold">
              <Plus className="h-4 w-4" />
              <span>Plan New Trip</span>
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="outline" className="rounded-2xl gap-2 h-11 text-xs font-semibold">
              <Compass className="h-4 w-4" />
              <span>Explore Cities</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. ACTIVE TRIP HERO COUNTDOWN BANNER */}
      {upcomingTrip && (
        <Card className="overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Image (5 cols) */}
            <div className="lg:col-span-5 relative h-56 lg:h-auto min-h-[220px]">
              <Image
                src={upcomingTrip.coverImage}
                alt={upcomingTrip.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />
              <div className="absolute top-4 left-4">
                <Badge variant="glass" className="backdrop-blur-md text-white border-white/20">
                  ⭐ Next Upcoming Journey
                </Badge>
              </div>
            </div>

            {/* Right Details & Route Highlights (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDateRange(upcomingTrip.startDate, upcomingTrip.endDate)} ({upcomingTrip.totalDays} Days)
                  </span>
                  <Badge variant="default" className="text-xs capitalize">
                    {upcomingTrip.status}
                  </Badge>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                  {upcomingTrip.title}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {upcomingTrip.description}
                </p>

                {/* Cities Connected */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {upcomingTrip.cities.map((city, idx) => (
                    <React.Fragment key={city.id || idx}>
                      <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {city.cityName}
                      </span>
                      {idx < upcomingTrip.cities.length - 1 && (
                        <span className="text-xs text-zinc-400 font-bold">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-zinc-400 font-medium block">Allocated Budget</span>
                  <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(upcomingTrip.spentBudget, upcomingTrip.currency)} /{" "}
                    <span className="text-zinc-400 font-normal">
                      {formatCurrency(upcomingTrip.totalBudget, upcomingTrip.currency)}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/trips/${upcomingTrip.id}/builder`}>
                    <Button className="rounded-2xl text-xs font-bold gap-2">
                      <span>Open Itinerary Builder</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 3. ANIMATED METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BudgetCard
          title="Countries Explored"
          amount={user?.countriesVisited || 24}
          currency=""
          subtitle="Across Europe, Asia & Americas"
          icon={Globe2}
          variant="default"
          trend={{ value: "+3 this year", isPositive: true }}
        />
        <BudgetCard
          title="Active & Upcoming Trips"
          amount={trips.filter((t) => t.status !== "completed").length}
          currency=""
          subtitle="4 destinations booked"
          icon={PlaneTakeoff}
          variant="success"
        />
        <BudgetCard
          title="Total Budget Planned"
          amount={budget?.totalBudget || 3400}
          currency="USD"
          totalLimit={4000}
          subtitle="Healthy financial pacing"
          icon={DollarSign}
          variant="default"
        />
        <BudgetCard
          title="Travel Achievements"
          amount={user?.badges.length || 5}
          currency=""
          subtitle="Next badge: Asia Explorer"
          icon={Award}
          variant="warning"
        />
      </div>

      {/* 4. MAIN GRID: RECENT TRIPS & LIVE WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Trips (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Your Travel Itineraries
              </h3>
              <p className="text-xs text-zinc-500">
                Manage schedules, track progress, or invite collaborators
              </p>
            </div>
            <Link href="/trips">
              <Button variant="ghost" className="text-xs font-semibold text-primary hover:underline">
                View All Trips ({trips.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trips.slice(0, 4).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          {/* Destination Recommendations */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Recommended For You
                </h3>
                <p className="text-xs text-zinc-500">
                  Curated according to your moderate travel pace & cultural interests
                </p>
              </div>
              <Link href="/discover">
                <Button variant="ghost" className="text-xs font-semibold text-primary hover:underline">
                  Explore More
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cities.slice(1, 3).map((city) => (
                <DestinationCard key={city.id} city={city} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weather & Budget Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Weather Widget */}
          <WeatherCard
            cityName="Paris, France"
            temp={19}
            condition="Sunny"
            humidity={55}
            windSpeed="10 km/h"
          />

          {/* Budget Quick Glance with Donut Chart */}
          {budget && (
            <Card className="rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Expense Allocation
                  </span>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {budget.tripTitle}
                  </h4>
                </div>
                <Link href="/budget">
                  <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold">
                    Details
                  </Button>
                </Link>
              </div>

              <BudgetPieChart categories={budget.categories} currency={budget.currency} />

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {budget.categories.slice(0, 4).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                        {cat.category}
                      </span>
                    </div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {formatCurrency(cat.spent, budget.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick AI Tip Card */}
          <Card className="p-5 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Smart Travel Tip</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Booking your TGV train between Paris & Nice 60 days in advance saves up to 45% compared to station ticket counters.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
