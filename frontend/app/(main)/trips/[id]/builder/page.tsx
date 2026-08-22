"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  MapPin,
  Calendar,
  Plus,
  ArrowLeft,
  Share2,
  Download,
  Users,
  Sparkles,
  Plane,
  Train,
  CheckCircle2,
  Trash2,
  Eye,
  Settings,
  Layers,
  Clock,
  Search,
  Star,
  ExternalLink,
  Hotel,
  Globe,
  Save,
  CheckCheck,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItineraryStopBlock } from "@/components/trip/ItineraryStopBlock";
import { TimelineItem } from "@/components/trip/TimelineItem";
import { InteractiveTripMap } from "@/components/map/InteractiveTripMap";
import { CollaborationModal } from "@/components/common/CollaborationModal";
import { ExportPdfModal } from "@/components/common/ExportPdfModal";
import { getTripById, updateTrip } from "@/lib/services/trip.service";
import { getCities } from "@/lib/services/city.service";
import { getActivities } from "@/lib/services/activity.service";
import { searchHotels, HotelSuggestion } from "@/lib/services/hotel.service";
import { Trip, CityStop, ItineraryDay, ItineraryItem, HotelBlock } from "@/types/trip";
import { City } from "@/types/city";
import { Activity } from "@/types/activity";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

// ─── Save status indicator ───────────────────────────────────────────────────
type SaveStatus = "idle" | "saving" | "saved" | "error";

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
        status === "saving"
          ? "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
          : status === "saved"
          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
          : "text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
      }`}
    >
      {status === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === "saved" && <CheckCheck className="h-3 w-3" />}
      {status === "error" && <X className="h-3 w-3" />}
      <span>
        {status === "saving" ? "Saving…" : status === "saved" ? "All changes saved" : "Save failed"}
      </span>
    </div>
  );
}

// ─── Star rating component ─────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
        />
      ))}
      <span className="text-[11px] text-zinc-500 ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ItineraryBuilderPage() {
  const params = useParams();
  const tripId = params.id as string;
  const router = useRouter();

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [cities, setCities] = React.useState<City[]>([]);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeStopIndex, setActiveStopIndex] = React.useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = React.useState(1);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");

  // Modals
  const [addStopModalOpen, setAddStopModalOpen] = React.useState(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [hotelModalOpen, setHotelModalOpen] = React.useState(false);
  const [hotelTargetStopId, setHotelTargetStopId] = React.useState<string | null>(null);

  // ─── City Stop form ───────────────────────────────────────────────────────
  const [stopTab, setStopTab] = React.useState<"catalog" | "custom">("catalog");
  const [citySearchQuery, setCitySearchQuery] = React.useState("");
  const [selectedCityId, setSelectedCityId] = React.useState<string>("");
  const [stayNights, setStayNights] = React.useState<number>(3);
  const [customStopCityName, setCustomStopCityName] = React.useState("");
  const [customStopCountry, setCustomStopCountry] = React.useState("");
  const [customStopCoverImage, setCustomStopCoverImage] = React.useState(
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&auto=format&fit=crop&q=80"
  );
  const [customStopLat, setCustomStopLat] = React.useState<string>("0");
  const [customStopLng, setCustomStopLng] = React.useState<string>("0");

  // ─── Activity form ────────────────────────────────────────────────────────
  const [newActivityTitle, setNewActivityTitle] = React.useState("");
  const [newActivityCost, setNewActivityCost] = React.useState(45);
  const [newActivityTimeSlot, setNewActivityTimeSlot] = React.useState<
    "Morning" | "Afternoon" | "Evening" | "Night"
  >("Morning");
  const [newActivityCategory, setNewActivityCategory] = React.useState("Culture");

  // ─── Hotel form + search ──────────────────────────────────────────────────
  const [hotelTab, setHotelTab] = React.useState<"search" | "manual">("search");
  const [hotelSearchResults, setHotelSearchResults] = React.useState<HotelSuggestion[]>([]);
  const [hotelSearchLoading, setHotelSearchLoading] = React.useState(false);
  const [hotelName, setHotelName] = React.useState("");
  const [hotelAddress, setHotelAddress] = React.useState("");
  const [hotelCostPerNight, setHotelCostPerNight] = React.useState<number>(120);
  const [hotelRating, setHotelRating] = React.useState<number>(4.3);
  const [hotelImage, setHotelImage] = React.useState(
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80"
  );

  // Save debounce ref
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    async function loadTrip() {
      try {
        const [data, loadedCities, loadedActivities] = await Promise.all([
          getTripById(tripId),
          getCities(),
          getActivities(),
        ]);
        setTrip(data);
        setCities(loadedCities);
        setActivities(loadedActivities);
        if (loadedCities[0]) setSelectedCityId(loadedCities[0].id);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  // Debounced persist
  const persistTripPatch = React.useCallback(
    async (nextTrip: Trip, updates: Partial<Trip>, successMessage?: string) => {
      if (!trip) return;
      const previousTrip = trip;
      setTrip(nextTrip);

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaveStatus("saving");

      saveTimerRef.current = setTimeout(async () => {
        try {
          const saved = await updateTrip(trip.id, updates);
          if (!saved) {
            setTrip(previousTrip);
            setSaveStatus("error");
            throw new Error("Unable to save your changes. Please try again.");
          }
          setTrip(saved);
          setSaveStatus("saved");
          if (successMessage) toast.success(successMessage);
          setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err) {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus("idle"), 4000);
        }
      }, 500);
    },
    [trip]
  );

  // ─── Hotel modal open: fetch search results ───────────────────────────────
  const openHotelModal = async (stop: CityStop) => {
    setHotelTargetStopId(stop.id);
    setHotelName(stop.hotel?.name || "");
    setHotelAddress(stop.hotel?.address || "");
    setHotelCostPerNight(stop.hotel?.costPerNight || 120);
    setHotelRating(stop.hotel?.rating || 4.3);
    setHotelImage(
      stop.hotel?.image ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80"
    );
    setHotelTab("search");
    setHotelModalOpen(true);
    setHotelSearchLoading(true);
    try {
      const results = await searchHotels(stop.cityId, stop.cityName);
      setHotelSearchResults(results);
    } catch {
      setHotelSearchResults([]);
    } finally {
      setHotelSearchLoading(false);
    }
  };

  // Pre-fill manual form from a search result
  const selectHotelFromSearch = (h: HotelSuggestion) => {
    setHotelName(h.name);
    setHotelAddress(h.address);
    setHotelCostPerNight(h.costPerNight);
    setHotelRating(h.rating);
    setHotelImage(h.image);
    setHotelTab("manual");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 gap-3 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm">Loading Itinerary Builder…</span>
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

  // ─── Stop handlers ────────────────────────────────────────────────────────
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newCities = [...trip.cities];
    [newCities[index - 1], newCities[index]] = [newCities[index], newCities[index - 1]];
    const updated = { ...trip, cities: newCities };
    try {
      await persistTripPatch(updated, { cities: newCities }, "Stop order updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update stops");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= trip.cities.length - 1) return;
    const newCities = [...trip.cities];
    [newCities[index + 1], newCities[index]] = [newCities[index], newCities[index + 1]];
    const updated = { ...trip, cities: newCities };
    try {
      await persistTripPatch(updated, { cities: newCities }, "Stop order updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update stops");
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    const newCities = trip.cities.filter((c) => c.id !== stopId);
    const updated = { ...trip, cities: newCities };
    try {
      await persistTripPatch(updated, { cities: newCities }, "Stop removed from itinerary");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove stop");
    }
  };

  // ─── Add Stop ─────────────────────────────────────────────────────────────
  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newStop: CityStop | null = null;

    if (stopTab === "custom") {
      const lat = Number(customStopLat);
      const lng = Number(customStopLng);
      if (
        !customStopCityName.trim() ||
        !customStopCountry.trim() ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        toast.error("Custom stop requires city, country, latitude, and longitude.");
        return;
      }
      const customId = `custom-city-${Date.now()}`;
      newStop = {
        id: `stop-${Date.now()}`,
        cityId: customId,
        cityName: customStopCityName.trim(),
        country: customStopCountry.trim(),
        coverImage:
          customStopCoverImage.trim() ||
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&auto=format&fit=crop&q=80",
        arrivalDate: trip.startDate,
        departureDate: trip.endDate,
        stayDurationDays: stayNights,
        order: trip.cities.length + 1,
        coordinates: { lat, lng },
      };
    } else {
      const city = cities.find((c) => c.id === selectedCityId);
      if (!city) return;
      newStop = {
        id: `stop-${Date.now()}`,
        cityId: city.id,
        cityName: city.name,
        country: city.country,
        coverImage: city.image,
        arrivalDate: trip.startDate,
        departureDate: trip.endDate,
        stayDurationDays: stayNights,
        order: trip.cities.length + 1,
        coordinates: city.coordinates,
      };
    }

    const newCities = [...trip.cities, newStop];
    const updated = { ...trip, cities: newCities };
    try {
      await persistTripPatch(
        updated,
        { cities: newCities },
        `${newStop.cityName} added to your stops!`
      );
      setAddStopModalOpen(false);
      setCitySearchQuery("");
      setCustomStopCityName("");
      setCustomStopCountry("");
      setCustomStopLat("0");
      setCustomStopLng("0");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add destination stop");
    }
  };

  // ─── Add Activity ─────────────────────────────────────────────────────────
  const handleAddActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle) return;

    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      title: newActivityTitle,
      category: newActivityCategory,
      timeSlot: newActivityTimeSlot,
      cost: Number(newActivityCost) || 0,
      locationName: trip.cities[activeStopIndex]?.cityName || "Local Area",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
    };

    let newItinerary = [...trip.itinerary];
    let day = newItinerary.find((d) => d.dayNumber === selectedDayNumber);

    if (day) {
      day.items = [...day.items, newItem];
    } else {
      day = {
        id: `day-${selectedDayNumber}`,
        dayNumber: selectedDayNumber,
        date: trip.startDate,
        cityId: trip.cities[activeStopIndex]?.cityId || "city-paris",
        cityName: trip.cities[activeStopIndex]?.cityName || "Paris",
        themeTitle: `Day ${selectedDayNumber} Exploration`,
        items: [newItem],
      };
      newItinerary.push(day);
    }

    const updated = { ...trip, itinerary: newItinerary };
    try {
      await persistTripPatch(
        updated,
        { itinerary: newItinerary },
        "Activity added to Day " + selectedDayNumber
      );
      setNewActivityTitle("");
      setAddActivityModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add activity");
    }
  };

  // ─── Save Hotel ───────────────────────────────────────────────────────────
  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelTargetStopId || !hotelName.trim() || !hotelAddress.trim()) {
      toast.error("Hotel name and address are required.");
      return;
    }

    const targetStop = trip.cities.find((stop) => stop.id === hotelTargetStopId);
    if (!targetStop) return;

    const totalCost = Number(
      (hotelCostPerNight * Math.max(1, targetStop.stayDurationDays)).toFixed(2)
    );
    const hotel: HotelBlock = {
      id: `hotel-${Date.now()}`,
      name: hotelName.trim(),
      address: hotelAddress.trim(),
      checkIn: targetStop.arrivalDate,
      checkOut: targetStop.departureDate,
      costPerNight: Number(hotelCostPerNight),
      totalCost,
      rating: Number(hotelRating),
      image:
        hotelImage.trim() ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
    };

    const newCities = trip.cities.map((stop) =>
      stop.id === hotelTargetStopId ? { ...stop, hotel } : stop
    );
    const updated = { ...trip, cities: newCities };
    try {
      await persistTripPatch(
        updated,
        { cities: newCities },
        `Hotel saved for ${targetStop.cityName}`
      );
      setHotelModalOpen(false);
      setHotelTargetStopId(null);
      setHotelName("");
      setHotelAddress("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save hotel booking");
    }
  };

  const currentDay = trip.itinerary.find((d) => d.dayNumber === selectedDayNumber) || {
    id: `day-${selectedDayNumber}`,
    dayNumber: selectedDayNumber,
    date: trip.startDate,
    cityId: trip.cities[activeStopIndex]?.cityId || "city-paris",
    cityName: trip.cities[activeStopIndex]?.cityName || "Paris",
    themeTitle: `Day ${selectedDayNumber} Highlights`,
    items: [],
  };

  // Filtered cities for search
  const filteredCities = citySearchQuery.trim()
    ? cities.filter(
        (c) =>
          c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(citySearchQuery.toLowerCase())
      )
    : cities;

  const targetStopForHotel = trip.cities.find((s) => s.id === hotelTargetStopId);

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Trips</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Itinerary Workspace
            </span>
            <Badge variant="glass" className="text-[10px]">
              Live Auto-Save
            </Badge>
            <SaveIndicator status={saveStatus} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            {trip.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 flex items-center gap-2 mt-0.5">
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            <span>•</span>
            <span>{trip.totalDays} Days Planned</span>
            <span>•</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {formatCurrency(trip.totalBudget, trip.currency)} Budget
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-10"
          >
            <Users className="h-4 w-4 text-accent" />
            <span>Collaborate ({trip.collaborators.length})</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-10"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>

          <Link href={`/trips/${trip.id}/itinerary`}>
            <Button size="sm" className="rounded-2xl text-xs font-bold gap-1.5 h-10">
              <Eye className="h-4 w-4" />
              <span>Day-Wise View</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Flagship Interactive Route Map */}
      <InteractiveTripMap
        stops={trip.cities}
        activeStopIndex={activeStopIndex}
        onSelectStop={(idx) => setActiveStopIndex(idx)}
      />

      {/* Main 2-Column Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: City Stops & Accommodations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <span>Destination Stops</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Reorder stops, adjust durations, or add hotel vouchers
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddStopModalOpen(true)}
              className="rounded-2xl text-xs font-semibold gap-1.5 h-9"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Stop</span>
            </Button>
          </div>

          {/* Stops List */}
          <div className="space-y-4">
            {trip.cities.length === 0 && (
              <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Globe className="h-8 w-8 mx-auto text-zinc-300 mb-2" />
                <p className="text-xs font-semibold text-zinc-500">No destination stops yet</p>
                <p className="text-[11px] text-zinc-400 mt-1 mb-4">
                  Add cities to build your route.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddStopModalOpen(true)}
                  className="rounded-xl text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add First Stop
                </Button>
              </div>
            )}
            {trip.cities.map((stop, idx) => (
              <ItineraryStopBlock
                key={stop.id || idx}
                stop={stop}
                index={idx}
                totalStops={trip.cities.length}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDeleteStop}
                onAddHotel={() => openHotelModal(stop)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Day Activities & Time Slots */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <span>Daily Activity Blocks</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Morning, afternoon, and evening scheduled milestones
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setAddActivityModalOpen(true)}
              className="rounded-2xl text-xs font-bold gap-1.5 h-9"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Activity</span>
            </Button>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {Array.from({ length: trip.totalDays || 5 }, (_, i) => i + 1).map((d) => {
              const hasItems = trip.itinerary.some(
                (day) => day.dayNumber === d && day.items.length > 0
              );
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDayNumber(d)}
                  className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                    selectedDayNumber === d
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  Day {d}
                  {hasItems && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Day Details Card */}
          <Card className="rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Day {selectedDayNumber} Itinerary
                </span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {currentDay.themeTitle}
                </h4>
              </div>
              <Badge variant="outline" className="text-xs">
                {currentDay.items.length} Activities
              </Badge>
            </div>

            {/* Activities Timeline */}
            {currentDay.items.length > 0 ? (
              <div className="space-y-1">
                {currentDay.items.map((item) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    onToggleComplete={(id) => {
                      const newItin = trip.itinerary.map((d) => {
                        if (d.dayNumber === selectedDayNumber) {
                          return {
                            ...d,
                            items: d.items.map((i) =>
                              i.id === id ? { ...i, isCompleted: !i.isCompleted } : i
                            ),
                          };
                        }
                        return d;
                      });
                      const updated = { ...trip, itinerary: newItin };
                      void persistTripPatch(updated, { itinerary: newItin }).catch((error) => {
                        toast.error(
                          error instanceof Error ? error.message : "Unable to update activity"
                        );
                      });
                    }}
                    onDelete={(id) => {
                      const newItin = trip.itinerary.map((d) => {
                        if (d.dayNumber === selectedDayNumber) {
                          return { ...d, items: d.items.filter((i) => i.id !== id) };
                        }
                        return d;
                      });
                      const updated = { ...trip, itinerary: newItin };
                      void persistTripPatch(
                        updated,
                        { itinerary: newItin },
                        "Activity removed"
                      ).catch((error) => {
                        toast.error(
                          error instanceof Error ? error.message : "Unable to remove activity"
                        );
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <Clock className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  No activities scheduled for Day {selectedDayNumber}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 mb-4">
                  Add museum visits, dining reservations, or walking tours.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddActivityModalOpen(true)}
                  className="rounded-xl text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Day {selectedDayNumber} Activity
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ─── Add Stop Modal ────────────────────────────────────────────────── */}
      <Dialog open={addStopModalOpen} onOpenChange={setAddStopModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">Add Destination Stop</DialogTitle>
            <DialogDescription className="text-xs">
              Choose from our city catalog or add any custom location to your route.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={stopTab}
            onValueChange={(v) => setStopTab(v as "catalog" | "custom")}
            className="p-6 pt-4"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-2xl mb-5 h-10">
              <TabsTrigger value="catalog" className="rounded-xl text-xs font-bold">
                <Globe className="h-3.5 w-3.5 mr-1.5" /> City Catalog
              </TabsTrigger>
              <TabsTrigger value="custom" className="rounded-xl text-xs font-bold">
                <MapPin className="h-3.5 w-3.5 mr-1.5" /> Custom Stop
              </TabsTrigger>
            </TabsList>

            {/* Catalog Tab */}
            <TabsContent value="catalog" className="mt-0">
              <form onSubmit={handleAddStopSubmit} className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Search city or country…"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="pl-10 rounded-2xl text-xs"
                  />
                </div>

                {/* City Grid */}
                <div className="max-h-52 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredCities.slice(0, 30).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCityId(c.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
                        selectedCityId === c.id
                          ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-primary"
                          : ""
                      }`}
                    >
                      {c.image && (
                        <div className="relative h-9 w-9 rounded-lg overflow-hidden shrink-0">
                          <Image src={c.image} alt={c.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">{c.country}</p>
                      </div>
                      {selectedCityId === c.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-400">No cities match your search</div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Stay Duration (Nights)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={stayNights}
                    onChange={(e) => setStayNights(Number(e.target.value) || 1)}
                    className="rounded-2xl"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full rounded-2xl font-bold text-xs" disabled={!selectedCityId}>
                    <Plus className="h-4 w-4 mr-1.5" /> Insert Stop into Route
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* Custom Tab */}
            <TabsContent value="custom" className="mt-0">
              <form onSubmit={handleAddStopSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">City Name</label>
                    <Input
                      type="text"
                      value={customStopCityName}
                      onChange={(e) => setCustomStopCityName(e.target.value)}
                      className="rounded-2xl"
                      placeholder="e.g. Jaipur"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Country</label>
                    <Input
                      type="text"
                      value={customStopCountry}
                      onChange={(e) => setCustomStopCountry(e.target.value)}
                      className="rounded-2xl"
                      placeholder="e.g. India"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cover Image URL</label>
                  <Input
                    type="url"
                    value={customStopCoverImage}
                    onChange={(e) => setCustomStopCoverImage(e.target.value)}
                    className="rounded-2xl"
                    placeholder="https://…"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Latitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={customStopLat}
                      onChange={(e) => setCustomStopLat(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Longitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={customStopLng}
                      onChange={(e) => setCustomStopLng(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stay Duration (Nights)</label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={stayNights}
                    onChange={(e) => setStayNights(Number(e.target.value) || 1)}
                    className="rounded-2xl"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full rounded-2xl font-bold text-xs">
                    <Plus className="h-4 w-4 mr-1.5" /> Add Custom Stop
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ─── Hotel Booking Modal ────────────────────────────────────────────── */}
      <Dialog open={hotelModalOpen} onOpenChange={setHotelModalOpen}>
        <DialogContent className="sm:max-w-[520px] rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
              <Hotel className="h-4 w-4" />
              <span>Hotel & Accommodation</span>
            </div>
            <DialogTitle className="text-xl font-bold">
              Book for {targetStopForHotel?.cityName || "Selected Stop"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Search available hotels or enter booking details manually.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={hotelTab}
            onValueChange={(v) => setHotelTab(v as "search" | "manual")}
            className="p-6 pt-4"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-2xl mb-5 h-10">
              <TabsTrigger value="search" className="rounded-xl text-xs font-bold">
                <Search className="h-3.5 w-3.5 mr-1.5" /> Search Hotels
              </TabsTrigger>
              <TabsTrigger value="manual" className="rounded-xl text-xs font-bold">
                <Settings className="h-3.5 w-3.5 mr-1.5" /> Manual Entry
              </TabsTrigger>
            </TabsList>

            {/* Hotel Search Tab */}
            <TabsContent value="search" className="mt-0 space-y-3">
              {hotelSearchLoading ? (
                <div className="flex items-center justify-center py-10 gap-2 text-zinc-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-xs">Searching hotels…</span>
                </div>
              ) : hotelSearchResults.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No hotel results found. Try the Manual Entry tab.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {hotelSearchResults.map((h) => (
                    <div
                      key={h.id}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-3 p-3">
                        {h.image && (
                          <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0">
                            <Image src={h.image} alt={h.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{h.name}</p>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {h.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <StarRating rating={h.rating} />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 ml-auto">
                              ${h.costPerNight}<span className="text-zinc-400 font-normal">/night</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 pb-3">
                        <Button
                          type="button"
                          size="sm"
                          className="flex-1 rounded-xl text-xs font-bold h-8"
                          onClick={() => selectHotelFromSearch(h)}
                        >
                          Select This Hotel
                        </Button>
                        {h.bookingUrl && (
                          <a
                            href={h.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:border-primary hover:text-primary transition-colors shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Book on Booking.com
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="mt-0">
              <form onSubmit={handleSaveHotel} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Hotel Name</label>
                  <Input
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="rounded-2xl"
                    placeholder="e.g. Hotel Le Meurice"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Address</label>
                  <Input
                    value={hotelAddress}
                    onChange={(e) => setHotelAddress(e.target.value)}
                    className="rounded-2xl"
                    placeholder="Street, district"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cost/Night (USD)</label>
                    <Input
                      type="number"
                      min={1}
                      value={hotelCostPerNight}
                      onChange={(e) => setHotelCostPerNight(Number(e.target.value) || 0)}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Rating (1–5)</label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      step="0.1"
                      value={hotelRating}
                      onChange={(e) => setHotelRating(Number(e.target.value) || 0)}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Hotel Image URL</label>
                  <Input
                    type="url"
                    value={hotelImage}
                    onChange={(e) => setHotelImage(e.target.value)}
                    className="rounded-2xl"
                  />
                </div>

                {targetStopForHotel && (
                  <div className="rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 p-3 text-xs">
                    <span className="font-semibold text-primary">Total cost estimate: </span>
                    <span className="font-bold">
                      ${(hotelCostPerNight * Math.max(1, targetStopForHotel.stayDurationDays)).toFixed(2)}
                    </span>
                    <span className="text-zinc-500 ml-1">
                      ({targetStopForHotel.stayDurationDays} nights × ${hotelCostPerNight}/night)
                    </span>
                  </div>
                )}

                <DialogFooter>
                  <Button type="submit" className="w-full rounded-2xl font-bold text-xs">
                    <Save className="h-4 w-4 mr-1.5" /> Save Hotel Booking
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ─── Add Activity Modal ─────────────────────────────────────────────── */}
      <Dialog open={addActivityModalOpen} onOpenChange={setAddActivityModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">Add Day Activity</DialogTitle>
            <DialogDescription className="text-xs">
              Insert a landmark visit, dining reservation, or excursion for Day{" "}
              {selectedDayNumber}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddActivitySubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Activity Title
              </label>
              <Input
                type="text"
                placeholder="e.g. Louvre Guided Masterclass"
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                className="rounded-2xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Time Slot
                </label>
                <Select
                  value={newActivityTimeSlot}
                  onValueChange={(val) => setNewActivityTimeSlot(val as any)}
                >
                  <SelectTrigger className="rounded-2xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Morning">🌅 Morning</SelectItem>
                    <SelectItem value="Afternoon">☀️ Afternoon</SelectItem>
                    <SelectItem value="Evening">🌆 Evening</SelectItem>
                    <SelectItem value="Night">🌙 Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Estimated Cost (USD)
                </label>
                <Input
                  type="number"
                  placeholder="45"
                  value={newActivityCost}
                  onChange={(e) => setNewActivityCost(Number(e.target.value) || 0)}
                  className="rounded-2xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Category
              </label>
              <Select value={newActivityCategory} onValueChange={setNewActivityCategory}>
                <SelectTrigger className="rounded-2xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Culture">🏛️ Culture</SelectItem>
                  <SelectItem value="Food">🍜 Food & Dining</SelectItem>
                  <SelectItem value="Adventure">🧗 Adventure</SelectItem>
                  <SelectItem value="Nature">🌿 Nature</SelectItem>
                  <SelectItem value="Shopping">🛍️ Shopping</SelectItem>
                  <SelectItem value="Wellness">🧘 Wellness</SelectItem>
                  <SelectItem value="Nightlife">🎶 Nightlife</SelectItem>
                  <SelectItem value="Transport">🚆 Transport</SelectItem>
                  <SelectItem value="Other">📌 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full rounded-2xl font-bold text-xs">
                Add to Day {selectedDayNumber}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Collaboration Modal */}
      <CollaborationModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        tripId={trip.id}
        shareId={trip.shareId}
        tripTitle={trip.title}
        collaborators={trip.collaborators}
        onCollaboratorsChange={(collaborators) =>
          setTrip((prev) => (prev ? { ...prev, collaborators } : prev))
        }
      />

      {/* Export PDF Modal */}
      <ExportPdfModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
