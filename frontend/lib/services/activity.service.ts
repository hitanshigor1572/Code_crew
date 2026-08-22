import { MOCK_ACTIVITIES } from '@/data/mock';
import { Activity, ActivityCategory } from '@/types/activity';

export async function getActivities(): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return [...MOCK_ACTIVITIES];
}

export async function getActivitiesByCity(cityId: string): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return MOCK_ACTIVITIES.filter((a) => a.cityId === cityId);
}

export async function getActivitiesByCategory(category: ActivityCategory | 'All'): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  if (category === 'All') return [...MOCK_ACTIVITIES];
  return MOCK_ACTIVITIES.filter((a) => a.category === category);
}

export async function searchActivities(query: string, category?: string): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  let results = [...MOCK_ACTIVITIES];
  if (category && category !== 'All') {
    results = results.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.cityName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return results;
}
