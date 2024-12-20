import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LookupPage = () => {
  const navigate = useNavigate();
  const [systemName, setSystemName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/wishlists/${systemName.trim()}`);
      
      if (!response.ok) {
        throw new Error('Wishlist not found');
      }

      // If found, navigate to the wishlist
      navigate(`/wishlist/${systemName.trim()}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <pre className="text-terminal-green animate-pulse">
{`Searching for wishlist...
[====================]
Please wait...`}
      </pre>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="border border-white p-4 mb-6">
        <h1 className="text-white text-2xl mb-4">Lookup Wishlist</h1>
        
        {error && (
          <pre className="text-terminal-green mb-4">
{`ERROR:
${error}
Press ENTER to try again...`}
          </pre>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-white mb-2">
            System Name *
          </label>
          <input
            type="text"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            className="w-full bg-black text-white border border-white p-2 mb-4 focus:outline-none"
            placeholder="Enter wishlist system name"
            required
            autoFocus
          />
          
          <button
            type="submit"
            className="w-full border border-white text-white hover:bg-white hover:text-black p-2 transition-colors"
          >
            [LOOKUP WISHLIST]
          </button>
        </form>

        <div className="mt-4 text-white/70 text-sm">
          <p>System names are in the format: username-wishlisttitle-uniqueid</p>
          <p>Example: john-birthday-abc123xyz</p>
        </div>
      </div>
    </div>
  );
};

export default LookupPage;