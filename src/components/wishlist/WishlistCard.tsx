import React from 'react';
import { Link } from 'react-router-dom';
import type { Wishlist } from '../../types';
import WishlistHeader from './WishlistHeader';
import WishlistItems from './WishlistItems';

export default function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
  return (
    <div className="border border-terminal-green p-4 mb-4 hover:bg-terminal-green/5 transition-all">
      <Link to={`/wishlist/${wishlist.systemName}`} className="block">
        <WishlistHeader
          title={wishlist.title}
          userName={wishlist.userName}
          createdAt={wishlist.createdAt}
          lastEditedAt={wishlist.lastEditedAt}
        />
        <WishlistItems items={wishlist.items} />
      </Link>
    </div>
  );
}