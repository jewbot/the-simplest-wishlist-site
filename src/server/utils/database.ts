import { readFileSync } from 'fs';
import { queries } from '../models/queries/wishlist.queries';
import db from '../config/database';

export const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    await db.batch([
      { sql: queries.createWishlistsTable },
      { sql: queries.createWishlistItemsTable }
    ]);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const result = await db.execute(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};