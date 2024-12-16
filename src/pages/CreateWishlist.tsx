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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const systemName = generateSystemName(formData.userName, formData.title);
    // Save wishlist logic here
    navigate(`/wishlist/${systemName}`);
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