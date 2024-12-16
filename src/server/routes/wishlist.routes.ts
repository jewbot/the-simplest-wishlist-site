import { Router } from 'express';
import * as WishlistModel from '../models/wishlist.model';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const wishlists = await WishlistModel.getPublicWishlists(page);
    res.json(wishlists);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

router.get('/:systemName', async (req, res) => {
  try {
    const wishlist = await WishlistModel.getWishlistBySystemName(req.params.systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/', async (req, res) => {
  try {
    const wishlist = await WishlistModel.createWishlist(req.body);
    res.status(201).json(wishlist);
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(400).json({ error: 'Failed to create wishlist' });
  }
});

router.put('/:systemName', async (req, res) => {
  try {
    const { systemName } = req.params;
    const { password } = req.body;

    const wishlist = await WishlistModel.getWishlistBySystemName(systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (!wishlist.isPublic && !(await WishlistModel.verifyWishlistPassword(systemName, password))) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    const updatedWishlist = await WishlistModel.updateWishlist(systemName, req.body);
    res.json(updatedWishlist);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(400).json({ error: 'Failed to update wishlist' });
  }
});

router.post('/:systemName/verify', async (req, res) => {
  try {
    const { systemName } = req.params;
    const { password } = req.body;
    const isValid = await WishlistModel.verifyWishlistPassword(systemName, password);
    res.json({ isValid });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
});

export default router;