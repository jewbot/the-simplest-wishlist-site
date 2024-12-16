import React from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatters';
import type { Wishlist } from '../../types';

interface WishlistHeaderProps {
  title: string;
  userName: string;
  createdAt: Date;
  lastEditedAt: Date;
}

export default function WishlistHeader({ title, userName, createdAt, lastEditedAt }: WishlistHeaderProps) {
  return (
    <>
      <h2 className="text-xl font-mono mb-2 text-terminal-green">{title}</h2>
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <span className="flex items-center gap-1">
          <User size={16} />
          {userName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={16} />
          Created: {formatDate(createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={16} />
          Last edited: {formatDate(lastEditedAt)}
        </span>
      </div>
    </>
  );
}