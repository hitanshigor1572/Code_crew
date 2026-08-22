"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  TrendingUp,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DestinationCard } from "@/components/trip/DestinationCard";
import { EmptyState } from "@/components/common/EmptyState";
import { getCities, searchCities } from "@/lib/services/city.service";
import { getCurrentUser, toggleSaveDestination } from "@/lib/services/user.service";
import { City } from "@/types/city";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";

const CONTINENTS = ["All", "Europe", "Asia", "North America", "South America", "Africa", "Oceania"];

function DiscoverCitiesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [cities, setCities] = React.useState<City[]>([]);
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedContinent, setSelectedContinent] = React.useState("All");
  const [selectedCostIndex, setSelectedCostIndex] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("popularity");
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [allCities, user] = await Promise.all([getCities(), getCurrentUser()]);
        setCities(allCities);
        setSavedIds(user.savedDestinations);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleSave = async (cityId: string) => {
    const updated = await toggleSaveDestination(cityId);
    setSavedIds(updated);
  };

  const filteredCities = React.useMemo(() => {
    let result = [...cities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedContinent !== "All") {
      result = result.filter((c) => c.continent === selectedContinent);
    }

    if (selectedCostIndex !== "all") {
      result = result.filter((c) => c.costIndex === Number(selectedCostIndex));
    }

    result.sort((a, b) => {
      if (sortBy === "popularity") return b.popularityScore - a.popularityScore;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "budget-asc") return a.avgDailyBudget - b.avgDailyBudget;
      if (sortBy === "budget-desc") return b.avgDailyBudget - a.avgDailyBudget;
      return 0;
    });

    return result;
  }, [cities, searchQuery, selectedContinent, selectedCostIndex, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Global Atlas
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {cities.length} Mapped Cities
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Discover Global Destinations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Compare cost indices, climates, must-see landmarks, and local culinary scenes.
          </p>
        </div>

        <Link href="/discover/activities">
          <Button variant="outline" className="rounded-2xl gap-2 font-semibold h-11 text-xs">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Search Activities & Tours</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search by city, country, vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent"
            />
          </div>

          {/* Continent Filter */}
          <Select value={selectedContinent} onValueChange={setSelectedContinent}>
            <SelectTrigger className="h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent">
              <SelectValue placeholder="Continent" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {CONTINENTS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "All" ? "All Continents" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cost Index */}
          <Select value={selectedCostIndex} onValueChange={setSelectedCostIndex}>
            <SelectTrigger className="h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent">
              <SelectValue placeholder="Cost Level" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="1">$ (Budget / &lt;$100/day)</SelectItem>
              <SelectItem value="2">$$ (Moderate / $100–$200/day)</SelectItem>
              <SelectItem value="3">$$$ (Upscale / $200–$300/day)</SelectItem>
              <SelectItem value="4">$$$$ (Luxury / $300+/day)</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="rating">Top Rated (4.9+)</SelectItem>
              <SelectItem value="budget-asc">Price (Low to High)</SelectItem>
              <SelectItem value="budget-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Continent Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
          {CONTINENTS.map((cont) => (
            <button
              key={cont}
              type="button"
              onClick={() => setSelectedContinent(cont)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedContinent === cont
                  ? "bg-primary text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
              }`}
            >
              {cont}
            </button>
          ))}
        </div>
      </div>

      {/* City Results Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <DestinationCard
              key={city.id}
              city={city}
              isSaved={savedIds.includes(city.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Cities Found"
          description={`No destinations match your current filter parameters. Try resetting your search.`}
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedContinent("All");
            setSelectedCostIndex("all");
          }}
        />
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading cities...</div>}>
      <DiscoverCitiesContent />
    </React.Suspense>
  );
}
