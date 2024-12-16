import db from '../config/database';
import type { Wishlist, WishlistItem } from '../../types';

export const getPublicWishlists = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return db.prepare(`
    SELECT w.*, 
           json_group_array(
             CASE WHEN i.id IS NOT NULL THEN json_object(
               'id', i.id,
               'name', i.name,
               'specification', i.specification,
               'howToBuy', i.howToBuy,
               'price', i.price,
               'priority', i.priority,
               'comments', i.comments,
               'lastEditedAt', i.lastEditedAt,
               'isBought', i.isBought
             )
             ELSE NULL END
           ) as items
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.systemName = i.wishlistSystemName
    WHERE w.isPublic = 1
    GROUP BY w.systemName
    ORDER BY w.createdAt DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
};

export const getWishlistBySystemName = (systemName: string) => {
  return db.prepare(`
    SELECT w.*, 
           json_group_array(
             CASE WHEN i.id IS NOT NULL THEN json_object(
               'id', i.id,
               'name', i.name,
               'specification', i.specification,
               'howToBuy', i.howToBuy,
               'price', i.price,
               'priority', i.priority,
               'comments', i.comments,
               'lastEditedAt', i.lastEditedAt,
               'isBought', i.isBought
             )
             ELSE NULL END
           ) as items
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.systemName = i.wishlistSystemName
    WHERE w.systemName = ?
    GROUP BY w.systemName
  `).get(systemName);
};

export const createWishlist = (wishlist: Wishlist) => {
  const { items, ...wishlistData } = wishlist;
  
  const insertWishlist = db.prepare(`
    INSERT INTO wishlists (
      systemName, userName, title, isPublic, password, createdAt, lastEditedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO wishlist_items (
      id, wishlistSystemName, name, specification, howToBuy,
      price, priority, comments, lastEditedAt, isBought
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

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

  const updateWishlistStmt = db.prepare(`
    UPDATE wishlists
    SET userName = ?,
        title = ?,
        isPublic = ?,
        password = ?,
        lastEditedAt = ?
    WHERE systemName = ?
  `);

  const deleteItems = db.prepare('DELETE FROM wishlist_items WHERE wishlistSystemName = ?');

  const insertItem = db.prepare(`
    INSERT INTO wishlist_items (
      id, wishlistSystemName, name, specification, howToBuy,
      price, priority, comments, lastEditedAt, isBought
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    db.transaction(() => {
      updateWishlistStmt.run(
        wishlistData.userName,
        wishlistData.title,
        wishlistData.isPublic ? 1 : 0,
        wishlistData.password,
        new Date(wishlistData.lastEditedAt).toISOString(),
        systemName
      );

      deleteItems.run(systemName);

      if (items?.length > 0) {
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
  const wishlist = db.prepare('SELECT password FROM wishlists WHERE systemName = ?').get(systemName);
  return wishlist && wishlist.password === password;
};