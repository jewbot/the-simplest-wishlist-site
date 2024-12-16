import db from '../config/database';
import { queries } from './queries/wishlist.queries';
import { DB_CONFIG } from '../config/constants';
import type { Wishlist, WishlistItem } from '../../types';

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

export const createWishlist = async (wishlistData: Omit<Wishlist, 'items'> & { items: WishlistItem[] }) => {
  const { systemName, userName, title, isPublic, password, createdAt, lastEditedAt, items } = wishlistData;

  if (isDevelopment) {
    const insertWishlist = db.prepare(queries.insertWishlist);
    const insertItem = db.prepare(queries.insertWishlistItem);

    db.transaction(() => {
      insertWishlist.run(
        systemName,
        userName,
        title,
        isPublic ? 1 : 0,
        password,
        createdAt,
        lastEditedAt
      );

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
          item.lastEditedAt,
          item.isBought ? 1 : 0
        );
      }
    })();

    return getWishlistBySystemName(systemName);
  } else {
    await db.batch([
      {
        sql: queries.insertWishlist,
        args: [systemName, userName, title, isPublic ? 1 : 0, password, createdAt, lastEditedAt]
      },
      ...items.map(item => ({
        sql: queries.insertWishlistItem,
        args: [
          item.id,
          systemName,
          item.name,
          item.specification,
          item.howToBuy,
          item.price,
          item.priority,
          item.comments,
          item.lastEditedAt,
          item.isBought ? 1 : 0
        ]
      }))
    ]);

    return getWishlistBySystemName(systemName);
  }
};

export const updateWishlist = async (systemName: string, wishlistData: Omit<Wishlist, 'items'> & { items: WishlistItem[] }) => {
  const { userName, title, isPublic, password, lastEditedAt, items } = wishlistData;

  if (isDevelopment) {
    const updateWishlist = db.prepare(queries.updateWishlist);
    const deleteItems = db.prepare(queries.deleteWishlistItems);
    const insertItem = db.prepare(queries.insertWishlistItem);

    db.transaction(() => {
      updateWishlist.run(
        userName,
        title,
        isPublic ? 1 : 0,
        password,
        lastEditedAt,
        systemName
      );

      deleteItems.run(systemName);

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
          item.lastEditedAt,
          item.isBought ? 1 : 0
        );
      }
    })();

    return getWishlistBySystemName(systemName);
  } else {
    await db.batch([
      {
        sql: queries.updateWishlist,
        args: [userName, title, isPublic ? 1 : 0, password, lastEditedAt, systemName]
      },
      {
        sql: queries.deleteWishlistItems,
        args: [systemName]
      },
      ...items.map(item => ({
        sql: queries.insertWishlistItem,
        args: [
          item.id,
          systemName,
          item.name,
          item.specification,
          item.howToBuy,
          item.price,
          item.priority,
          item.comments,
          item.lastEditedAt,
          item.isBought ? 1 : 0
        ]
      }))
    ]);

    return getWishlistBySystemName(systemName);
  }
};

export const verifyWishlistPassword = async (systemName: string, password: string) => {
  if (isDevelopment) {
    const result = db.prepare(queries.verifyPassword).get(systemName);
    return result?.password === password;
  } else {
    const result = await db.execute(queries.verifyPassword, [systemName]);
    return result.rows[0]?.password === password;
  }
};