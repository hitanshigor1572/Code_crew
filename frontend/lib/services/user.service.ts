import { UserProfile } from '@/types/user';
import { api, saveToken } from '@/lib/api';

export async function getCurrentUser(): Promise<UserProfile> { return api<UserProfile>('/users/me'); }

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> { return api<UserProfile>('/users/me', { method: 'PATCH', body: JSON.stringify(updates) }); }
export async function deleteCurrentUser(): Promise<void> { await api<void>('/users/me', { method: 'DELETE' }); localStorage.removeItem('globetrotter_token'); }

export async function toggleSaveDestination(cityId: string): Promise<string[]> { const user = await getCurrentUser(); const savedDestinations = user.savedDestinations.includes(cityId) ? user.savedDestinations.filter((id) => id !== cityId) : [...user.savedDestinations, cityId]; await updateUserProfile({ savedDestinations }); return savedDestinations; }

export async function login(email: string, password: string) { const result = await api<{ token: string; user: UserProfile }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); saveToken(result.token); return result.user; }
export async function signup(fullName: string, email: string, password: string) { const result = await api<{ token: string; user: UserProfile }>('/auth/signup', { method: 'POST', body: JSON.stringify({ fullName, email, password }) }); saveToken(result.token); return result.user; }
