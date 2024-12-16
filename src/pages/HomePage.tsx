import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import WishlistCard from '../components/WishlistCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Wishlist } from '../types';

export default function HomePage() {
  const [filter, setFilter] = useState('');
  const { items: wishlists, loadMore, hasMore } = useInfiniteScroll<Wishlist>();

  return (
    <div>
      <FilterBar onFilter={setFilter} />
      <div className="space-y-4">
        {wishlists
          .filter(w => 
            w.isPublic && 
            (w.title.toLowerCase().includes(filter.toLowerCase()) ||
             w.userName.toLowerCase().includes(filter.toLowerCase()))
          )
          .map(wishlist => (
            <WishlistCard key={wishlist.systemName} wishlist={wishlist} />
          ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full mt-4 p-2 border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
        >
          Load More...
        </button>
      )}
    </div>
  );
}