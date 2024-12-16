import React from 'react';
import { Search } from 'lucide-react';

export default function FilterBar({ onFilter }: { onFilter: (query: string) => void }) {
  return (
    <div className="mb-6 relative">
      <input
        type="text"
        placeholder="Filter wishlists..."
        onChange={(e) => onFilter(e.target.value)}
        className="w-full bg-black border border-terminal-green p-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-terminal-green"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-green" size={18} />
    </div>
  );
}