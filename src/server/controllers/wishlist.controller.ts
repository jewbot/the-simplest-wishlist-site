import { Request, Response } from 'express';
import { WishlistService } from '../services';
import { handleAsync } from '../utils/handleAsync';

export const WishlistController = {
  getPublicWishlists: handleAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const wishlists = await WishlistService.getPublicWishlists(page);
    res.json(wishlists);
  }),

  getWishlist: handleAsync(async (req: Request, res: Response) => {
    const wishlist = await WishlistService.getWishlistBySystemName(req.params.systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  }),

  createWishlist: handleAsync(async (req: Request, res: Response) => {
    const wishlist = await WishlistService.createWishlist(req.body);
    res.status(201).json(wishlist);
  }),

  updateWishlist: handleAsync(async (req: Request, res: Response) => {
    const { systemName } = req.params;
    const { password } = req.body;

    const wishlist = await WishlistService.getWishlistBySystemName(systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (!wishlist.isPublic && !(await WishlistService.verifyPassword(systemName, password))) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    const updatedWishlist = await WishlistService.updateWishlist(systemName, req.body);
    res.json(updatedWishlist);
  }),

  verifyPassword: handleAsync(async (req: Request, res: Response) => {
    const { systemName } = req.params;
    const { password } = req.body;
    const isValid = await WishlistService.verifyPassword(systemName, password);
    res.json({ isValid });
  })
};