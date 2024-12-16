import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSystemName } from '../utils/helpers';

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-terminal-green p-6">
        <h1 className="text-2xl font-mono mb-6 text-terminal-green">Create New Wishlist</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
              className="w-full bg-black border border-terminal-green p-2"
            />
          </div>

          <div>
            <label className="block mb-2">Wishlist Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-black border border-terminal-green p-2"
            />
          </div>

          <div>
            <label className="block mb-2">Visibility</label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={formData.isPublic}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                  className="mr-2"
                />
                Public
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={!formData.isPublic}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                  className="mr-2"
                />
                Private
              </label>
            </div>
          </div>

          {!formData.isPublic && (
            <div>
              <label className="block mb-2">Password</label>
              <input
                type="password"
                required={!formData.isPublic}
                value={formData.password}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-black border border-terminal-green p-2"
              />
              <p className="text-sm mt-1 text-gray-400">
                Remember this password - you'll need it to make future changes.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full p-2 bg-terminal-green/10 border border-terminal-green text-terminal-green hover:bg-terminal-green/20"
          >
            Create Wishlist
          </button>
        </form>
      </div>
      
      <div className="mt-6 border border-terminal-green p-6">
        <div className="flex items-center justify-center h-40">
          <pre className="text-terminal-green animate-pulse">
            {`
   Loading...
   [##########]
            `}
          </pre>
        </div>
      </div>
    </div>
  );
}