import { MOCK_CITIES } from '@/data/mock';
import { City } from '@/types/city';

export async function getCities(): Promise<City[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return [...MOCK_CITIES];
}

export async function getCityById(id: string): Promise<City | null> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const city = MOCK_CITIES.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
  return city ? { ...city } : null;
}

export async function searchCities(params: {
  query?: string;
  continent?: string;
  maxCostIndex?: number;
  tags?: string[];
}): Promise<City[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  let results = [...MOCK_CITIES];

  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (params.continent && params.continent !== 'All') {
    results = results.filter((c) => c.continent === params.continent);
  }

  if (params.maxCostIndex) {
    results = results.filter((c) => c.costIndex <= params.maxCostIndex!);
  }

  if (params.tags && params.tags.length > 0) {
    results = results.filter((c) =>
      params.tags!.some((tag) => c.tags.includes(tag))
    );
  }

  return results;
}

export async function getFeaturedCities(): Promise<City[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_CITIES.slice(0, 6);
}
