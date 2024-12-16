import { createClient } from '@libsql/client';
import { ENV } from './env';

if (!ENV.TURSO_DATABASE_URL || !ENV.TURSO_AUTH_TOKEN) {
  throw new Error('Missing required database configuration');
}

const db = createClient({
  url: ENV.TURSO_DATABASE_URL,
  authToken: ENV.TURSO_AUTH_TOKEN,
});

export default db;