import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSystemName } from '../utils/helpers';
import WishlistForm from '../components/forms/WishlistForm';
import LoadingAnimation from '../components/loading/LoadingAnimation';

export default function CreateWishlist() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    title: '',
    isPublic: true,
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const systemName = generateSystemName(formData.userName, formData.title);
    
    try {
      const response = await fetch('/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          systemName,
          createdAt: new Date().toISOString(),
          lastEditedAt: new Date().toISOString(),
          items: []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create wishlist');
      }

      // Navigate to the wishlist page with edit mode enabled
      navigate(`/wishlist/${systemName}?edit=true`);
    } catch (error) {
      console.error('Error creating wishlist:', error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  const handleFormChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-terminal-green p-6">
        <h1 className="text-2xl font-mono mb-6 text-terminal-green">Create New Wishlist</h1>
        <WishlistForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </div>
      
      <div className="mt-6 border border-terminal-green p-6">
        <LoadingAnimation />
      </div>
    </div>
  );
}