import { City } from '@/types/city';
import { api } from '@/lib/api';

export async function getCities(): Promise<City[]> {
  return api<City[]>('/cities');
}

export async function getCityById(id: string): Promise<City | null> {
  return api<City>(`/cities/${encodeURIComponent(id)}`).catch(() => null);
}

export async function searchCities(params: {
  query?: string;
  continent?: string;
  maxCostIndex?: number;
  tags?: string[];
}): Promise<City[]> {
  const query = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, Array.isArray(value) ? value.join(',') : String(value)); }); return api<City[]>(`/cities?${query}`);
}

export async function getFeaturedCities(): Promise<City[]> {
  return api<City[]>('/cities?featured=true');
}
