import React from 'react';
import { Terminal } from 'lucide-react';
import Navigation from './Navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-terminal-green p-4 text-center text-terminal-green animate-pulse">
        Do not scrape. We do not allow automated web scraping of data!
      </div>
      <header className="border-b border-terminal-green p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="text-terminal-green" />
            <span className="font-mono text-xl">WishList_OS v1.0</span>
          </div>
          <Navigation />
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}