import React from 'react';

interface WishlistFormData {
  userName: string;
  title: string;
  isPublic: boolean;
  password: string;
}

interface WishlistFormProps {
  formData: WishlistFormData;
  onChange: (data: Partial<WishlistFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function WishlistForm({ formData, onChange, onSubmit }: WishlistFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          required
          value={formData.userName}
          onChange={e => onChange({ userName: e.target.value })}
          className="w-full bg-black border border-terminal-green p-2"
        />
      </div>

      <div>
        <label className="block mb-2">Wishlist Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={e => onChange({ title: e.target.value })}
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
              onChange={() => onChange({ isPublic: true })}
              className="mr-2"
            />
            Public
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={!formData.isPublic}
              onChange={() => onChange({ isPublic: false })}
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
            onChange={e => onChange({ password: e.target.value })}
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
  );
}