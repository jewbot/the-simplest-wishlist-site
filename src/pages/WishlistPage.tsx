import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import WishlistView from '../components/wishlist/WishlistView';
import WishlistEdit from '../components/wishlist/WishlistEdit';
import PasswordModal from '../components/modals/PasswordModal';
import { useWishlist } from '../hooks/useWishlist';

export default function WishlistPage() {
  const { systemName } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { wishlist, updateWishlist, isLoading } = useWishlist(systemName);

  const handleEditClick = () => {
    if (wishlist?.isPublic) {
      setIsEditMode(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    // Verify password logic here
    if (password === wishlist?.password) {
      setIsEditMode(true);
      setShowPasswordModal(false);
    }
  };

  if (isLoading || !wishlist) {
    return <div className="text-center mt-8">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {isEditMode ? (
        <WishlistEdit
          wishlist={wishlist}
          onUpdate={updateWishlist}
          onExitEdit={() => setIsEditMode(false)}
        />
      ) : (
        <WishlistView wishlist={wishlist} onEditClick={handleEditClick} />
      )}
      
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}