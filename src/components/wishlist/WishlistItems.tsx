import React from 'react';
import type { WishlistItem } from '../../types';

interface WishlistItemsProps {
  items: WishlistItem[];
  maxItems?: number;
}

export default function WishlistItems({ items, maxItems = 3 }: WishlistItemsProps) {
  const displayItems = items.slice(0, Math.min(maxItems, items.length));

  return (
    <div className="font-mono">
      {displayItems.map((item) => (
        <div key={item.id} className={`${item.isBought ? 'line-through' : ''}`}>
          {`> ${item.name}`}
        </div>
      ))}
    </div>
  );
}