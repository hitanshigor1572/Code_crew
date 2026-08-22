export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Oceania';
  image: string;
  gallery: string[];
  description: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  avgDailyBudget: number; // in USD
  costIndex: 1 | 2 | 3 | 4; // 1: Budget ($), 2: Moderate ($$), 3: Upscale ($$$), 4: Luxury ($$$$)
  popularityScore: number; // 0-100
  climate: {
    temp: number; // Celsius
    condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Snow' | 'Mild';
    bestSeason: string;
  };
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  highlights: string[];
  timeZone: string;
}
