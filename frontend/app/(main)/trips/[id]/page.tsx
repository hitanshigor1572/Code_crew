"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Edit,
  Share2,
  Download,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InteractiveTripMap } from "@/components/map/InteractiveTripMap";
import { CollaborationModal } from "@/components/common/CollaborationModal";
import { ExportPdfModal } from "@/components/common/ExportPdfModal";
import { getTripById } from "@/lib/services/trip.service";
import { Trip } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";

export default function TripDetailsOverviewPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);

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
    return <div className="p-12 text-center text-xs text-zinc-400">Loading trip details...</div>;
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
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Trips</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="capitalize text-xs">
              {trip.status}
            </Badge>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500 font-semibold">{trip.travelStyle} Trip</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            {trip.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-10"
          >
            <Share2 className="h-4 w-4 text-accent" />
            <span>Share & Invite</span>
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

          <Link href={`/trips/${trip.id}/builder`}>
            <Button size="sm" className="rounded-2xl text-xs font-bold gap-1.5 h-10 shadow-md shadow-primary/20">
              <Edit className="h-4 w-4" />
              <span>Itinerary Builder</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Visual Card */}
      <Card className="overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xl">
        <div className="relative h-72 sm:h-96 w-full">
          <Image src={trip.coverImage} alt={trip.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Curated Itinerary
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{trip.title}</h2>
            <p className="text-xs sm:text-sm text-zinc-200 max-w-2xl">{trip.description}</p>
          </div>
        </div>
      </Card>

      {/* Route Map Preview */}
      <InteractiveTripMap stops={trip.cities} />

      {/* Summary Metrics & Stops */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-xs font-bold uppercase text-zinc-400">Duration</span>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {trip.totalDays} Days
          </p>
          <p className="text-xs text-zinc-500">{formatDateRange(trip.startDate, trip.endDate)}</p>
        </Card>

        <Card className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-xs font-bold uppercase text-zinc-400">Budget Progress</span>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {formatCurrency(trip.spentBudget, trip.currency)}
          </p>
          <p className="text-xs text-zinc-500">
            of {formatCurrency(trip.totalBudget, trip.currency)} Total Planned
          </p>
          <Progress
            value={Math.round((trip.spentBudget / (trip.totalBudget || 1)) * 100)}
            className="h-2 mt-2"
          />
        </Card>

        <Card className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-xs font-bold uppercase text-zinc-400">Travel Party</span>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex -space-x-2">
              {trip.collaborators.map((c) => (
                <Avatar key={c.id} className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback>{c.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {trip.collaborators.length} Members
            </span>
          </div>
          <p className="text-xs text-zinc-500 pt-1">Co-planning live</p>
        </Card>
      </div>

      <CollaborationModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        tripId={trip.id}
        shareId={trip.shareId}
        tripTitle={trip.title}
        collaborators={trip.collaborators}
        onCollaboratorsChange={(collaborators) => setTrip((prev) => (prev ? { ...prev, collaborators } : prev))}
      />

      <ExportPdfModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
