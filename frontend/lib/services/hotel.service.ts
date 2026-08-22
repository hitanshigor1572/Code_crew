import { api } from '@/lib/api';

export interface HotelSuggestion {
  id: string;
  name: string;
  address: string;
  costPerNight: number;
  rating: number;
  image: string;
  cityId?: string;
  cityName?: string;
  bookingUrl?: string;
}

export async function searchHotels(cityId?: string, cityName?: string): Promise<HotelSuggestion[]> {
  const params = new URLSearchParams();
  if (cityId) params.set('cityId', cityId);
  if (cityName) params.set('cityName', cityName);
  const query = params.toString();
  return api<HotelSuggestion[]>(`/hotels${query ? `?${query}` : ''}`);
}
