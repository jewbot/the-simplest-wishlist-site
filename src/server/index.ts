import express from 'express';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { initializeDatabase } from './utils/database';
import { wishlistRoutes } from './routes';

const app = express();

initializeDatabase();
app.use(express.json());
app.use(requestLogger);
app.use('/api/wishlists', wishlistRoutes);
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});