require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    await db.getPublicWishlists(1, 1);
    res.json({ message: 'Database connected!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new wishlist
app.post('/api/wishlists', async (req, res) => {
  try {
    const { userName, title, isPublic, password } = req.body;
    
    const baseSystemName = `${userName}-${title}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const systemName = `${baseSystemName}-${uniqueId}`;
    
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const wishlistId = await db.createWishlist({
      systemName,
      userName,
      title,
      isPublic,
      passwordHash
    });

    res.json({ success: true, wishlistId, systemName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get public wishlists
app.get('/api/wishlists/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const wishlists = await db.getPublicWishlists(page, limit);
    res.json(wishlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single wishlist by system name
app.get('/api/wishlists/:systemName', async (req, res) => {
  try {
    const wishlist = await db.getWishlistBySystemName(req.params.systemName);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify wishlist password
app.post('/api/wishlists/:systemName/verify', async (req, res) => {
  try {
    const { password } = req.body;
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const verified = await db.verifyWishlistPassword(req.params.systemName, passwordHash);
    res.json({ verified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to wishlist
app.post('/api/wishlists/:systemName/items', async (req, res) => {
  try {
    const { 
      itemName, 
      sizeVersion, 
      purchaseLink, 
      price, 
      priority, 
      comments 
    } = req.body;
    
    const item = await db.addWishlistItem({
      systemName: req.params.systemName,
      itemName,
      sizeVersion,
      purchaseLink,
      price,
      priority,
      comments
    });
    
    res.json({ success: true, itemId: item.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item bought status (no password required)
app.put('/api/wishlists/items/:itemId/bought', async (req, res) => {
  try {
    const { isBought } = req.body;
    
    await db.updateWishlistItemBoughtStatus({
      itemId: req.params.itemId,
      isBought
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
app.put('/api/wishlists/items/:itemId', async (req, res) => {
  try {
    const { 
      itemName, 
      sizeVersion, 
      purchaseLink, 
      price, 
      priority, 
      comments,
      isBought 
    } = req.body;
    
    await db.updateWishlistItem({
      itemId: req.params.itemId,
      itemName,
      sizeVersion,
      purchaseLink,
      price,
      priority,
      comments,
      isBought
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete wishlist
app.delete('/api/wishlists/:systemName', async (req, res) => {
  try {
    const { systemName } = req.params;
    const { password } = req.body;

    // If the wishlist has a password, verify it
    if (password) {
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      const isVerified = await db.verifyWishlistOwnership(systemName, passwordHash);
      if (!isVerified) {
        return res.status(403).json({ error: 'Invalid password' });
      }
    }

    await db.deleteWishlist(systemName);
    res.json({ success: true, message: 'Wishlist deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Wishlist not found' ? 404 : 500)
      .json({ error: error.message });
  }
});

// Delete item
app.delete('/api/wishlists/items/:itemId', async (req, res) => {
  try {
    await db.deleteWishlistItem(req.params.itemId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});