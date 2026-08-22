import { MOCK_TRIPS } from '@/data/mock';
import { Trip, TripStatus, CityStop, ItineraryDay } from '@/types/trip';

// In-memory store for client mutations during session
let tripsStore: Trip[] = [...MOCK_TRIPS];

export async function getTrips(status?: TripStatus): Promise<Trip[]> {
  // Simulate lightweight async network delay
  await new Promise((resolve) => setTimeout(resolve, 80));
  if (!status || status === 'all' as any) {
    return [...tripsStore];
  }
  return tripsStore.filter((trip) => trip.status === status);
}

export async function getTripById(id: string): Promise<Trip | null> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const trip = tripsStore.find((t) => t.id === id || t.shareId === id);
  return trip ? { ...trip } : null;
}

export async function createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'progressPercent' | 'shareId'>): Promise<Trip> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const newTrip: Trip = {
    ...tripData,
    id: `trip-${Date.now()}`,
    shareId: `gt-share-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    progressPercent: 15,
  };
  tripsStore = [newTrip, ...tripsStore];
  return newTrip;
}

export async function updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const index = tripsStore.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tripsStore[index] = {
    ...tripsStore[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0],
  };
  return tripsStore[index];
}

export async function deleteTrip(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const initialLength = tripsStore.length;
  tripsStore = tripsStore.filter((t) => t.id !== id);
  return tripsStore.length < initialLength;
}

export async function cloneTrip(id: string): Promise<Trip | null> {
  const existing = await getTripById(id);
  if (!existing) return null;

  const cloned: Trip = {
    ...existing,
    id: `trip-${Date.now()}`,
    title: `${existing.title} (Copy)`,
    shareId: `gt-share-${Math.random().toString(36).substring(2, 8)}`,
    status: 'draft',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    progressPercent: 0,
    spentBudget: 0,
  };
  tripsStore = [cloned, ...tripsStore];
  return cloned;
}
