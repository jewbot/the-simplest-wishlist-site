DROP TABLE IF EXISTS wishlists;

CREATE TABLE wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    system_name TEXT UNIQUE NOT NULL,
    user_name TEXT NOT NULL,
    title TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT 0,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wishlists_system_name ON wishlists(system_name);
CREATE INDEX IF NOT EXISTS idx_wishlists_public ON wishlists(is_public);