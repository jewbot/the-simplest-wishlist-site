import Database from 'better-sqlite3';
import { DB_PATH } from './constants';
import { initializeDatabase } from '../utils/database';
import { SCHEMA_PATH } from './constants';

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
initializeDatabase(db, SCHEMA_PATH);

export default db;