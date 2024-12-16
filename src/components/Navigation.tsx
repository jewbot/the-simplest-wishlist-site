import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Edit, PlusSquare } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const links = [
    { to: '/', icon: <Home />, label: 'Home' },
    { to: '/lookup', icon: <Search />, label: 'Lookup Private' },
    { to: '/edit', icon: <Edit />, label: 'Edit Existing' },
    { to: '/create', icon: <PlusSquare />, label: 'Create New' },
  ];

  return (
    <nav className="flex gap-6">
      {links.map(({ to, icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex items-center gap-2 text-terminal-green hover:brightness-150 transition-all
            ${location.pathname === to ? 'border-b-2 border-terminal-green' : ''}`}
        >
          {icon}
          <span className="hidden md:inline">{label}</span>
        </Link>
      ))}
    </nav>
  );
}