"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Compass, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateTripForm } from "@/components/forms/CreateTripForm";

function CreateTripContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city") || undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
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
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Step 1: Journey Blueprint
            </span>
            <Badge variant="glass" className="text-[10px]">
              Live Preview Enabled
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Design Your Next Adventure
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
            Choose destinations, assign dates, set financial targets, and preview your trip card in real time.
          </p>
        </div>
      </div>

      {/* Main Creation Form Wizard */}
      <CreateTripForm initialCityId={cityParam} />
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading trip builder...</div>}>
      <CreateTripContent />
    </React.Suspense>
  );
}
