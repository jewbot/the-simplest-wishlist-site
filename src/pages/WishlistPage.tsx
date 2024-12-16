import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import WishlistView from '../components/wishlist/WishlistView';
import WishlistEdit from '../components/wishlist/WishlistEdit';
import PasswordModal from '../components/modals/PasswordModal';
import LoadingAnimation from '../components/loading/LoadingAnimation';
import { useWishlist } from '../hooks/useWishlist';

export default function WishlistPage() {
  const { systemName } = useParams();
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(searchParams.get('edit') === 'true');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { wishlist, updateWishlist, isLoading, error } = useWishlist(systemName);

  useEffect(() => {
    // Update edit mode when search params change
    setIsEditMode(searchParams.get('edit') === 'true');
  }, [searchParams]);

  const handleEditClick = () => {
    if (wishlist?.isPublic) {
      setIsEditMode(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      const response = await fetch(`/api/wishlists/${systemName}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.isValid) {
        setIsEditMode(true);
        setShowPasswordModal(false);
      } else {
        // Handle invalid password
        alert('Invalid password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('Failed to verify password');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <LoadingAnimation />
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center text-terminal-green">
        <pre>{`
   Error 404
   Wishlist Not Found
   [##########]
        `}</pre>
      </div>
    );
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