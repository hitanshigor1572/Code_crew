export type ExpenseCategory =
  | 'Stays'
  | 'Flights'
  | 'Transit'
  | 'Food'
  | 'Activities'
  | 'Shopping'
  | 'Misc';

export interface Expense {
  id: string;
  tripId: string;
  tripTitle?: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paidBy: {
    name: string;
    avatar: string;
  };
  notes?: string;
  receiptUrl?: string;
}

export interface BudgetCategoryBreakdown {
  category: ExpenseCategory;
  allocated: number;
  spent: number;
  color: string;
}

export interface DailySpend {
  date: string;
  dayLabel: string;
  spent: number;
  budgetLimit: number;
}

export interface BudgetSummary {
  tripId: string;
  tripTitle: string;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  currency: string;
  categories: BudgetCategoryBreakdown[];
  dailySpending: DailySpend[];
  recentExpenses: Expense[];
  isOverBudget: boolean;
  overBudgetAmount: number;
}
