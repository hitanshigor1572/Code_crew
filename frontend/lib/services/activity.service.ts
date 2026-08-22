import { Activity, ActivityCategory } from '@/types/activity';
import { api } from '@/lib/api';

export async function getActivities(): Promise<Activity[]> {
  return api<Activity[]>('/activities');
}

export async function getActivitiesByCity(cityId: string): Promise<Activity[]> {
  return api<Activity[]>(`/activities?cityId=${encodeURIComponent(cityId)}`);
}

export async function getActivitiesByCategory(category: ActivityCategory | 'All'): Promise<Activity[]> {
  return api<Activity[]>(`/activities${category === 'All' ? '' : `?category=${encodeURIComponent(category)}`}`);
}

export async function searchActivities(query: string, category?: string): Promise<Activity[]> {
  const params = new URLSearchParams({ ...(query ? { query } : {}), ...(category && category !== 'All' ? { category } : {}) }); return api<Activity[]>(`/activities?${params}`);
}
