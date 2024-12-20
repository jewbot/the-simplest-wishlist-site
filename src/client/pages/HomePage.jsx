import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false); // Add this to prevent double fetching

  const observer = useRef();
  const lastWishlistRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchWishlists = async () => {
    if (loadingRef.current) return; // Prevent duplicate fetches
    try {
      loadingRef.current = true;
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/wishlists/public?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch wishlists');
      const data = await response.json();
      
      // Prevent duplicates by checking IDs
      const newWishlists = data.filter(newWishlist => 
        !wishlists.some(existingWishlist => existingWishlist.id === newWishlist.id)
      );
      
      if (data.length < 10) {
        setHasMore(false);
      }
      
      setWishlists(prev => [...prev, ...newWishlists]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, [page]);

  if (error) {
    return (
      <pre className="text-terminal-green">
{`ERROR:
${error}
Press F5 to retry...`}
      </pre>
    );
  }

  return (
    <div className="bg-black">
      <div className="grid gap-6">
        {wishlists.map((wishlist, index) => (
          <div 
            ref={index === wishlists.length - 1 ? lastWishlistRef : null}
            key={wishlist.id} 
            className="border border-white p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-xl mb-2">{wishlist.title}</h2>
                <p className="text-white text-sm mb-1">Created by: {wishlist.user_name}</p>
                <p className="text-white/70 text-xs">
                  Created: {new Date(wishlist.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link 
                to={`/wishlist/${wishlist.system_name}`}
                className="text-white hover:bg-white hover:text-black px-2 py-1 border border-white text-sm"
              >
                [VIEW]
              </Link>
            </div>
            {wishlist.preview_items && (
              <div className="mt-4">
                <p className="text-white text-sm mb-2">Preview Items:</p>
                <pre className="text-white/70 text-xs">
                  {wishlist.preview_items.split('||').map((item, i) => 
                    `${i + 1}. ${item}\n`
                  )}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && 
        <pre className="text-terminal-green text-center mt-4">
{`Loading more...
[====================]`}
        </pre>
      }
    </div>
  );
};

export default HomePage;