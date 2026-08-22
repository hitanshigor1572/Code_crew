"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  MapPin,
  UtensilsCrossed,
  Flame,
  Trees,
  Moon,
  ShoppingBag,
  Landmark,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ActivityCard } from "@/components/trip/ActivityCard";
import { EmptyState } from "@/components/common/EmptyState";
import { getActivities } from "@/lib/services/activity.service";
import { Activity, ActivityCategory } from "@/types/activity";

const CATEGORIES: { label: string; value: ActivityCategory | "All"; icon: any }[] = [
  { label: "All Experiences", value: "All", icon: Compass },
  { label: "Food & Dining", value: "Food", icon: UtensilsCrossed },
  { label: "Adventure & Sports", value: "Adventure", icon: Flame },
  { label: "Nature & Outdoors", value: "Nature", icon: Trees },
  { label: "Nightlife & Bars", value: "Nightlife", icon: Moon },
  { label: "Shopping & Bazaars", value: "Shopping", icon: ShoppingBag },
  { label: "Culture & Heritage", value: "Culture", icon: Landmark },
];

export default function ActivitySearchPage() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<ActivityCategory | "All">("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getActivities();
        setActivities(data);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  const filteredActivities = React.useMemo(() => {
    let result = [...activities];

    if (selectedCategory !== "All") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.cityName.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activities, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Cities</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Experiences & Tours
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {activities.length} Curated Tours
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Global Activities & Adventures
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Discover skip-the-line museum passes, food safaris, alpine skydiving, and sunset cruises.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="p-4 sm:p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-sm space-y-4">
        <div className="relative max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search activities (e.g. Louvre, Scuba, Skydiving, Izakaya)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-950 border-transparent"
          />
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Activities Found"
          description={`No experiences match your search query for "${searchQuery}".`}
          actionText="Reset Search"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All");
          }}
        />
      )}
    </div>
  );
}
