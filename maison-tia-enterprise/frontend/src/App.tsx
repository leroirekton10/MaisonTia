import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './app/Home';
import CollectionsPage from './app/CollectionsPage';
import ProductDetail from './app/ProductDetail';
import ContactPage from './app/ContactPage';
import SecretAdminLogin from './app/SecretAdminLogin';
import AdminDashboard from './app/AdminDashboard';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './providers/SmoothScroll';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SmoothScroll>
        <div className="min-h-screen bg-[#030303] text-[#FDFBF7] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FDFBF7]">
          <Header />
          <div className="flex-grow pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<SecretAdminLogin />} />
              <Route path="/secret-vault-admin" element={<SecretAdminLogin />} />
              
              {/* Protected Routes — Handled & Guarded by middleware.ts */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute fallbackPath="/login">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </SmoothScroll>
    </Router>
  );
}

export default App;

