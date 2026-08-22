import { Activity } from './activity';
import { City } from './city';
import { Collaborator } from './user';

export type TripStatus = 'upcoming' | 'in-progress' | 'completed' | 'wishlist' | 'draft';
export type TravelStyle = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Luxury' | 'Backpacker';
export type TransportType = 'flight' | 'train' | 'car' | 'ferry' | 'walk' | 'bus';

export interface TransportLeg {
  id: string;
  type: TransportType;
  fromCity: string;
  toCity: string;
  duration: string;
  departureTime?: string;
  arrivalTime?: string;
  cost: number;
  carrier?: string;
  bookingRef?: string;
  carbonKg?: number;
}

export interface HotelBlock {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  costPerNight: number;
  totalCost: number;
  rating: number;
  image: string;
  confirmationCode?: string;
}

export interface ItineraryItem {
  id: string;
  activityId?: string;
  title: string;
  description?: string;
  category: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  startTime?: string;
  endTime?: string;
  cost: number;
  locationName: string;
  image?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  cityId: string;
  cityName: string;
  themeTitle?: string;
  items: ItineraryItem[];
  transportLeg?: TransportLeg;
  hotel?: HotelBlock;
}

export interface CityStop {
  id: string;
  cityId: string;
  cityName: string;
  country: string;
  coverImage: string;
  arrivalDate: string;
  departureDate: string;
  stayDurationDays: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  hotel?: HotelBlock;
  order: number;
}

export interface Trip {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  status: TripStatus;
  travelStyle: TravelStyle;
  totalBudget: number;
  spentBudget: number;
  currency: string;
  cities: CityStop[];
  itinerary: ItineraryDay[];
  collaborators: Collaborator[];
  isPublic: boolean;
  shareId: string;
  createdAt: string;
  updatedAt: string;
  progressPercent: number; // 0 - 100
  tags: string[];
}
