import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { pool } from './db/pool.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const secret = process.env.JWT_SECRET || 'development-only-secret';
type AuthRequest = Request & { userId?: string };

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));

function asyncRoute(handler: (req: AuthRequest, res: Response) => Promise<any>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => handler(req, res).catch(next);
}

function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.userId = (jwt.verify(token, secret) as jwt.JwtPayload).sub; next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return (value as T) || fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function userResponse(row: any) {
  return { id: row.id, name: row.name, email: row.email, avatar: row.avatar, role: row.role, bio: row.bio,
    location: row.location, countriesVisited: row.countries_visited, tripsCompleted: row.trips_completed,
    currency: row.currency, distanceUnit: row.distance_unit, travelPace: row.travel_pace, theme: row.theme,
    joinedDate: row.joined_date, badges: parseJson(row.badges, []), savedDestinations: parseJson(row.saved_destinations, []) };
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/ai/chat', auth, asyncRoute(async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI Copilot is not configured. Add GROQ_API_KEY to backend/.env.' });
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body.history) ? req.body.history.slice(-10) : [];
  if (!message) return res.status(400).json({ error: 'A message is required' });

  const [userRows] = await pool.execute('SELECT name, bio, location, currency, travel_pace, saved_destinations FROM users WHERE id = ?', [req.userId!] as any[]);
  const [tripRows] = await pool.execute('SELECT title, start_date, end_date, status, total_budget, spent_budget, cities FROM trips WHERE owner_id = ? ORDER BY start_date LIMIT 10', [req.userId!] as any[]);
  const [cityRows] = await pool.execute('SELECT id, name, country, description, avg_daily_budget, tags FROM cities ORDER BY popularity_score DESC LIMIT 20');
  const user = (userRows as any[])[0] || {};
  const context = {
    user: { name: user.name, bio: user.bio, location: user.location, currency: user.currency, travelPace: user.travel_pace, savedDestinations: parseJson(user.saved_destinations, []) },
    trips: (tripRows as any[]).map((trip) => ({ ...trip, total_budget: Number(trip.total_budget), spent_budget: Number(trip.spent_budget), cities: parseJson(trip.cities, []) })),
    featuredCities: (cityRows as any[]).map((city) => ({ id: city.id, name: city.name, country: city.country, description: city.description, avgDailyBudget: Number(city.avg_daily_budget), tags: parseJson(city.tags, []) })),
  };
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', temperature: 0.4, max_tokens: 900,
      messages: [{ role: 'system', content: `You are GlobeTrotter AI Copilot, a practical travel planning assistant. Use only the supplied application data for personal facts and clearly label estimates. Never claim to book, modify, or add anything unless the application explicitly supports it. Give concise, actionable answers with costs in the user's currency. Application data: ${JSON.stringify(context)}` }, ...history.filter((item: any) => ['user', 'assistant'].includes(item?.role) && typeof item?.content === 'string').map((item: any) => ({ role: item.role, content: item.content })), { role: 'user', content: message }] }),
  });
  const result = await groqResponse.json() as any;
  if (!groqResponse.ok) { console.error('Groq request failed:', result); return res.status(502).json({ error: 'The AI provider could not answer right now' }); }
  res.json({ text: result.choices?.[0]?.message?.content || 'I could not generate a response.', model: result.model });
}));

app.post('/api/auth/signup', asyncRoute(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password || password.length < 8) return res.status(400).json({ error: 'Name, valid email and 8-character password are required' });
  const id = randomUUID();
  try {
    await pool.execute(`INSERT INTO users (id,name,email,password_hash,avatar,bio,location,joined_date,saved_destinations,badges) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [id, fullName.trim(), email.toLowerCase().trim(), await bcrypt.hash(password, 12), '', '', '', new Date(), '[]', '[]']);
  } catch (error: any) { if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email is already registered' }); throw error; }
  const token = jwt.sign({ sub: id }, secret, { expiresIn: '30d' });
  res.status(201).json({ token, user: { id, name: fullName, email: email.toLowerCase(), role: 'user' } });
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [String(email || '').toLowerCase().trim()]);
  const user = (rows as any[])[0];
  if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash))) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: jwt.sign({ sub: user.id }, secret, { expiresIn: '30d' }), user: userResponse(user) });
}));

app.get('/api/users/me', auth, asyncRoute(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.userId!] as any[]);
  const user = (rows as any[])[0]; if (!user) return res.status(404).json({ error: 'User not found' }); res.json(userResponse(user));
}));

app.patch('/api/users/me', auth, asyncRoute(async (req, res) => {
  const allowed: Record<string, string> = { name: 'name', bio: 'bio', location: 'location', currency: 'currency', distanceUnit: 'distance_unit', travelPace: 'travel_pace', theme: 'theme', savedDestinations: 'saved_destinations' };
  const fields = Object.keys(req.body).filter((key) => allowed[key]);
  if (!fields.length) return res.status(400).json({ error: 'No supported fields supplied' });
  const set = fields.map((key) => `\`${allowed[key]}\` = ?`).join(', ');
  const values = fields.map((key) => ['savedDestinations'].includes(key) ? JSON.stringify(req.body[key]) : req.body[key]);
  await pool.execute(`UPDATE users SET ${set} WHERE id = ?`, [...values, req.userId]);
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.userId!] as any[]); res.json(userResponse((rows as any[])[0]));
}));

app.get('/api/cities', asyncRoute(async (req, res) => {
  const query = String(req.query.query || '').trim(); const continent = String(req.query.continent || '');
  const conditions: string[] = []; const values: unknown[] = [];
  if (query) { conditions.push('(name LIKE ? OR country LIKE ?)'); values.push(`%${query}%`, `%${query}%`); }
  if (continent && continent !== 'All') { conditions.push('continent = ?'); values.push(continent); }
  if (req.query.maxCostIndex) { conditions.push('cost_index <= ?'); values.push(Number(req.query.maxCostIndex)); }
  const [rows] = await pool.execute(`SELECT * FROM cities ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} ORDER BY popularity_score DESC`, values as any[]);
  res.json((rows as any[]).map((row) => ({ ...row, countryCode: row.country_code, reviewCount: row.review_count, avgDailyBudget: Number(row.avg_daily_budget), costIndex: row.cost_index, popularityScore: row.popularity_score, gallery: parseJson(row.gallery, []), climate: parseJson(row.climate, {}), tags: parseJson(row.tags, []), coordinates: parseJson(row.coordinates, {}), highlights: parseJson(row.highlights, []), timeZone: row.time_zone })));
}));
app.get('/api/cities/:id', asyncRoute(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM cities WHERE id = ? OR LOWER(name) = LOWER(?)', [req.params.id, req.params.id]);
  const row = (rows as any[])[0]; if (!row) return res.status(404).json({ error: 'City not found' });
  res.json({ ...row, countryCode: row.country_code, reviewCount: row.review_count, avgDailyBudget: Number(row.avg_daily_budget), costIndex: row.cost_index, popularityScore: row.popularity_score, gallery: parseJson(row.gallery, []), climate: parseJson(row.climate, {}), tags: parseJson(row.tags, []), coordinates: parseJson(row.coordinates, {}), highlights: parseJson(row.highlights, []), timeZone: row.time_zone });
}));

app.get('/api/activities', asyncRoute(async (req, res) => {
  const search = `%${String(req.query.query || '').trim()}%`;
  const [rows] = await pool.execute('SELECT * FROM activities WHERE (? = "" OR city_id = ?) AND (? = "" OR category = ?) AND (? = "%%" OR title LIKE ? OR city_name LIKE ? OR description LIKE ?) ORDER BY rating DESC', [String(req.query.cityId || ''), String(req.query.cityId || ''), String(req.query.category || ''), String(req.query.category || ''), search, search, search, search]);
  res.json((rows as any[]).map((row) => ({ ...row, cityId: row.city_id, durationMinutes: row.duration_minutes, durationText: row.duration_text, reviewsCount: row.reviews_count, locationName: row.location_name, bookingRequired: Boolean(row.booking_required), timeOfDay: row.time_of_day, tags: parseJson(row.tags, []), coordinates: parseJson(row.coordinates, undefined) })));
}));

app.get('/api/admin/metrics', auth, asyncRoute(async (_req, res) => {
  const [userRows] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [tripRows] = await pool.query('SELECT COUNT(*) AS totalTrips, COALESCE(SUM(total_budget), 0) AS plannedSpend FROM trips');
  const [cityRows] = await pool.query('SELECT COUNT(*) AS totalCities FROM cities');
  const users = (userRows as any[])[0];
  const trips = (tripRows as any[])[0];
  const cities = (cityRows as any[])[0];
  const [popular] = await pool.query('SELECT city_name AS name, COUNT(*) AS tripsCount FROM (SELECT JSON_UNQUOTE(JSON_EXTRACT(stop.value, "$.cityName")) AS city_name FROM trips JOIN JSON_TABLE(trips.cities, "$[*]" COLUMNS (value JSON PATH "$")) AS stop) AS destinations WHERE city_name IS NOT NULL GROUP BY city_name ORDER BY tripsCount DESC LIMIT 6');
  res.json({ totalUsers: Number((users as any).totalUsers), activeTrips: Number((trips as any).totalTrips), totalSavedUSD: Number((trips as any).plannedSpend), totalCitiesMapped: Number((cities as any).totalCities), popularDestinations: (popular as any[]).map((item) => ({ name: item.name, tripsCount: Number(item.tripsCount), percentage: 100 })), userGrowth: [] });
}));

function tripResponse(row: any) { return { id: row.id, title: row.title, tagline: row.tagline, description: row.description, coverImage: row.cover_image, startDate: row.start_date, endDate: row.end_date, totalDays: row.total_days, status: row.status, travelStyle: row.travel_style, totalBudget: Number(row.total_budget), spentBudget: Number(row.spent_budget), currency: row.currency, cities: parseJson(row.cities, []), itinerary: parseJson(row.itinerary, []), collaborators: parseJson(row.collaborators, []), isPublic: Boolean(row.is_public), shareId: row.share_id, createdAt: row.created_at, updatedAt: row.updated_at, progressPercent: row.total_days ? Math.min(100, Math.round((Number(row.spent_budget) / Number(row.total_budget)) * 100)) : 0, tags: parseJson(row.tags, []) }; }
app.get('/api/trips', auth, asyncRoute(async (req, res) => { const [rows] = await pool.execute('SELECT * FROM trips WHERE owner_id = ? AND (? = "" OR status = ?)', [req.userId!, String(req.query.status || ''), String(req.query.status || '')] as any[]); res.json((rows as any[]).map(tripResponse)); }));
app.get('/api/trips/:id', asyncRoute(async (req, res) => { const [rows] = await pool.execute('SELECT * FROM trips WHERE id = ? OR share_id = ?', [req.params.id, req.params.id]); const trip = (rows as any[])[0]; if (!trip || (!trip.is_public && trip.owner_id !== req.userId)) return res.status(404).json({ error: 'Trip not found' }); res.json(tripResponse(trip)); }));
app.post('/api/trips', auth, asyncRoute(async (req, res) => { const data = req.body; const id = randomUUID(); const today = new Date(); const shareId = `gt-share-${randomUUID().slice(0, 8)}`; await pool.execute(`INSERT INTO trips (id,owner_id,title,tagline,description,cover_image,start_date,end_date,total_days,status,travel_style,total_budget,spent_budget,currency,cities,itinerary,collaborators,is_public,share_id,tags,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [id, req.userId, data.title, data.tagline || '', data.description, data.coverImage, data.startDate, data.endDate, data.totalDays || 1, data.status || 'draft', data.travelStyle || 'Solo', data.totalBudget || 0, data.spentBudget || 0, data.currency || 'USD', JSON.stringify(data.cities || []), JSON.stringify(data.itinerary || []), JSON.stringify(data.collaborators || []), data.isPublic !== false, shareId, JSON.stringify(data.tags || []), today, today]); const [rows] = await pool.execute('SELECT * FROM trips WHERE id = ?', [id]); res.status(201).json(tripResponse((rows as any[])[0])); }));
app.patch('/api/trips/:id', auth, asyncRoute(async (req, res) => { const map: Record<string,string> = { title:'title', tagline:'tagline', description:'description', coverImage:'cover_image', startDate:'start_date', endDate:'end_date', totalDays:'total_days', status:'status', travelStyle:'travel_style', totalBudget:'total_budget', spentBudget:'spent_budget', currency:'currency', cities:'cities', itinerary:'itinerary', collaborators:'collaborators', isPublic:'is_public', tags:'tags' }; const keys = Object.keys(req.body).filter((key) => map[key]); if (!keys.length) return res.status(400).json({ error:'No supported fields supplied' }); const values = keys.map((key) => ['cities','itinerary','collaborators','tags'].includes(key) ? JSON.stringify(req.body[key]) : req.body[key]); await pool.execute(`UPDATE trips SET ${keys.map((key) => `\`${map[key]}\` = ?`).join(', ')}, updated_at = ? WHERE id = ? AND owner_id = ?`, [...values, new Date(), req.params.id, req.userId]); const [rows] = await pool.execute('SELECT * FROM trips WHERE id = ?', [req.params.id]); const trip = (rows as any[])[0]; if (!trip) return res.status(404).json({ error:'Trip not found' }); res.json(tripResponse(trip)); }));
app.delete('/api/trips/:id', auth, asyncRoute(async (req, res) => { const [result] = await pool.execute('DELETE FROM trips WHERE id = ? AND owner_id = ?', [req.params.id, req.userId!] as any[]); res.json({ deleted: (result as any).affectedRows === 1 }); }));
app.get('/api/budget', auth, asyncRoute(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM expenses WHERE owner_id = ? AND (? = "" OR trip_id = ?) ORDER BY expense_date DESC', [req.userId!, String(req.query.tripId || ''), String(req.query.tripId || '')] as any[]);
  const expenses = (rows as any[]).map((row) => ({ id: row.id, tripId: row.trip_id, title: row.title, amount: Number(row.amount), currency: row.currency, category: row.category, date: row.expense_date, paidBy: parseJson(row.paid_by, {}), notes: row.notes, receiptUrl: row.receipt_url }));
  const [tripRows] = await pool.execute('SELECT * FROM trips WHERE owner_id = ? AND (? = "" OR id = ?)', [req.userId!, String(req.query.tripId || ''), String(req.query.tripId || '')] as any[]); const trip = (tripRows as any[])[0]; const totalBudget = trip ? Number(trip.total_budget) : 0; const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  res.json({ tripId: trip?.id || '', tripTitle: trip?.title || 'All trips', totalBudget, totalSpent, remainingBudget: Math.max(0, totalBudget - totalSpent), currency: trip?.currency || 'USD', categories: [], dailySpending: [], recentExpenses: expenses, isOverBudget: totalSpent > totalBudget, overBudgetAmount: Math.max(0, totalSpent - totalBudget) });
}));
app.post('/api/budget/expenses', auth, asyncRoute(async (req, res) => { const data = req.body; const id = randomUUID(); await pool.execute('INSERT INTO expenses (id, owner_id, trip_id, title, amount, currency, category, expense_date, paid_by, notes, receipt_url) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [id, req.userId, data.tripId, data.title, data.amount, data.currency || 'USD', data.category, data.date, JSON.stringify(data.paidBy || {}), data.notes || null, data.receiptUrl || null]); res.status(201).json({ ...data, id }); }));

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => { console.error(error); res.status(500).json({ error: 'Internal server error' }); });
app.listen(port, () => console.log(`GlobeTrotter API listening on http://localhost:${port}`));