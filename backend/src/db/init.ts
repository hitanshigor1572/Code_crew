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
console.log(`Database ${database} is ready. Demo login: alex.morgan@globetrotter.io / password123`);
await connection.end();