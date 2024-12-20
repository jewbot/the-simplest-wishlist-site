import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import WishlistPage from './pages/WishlistPage';
import LookupPage from './pages/LookupPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lookup" element={<LookupPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/wishlist/:systemName" element={<WishlistPage />} />
      </Routes>
    </Layout>
  );
};

export default App;