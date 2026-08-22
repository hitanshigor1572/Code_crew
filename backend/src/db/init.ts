import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const database = process.env.DB_NAME || 'globetrotter';
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});

await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database.replace(/[^a-zA-Z0-9_]/g, '')}\``);
await connection.changeUser({ database });

await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, avatar TEXT NOT NULL, role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    bio TEXT NOT NULL, location VARCHAR(160) NOT NULL, currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    distance_unit ENUM('km', 'mi') NOT NULL DEFAULT 'km', travel_pace ENUM('relaxed', 'moderate', 'fast') NOT NULL DEFAULT 'moderate',
    theme ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'system', countries_visited INT NOT NULL DEFAULT 0,
    trips_completed INT NOT NULL DEFAULT 0, joined_date DATE NOT NULL, saved_destinations JSON NOT NULL,
    badges JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
  CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(80) PRIMARY KEY, name VARCHAR(120) NOT NULL, country VARCHAR(120) NOT NULL, country_code VARCHAR(4) NOT NULL,
    continent VARCHAR(80) NOT NULL, image TEXT NOT NULL, gallery JSON NOT NULL, description TEXT NOT NULL, tagline VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) NOT NULL, review_count INT NOT NULL, avg_daily_budget DECIMAL(10,2) NOT NULL, cost_index TINYINT NOT NULL,
    popularity_score TINYINT NOT NULL, climate JSON NOT NULL, tags JSON NOT NULL, coordinates JSON NOT NULL, highlights JSON NOT NULL, time_zone VARCHAR(80) NOT NULL
  ) ENGINE=InnoDB;
  CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(80) PRIMARY KEY, city_id VARCHAR(80) NOT NULL, city_name VARCHAR(120) NOT NULL, title VARCHAR(180) NOT NULL,
    category VARCHAR(40) NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, duration_minutes INT NOT NULL, duration_text VARCHAR(60) NOT NULL,
    cost DECIMAL(10,2) NOT NULL, rating DECIMAL(3,2) NOT NULL, reviews_count INT NOT NULL, location_name VARCHAR(180) NOT NULL,
    tags JSON NOT NULL, booking_required BOOLEAN NOT NULL DEFAULT false, time_of_day VARCHAR(20) NOT NULL, coordinates JSON NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
  CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(36) PRIMARY KEY, owner_id VARCHAR(36) NOT NULL, title VARCHAR(180) NOT NULL, tagline VARCHAR(255) NOT NULL, description TEXT NOT NULL,
    cover_image TEXT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, total_days INT NOT NULL, status VARCHAR(20) NOT NULL,
    travel_style VARCHAR(30) NOT NULL, total_budget DECIMAL(12,2) NOT NULL, spent_budget DECIMAL(12,2) NOT NULL DEFAULT 0, currency VARCHAR(3) NOT NULL,
    cities JSON NOT NULL, itinerary JSON NOT NULL, collaborators JSON NOT NULL, is_public BOOLEAN NOT NULL DEFAULT true, share_id VARCHAR(40) NOT NULL UNIQUE,
    tags JSON NOT NULL, created_at DATE NOT NULL, updated_at DATE NOT NULL, FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
  CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(36) PRIMARY KEY, owner_id VARCHAR(36) NOT NULL, trip_id VARCHAR(36) NOT NULL, title VARCHAR(180) NOT NULL,
    amount DECIMAL(12,2) NOT NULL, currency VARCHAR(3) NOT NULL, category VARCHAR(30) NOT NULL, expense_date DATE NOT NULL,
    paid_by JSON NOT NULL, notes TEXT NULL, receipt_url TEXT NULL, FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) NOT NULL, title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL, type VARCHAR(30) NOT NULL DEFAULT 'info', is_read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
`);

const passwordHash = await bcrypt.hash('password123', 12);
await connection.query(
  `INSERT IGNORE INTO users (id, name, email, password_hash, avatar, bio, location, joined_date, saved_destinations, badges)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ['usr-alex-01', 'Alexandre Morgan', 'alex.morgan@globetrotter.io', passwordHash,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'Product Designer & Travel Enthusiast.', 'San Francisco, CA', '2024-03-01', '[]', '[]']
);

const cities = [
  ['city-paris', 'Paris', 'France', 'FR', 'Europe', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80', 'The City of Light captivates with timeless art, historic boulevards, iconic cafes, and world-class cuisine.', 4.9, 3840, 220, 3, 98, '19', 'Sunny', 'Apr - Oct', ['Romance', 'Museums', 'Cuisine'], ['Eiffel Tower', 'Louvre Museum'], '48.8566', '2.3522', 'Europe/Paris'],
  ['city-tokyo', 'Tokyo', 'Japan', 'JP', 'Asia', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80', 'A dazzling metropolis blending ultramodern neon, historic shrines, and exceptional gastronomy.', 4.95, 4520, 210, 3, 99, '21', 'Mild', 'Mar - May', ['Tech', 'Nightlife', 'Food'], ['Shibuya Crossing', 'Sensō-ji Temple'], '35.6762', '139.6503', 'Asia/Tokyo'],
  ['city-zurich', 'Zurich', 'Switzerland', 'CH', 'Europe', 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1000&auto=format&fit=crop&q=80', 'Lakeside sophistication with alpine peaks, pristine nature, and a lively old town.', 4.88, 2190, 310, 4, 92, '16', 'Partly Cloudy', 'Jun - Sep', ['Lakes', 'Luxury', 'Hiking'], ['Lake Zurich Promenade', 'Old Town'], '47.3769', '8.5417', 'Europe/Zurich'],
  ['city-rome', 'Rome', 'Italy', 'IT', 'Europe', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1000&auto=format&fit=crop&q=80', 'An open-air museum filled with ancient ruins, piazzas, fountains, and memorable pasta.', 4.89, 4100, 175, 2, 96, '24', 'Sunny', 'Apr - Jun', ['History', 'Cuisine', 'Architecture'], ['Colosseum', 'Vatican City'], '41.9028', '12.4964', 'Europe/Rome'],
  ['city-bali', 'Bali', 'Indonesia', 'ID', 'Asia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&auto=format&fit=crop&q=80', 'A tropical island of volcanic hills, sacred temples, beaches, and wellness retreats.', 4.91, 3750, 85, 1, 95, '29', 'Sunny', 'May - Sep', ['Beaches', 'Wellness', 'Temples'], ['Ubud Monkey Forest', 'Tanah Lot Temple'], '-8.4095', '115.1889', 'Asia/Makassar'],
  ['city-kyoto', 'Kyoto', 'Japan', 'JP', 'Asia', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80', 'Japans cultural heart with classical temples, Zen gardens, and traditional teahouses.', 4.93, 2980, 160, 2, 94, '20', 'Sunny', 'Mar - May', ['Culture', 'Temples', 'Gardens'], ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove'], '35.0116', '135.7681', 'Asia/Tokyo'],
];
for (const city of cities) {
  await connection.query(`INSERT IGNORE INTO cities (id,name,country,country_code,continent,image,gallery,description,tagline,rating,review_count,avg_daily_budget,cost_index,popularity_score,climate,tags,coordinates,highlights,time_zone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [city[0], city[1], city[2], city[3], city[4], city[5], '[]', city[6], `Explore ${city[1]}`, city[7], city[8], city[9], city[10], city[11], JSON.stringify({ temp: Number(city[12]), condition: city[13], bestSeason: city[14] }), JSON.stringify(city[15]), JSON.stringify({ lat: Number(city[17]), lng: Number(city[18]) }), JSON.stringify(city[16]), city[19]]);
}

const activities = [
  ['activity-paris-louvre', 'city-paris', 'Paris', 'Louvre Museum Priority Tour', 'Culture', 'Explore the Louvre highlights with an expert guide and timed entry.', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80', 150, '2h 30m', 75, 4.9, 1260, 'Louvre Pyramid', ['Museums', 'History'], true, 'Morning', { lat: 48.8606, lng: 2.3376 }],
  ['activity-paris-food', 'city-paris', 'Paris', 'Montmartre Food Walk', 'Food', 'Taste fresh pastries, cheese, and regional specialties across Montmartre.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80', 180, '3h', 45, 4.8, 840, 'Montmartre', ['Food', 'Walking'], false, 'Morning', { lat: 48.8867, lng: 2.3431 }],
  ['activity-tokyo-shibuya', 'city-tokyo', 'Tokyo', 'Shibuya Night Food Tour', 'Nightlife', 'Discover izakaya favorites and neon-lit streets with a local host.', 'https://images.unsplash.com/photo-1540959733332-eab4debbe7f2?w=800&auto=format&fit=crop&q=80', 180, '3h', 90, 4.9, 1020, 'Shibuya Station', ['Food', 'Nightlife'], true, 'Night', { lat: 35.6595, lng: 139.7005 }],
  ['activity-tokyo-temple', 'city-tokyo', 'Tokyo', 'Historic Asakusa Walk', 'Culture', 'Visit Senso-ji and hidden neighborhood lanes in historic Asakusa.', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop&q=80', 120, '2h', 30, 4.7, 690, 'Senso-ji Temple', ['Temples', 'History'], false, 'Afternoon', { lat: 35.7148, lng: 139.7967 }],
  ['activity-rome-colosseum', 'city-rome', 'Rome', 'Colosseum Underground Tour', 'Culture', 'See the arena floor and underground passages with priority access.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80', 150, '2h 30m', 85, 4.9, 1880, 'Colosseum', ['History', 'Architecture'], true, 'Morning', { lat: 41.8902, lng: 12.4922 }],
  ['activity-bali-temple', 'city-bali', 'Bali', 'Ubud Rice Terrace Sunrise', 'Nature', 'Walk through emerald terraces and villages before the island warms up.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80', 240, '4h', 40, 4.8, 730, 'Tegallalang', ['Nature', 'Wellness'], false, 'Morning', { lat: -8.4312, lng: 115.2792 }],
];
for (const activity of activities) {
  await connection.query(`INSERT IGNORE INTO activities (id,city_id,city_name,title,category,description,image,duration_minutes,duration_text,cost,rating,reviews_count,location_name,tags,booking_required,time_of_day,coordinates) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [activity[0], activity[1], activity[2], activity[3], activity[4], activity[5], activity[6], activity[7], activity[8], activity[9], activity[10], activity[11], activity[12], JSON.stringify(activity[13]), activity[14], activity[15], JSON.stringify(activity[16])]);
}
console.log(`Database ${database} is ready. Demo login: alex.morgan@globetrotter.io / password123`);
await connection.end();