"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  MoreVertical,
  Share2,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trip } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  onClone?: (id: string) => void;
  onShare?: (trip: Trip) => void;
}

export function TripCard({
  trip,
  onDelete,
  onClone,
  onShare,
}: TripCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const statusVariant =
    trip.status === "in-progress"
      ? "success"
      : trip.status === "upcoming"
      ? "default"
      : trip.status === "completed"
      ? "outline"
      : "warning";

  return (
    <>
      <Card className="group overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 hover:shadow-card-hover transition-all duration-300 flex flex-col">
        {/* Cover Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Status and Actions */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
            <Badge variant={statusVariant} className="capitalize text-[11px] px-2.5 py-0.5 backdrop-blur-md">
              {trip.status}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="glass"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60"
                  aria-label="Trip options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-48 shadow-xl">
                <DropdownMenuItem asChild>
                  <Link href={`/trips/${trip.id}/builder`} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2 text-primary" /> Edit Itinerary
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/shared/${trip.shareId || trip.id}`} className="cursor-pointer">
                    <ExternalLink className="h-4 w-4 mr-2 text-secondary" /> View Public Link
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (onShare) onShare(trip);
                    else {
                      navigator.clipboard.writeText(
                        `https://globetrotter.io/shared/${trip.shareId || trip.id}`
                      );
                      toast.success("Share link copied!");
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Share2 className="h-4 w-4 mr-2 text-accent" /> Share Trip
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onClone && onClone(trip.id)}
                  className="cursor-pointer"
                >
                  <Copy className="h-4 w-4 mr-2" /> Duplicate Itinerary
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-danger focus:text-danger cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Trip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="font-bold text-lg text-white leading-tight drop-shadow-sm truncate">
              {trip.title}
            </h3>
            <p className="text-xs text-zinc-200 drop-shadow-sm line-clamp-1 mt-0.5">
              {trip.tagline || trip.description}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Dates & Destinations */}
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                <Layers className="h-3.5 w-3.5 text-secondary" />
                {trip.cities.length} {trip.cities.length === 1 ? "City" : "Cities"}
              </span>
            </div>

            {/* Budget Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 font-medium">Budget Spend</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {formatCurrency(trip.spentBudget, trip.currency)} /{" "}
                  <span className="text-zinc-400">
                    {formatCurrency(trip.totalBudget, trip.currency)}
                  </span>
                </span>
              </div>
              <Progress
                value={Math.min(100, Math.round((trip.spentBudget / (trip.totalBudget || 1)) * 100))}
                className="h-2"
              />
            </div>
          </div>

          {/* Footer with Collaborators and Action CTA */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            {/* Collaborators Stack */}
            <div className="flex items-center -space-x-2">
              {trip.collaborators.slice(0, 3).map((collab) => (
                <Avatar key={collab.id} className="h-7 w-7 border-2 border-white dark:border-zinc-900">
                  <AvatarImage src={collab.avatar} alt={collab.name} />
                  <AvatarFallback>{collab.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
              {trip.collaborators.length > 3 && (
                <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 border-2 border-white dark:border-zinc-900">
                  +{trip.collaborators.length - 3}
                </div>
              )}
            </div>

            {/* Quick Link Button */}
            <Link href={`/trips/${trip.id}/builder`}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold h-8 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
              >
                Open Itinerary
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="rounded-3xl p-6 sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold text-danger">Delete Trip</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete &quot;{trip.title}&quot;? All associated itineraries and expense logs will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (onDelete) onDelete(trip.id);
                setShowDeleteConfirm(false);
                toast.success("Trip successfully deleted");
              }}
              className="rounded-xl"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
