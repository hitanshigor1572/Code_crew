import { MOCK_BUDGET_SUMMARY } from '@/data/mock';
import { BudgetSummary, Expense } from '@/types/budget';

let budgetSummaryStore: BudgetSummary = { ...MOCK_BUDGET_SUMMARY };

export async function getBudgetSummary(tripId?: string): Promise<BudgetSummary> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return { ...budgetSummaryStore };
}

export async function addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const newExp: Expense = {
    ...expense,
    id: `exp-${Date.now()}`,
  };

  const updatedExpenses = [newExp, ...budgetSummaryStore.recentExpenses];
  const newTotalSpent = budgetSummaryStore.totalSpent + newExp.amount;
  const newRemaining = Math.max(0, budgetSummaryStore.totalBudget - newTotalSpent);
  const isOver = newTotalSpent > budgetSummaryStore.totalBudget;

  budgetSummaryStore = {
    ...budgetSummaryStore,
    totalSpent: newTotalSpent,
    remainingBudget: newRemaining,
    isOverBudget: isOver,
    overBudgetAmount: isOver ? newTotalSpent - budgetSummaryStore.totalBudget : 0,
    recentExpenses: updatedExpenses,
  };

  return newExp;
}
