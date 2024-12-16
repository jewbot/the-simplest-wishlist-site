import { Router } from 'express';
import * as WishlistModel from '../models/wishlist.model';

const router = Router();

router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const wishlists = WishlistModel.getPublicWishlists(page);
    res.json(wishlists);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

router.get('/:systemName', (req, res) => {
  try {
    const wishlist = WishlistModel.getWishlistBySystemName(req.params.systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/', (req, res) => {
  try {
    const wishlist = WishlistModel.createWishlist(req.body);
    res.status(201).json(wishlist);
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(400).json({ error: 'Failed to create wishlist' });
  }
});

router.put('/:systemName', (req, res) => {
  try {
    const { systemName } = req.params;
    const { password } = req.body;

    const wishlist = WishlistModel.getWishlistBySystemName(systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (!wishlist.isPublic && !WishlistModel.verifyWishlistPassword(systemName, password)) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    const updatedWishlist = WishlistModel.updateWishlist(systemName, req.body);
    res.json(updatedWishlist);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(400).json({ error: 'Failed to update wishlist' });
  }
});

router.post('/:systemName/verify', (req, res) => {
  try {
    const { systemName } = req.params;
    const { password } = req.body;
    const isValid = WishlistModel.verifyWishlistPassword(systemName, password);
    res.json({ isValid });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
});

export default router;