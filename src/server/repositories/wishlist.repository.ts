import { executeQuery } from '../utils/database';
import { queries } from './queries';
import type { Wishlist, WishlistItem } from '../../types';

export const WishlistRepository = {
  async getPublicWishlists(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return executeQuery(queries.getPublicWishlists, [limit, offset]);
  },

  async getWishlistBySystemName(systemName: string) {
    const results = await executeQuery(queries.getWishlistBySystemName, [systemName]);
    return results[0];
  },

  async createWishlist(wishlistData: Omit<Wishlist, 'items'> & { items: WishlistItem[] }) {
    const { systemName, userName, title, isPublic, password, createdAt, lastEditedAt, items } = wishlistData;

    await executeQuery(queries.insertWishlist, [
      systemName, userName, title, isPublic ? 1 : 0, password, createdAt, lastEditedAt
    ]);

    for (const item of items) {
      await executeQuery(queries.insertWishlistItem, [
        item.id, systemName, item.name, item.specification, item.howToBuy,
        item.price, item.priority, item.comments, item.lastEditedAt, item.isBought ? 1 : 0
      ]);
    }

    return this.getWishlistBySystemName(systemName);
  },

  async updateWishlist(systemName: string, wishlistData: Omit<Wishlist, 'items'> & { items: WishlistItem[] }) {
    const { userName, title, isPublic, password, lastEditedAt, items } = wishlistData;

    await executeQuery(queries.updateWishlist, [
      userName, title, isPublic ? 1 : 0, password, lastEditedAt, systemName
    ]);

    await executeQuery(queries.deleteWishlistItems, [systemName]);

    for (const item of items) {
      await executeQuery(queries.insertWishlistItem, [
        item.id, systemName, item.name, item.specification, item.howToBuy,
        item.price, item.priority, item.comments, item.lastEditedAt, item.isBought ? 1 : 0
      ]);
    }

    return this.getWishlistBySystemName(systemName);
  },

  async verifyPassword(systemName: string, password: string) {
    const results = await executeQuery(queries.verifyPassword, [systemName]);
    return results[0]?.password === password;
  }
};