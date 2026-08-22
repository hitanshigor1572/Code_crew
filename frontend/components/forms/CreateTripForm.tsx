"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sparkles,
  Calendar,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Check,
  Plane,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCities } from "@/lib/services/city.service";
import { getCurrentUser } from "@/lib/services/user.service";
import { createTrip } from "@/lib/services/trip.service";
import { formatCurrency, formatDateRange, getDaysDifference } from "@/lib/utils";
import { City } from "@/types/city";
import { UserProfile } from "@/types/user";
import { TravelStyle, Trip } from "@/types/trip";
import { toast } from "sonner";

const COVER_PRESETS = [
  {
    name: "Paris Eiffel",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Tokyo Neon",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Swiss Alps",
    url: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Tropical Bali",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Amalfi Coast",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Goa Beach",
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80",
  },
];

const TRAVEL_STYLES: TravelStyle[] = [
  "Solo",
  "Couple",
  "Family",
  "Friends",
  "Luxury",
  "Backpacker",
];

const tripFormSchema = z.object({
  title: z.string().min(3, "Trip name must be at least 3 characters"),
  tagline: z.string().optional(),
  description: z.string().min(10, "Please provide a brief description (min 10 characters)"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalBudget: z.coerce.number().min(100, "Minimum budget is $100"),
  travelStyle: z.string().default("Solo"),
  coverImage: z.string().url("Valid cover image URL is required"),
  selectedCityIds: z.array(z.string()).min(1, "Please select at least 1 destination stop"),
});

type TripFormData = z.infer<typeof tripFormSchema>;

interface CreateTripFormProps {
  initialCityId?: string;
}

export function CreateTripForm({ initialCityId }: CreateTripFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [cities, setCities] = React.useState<City[]>([]);
  const [user, setUser] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    getCities().then(setCities).catch(() => toast.error("Unable to load destinations"));
    getCurrentUser().then(setUser).catch(() => undefined);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: initialCityId
        ? "Destination Expedition"
        : "European Summer Grand Tour",
      tagline: "Historic streets, boutique stays, culinary gems & scenic train hops",
      description:
        "A customized itinerary designed for unforgettable cultural immersion, scenic views, and local culinary experiences.",
      startDate: "2026-09-10",
      endDate: "2026-09-18",
      totalBudget: 3500,
      travelStyle: "Couple",
      coverImage: COVER_PRESETS[0].url,
      selectedCityIds: initialCityId ? [initialCityId] : ["city-paris", "city-zurich"],
    },
  });

  const formData = watch();

  const handleToggleCity = (cityId: string) => {
    const current = formData.selectedCityIds || [];
    if (current.includes(cityId)) {
      if (current.length > 1) {
        setValue("selectedCityIds", current.filter((id) => id !== cityId));
      } else {
        toast.error("Trip must have at least 1 destination");
      }
    } else {
      setValue("selectedCityIds", [...current, cityId]);
    }
  };

  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true);

    const totalDays = getDaysDifference(data.startDate, data.endDate);
    const selectedCitiesDetails = data.selectedCityIds
      .map((id, index) => {
        const city = cities.find((item) => item.id === id);
        if (!city) return null;
        const daysBefore = Math.floor((totalDays / data.selectedCityIds.length) * index);
        const stayDurationDays = index === data.selectedCityIds.length - 1
          ? totalDays - daysBefore
          : Math.max(1, Math.floor(totalDays / data.selectedCityIds.length));
        const arrival = new Date(`${data.startDate}T00:00:00`);
        arrival.setDate(arrival.getDate() + daysBefore);
        const departure = new Date(arrival);
        departure.setDate(departure.getDate() + stayDurationDays - 1);
        return {
          id: `stop-${crypto.randomUUID()}-${index}`,
          cityId: city.id,
          cityName: city.name,
          country: city.country,
          coverImage: city.image,
          arrivalDate: arrival.toISOString().slice(0, 10),
          departureDate: departure.toISOString().slice(0, 10),
          stayDurationDays,
          coordinates: city.coordinates,
          order: index + 1,
        };
      })
      .filter(Boolean) as any[];

    try {
      const created = await createTrip({
        title: data.title,
        tagline: data.tagline || "",
        description: data.description,
        coverImage: data.coverImage,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays,
        status: "upcoming",
        travelStyle: data.travelStyle as TravelStyle,
        totalBudget: data.totalBudget,
        spentBudget: 0,
        currency: "USD",
        cities: selectedCitiesDetails,
        itinerary: [],
        collaborators: [
          {
            id: user?.id || "owner",
            name: user?.name || "Trip Owner",
            email: user?.email || "",
            avatar: user?.avatar || "",
            role: "owner",
            status: "active",
          },
        ],
        isPublic: true,
        tags: ["Custom Itinerary", data.travelStyle],
      });

      toast.success(`Trip "${created.title}" successfully created!`);
      router.push(`/trips/${created.id}/builder`);
    } catch (err) {
      toast.error("Failed to create trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Controls (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Name & Tagline */}
          <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span>Trip Essentials</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Trip Title
              </label>
              <Input
                type="text"
                placeholder="e.g. Grand Japan Odyssey"
                {...register("title")}
                className="h-12 rounded-2xl font-medium"
              />
              {errors.title && (
                <p className="text-xs text-danger font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Short Tagline
              </label>
              <Input
                type="text"
                placeholder="e.g. Neon skylines, bullet trains & Michelin ramen"
                {...register("tagline")}
                className="h-11 rounded-2xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Description & Vision
              </label>
              <Textarea
                placeholder="Describe your travel goals, highlights, and group desires..."
                {...register("description")}
                className="rounded-2xl text-xs min-h-[80px]"
              />
              {errors.description && (
                <p className="text-xs text-danger font-medium">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Destinations Picker */}
          <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Select Destination Stops</span>
              </h3>
              <Badge variant="outline" className="text-xs">
                {formData.selectedCityIds?.length || 0} Stops Selected
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {cities.map((city) => {
                const isSelected = formData.selectedCityIds?.includes(city.id);
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleToggleCity(city.id)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-200 flex items-center gap-2.5 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <div className="relative h-8 w-8 rounded-xl overflow-hidden shrink-0">
                      <Image src={city.image} alt={city.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate">{city.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{city.country}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
            {errors.selectedCityIds && (
              <p className="text-xs text-danger font-medium">{errors.selectedCityIds.message}</p>
            )}
          </div>

          {/* Dates, Budget & Travel Style */}
          <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span>Dates & Budget</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Start Date
                </label>
                <Input
                  type="date"
                  {...register("startDate")}
                  className="h-11 rounded-2xl text-xs"
                />
                {errors.startDate && (
                  <p className="text-xs text-danger font-medium">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  End Date
                </label>
                <Input
                  type="date"
                  {...register("endDate")}
                  className="h-11 rounded-2xl text-xs"
                />
                {errors.endDate && (
                  <p className="text-xs text-danger font-medium">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Total Planned Budget (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="number"
                  placeholder="3500"
                  {...register("totalBudget")}
                  className="pl-10 h-11 rounded-2xl text-xs font-semibold"
                />
              </div>
              {errors.totalBudget && (
                <p className="text-xs text-danger font-medium">{errors.totalBudget.message}</p>
              )}
            </div>

            {/* Travel Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Travel Style & Pace
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map((style) => {
                  const isCurrent = formData.travelStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setValue("travelStyle", style)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isCurrent
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cover Photo Preset Selector */}
          <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-amber-500" />
              <span>Choose Cover Photography</span>
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COVER_PRESETS.map((preset) => {
                const isSelected = formData.coverImage === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setValue("coverImage", preset.url)}
                    className={`relative h-20 rounded-2xl overflow-hidden border-2 transition-all group ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/40 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 gap-2"
          >
            {isSubmitting ? (
              <span>Building Itinerary...</span>
            ) : (
              <>
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Create & Open Itinerary Builder</span>
                <ArrowRight className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Right Live Preview Sticky Card (5 cols) */}
      <div className="lg:col-span-5 sticky top-28 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Live Preview
          </span>
          <Badge variant="glass" className="text-[10px]">
            {formData.travelStyle} Mode
          </Badge>
        </div>

        {/* Live Rendered Trip Card */}
        <Card className="overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-2xl">
          <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
            <Image
              src={formData.coverImage || COVER_PRESETS[0].url}
              alt="Cover Preview"
              fill
              className="object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 left-4">
              <Badge variant="default" className="text-xs">
                Upcoming
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h4 className="font-extrabold text-xl leading-tight">
                {formData.title || "Untitled Trip"}
              </h4>
              <p className="text-xs text-zinc-200 mt-1 line-clamp-1">
                {formData.tagline || "Your exciting travel itinerary"}
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                {formData.startDate && formData.endDate
                  ? formatDateRange(formData.startDate, formData.endDate)
                  : "Dates TBD"}
              </span>
              <span className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                <Layers className="h-4 w-4 text-secondary" />
                {formData.selectedCityIds?.length || 0} Cities
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Planned Budget</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(Number(formData.totalBudget) || 0)}
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            {/* Selected Stops Preview Pills */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
              {formData.selectedCityIds?.map((id) => {
                const city = cities.find((item) => item.id === id);
                return (
                  <span
                    key={id}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3 text-primary" />
                    {city?.name || id}
                  </span>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
