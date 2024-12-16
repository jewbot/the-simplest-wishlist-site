import Database from 'better-sqlite3';
import path from 'path';

// Initialize database connection
const db = new Database(path.join(process.cwd(), 'wishlist.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;