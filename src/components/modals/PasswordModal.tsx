import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export default function PasswordModal({ isOpen, onClose, onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-black border border-terminal-green p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-mono text-terminal-green">Enter Password</h2>
          <button
            onClick={onClose}
            className="text-terminal-green hover:bg-terminal-green/10 p-1"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-black border border-terminal-green p-2 mb-4"
            placeholder="Enter password to edit"
            autoFocus
          />
          <button
            type="submit"
            className="w-full p-2 bg-terminal-green/10 border border-terminal-green text-terminal-green hover:bg-terminal-green/20"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}