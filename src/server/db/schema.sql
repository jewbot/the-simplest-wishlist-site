-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    system_name TEXT UNIQUE NOT NULL,
    user_name TEXT NOT NULL,
    title TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT 0,
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist items table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wishlist_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    size_version TEXT,
    purchase_link TEXT NOT NULL,
    price TEXT,
    priority TEXT CHECK (
        priority IN (
            'I need it urgently',
            'I need it in general',
            'I want it urgently',
            'I want it in general',
            'It would be nice'
        )
    ),
    comments TEXT,
    is_bought BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlists_system_name ON wishlists(system_name);
CREATE INDEX IF NOT EXISTS idx_wishlists_public ON wishlists(is_public);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);