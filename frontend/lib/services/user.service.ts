import { MOCK_USER } from '@/data/mock';
import { UserProfile } from '@/types/user';

let userStore: UserProfile = { ...MOCK_USER };

export async function getCurrentUser(): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return { ...userStore };
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  userStore = {
    ...userStore,
    ...updates,
  };
  return { ...userStore };
}

export async function toggleSaveDestination(cityId: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const exists = userStore.savedDestinations.includes(cityId);
  if (exists) {
    userStore.savedDestinations = userStore.savedDestinations.filter((id) => id !== cityId);
  } else {
    userStore.savedDestinations = [...userStore.savedDestinations, cityId];
  }
  return [...userStore.savedDestinations];
}
