import { BudgetSummary, Expense } from '@/types/budget';
import { api } from '@/lib/api';

export async function getBudgetSummary(tripId?: string): Promise<BudgetSummary> {
  return api<BudgetSummary>(`/budget${tripId ? `?tripId=${encodeURIComponent(tripId)}` : ''}`);
}

export async function addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  return api<Expense>('/budget/expenses', { method: 'POST', body: JSON.stringify(expense) });
}
