export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('globetrotter_token') : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('globetrotter_token');
    if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
  }
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body as T;
}

export function saveToken(token: string) { localStorage.setItem('globetrotter_token', token); }