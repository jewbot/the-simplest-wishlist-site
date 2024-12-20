import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const { systemName } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [localItems, setLocalItems] = useState([]);
  const [hasSeenNotice, setHasSeenNotice] = useState(false);
  
  const checkFirstVisit = () => {
    const key = `wishlist-visited-${systemName}`;
    const visited = localStorage.getItem(key);
    
    if (!visited && wishlist && !wishlist.is_public) {
      setShowShareModal(true);
      localStorage.setItem(key, 'true');
      setHasSeenNotice(true);
    }
  };

  const priorityOptions = [
    'I need it urgently',
    'I need it in general',
    'I want it urgently',
    'I want it in general',
    'It would be nice'
  ];

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/wishlists/${systemName}`);
      if (!response.ok) throw new Error('Wishlist not found');
      const data = await response.json();
      console.log('Raw response from server:', data); //debug log
      setWishlist(data);
    } catch (err) {
      console.log('Fetch error', err); //debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    try {
      const newItem = {
        itemName: '',
        purchaseLink: '',
        priority: priorityOptions[4],
        sizeVersion: '',
        price: '',
        comments: '',
        isBought: false
      };
  
      // Add to local state immediately with temporary ID
      const tempId = `temp-${Date.now()}`;
      setLocalItems(current => [...current, { ...newItem, id: tempId }]);
  
      // Send to server
      const response = await fetch(`http://localhost:3001/api/wishlists/${systemName}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
  
      if (!response.ok) throw new Error('Failed to add item');
      const data = await response.json();
  
      // Update local state with real ID
      setLocalItems(current => 
        current.map(item => 
          item.id === tempId ? { ...item, id: data.itemId } : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
  
    try {
      const response = await fetch(`http://localhost:3001/api/wishlists/items/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item');
      
      // Update local state immediately
      setLocalItems(current => current.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBoughtToggle = async (itemId, currentBoughtStatus) => {
    console.log('handleBoughtToggle called with:', { itemId, currentBoughtStatus });
    try {
      const newBoughtStatus = !currentBoughtStatus;
      
      // Update local state immediately
      setLocalItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, isBought: newBoughtStatus }
            : item
        )
      );
  
      const response = await fetch(`http://localhost:3001/api/wishlists/items/${itemId}/bought`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBought: newBoughtStatus })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update bought status');
      }
    } catch (error) {
      console.error('Error in handleBoughtToggle:', error);
      setError(error.message);
      // Revert local state if server update fails
      setLocalItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, isBought: currentBoughtStatus }  
            : item
        )
      );
    }
  };
  

  // First useEffect to fetch data from server
  useEffect(() => {
    console.log('systemName changed, fetching wishlist for:', systemName);
    fetchWishlist();
  }, [systemName]);
  
  // Second useEffect to update local items when wishlist changes
  useEffect(() => {
    console.log('Wishlist data in second useEffect:', wishlist);
    if (wishlist?.items) {
      console.log('Items from wishlist:', wishlist.items);
      setLocalItems(wishlist.items);
      checkFirstVisit();
    } else {
      console.log('No items found in wishlist data');
    }
  }, [wishlist]);

  const verifyPassword = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/wishlists/${systemName}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.verified) {
        setIsEditing(true);
        setShowPasswordModal(false);
        setPassword('');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleItemChange = (itemId, field, value) => {
    setLocalItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };
  
  const saveItemChanges = async (itemId) => {
    const item = localItems.find(i => i.id === itemId);
    if (!item) return;
  
    try {
      const response = await fetch(`http://localhost:3001/api/wishlists/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('Failed to update item');
    } catch (err) {
      setError(err.message);
      fetchWishlist();
    }
  };

  const handleShare = async () => {
    // Try native sharing first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${wishlist.user_name}'s Wishlist: ${wishlist.title}`,
          text: !wishlist.is_public 
            ? `Check out my wishlist!\nSystem name (save this!): ${systemName}`
            : `Check out my wishlist!`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
        // If native share fails, fall back to modal
        setShowShareModal(true);
      }
    } else {
      // On desktop, show the modal
      setShowShareModal(true);
    }
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${wishlist.user_name}'s Wishlist: ${wishlist.title}`);
    const body = encodeURIComponent(
      `Check out my wishlist: ${wishlist.title}\n\n` +
      `${!wishlist.is_public ? `System name (save this!): ${systemName}\n\n` : ''}` +
      `Link: ${window.location.href}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <pre className="text-terminal-green animate-pulse">
{`Loading wishlist...
[====================]
Please wait...`}
      </pre>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="border border-white p-6 bg-black max-w-md w-full">
            <h3 className="text-white mb-4">Enter Password to Edit</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black text-white border border-white p-2 mb-4"
              placeholder="Enter wishlist password"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
              >
                [CANCEL]
              </button>
              <button
                onClick={verifyPassword}
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
              >
                [VERIFY]
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Share Modal */}
        {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="border border-white p-6 bg-black max-w-md w-full">
            <h3 className="text-white mb-4">Share Wishlist</h3>
            
            {/* Privacy Warning for Private Lists */}
            {!wishlist.is_public && (
                <pre className="text-terminal-green mb-4">
        {`NOTICE:
        This is a private wishlist!
        Make sure to save the system name
        for future access.`}
                </pre>
            )}

            <p className="text-white/70 mb-2">System Name (for lookup):</p>
            <pre className="bg-black text-terminal-green p-2 border border-white mb-4">
                {systemName}
            </pre>
            
            <p className="text-white/70 mb-2">Direct Link:</p>
            <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full bg-black text-white border border-white p-2 mb-4"
                onClick={(e) => e.target.select()}
            />

            <div className="flex justify-end gap-2">
                {/* Share via Email */}
                <button
                onClick={handleEmailShare}
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
                >
                [EMAIL]
                </button>

                {/* Native Share (Mobile) */}
                {navigator.share && (
                <button
                    onClick={handleShare}
                    className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
                >
                    [SHARE]
                </button>
                )}

                <button
                onClick={() => setShowShareModal(false)}
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
                >
                [CLOSE]
                </button>
            </div>
            </div>
        </div>
        )}

      {/* Wishlist Header */}
      <div className="border border-white p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white text-2xl mb-2">{wishlist?.title}</h1>
            <p className="text-white/70">Created by: {wishlist?.user_name}</p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
              >
                [EDIT]
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
              >
                [EXIT EDIT MODE]
              </button>
            )}
            <button
              onClick={handleShare}
              className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black"
            >
              [SHARE]
            </button>
          </div>
        </div>
      </div>

      {/* Items Table/List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-white">
            <tr>
              {isEditing && <th className="p-2 text-left text-white"></th>}
              <th className="p-2 text-left text-white">Item</th>
              <th className="p-2 text-left text-white hidden md:table-cell">Size/Version</th>
              <th className="p-2 text-left text-white">Where to Buy</th>
              <th className="p-2 text-left text-white hidden md:table-cell">Price</th>
              <th className="p-2 text-left text-white hidden md:table-cell">Priority</th>
              <th className="p-2 text-left text-white hidden md:table-cell">Comments</th>
            </tr>
          </thead>
          <tbody>
            {console.log('localItems:', localItems)}
            {localItems.map((item) => (
                <tr 
                key={item.id} 
                className={`border-b border-white/30 ${item.isBought ? 'opacity-50' : ''}`}
                >
                <td className="p-2">
                    <div className="flex gap-2">
                        {/* Bought button - always visible */}
                        <button
                          onClick={() => {
                            console.log('Full item:', item);
                            console.log('Button clicked for item:', item.id); // Debug log
                            handleBoughtToggle(item.id, item.isBought);
                          }}
                          className="text-white hover:text-terminal-green"
                        >
                          [{item.isBought ? 'UNBUY' : 'BOUGHT'}]
                        </button>
                        
                        {/* Delete button - only in edit mode */}
                        {isEditing && (
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="text-white hover:text-red-500"
                        >
                            [DELETE]
                        </button>
                        )}
                    </div>
                </td>
                
                {/* Item Name */}
                <td className="p-2">
                    {isEditing ? (
                    <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                        onBlur={() => saveItemChanges(item.id)}
                        className={`w-full bg-black text-white border-white border p-1 ${item.isBought ? 'line-through' : ''}`}
                    />
                    ) : (
                    <span className={item.isBought ? 'line-through' : ''}>{item.itemName}</span>
                    )}
                </td>

                {/* Size/Version */}
                <td className="p-2 hidden md:table-cell">
                    {isEditing ? (
                    <input
                        type="text"
                        value={item.sizeVersion || ''}
                        onChange={(e) => handleItemChange(item.id, 'sizeVersion', e.target.value)}
                        onBlur={() => saveItemChanges(item.id)}
                        className="w-full bg-black text-white border-white border p-1"
                    />
                    ) : (
                    <span>{item.sizeVersion}</span>
                    )}
                </td>

                {/* Purchase Link */}
                <td className="p-2">
                    {isEditing ? (
                    <input
                        type="text"
                        value={item.purchaseLink || ''}
                        onChange={(e) => handleItemChange(item.id, 'purchaseLink', e.target.value)}
                        onBlur={() => saveItemChanges(item.id)}
                        className="w-full bg-black text-white border-white border p-1"
                    />
                    ) : (
                    <a href={item.purchaseLink} target="_blank" rel="noopener noreferrer" 
                        className="text-white hover:text-terminal-green underline">
                        [LINK]
                    </a>
                    )}
                </td>

                {/* Price */}
                <td className="p-2 hidden md:table-cell">
                    {isEditing ? (
                    <input
                        type="text"
                        value={item.price || ''}
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                        onBlur={() => saveItemChanges(item.id)}
                        className="w-full bg-black text-white border-white border p-1"
                    />
                    ) : (
                    <span>{item.price}</span>
                    )}
                </td>

                {/* Priority */}
                <td className="p-2 hidden md:table-cell">
                    {isEditing ? (
                    <select
                        value={item.priority}
                        onChange={(e) => {
                        handleItemChange(item.id, 'priority', e.target.value);
                        saveItemChanges(item.id);
                        }}
                        className="w-full bg-black text-white border-white border p-1"
                    >
                        {priorityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    ) : (
                    <span>{item.priority}</span>
                    )}
                </td>

                {/* Comments */}
                <td className="p-2 hidden md:table-cell">
                    {isEditing ? (
                    <input
                        type="text"
                        value={item.comments || ''}
                        onChange={(e) => handleItemChange(item.id, 'comments', e.target.value)}
                        onBlur={() => saveItemChanges(item.id)}
                        className="w-full bg-black text-white border-white border p-1"
                    />
                    ) : (
                    <span>{item.comments}</span>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* Mobile View for Hidden Columns */}
      <div className="md:hidden">
        {wishlist?.items?.map((item) => (
          <div key={item.id} className="mt-4 text-white/70 text-sm">
            <p>Size/Version: {item.sizeVersion}</p>
            <p>Price: {item.price}</p>
            <p>Priority: {item.priority}</p>
            <p>Comments: {item.comments}</p>
          </div>
        ))}
      </div>

      {/* Add New Item Button */}
      {isEditing && (
        <button
          onClick={addItem}
          className="w-full border border-white text-white mt-6 p-4 hover:bg-white hover:text-black"
        >
          [ADD NEW ITEM]
        </button>
      )}
    </div>
  );
};

export default WishlistPage;