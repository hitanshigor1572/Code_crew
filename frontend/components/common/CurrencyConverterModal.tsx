"use client";

import * as React from "react";
import { DollarSign, ArrowRightLeft, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 153.4,
  INR: 86.8,
  CHF: 0.88,
  AUD: 1.54,
};

export function CurrencyConverterModal({
  isOpen,
  onClose,
}: CurrencyConverterModalProps) {
  const [amount, setAmount] = React.useState<number>(100);
  const [fromCurrency, setFromCurrency] = React.useState<string>("USD");
  const [toCurrency, setToCurrency] = React.useState<string>("EUR");

  const convertedAmount = React.useMemo(() => {
    const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
    const rateTo = EXCHANGE_RATES[toCurrency] || 1;
    const inUSD = amount / rateFrom;
    return inUSD * rateTo;
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <DollarSign className="h-4 w-4" />
            <span>GlobeTrotter FX</span>
          </div>
          <DialogTitle className="text-xl font-bold">Currency Converter</DialogTitle>
          <DialogDescription className="text-xs">
            Live estimates for global travel budgeting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="text-lg font-bold h-12 rounded-2xl"
              min={1}
            />
          </div>

          {/* Currencies Grid with Swap */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {Object.keys(EXCHANGE_RATES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="h-10 w-10 mt-5 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500">To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {Object.keys(EXCHANGE_RATES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result Card */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-4 text-center">
            <p className="text-xs text-zinc-500 font-medium">Estimated Value</p>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-[11px] text-zinc-400 mt-2 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              1 {fromCurrency} = {(EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[fromCurrency]).toFixed(4)} {toCurrency}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
