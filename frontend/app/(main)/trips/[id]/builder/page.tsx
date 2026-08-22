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
import { MOCK_CITIES, MOCK_ACTIVITIES } from "@/data/mock";
import { Trip, CityStop, ItineraryDay, ItineraryItem } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ItineraryBuilderPage() {
  const params = useParams();
  const tripId = params.id as string;
  const router = useRouter();

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeStopIndex, setActiveStopIndex] = React.useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = React.useState(1);

  // Modals
  const [addStopModalOpen, setAddStopModalOpen] = React.useState(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);

  // Form states for Add Stop
  const [selectedCityId, setSelectedCityId] = React.useState<string>(MOCK_CITIES[0].id);
  const [stayNights, setStayNights] = React.useState<number>(3);

  // Form states for Add Activity
  const [newActivityTitle, setNewActivityTitle] = React.useState("");
  const [newActivityCost, setNewActivityCost] = React.useState(45);
  const [newActivityTimeSlot, setNewActivityTimeSlot] = React.useState<"Morning" | "Afternoon" | "Evening" | "Night">("Morning");
  const [newActivityCategory, setNewActivityCategory] = React.useState("Culture");

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
    return (
      <div className="p-12 text-center text-xs text-zinc-400">
        Loading Itinerary Builder...
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

  // Reordering Stops
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCities = [...trip.cities];
    const temp = newCities[index - 1];
    newCities[index - 1] = newCities[index];
    newCities[index] = temp;
    const updated = { ...trip, cities: newCities };
    setTrip(updated);
    updateTrip(trip.id, { cities: newCities });
    toast.success("Stop order updated!");
  };

  const handleMoveDown = (index: number) => {
    if (index >= trip.cities.length - 1) return;
    const newCities = [...trip.cities];
    const temp = newCities[index + 1];
    newCities[index + 1] = newCities[index];
    newCities[index] = temp;
    const updated = { ...trip, cities: newCities };
    setTrip(updated);
    updateTrip(trip.id, { cities: newCities });
    toast.success("Stop order updated!");
  };

  const handleDeleteStop = (stopId: string) => {
    const newCities = trip.cities.filter((c) => c.id !== stopId);
    const updated = { ...trip, cities: newCities };
    setTrip(updated);
    updateTrip(trip.id, { cities: newCities });
    toast.success("Stop removed from itinerary");
  };

  // Add new Stop
  const handleAddStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = MOCK_CITIES.find((c) => c.id === selectedCityId);
    if (!city) return;

    const newStop: CityStop = {
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

    const newCities = [...trip.cities, newStop];
    const updated = { ...trip, cities: newCities };
    setTrip(updated);
    updateTrip(trip.id, { cities: newCities });
    setAddStopModalOpen(false);
    toast.success(`${city.name} added to your stops!`);
  };

  // Add Activity to Day
  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle) return;

    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      title: newActivityTitle,
      category: newActivityCategory,
      timeSlot: newActivityTimeSlot,
      cost: Number(newActivityCost) || 0,
      locationName: trip.cities[activeStopIndex]?.cityName || "Local Area",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
    };

    // Find or create day
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
    setTrip(updated);
    updateTrip(trip.id, { itinerary: newItinerary });
    setNewActivityTitle("");
    setAddActivityModalOpen(false);
    toast.success("Activity added to Day " + selectedDayNumber);
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
              Notion-Style Itinerary Workspace
            </span>
            <Badge variant="glass" className="text-[10px]">
              Live Auto-Save
            </Badge>
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

      {/* Flagship Interactive Route Map Visualizer */}
      <InteractiveTripMap
        stops={trip.cities}
        activeStopIndex={activeStopIndex}
        onSelectStop={(idx) => setActiveStopIndex(idx)}
      />

      {/* Main 2-Column Notion + Day Schedule Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: City Stops & Accommodations (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <span>Multi-City Stop Sequence</span>
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
            {trip.cities.map((stop, idx) => (
              <ItineraryStopBlock
                key={stop.id || idx}
                stop={stop}
                index={idx}
                totalStops={trip.cities.length}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDeleteStop}
                onAddHotel={() => toast.info("Hotel search & booking linked to " + stop.cityName)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Day Activities & Time Slots (6 cols) */}
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
            {[1, 2, 3, 4, 5, 6, 7].slice(0, trip.totalDays || 5).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDayNumber(d)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  selectedDayNumber === d
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                }`}
              >
                Day {d}
              </button>
            ))}
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
                      setTrip({ ...trip, itinerary: newItin });
                      updateTrip(trip.id, { itinerary: newItin });
                    }}
                    onDelete={(id) => {
                      const newItin = trip.itinerary.map((d) => {
                        if (d.dayNumber === selectedDayNumber) {
                          return {
                            ...d,
                            items: d.items.filter((i) => i.id !== id),
                          };
                        }
                        return d;
                      });
                      setTrip({ ...trip, itinerary: newItin });
                      updateTrip(trip.id, { itinerary: newItin });
                      toast.success("Activity removed");
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

      {/* Add Stop Modal */}
      <Dialog open={addStopModalOpen} onOpenChange={setAddStopModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">Add Stop to Itinerary</DialogTitle>
            <DialogDescription className="text-xs">
              Choose a global destination to connect with your existing route.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStopSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Destination City
              </label>
              <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {MOCK_CITIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}, {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full rounded-2xl font-bold text-xs">
                Insert Stop into Route
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Activity Modal */}
      <Dialog open={addActivityModalOpen} onOpenChange={setAddActivityModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">Add Day Activity</DialogTitle>
            <DialogDescription className="text-xs">
              Insert a landmark visit, dining reservation, or excursion for Day {selectedDayNumber}.
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
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
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
        tripTitle={trip.title}
        collaborators={trip.collaborators}
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
