import express from 'express';
import fs from 'fs';
import path from 'path';
import db from './config/database';
import wishlistRoutes from './routes/wishlist.routes';

const app = express();

// Initialize database schema
const schema = fs.readFileSync(path.join(__dirname, 'config', 'schema.sql'), 'utf8');
db.exec(schema);

// Middleware
app.use(express.json());

// Routes
app.use('/api/wishlists', wishlistRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});