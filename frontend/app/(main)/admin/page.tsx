"use client";

import * as React from "react";
import {
  ShieldCheck,
  Users,
  PlaneTakeoff,
  Globe2,
  TrendingUp,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { TripTrendsAreaChart } from "@/components/charts/TripTrendsAreaChart";
import { BudgetCard } from "@/components/trip/BudgetCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { getTrips } from "@/lib/services/trip.service";

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [metrics, setMetrics] = React.useState<any>(null);
  const [trips, setTrips] = React.useState<any[]>([]);

  React.useEffect(() => {
    Promise.all([api<any>("/admin/metrics"), getTrips()]).then(([loadedMetrics, loadedTrips]) => {
      setMetrics(loadedMetrics);
      setTrips(loadedTrips);
    }).catch(() => undefined);
  }, []);

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.collaborators[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Management</span>
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              v2.4.0 Production
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            GlobeTrotter Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Monitor real-time user registrations, trip creation velocity, and global destination trends.
          </p>
        </div>
      </div>

      {/* 1. KEY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BudgetCard
          title="Total Active Users"
          amount={metrics?.totalUsers || 0}
          currency=""
          subtitle="+18% MoM Growth"
          icon={Users}
          variant="default"
          trend={{ value: "+3,200 this week", isPositive: true }}
        />
        <BudgetCard
          title="Trips Created"
          amount={metrics?.activeTrips || 0}
          currency=""
          subtitle="94% Completion Rate"
          icon={PlaneTakeoff}
          variant="success"
          trend={{ value: "+1,420 trips", isPositive: true }}
        />
        <BudgetCard
          title="Total Travel Spend Planned"
          amount={metrics?.totalSavedUSD || 0}
          currency="USD"
          subtitle="Processed via itineraries"
          icon={TrendingUp}
          variant="default"
        />
        <BudgetCard
          title="Global Cities Mapped"
          amount={metrics?.totalCitiesMapped || 0}
          currency=""
          subtitle="Across 6 continents"
          icon={Globe2}
          variant="default"
        />
      </div>

      {/* 2. USER GROWTH AREA CHART & POPULAR CITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Growth Area Chart (8 cols) */}
        <Card className="lg:col-span-8 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Growth Trajectory
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Monthly User Onboarding & Itineraries Created
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Active Users
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-accent">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Trips Planned
              </span>
            </div>
          </div>

          <TripTrendsAreaChart data={metrics?.userGrowth || []} />
        </Card>

        {/* Popular Cities Leaderboard (4 cols) */}
        <Card className="lg:col-span-4 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Destination Popularity
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Top Trending Stops
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {(metrics?.popularDestinations || []).map((dest: any, idx: number) => (
              <div key={dest.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <span className="text-zinc-400 font-mono">#{idx + 1}</span>
                    {dest.name}
                  </span>
                  <span className="text-zinc-500 font-mono">
                    {dest.tripsCount.toLocaleString()} trips
                  </span>
                </div>
                <Progress value={dest.percentage * 3} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. PLATFORM TRIPS MODERATION TABLE */}
      <Card className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Live Platform Itineraries
            </h3>
            <p className="text-xs text-zinc-500">
              Recent user-created travel itineraries across GlobeTrotter
            </p>
          </div>

          <div className="relative max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search trips or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-2xl text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Trip Title</th>
                <th className="pb-3">Lead Traveler</th>
                <th className="pb-3">Stops</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredTrips.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                    {t.title}
                  </td>
                  <td className="py-3.5 text-zinc-600 dark:text-zinc-300">
                    {t.collaborators[0]?.name || "Alexandre"}
                  </td>
                  <td className="py-3.5 font-mono">{t.cities.length} stops</td>
                  <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(t.totalBudget, t.currency)}
                  </td>
                  <td className="py-3.5">
                    <Badge variant={t.status === "in-progress" ? "success" : "outline"} className="text-[10px] capitalize">
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <Button variant="ghost" size="sm" className="h-8 rounded-xl text-xs">
                      <Eye className="h-3.5 w-3.5 mr-1" /> Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
