import React from 'react';
import { Edit } from 'lucide-react';
import WishlistHeader from './WishlistHeader';
import WishlistTable from './WishlistTable';
import type { Wishlist } from '../../types';

interface WishlistViewProps {
  wishlist: Wishlist;
  onEditClick: () => void;
}

export default function WishlistView({ wishlist, onEditClick }: WishlistViewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <WishlistHeader
          title={wishlist.title}
          userName={wishlist.userName}
          createdAt={wishlist.createdAt}
          lastEditedAt={wishlist.lastEditedAt}
        />
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
        >
          <Edit size={16} />
          Edit
        </button>
      </div>
      <WishlistTable items={wishlist.items} isEditMode={false} />
    </div>
  );
}