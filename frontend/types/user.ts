export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  bio: string;
  location: string;
  countriesVisited: number;
  tripsCompleted: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CHF';
  distanceUnit: 'km' | 'mi';
  travelPace: 'relaxed' | 'moderate' | 'fast';
  theme: 'light' | 'dark' | 'system';
  joinedDate: string;
  badges: AchievementBadge[];
  savedDestinations: string[]; // City IDs
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'exploration' | 'budget' | 'culture' | 'social';
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'invited';
}
