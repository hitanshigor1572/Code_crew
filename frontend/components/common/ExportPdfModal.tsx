"use client";

import * as React from "react";
import { Printer, Download, FileText, CheckCircle2, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trip } from "@/types/trip";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export function ExportPdfModal({ isOpen, onClose, trip }: ExportPdfModalProps) {
  const handlePrint = () => {
    window.print();
    toast.success("Sending itinerary to print!");
  };

  const handleDownload = () => {
    toast.success(`Exporting "${trip.title}" PDF package...`);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <FileText className="h-4 w-4" />
            <span>Document Generator</span>
          </div>
          <DialogTitle className="text-xl font-bold">Export Itinerary</DialogTitle>
          <DialogDescription className="text-xs">
            Generate a clean, high-resolution printable travel itinerary & ticket summary.
          </DialogDescription>
        </DialogHeader>

        {/* Printable Preview Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 p-5 space-y-4">
          <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                GlobeTrotter Travel Dossier
              </span>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{trip.title}</h4>
              <p className="text-xs text-zinc-500">
                {formatDateRange(trip.startDate, trip.endDate)} ({trip.totalDays} Days)
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              #{trip.shareId}
            </Badge>
          </div>

          {/* Cities Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-semibold text-zinc-400 text-[11px]">Destinations</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {trip.cities.map((c) => c.cityName).join(" → ")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-zinc-400 text-[11px]">Budget Planned</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {formatCurrency(trip.totalBudget, trip.currency)}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Includes hotel vouchers, daily schedules & QR mobile link
            </span>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between pt-2">
          <Button variant="outline" onClick={handlePrint} className="rounded-2xl gap-1.5">
            <Printer className="h-4 w-4" />
            <span>Print Version</span>
          </Button>
          <Button onClick={handleDownload} className="rounded-2xl gap-1.5">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
