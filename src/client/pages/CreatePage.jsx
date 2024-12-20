import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('header'); // 'header' or 'items'
  const [formData, setFormData] = useState({
    userName: '',
    title: '',
    isPublic: true,
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create wishlist');
      
      const data = await response.json();
      navigate(`/wishlist/${data.systemName}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <pre className="text-terminal-green animate-pulse">
{`Creating wishlist...
[====================]
Please wait...`}
      </pre>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        {error && (
          <pre className="text-white mb-4">
{`ERROR:
${error}`}
          </pre>
        )}

        <div className="space-y-6">
          <div className="border border-white p-4">
            <h2 className="text-white text-xl mb-4">Create New Wishlist</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none focus:border-white"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  Wishlist Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none focus:border-white"
                  placeholder="Enter wishlist title"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="bg-black border-white"
                />
                <label className="text-white">
                  List this wishlist publically
                </label>
              </div>
              <div>
                  <label className="block text-white mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-black text-white border border-white p-2 focus:outline-none focus:border-white"
                    placeholder="Enter password for editting"
                  />
                  <p className="text-white/70 text-sm mt-1">
                    Keep it simple! You'll need this password to edit your wishlist later.
                  </p>
                </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full border border-white text-white hover:bg-white hover:text-black p-2 transition-colors"
          >
            [CREATE WISHLIST]
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;