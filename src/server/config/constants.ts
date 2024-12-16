import path from 'path';

export const DB_PATH = path.join(process.cwd(), 'data', 'wishlist.db');
export const SCHEMA_PATH = path.join(process.cwd(), 'src', 'server', 'config', 'schema.sql');

export const DB_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PREVIEW: 3,
} as const;