import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import WishlistHeader from './WishlistHeader';
import WishlistTable from './WishlistTable';
import type { Wishlist, WishlistItem } from '../../types';

interface WishlistEditProps {
  wishlist: Wishlist;
  onUpdate: (wishlist: Wishlist) => void;
  onExitEdit: () => void;
}

export default function WishlistEdit({ wishlist, onUpdate, onExitEdit }: WishlistEditProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [items, setItems] = useState(wishlist.items);

  const handleSave = () => {
    onUpdate({ ...wishlist, items });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddItem = () => {
    const newItem: WishlistItem = {
      id: crypto.randomUUID(),
      name: '',
      howToBuy: '',
      lastEditedAt: new Date(),
      isBought: false,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? { ...updatedItem, lastEditedAt: new Date() } : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleToggleBought = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, isBought: !item.isBought } : item
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <WishlistHeader
          title={wishlist.title}
          userName={wishlist.userName}
          createdAt={wishlist.createdAt}
          lastEditedAt={wishlist.lastEditedAt}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
          >
            {isSaved ? 'Saved!' : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
          <button
            onClick={onExitEdit}
            className="flex items-center gap-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
          >
            <X size={16} />
            Exit
          </button>
        </div>
      </div>
      
      <WishlistTable
        items={items}
        isEditMode={true}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onToggleBought={handleToggleBought}
      />
      
      <button
        onClick={handleAddItem}
        className="mt-4 flex items-center gap-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
}