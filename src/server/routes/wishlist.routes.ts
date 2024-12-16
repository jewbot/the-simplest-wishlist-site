import { Router } from 'express';
import { WishlistController } from '../controllers';

const router = Router();

router.get('/', WishlistController.getPublicWishlists);
router.get('/:systemName', WishlistController.getWishlist);
router.post('/', WishlistController.createWishlist);
router.put('/:systemName', WishlistController.updateWishlist);
router.post('/:systemName/verify', WishlistController.verifyPassword);

export default router;