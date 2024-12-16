CREATE TABLE IF NOT EXISTS wishlists (
  systemName TEXT PRIMARY KEY,
  userName TEXT NOT NULL,
  title TEXT NOT NULL,
  isPublic BOOLEAN NOT NULL,
  password TEXT,
  createdAt TEXT NOT NULL,
  lastEditedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id TEXT PRIMARY KEY,
  wishlistSystemName TEXT NOT NULL,
  name TEXT NOT NULL,
  specification TEXT,
  howToBuy TEXT NOT NULL,
  price REAL,
  priority TEXT,
  comments TEXT,
  lastEditedAt TEXT NOT NULL,
  isBought BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (wishlistSystemName) REFERENCES wishlists(systemName)
);