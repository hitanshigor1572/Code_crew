"use client";

import * as React from "react";
import {
  DollarSign,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Plus,
  Receipt,
  Download,
  Calendar,
  CreditCard,
  Building,
  Plane,
  Utensils,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BudgetCard } from "@/components/trip/BudgetCard";
import { BudgetPieChart } from "@/components/charts/BudgetPieChart";
import { SpendingBarChart } from "@/components/charts/SpendingBarChart";
import { AddExpenseModal } from "@/components/forms/AddExpenseModal";
import { getBudgetSummary } from "@/lib/services/budget.service";
import { BudgetSummary } from "@/types/budget";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BudgetDashboardPage() {
  const [budget, setBudget] = React.useState<BudgetSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = React.useState(false);

  const fetchBudget = React.useCallback(async () => {
    try {
      const data = await getBudgetSummary();
      setBudget(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  if (loading || !budget) {
    return (
      <div className="p-12 text-center text-xs text-zinc-400">
        Loading budget analytics...
      </div>
    );
  }

  const percentSpent = Math.round((budget.totalSpent / budget.totalBudget) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Financial Intelligence
            </span>
            <Badge variant={budget.isOverBudget ? "destructive" : "success"} className="text-xs">
              {budget.isOverBudget ? "Over Budget Warning" : "On Track (72% Pacing)"}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Trip Budget & Expense Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Real-time tracking for <strong className="text-zinc-800 dark:text-zinc-200">{budget.tripTitle}</strong>
          </p>
        </div>

        <Button
          onClick={() => setAddExpenseModalOpen(true)}
          className="rounded-2xl gap-2 font-bold shadow-md shadow-primary/20 h-11 px-5 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Log New Expense</span>
        </Button>
      </div>

      {/* Over-Budget Warning Banner if triggered */}
      {budget.isOverBudget && (
        <Card className="p-4 rounded-3xl border border-danger/40 bg-danger/10 text-danger flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Budget Threshold Exceeded</h4>
              <p className="text-xs opacity-90">
                You have exceeded the planned trip budget by {formatCurrency(budget.overBudgetAmount, budget.currency)}.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl text-xs border-danger/30 text-danger hover:bg-danger/20">
            Adjust Ceiling
          </Button>
        </Card>
      )}

      {/* 1. KEY BUDGET KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BudgetCard
          title="Total Budget Planned"
          amount={budget.totalBudget}
          currency={budget.currency}
          subtitle="Fixed spending limit"
          icon={DollarSign}
          variant="default"
        />
        <BudgetCard
          title="Total Amount Spent"
          amount={budget.totalSpent}
          currency={budget.currency}
          totalLimit={budget.totalBudget}
          subtitle={`${percentSpent}% of total ceiling`}
          icon={CreditCard}
          variant={percentSpent > 90 ? "warning" : "default"}
        />
        <BudgetCard
          title="Remaining Balance"
          amount={budget.remainingBudget}
          currency={budget.currency}
          subtitle="Safe for meals & activities"
          icon={TrendingUp}
          variant="success"
        />
        <BudgetCard
          title="Average Daily Burn"
          amount={Math.round(budget.totalSpent / 7)}
          currency={budget.currency}
          subtitle="Across 7 trip days"
          icon={Calendar}
          variant="default"
        />
      </div>

      {/* 2. RECHARTS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Breakdown Donut (5 cols) */}
        <Card className="lg:col-span-5 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Category Distribution
              </span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Where Your Money Goes
              </h3>
            </div>
            <Badge variant="glass" className="text-[10px]">
              6 Categories
            </Badge>
          </div>

          <BudgetPieChart categories={budget.categories} currency={budget.currency} />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {budget.categories.map((c) => (
              <div key={c.category} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.category}
                </span>
                <span className="font-bold">{formatCurrency(c.spent, budget.currency)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Spending vs Cap Bar Chart (7 cols) */}
        <Card className="lg:col-span-7 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Daily Timeline
              </span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Daily Spending vs Target Cap ($450)
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">7 Days Tracked</span>
          </div>

          <SpendingBarChart dailySpending={budget.dailySpending} currency={budget.currency} />

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-500 flex items-center justify-between">
            <span>Peak spend occurred on <strong>Day 4 (TGV Transit & Dinner)</strong></span>
            <span className="text-primary font-bold">{formatCurrency(510, budget.currency)}</span>
          </div>
        </Card>
      </div>

      {/* 3. EXPENSE TRANSACTION LOG */}
      <Card className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Logged Transactions & Invoices
            </h3>
            <p className="text-xs text-zinc-500">
              Verified receipts and split expenses logged by travel party
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddExpenseModalOpen(true)}
            className="rounded-xl text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Transaction</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Transaction</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Paid By</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {budget.recentExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    <span>{exp.title}</span>
                  </td>
                  <td className="py-3.5">
                    <Badge variant="outline" className="text-[10px]">
                      {exp.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-zinc-500">{formatDate(exp.date)}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={exp.paidBy.avatar} />
                        <AvatarFallback>{exp.paidBy.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                        {exp.paidBy.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-extrabold text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(exp.amount, exp.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        tripId={budget.tripId}
        onExpenseAdded={fetchBudget}
      />
    </div>
  );
}
