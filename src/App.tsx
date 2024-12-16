import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateWishlist from './pages/CreateWishlist';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateWishlist />} />
          {/* Add other routes as we implement them */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;