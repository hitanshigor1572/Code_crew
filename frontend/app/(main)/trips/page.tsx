"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Filter, PlaneTakeoff, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TripCard } from "@/components/trip/TripCard";
import { EmptyState } from "@/components/common/EmptyState";
import { CollaborationModal } from "@/components/common/CollaborationModal";
import { getTrips, deleteTrip, cloneTrip } from "@/lib/services/trip.service";
import { Trip, TripStatus } from "@/types/trip";
import { toast } from "sonner";

export default function MyTripsPage() {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("date-asc");
  const [sharingTrip, setSharingTrip] = React.useState<Trip | null>(null);

  const fetchTrips = React.useCallback(async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleDelete = async (id: string) => {
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClone = async (id: string) => {
    const cloned = await cloneTrip(id);
    if (cloned) {
      setTrips((prev) => [cloned, ...prev]);
      toast.success(`Itinerary "${cloned.title}" duplicated!`);
    }
  };

  // Filter and sort trips
  const filteredTrips = React.useMemo(() => {
    let result = [...trips];

    if (selectedStatus !== "all") {
      result = result.filter((t) => t.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.cities.some((c) => c.cityName.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === "budget-desc") {
        return b.totalBudget - a.totalBudget;
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [trips, selectedStatus, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header & New Trip CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Travel Portfolio
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {trips.length} Total Journeys
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            My Itineraries & Journeys
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            View, customize, duplicate, and share your multi-city travel schedules.
          </p>
        </div>

        <Link href="/trips/create">
          <Button className="rounded-2xl gap-2 h-11 px-5 font-bold shadow-md shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span>Create New Trip</span>
          </Button>
        </Link>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <Tabs
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            className="w-full md:w-auto"
          >
            <TabsList className="h-11 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl w-full md:w-auto overflow-x-auto justify-start">
              <TabsTrigger value="all" className="text-xs rounded-xl">
                All Trips
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs rounded-xl">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="text-xs rounded-xl">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs rounded-xl">
                Completed
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="text-xs rounded-xl">
                Wishlist
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Filter by city, title, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="date-asc">Date (Earliest)</SelectItem>
                <SelectItem value="budget-desc">Budget (High to Low)</SelectItem>
                <SelectItem value="title-asc">Title (A – Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Trips Cards Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={handleDelete}
              onClone={handleClone}
              onShare={(t) => setSharingTrip(t)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PlaneTakeoff}
          title="No Trips Found"
          description={
            searchQuery
              ? `No itineraries match "${searchQuery}". Try clearing search filters.`
              : "You don't have any trips under this category yet. Start your next adventure today!"
          }
          actionText={searchQuery ? "Clear Search" : "Plan Your First Trip"}
          onAction={searchQuery ? () => setSearchQuery("") : undefined}
          actionHref={!searchQuery ? "/trips/create" : undefined}
        />
      )}

      {/* Collaboration / Share Modal */}
      {sharingTrip && (
        <CollaborationModal
          isOpen={!!sharingTrip}
          onClose={() => setSharingTrip(null)}
          tripId={sharingTrip.id}
          shareId={sharingTrip.shareId}
          tripTitle={sharingTrip.title}
          collaborators={sharingTrip.collaborators}
          onCollaboratorsChange={(collaborators) => {
            setTrips((prev) => prev.map((trip) => (trip.id === sharingTrip.id ? { ...trip, collaborators } : trip)));
            setSharingTrip((prev) => (prev ? { ...prev, collaborators } : prev));
          }}
        />
      )}
    </div>
  );
}
