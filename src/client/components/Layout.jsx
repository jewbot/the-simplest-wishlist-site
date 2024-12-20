import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    const baseClass = "text-white hover:bg-white hover:text-black px-4 py-2 border border-white transition-colors";
    return location.pathname === path 
      ? `${baseClass} bg-white text-black` 
      : baseClass;
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Banner */}
      <div className="border-b border-white p-4">
        <pre className="text-white text-center whitespace-pre text-xs md:text-sm">
{`
╔═══════════════════════════════════════════╗
║         the simplest wishlist             ║
║  do not scrape. no automated scraping!    ║
╚═══════════════════════════════════════════╝
`}
        </pre>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white p-4">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className={getNavLinkClass('/')}>
            [HOME]
          </Link>
          <Link to="/lookup" className={getNavLinkClass('/lookup')}>
            [LOOKUP]
          </Link>
          <Link to="/create" className={getNavLinkClass('/create')}>
            [NEW WISHLIST]
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;