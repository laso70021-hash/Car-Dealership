import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DatabaseStatusBanner } from './components/common/DatabaseStatusBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { CarsPage } from './pages/CarsPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { ServicesPage } from './pages/ServicesPage';
import { FinancePage } from './pages/FinancePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';

// Layout wrapper for Public Pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fb]">
      <DatabaseStatusBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

// Route Guard for Admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  if (role !== 'admin') {
    // Graceful redirect or allow preview
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <DatabaseStatusBanner />
      {children}
    </>
  );
};

// Route Guard for Seller
const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  if (role !== 'seller' && role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <DatabaseStatusBanner />
      {children}
    </>
  );
};

// Route Guard for Buyer
const BuyerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <DatabaseStatusBanner />
      {children}
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/cars" element={<PublicLayout><CarsPage /></PublicLayout>} />
          <Route path="/cars/:slug" element={<PublicLayout><CarDetailsPage /></PublicLayout>} />
          <Route path="/new-cars" element={<PublicLayout><CarsPage /></PublicLayout>} />
          <Route path="/used-cars" element={<PublicLayout><CarsPage /></PublicLayout>} />
          <Route path="/accessories" element={<PublicLayout><AccessoriesPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/finance" element={<PublicLayout><FinancePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Seller Dashboard Routes */}
          <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="/seller/*" element={<SellerRoute><SellerDashboard /></SellerRoute>} />

          {/* Buyer Dashboard Routes */}
          <Route path="/account/dashboard" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />
          <Route path="/account/*" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
