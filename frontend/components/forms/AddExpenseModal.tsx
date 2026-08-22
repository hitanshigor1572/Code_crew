"use client";

import * as React from "react";
import { PlusCircle, DollarSign, Tag, Calendar, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseCategory } from "@/types/budget";
import { addExpense } from "@/lib/services/budget.service";
import { toast } from "sonner";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  onExpenseAdded?: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  "Stays",
  "Flights",
  "Transit",
  "Food",
  "Activities",
  "Shopping",
  "Misc",
];

export function AddExpenseModal({
  isOpen,
  onClose,
  tripId,
  onExpenseAdded,
}: AddExpenseModalProps) {
  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState<ExpenseCategory>("Food");
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      toast.error("Please fill in expense title and amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await addExpense({
        tripId,
        title,
        amount: Number(amount),
        currency: "USD",
        category,
        date,
        paidBy: {
          name: "Alexandre Morgan",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        },
      });

      toast.success(`Expense "${title}" logged successfully!`);
      if (onExpenseAdded) onExpenseAdded();
      setTitle("");
      setAmount("");
      onClose();
    } catch {
      toast.error("Failed to log expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Expense Logger</span>
          </div>
          <DialogTitle className="text-xl font-bold">Log New Expense</DialogTitle>
          <DialogDescription className="text-xs">
            Record payments, tickets, dining or reservations for real-time tracking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Expense Item / Description
            </label>
            <Input
              type="text"
              placeholder="e.g. Louvre Museum Tickets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-2xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="number"
                  placeholder="85"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9 h-11 rounded-2xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Category
              </label>
              <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
                <SelectTrigger className="h-11 rounded-2xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Expense Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 rounded-2xl text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-2xl font-bold text-xs"
            >
              {isSubmitting ? "Logging Expense..." : "Add Expense to Trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
