export const queries = {
  createWishlistsTable: `
    CREATE TABLE IF NOT EXISTS wishlists (
      systemName TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      title TEXT NOT NULL,
      isPublic INTEGER NOT NULL,
      password TEXT,
      createdAt TEXT NOT NULL,
      lastEditedAt TEXT NOT NULL
    );
  `,

  createWishlistItemsTable: `
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
      isBought INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (wishlistSystemName) REFERENCES wishlists(systemName)
    );
  `,

  getPublicWishlists: `
    SELECT w.*, 
           json_group_array(
             json_object(
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
           ) FILTER (WHERE i.id IS NOT NULL) as items
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.systemName = i.wishlistSystemName
    WHERE w.isPublic = 1
    GROUP BY w.systemName
    ORDER BY w.createdAt DESC
    LIMIT ? OFFSET ?
  `,

  getWishlistBySystemName: `
    SELECT w.*, 
           json_group_array(
             json_object(
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
           ) FILTER (WHERE i.id IS NOT NULL) as items
    FROM wishlists w
    LEFT JOIN wishlist_items i ON w.systemName = i.wishlistSystemName
    WHERE w.systemName = ?
    GROUP BY w.systemName
  `,

  insertWishlist: `
    INSERT INTO wishlists (
      systemName, userName, title, isPublic, password, createdAt, lastEditedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  insertWishlistItem: `
    INSERT INTO wishlist_items (
      id, wishlistSystemName, name, specification, howToBuy,
      price, priority, comments, lastEditedAt, isBought
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  updateWishlist: `
    UPDATE wishlists
    SET userName = ?,
        title = ?,
        isPublic = ?,
        password = ?,
        lastEditedAt = ?
    WHERE systemName = ?
  `,

  deleteWishlistItems: 'DELETE FROM wishlist_items WHERE wishlistSystemName = ?',

  verifyPassword: 'SELECT password FROM wishlists WHERE systemName = ?'
} as const;