import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSystemName } from '../utils/helpers';

interface WishlistFormData {
  userName: string;
  title: string;
  isPublic: boolean;
  password: string;
}

export function useWishlistForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<WishlistFormData>({
    userName: '',
    title: '',
    isPublic: true,
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const systemName = generateSystemName(formData.userName, formData.title);
    // Save wishlist logic here
    navigate(`/wishlist/${systemName}`);
  };

  const handleFormChange = (updates: Partial<WishlistFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    handleSubmit,
    handleFormChange,
  };
}