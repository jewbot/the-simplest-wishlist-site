import fs from 'fs';
import path from 'path';
import { DB_PATH } from '../config/constants';

export const ensureDatabaseDirectory = () => {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

export const initializeDatabase = (db: any, schemaPath: string) => {
  try {
    ensureDatabaseDirectory();
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};