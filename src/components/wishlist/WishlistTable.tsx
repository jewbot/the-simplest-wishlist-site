import React from 'react';
import { Trash2, Check } from 'lucide-react';
import type { WishlistItem, WishlistPriority } from '../../types';

interface WishlistTableProps {
  items: WishlistItem[];
  isEditMode: boolean;
  onUpdateItem?: (item: WishlistItem) => void;
  onDeleteItem?: (id: string) => void;
  onToggleBought?: (id: string) => void;
}

const PRIORITY_OPTIONS: WishlistPriority[] = [
  "I need it urgently",
  "I need it in general",
  "I want it urgently",
  "I want it in general",
  "It would be nice"
];

export default function WishlistTable({
  items,
  isEditMode,
  onUpdateItem,
  onDeleteItem,
  onToggleBought
}: WishlistTableProps) {
  const handleChange = (id: string, field: keyof WishlistItem, value: any) => {
    const item = items.find(i => i.id === id);
    if (item && onUpdateItem) {
      onUpdateItem({ ...item, [field]: value });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-terminal-green">
            <th className="py-2 px-4 text-left">Item Name</th>
            <th className="py-2 px-4 text-left">Which One</th>
            <th className="py-2 px-4 text-left">How to Buy</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Priority</th>
            <th className="py-2 px-4 text-left">Comments</th>
            <th className="py-2 px-4 text-left">Last Edit</th>
            {isEditMode && <th className="py-2 px-4 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className={`border-b border-terminal-green ${item.isBought ? 'line-through opacity-50' : ''}`}>
              <td className="py-2 px-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => handleChange(item.id, 'name', e.target.value)}
                    className="w-full bg-black border border-terminal-green p-1"
                    required
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="py-2 px-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.specification || ''}
                    onChange={e => handleChange(item.id, 'specification', e.target.value)}
                    className="w-full bg-black border border-terminal-green p-1"
                    placeholder="Size/Version"
                  />
                ) : (
                  item.specification
                )}
              </td>
              <td className="py-2 px-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.howToBuy}
                    onChange={e => handleChange(item.id, 'howToBuy', e.target.value)}
                    className="w-full bg-black border border-terminal-green p-1"
                    required
                  />
                ) : (
                  <a
                    href={item.howToBuy.startsWith('http') ? item.howToBuy : `https://${item.howToBuy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terminal-green hover:underline"
                  >
                    {item.howToBuy}
                  </a>
                )}
              </td>
              <td className="py-2 px-4">
                {isEditMode ? (
                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={e => handleChange(item.id, 'price', parseFloat(e.target.value))}
                    className="w-full bg-black border border-terminal-green p-1"
                  />
                ) : (
                  item.price && `$${item.price.toFixed(2)}`
                )}
              </td>
              <td className="py-2 px-4">
                {isEditMode ? (
                  <select
                    value={item.priority || ''}
                    onChange={e => handleChange(item.id, 'priority', e.target.value)}
                    className="w-full bg-black border border-terminal-green p-1"
                  >
                    <option value="">Select priority</option>
                    {PRIORITY_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  item.priority
                )}
              </td>
              <td className="py-2 px-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.comments || ''}
                    onChange={e => handleChange(item.id, 'comments', e.target.value)}
                    className="w-full bg-black border border-terminal-green p-1"
                  />
                ) : (
                  item.comments
                )}
              </td>
              <td className="py-2 px-4">
                {new Date(item.lastEditedAt).toLocaleDateString()}
              </td>
              {isEditMode && (
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleBought?.(item.id)}
                      className="p-1 text-terminal-green hover:bg-terminal-green/10"
                      title={item.isBought ? "Mark as not bought" : "Mark as bought"}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteItem?.(item.id)}
                      className="p-1 text-terminal-green hover:bg-terminal-green/10"
                      title="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}