import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock } from 'lucide-react';
import type { Wishlist } from '../types';

export default function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  return (
    <div className="border border-terminal-green p-4 mb-4 hover:bg-terminal-green/5 transition-all">
      <Link to={`/wishlist/${wishlist.systemName}`} className="block">
        <h2 className="text-xl font-mono mb-2 text-terminal-green">{wishlist.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <span className="flex items-center gap-1">
            <User size={16} />
            {wishlist.userName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            Created: {formatDate(wishlist.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} />
            Last edited: {formatDate(wishlist.lastEditedAt)}
          </span>
        </div>
        <div className="font-mono">
          {wishlist.items.slice(0, Math.min(3, wishlist.items.length)).map((item, i) => (
            <div key={item.id} className={`${item.isBought ? 'line-through' : ''}`}>
              {`> ${item.name}`}
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}