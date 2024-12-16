import db from '../config/database';
import { queries } from './queries/wishlist.queries';
import { DB_CONFIG } from '../config/constants';
import type { Wishlist } from '../../types';

export const getPublicWishlists = (page: number = 1) => {
  const offset = (page - 1) * DB_CONFIG.ITEMS_PER_PAGE;
  return db.prepare(queries.getPublicWishlists)
    .all(DB_CONFIG.ITEMS_PER_PAGE, offset);
};

export const getWishlistBySystemName = (systemName: string) => {
  return db.prepare(queries.getWishlistBySystemName).get(systemName);
};

export const createWishlist = (wishlist: Wishlist) => {
  const { items, ...wishlistData } = wishlist;
  
  const insertWishlist = db.prepare(queries.insertWishlist);
  const insertItem = db.prepare(queries.insertWishlistItem);

  try {
    db.transaction(() => {
      insertWishlist.run(
        wishlistData.systemName,
        wishlistData.userName,
        wishlistData.title,
        wishlistData.isPublic ? 1 : 0,
        wishlistData.password,
        new Date(wishlistData.createdAt).toISOString(),
        new Date(wishlistData.lastEditedAt).toISOString()
      );

      if (items?.length > 0) {
        for (const item of items) {
          insertItem.run(
            item.id,
            wishlistData.systemName,
            item.name,
            item.specification,
            item.howToBuy,
            item.price,
            item.priority,
            item.comments,
            new Date(item.lastEditedAt).toISOString(),
            item.isBought ? 1 : 0
          );
        }
      }
    })();

    return getWishlistBySystemName(wishlistData.systemName);
  } catch (error) {
    console.error('Error creating wishlist:', error);
    throw error;
  }
};

export const updateWishlist = (systemName: string, wishlist: Wishlist) => {
  const { items, ...wishlistData } = wishlist;

  try {
    db.transaction(() => {
      db.prepare(queries.updateWishlist).run(
        wishlistData.userName,
        wishlistData.title,
        wishlistData.isPublic ? 1 : 0,
        wishlistData.password,
        new Date(wishlistData.lastEditedAt).toISOString(),
        systemName
      );

      db.prepare(queries.deleteWishlistItems).run(systemName);

      if (items?.length > 0) {
        const insertItem = db.prepare(queries.insertWishlistItem);
        for (const item of items) {
          insertItem.run(
            item.id,
            systemName,
            item.name,
            item.specification,
            item.howToBuy,
            item.price,
            item.priority,
            item.comments,
            new Date(item.lastEditedAt).toISOString(),
            item.isBought ? 1 : 0
          );
        }
      }
    })();

    return getWishlistBySystemName(systemName);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
};

export const verifyWishlistPassword = (systemName: string, password: string) => {
  const wishlist = db.prepare(queries.verifyPassword).get(systemName);
  return wishlist && wishlist.password === password;
};