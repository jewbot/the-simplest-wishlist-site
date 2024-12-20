const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const dbHelpers = {
  // Create a new wishlist
  createWishlist: async (wishlistData) => {
    const { systemName, userName, title, isPublic, passwordHash } = wishlistData;
    const result = await client.execute({
      sql: `INSERT INTO wishlists (system_name, user_name, title, is_public, password_hash)
            VALUES (?, ?, ?, ?, ?)`,
      args: [systemName, userName, title, isPublic, passwordHash]
    });
    return Number(result.lastInsertRowid);
  },

  // Get public wishlists
  getPublicWishlists: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const result = await client.execute({
      sql: `
        SELECT 
          wishlists.*,
          (SELECT COUNT(*) FROM wishlist_items WHERE wishlist_items.wishlist_id = wishlists.id) as item_count,
          (SELECT GROUP_CONCAT(item_name) 
           FROM (
             SELECT item_name 
             FROM wishlist_items 
             WHERE wishlist_items.wishlist_id = wishlists.id 
             ORDER BY created_at ASC
             LIMIT 3
           )) as preview_items
        FROM wishlists
        WHERE wishlists.is_public = 1
        ORDER BY wishlists.created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [limit, offset]
    });
  
    return result.rows.map(row => {
      const converted = {};
      for (let key in row) {
        converted[key] = typeof row[key] === 'bigint' ? Number(row[key]) : row[key];
      }
      return converted;
    });
  },

  // Get wishlist by system name
  getWishlistBySystemName: async (systemName) => {
    const result = await client.execute({
      sql: `SELECT w.*, json_group_array(
        json_object(
          'id', wi.id,
          'itemName', wi.item_name,
          'sizeVersion', wi.size_version,
          'purchaseLink', wi.purchase_link,
          'price', wi.price,
          'priority', wi.priority,
          'comments', wi.comments,
          'isBought', CASE WHEN wi.is_bought = 1 THEN true ELSE false END,
          'lastEditedAt', wi.last_edited_at
        )
      ) as items
      FROM wishlists w
      LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
      WHERE w.system_name = ?
      GROUP BY w.id`,
      args: [systemName]
    });
    
    if (result.rows.length === 0) return null;
    
    const wishlist = result.rows[0];
    wishlist.items = JSON.parse(wishlist.items);
    
    // If there are no items, set an empty array instead of [null]
    if (wishlist.items.length === 1 && wishlist.items[0].id === null) {
      wishlist.items = [];
    }
    
    return wishlist;
  },

  // Verify wishlist password
  verifyWishlistPassword: async (systemName, passwordHash) => {
    const result = await client.execute({
      sql: 'SELECT 1 FROM wishlists WHERE system_name = ? AND password_hash = ?',
      args: [systemName, passwordHash]
    });
    return result.rows.length > 0;
  },

  // Add item to wishlist
  addWishlistItem: async (item) => {
    try {
      // First get the wishlist_id from system_name
      const wishlistResult = await client.execute({
        sql: 'SELECT id FROM wishlists WHERE system_name = ?',
        args: [String(item.systemName)]
      });
  
      if (wishlistResult.rows.length === 0) {
        throw new Error('Wishlist not found');
      }
  
      const wishlistId = Number(wishlistResult.rows[0].id);
  
      // Ensure all values are of the correct type
      const args = [
        wishlistId,                          // INTEGER
        String(item.itemName || ''),         // TEXT
        item.sizeVersion ? String(item.sizeVersion) : null,  // TEXT or null
        String(item.purchaseLink || ''),     // TEXT
        item.price ? String(item.price) : null,  // TEXT or null
        String(item.priority || 'It would be nice'),  // TEXT
        item.comments ? String(item.comments) : null  // TEXT or null
      ];
  
      console.log('Adding item with args:', args); // Debug log
  
      const result = await client.execute({
        sql: `INSERT INTO wishlist_items (
                wishlist_id, 
                item_name, 
                size_version, 
                purchase_link,
                price, 
                priority, 
                comments
              ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: args
      });
  
      return { 
        id: Number(result.lastInsertRowid),
        wishlistId: wishlistId 
      };
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    }
  },

  // Update wishlist item
  updateWishlistItem: async (item) => {
    await client.execute({
      sql: `UPDATE wishlist_items 
            SET item_name = ?,
                size_version = ?,
                purchase_link = ?,
                price = ?,
                priority = ?,
                comments = ?,
                is_bought = ?,
                last_edited_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        item.itemName,
        item.sizeVersion,
        item.purchaseLink,
        item.price,
        item.priority,
        item.comments,
        item.isBought,
        item.itemId
      ]
    });
  },

  updateWishlistItemBoughtStatus: async ({ itemId, isBought }) => {
    console.log('Updating item bought status:', { itemId, isBought });
    const result = await client.execute({
      sql: 'UPDATE wishlist_items SET is_bought = ?, last_edited_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [isBought ? 1 : 0, itemId]  // Convert boolean to 0/1 for SQLite
    });
    console.log('Update result:', result);
    return result.rowsAffected > 0;
  },

  deleteWishlist: async (systemName) => {
    // First verify the wishlist exists
    const wishlist = await client.execute({
      sql: 'SELECT id FROM wishlists WHERE system_name = ?',
      args: [systemName]
    });
  
    if (wishlist.rows.length === 0) {
      throw new Error('Wishlist not found');
    }
  
    // Delete the wishlist (items will be deleted automatically due to CASCADE)
    await client.execute({
      sql: 'DELETE FROM wishlists WHERE system_name = ?',
      args: [systemName]
    });
  
    return true;
  },
  
  // Optional: Add a function to verify wishlist ownership via password
  verifyWishlistOwnership: async (systemName, passwordHash) => {
    const result = await client.execute({
      sql: 'SELECT 1 FROM wishlists WHERE system_name = ? AND password_hash = ?',
      args: [systemName, passwordHash]
    });
    return result.rows.length > 0;
  },

  // Delete wishlist item
  deleteWishlistItem: async (itemId) => {
    await client.execute({
      sql: 'DELETE FROM wishlist_items WHERE id = ?',
      args: [itemId]
    });
  }
};

module.exports = dbHelpers;