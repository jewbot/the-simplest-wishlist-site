import { DB_CONFIG } from '../config/constants';
import { WishlistRepository } from '../repositories';
import type { Wishlist, WishlistItem } from '../../types';

export const WishlistService = {
  async getPublicWishlists(page: number = 1) {
    return WishlistRepository.getPublicWishlists(page, DB_CONFIG.ITEMS_PER_PAGE);
  },

  async getWishlistBySystemName(systemName: string) {
    return WishlistRepository.getWishlistBySystemName(systemName);
  },

  async createWishlist(wishlistData: Omit<Wishlist, 'items'> & { items: WishlistItem[] }) {
    return WishlistRepository.createWishlist(wishlistData);
  },

  async updateWishlist(systemName: string, wishlistData: Omit<Wishlist, 'items'> & { items: WishlistItem[] }) {
    return WishlistRepository.updateWishlist(systemName, wishlistData);
  },

  async verifyPassword(systemName: string, password: string) {
    return WishlistRepository.verifyPassword(systemName, password);
  }
};