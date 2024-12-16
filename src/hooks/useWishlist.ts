import { useState, useEffect } from 'react';
import type { Wishlist } from '../types';

export function useWishlist(systemName?: string) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemName) {
      setIsLoading(false);
      return;
    }

    fetch(`/api/wishlists/${systemName}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch wishlist');
        return res.json();
      })
      .then(data => {
        setWishlist(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [systemName]);

  const updateWishlist = async (updatedWishlist: Wishlist) => {
    try {
      const res = await fetch(`/api/wishlists/${systemName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWishlist)
      });

      if (!res.ok) throw new Error('Failed to update wishlist');
      
      const data = await res.json();
      setWishlist(data);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wishlist');
      return false;
    }
  };

  return { wishlist, updateWishlist, isLoading, error };
}