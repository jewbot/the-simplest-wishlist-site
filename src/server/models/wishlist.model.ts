import db from '../config/database';
import { queries } from './queries/wishlist.queries';
import { DB_CONFIG } from '../config/constants';
import type { Wishlist } from '../../types';

const isDevelopment = process.env.NODE_ENV === 'development';

export const getPublicWishlists = async (page: number = 1) => {
  const offset = (page - 1) * DB_CONFIG.ITEMS_PER_PAGE;
  
  if (isDevelopment) {
    return db.prepare(queries.getPublicWishlists)
      .all(DB_CONFIG.ITEMS_PER_PAGE, offset);
  } else {
    const result = await db.execute(queries.getPublicWishlists, 
      [DB_CONFIG.ITEMS_PER_PAGE, offset]);
    return result.rows;
  }
};

export const getWishlistBySystemName = async (systemName: string) => {
  if (isDevelopment) {
    return db.prepare(queries.getWishlistBySystemName).get(systemName);
  } else {
    const result = await db.execute(queries.getWishlistBySystemName, [systemName]);
    return result.rows[0];
  }
};

// Update other functions similarly to handle both development and production cases