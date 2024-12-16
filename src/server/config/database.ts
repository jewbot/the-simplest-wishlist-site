import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { DB_PATH } from './constants';
import { initializeDatabase } from '../utils/database';
import { SCHEMA_PATH } from './constants';

const isDevelopment = process.env.NODE_ENV === 'development';

let db: any;

if (isDevelopment) {
  // Use better-sqlite3 for local development
  db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  initializeDatabase(db, SCHEMA_PATH);
} else {
  // Use Turso for production
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('Missing Turso database configuration');
  }

  db = createClient({
    url,
    authToken,
  });
}

export default db;