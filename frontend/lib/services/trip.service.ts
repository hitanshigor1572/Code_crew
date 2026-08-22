import { Trip, TripStatus, CityStop, ItineraryDay } from '@/types/trip';
import { api } from '@/lib/api';

export async function getTrips(status?: TripStatus): Promise<Trip[]> { return api<Trip[]>(`/trips${status && status !== ('all' as any) ? `?status=${encodeURIComponent(status)}` : ''}`); }

export async function getTripById(id: string): Promise<Trip | null> { try { return await api<Trip>(`/trips/${encodeURIComponent(id)}`); } catch { return null; } }

export async function createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'progressPercent' | 'shareId'>): Promise<Trip> {
  return api<Trip>('/trips', { method: 'POST', body: JSON.stringify(tripData) });
}

export async function updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | null> {
  try { return await api<Trip>(`/trips/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }); } catch { return null; }
}

export async function deleteTrip(id: string): Promise<boolean> {
  const result = await api<{ deleted: boolean }>(`/trips/${id}`, { method: 'DELETE' }); return result.deleted;
}

export async function inviteTripCollaborator(
  tripId: string,
  email: string,
  role: 'editor' | 'viewer' = 'editor'
): Promise<{ collaborators: Trip['collaborators']; inviteLink: string }> {
  return api<{ ok: boolean; collaborators: Trip['collaborators']; inviteLink: string }>(`/trips/${encodeURIComponent(tripId)}/invite`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  }).then((result) => ({ collaborators: result.collaborators, inviteLink: result.inviteLink }));
}

export async function cloneTrip(id: string): Promise<Trip | null> {
  const existing = await getTripById(id); if (!existing) return null;
  return createTrip({ ...existing, title: `${existing.title} (Copy)`, status: 'draft', spentBudget: 0 });
}
