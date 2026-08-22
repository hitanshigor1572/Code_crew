export type ActivityCategory =
  | 'Food'
  | 'Adventure'
  | 'Nature'
  | 'Nightlife'
  | 'Shopping'
  | 'Culture';

export interface Activity {
  id: string;
  cityId: string;
  cityName: string;
  title: string;
  category: ActivityCategory;
  description: string;
  image: string;
  durationMinutes: number;
  durationText: string;
  cost: number; // in USD
  rating: number;
  reviewsCount: number;
  locationName: string;
  tags: string[];
  bookingRequired: boolean;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Flexible';
  coordinates?: {
    lat: number;
    lng: number;
  };
}
