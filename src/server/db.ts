import Database from 'better-sqlite3';
import { Wishlist, WishlistItem } from '../types';

const db = new Database('wishlist.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS wishlists (
    systemName TEXT PRIMARY KEY,
    userName TEXT NOT NULL,
    title TEXT NOT NULL,
    isPublic BOOLEAN NOT NULL,
    password TEXT,
    createdAt TEXT NOT NULL,
    lastEditedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id TEXT PRIMARY KEY,
    wishlistSystemName TEXT NOT NULL,
    name TEXT NOT NULL,
    specification TEXT,
    howToBuy TEXT NOT NULL,
    price REAL,
    priority TEXT,
    comments TEXT,
    lastEditedAt TEXT NOT NULL,
    isBought BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (wishlistSystemName) REFERENCES wishlists(systemName)
  );
`);

export const getPublicWishlists = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return db.prepare(`
    SELECT w.*, 
           json_group_array(json_object(
             'id', i.id,
             'name', i.name,
             'specification', i.specification,
             'howToBuy', i.howToBuy,
             'price', i.price,
             'priority', i.priority,
             'comments', i.comments,
             'lastEditedAt', i.lastEditedAt,
             'isBought', i.isBought
           )) as items
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
           json_group_array(json_object(
             'id', i.id,
             'name', i.name,
             'specification', i.specification,
             'howToBuy', i.howToBuy,
             'price', i.price,
             'priority', i.priority,
             'comments', i.comments,
             'lastEditedAt', i.lastEditedAt,
             'isBought', i.isBought
           )) as items
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.systemName = i.wishlistSystemName
    WHERE w.systemName = ?
    GROUP BY w.systemName
  `).get(systemName);
};

export const createWishlist = (wishlist: Wishlist) => {
  const { items, ...wishlistData } = wishlist;
  
  db.prepare(`
    INSERT INTO wishlists (
      systemName, userName, title, isPublic, password, createdAt, lastEditedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    wishlistData.systemName,
    wishlistData.userName,
    wishlistData.title,
    wishlistData.isPublic ? 1 : 0,
    wishlistData.password,
    wishlistData.createdAt.toISOString(),
    wishlistData.lastEditedAt.toISOString()
  );

  if (items.length > 0) {
    const insertItem = db.prepare(`
      INSERT INTO wishlist_items (
        id, wishlistSystemName, name, specification, howToBuy,
        price, priority, comments, lastEditedAt, isBought
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

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
        item.lastEditedAt.toISOString(),
        item.isBought ? 1 : 0
      );
    }
  }

  return getWishlistBySystemName(wishlistData.systemName);
};

export const updateWishlist = (systemName: string, wishlist: Wishlist) => {
  const { items, ...wishlistData } = wishlist;

  db.prepare(`
    UPDATE wishlists
    SET userName = ?,
        title = ?,
        isPublic = ?,
        password = ?,
        lastEditedAt = ?
    WHERE systemName = ?
  `).run(
    wishlistData.userName,
    wishlistData.title,
    wishlistData.isPublic ? 1 : 0,
    wishlistData.password,
    wishlistData.lastEditedAt.toISOString(),
    systemName
  );

  // Delete existing items
  db.prepare('DELETE FROM wishlist_items WHERE wishlistSystemName = ?').run(systemName);

  // Insert updated items
  if (items.length > 0) {
    const insertItem = db.prepare(`
      INSERT INTO wishlist_items (
        id, wishlistSystemName, name, specification, howToBuy,
        price, priority, comments, lastEditedAt, isBought
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

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
        item.lastEditedAt.toISOString(),
        item.isBought ? 1 : 0
      );
    }
  }

  return getWishlistBySystemName(systemName);
};

export const verifyWishlistPassword = (systemName: string, password: string) => {
  const wishlist = db.prepare('SELECT password FROM wishlists WHERE systemName = ?').get(systemName);
  return wishlist && wishlist.password === password;
};