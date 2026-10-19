import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DatabaseStatusBanner } from './components/common/DatabaseStatusBanner';

// Public Pages
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

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { SellerLayout } from './layouts/SellerLayout';
import { BuyerLayout } from './layouts/BuyerLayout';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage';
import { AdminAccessoriesPage } from './pages/admin/AdminAccessoriesPage';
import { AdminMotorbikesPage } from './pages/admin/AdminMotorbikesPage';
import { AdminOrdersEnquiriesPage } from './pages/admin/AdminOrdersEnquiriesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminFinancingPage } from './pages/admin/AdminFinancingPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminMarketingPage } from './pages/admin/AdminMarketingPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Seller Pages
import { SellerOverviewPage } from './pages/seller/SellerOverviewPage';
import { SellerVehiclesPage } from './pages/seller/SellerVehiclesPage';
import { SellerAddVehiclePage } from './pages/seller/SellerAddVehiclePage';
import { SellerInventoryPage } from './pages/seller/SellerInventoryPage';
import { SellerEnquiriesPage } from './pages/seller/SellerEnquiriesPage';
import { SellerOrdersBookingsPage } from './pages/seller/SellerOrdersBookingsPage';
import { SellerCustomersPage } from './pages/seller/SellerCustomersPage';
import { SellerStoreProfilePage } from './pages/seller/SellerStoreProfilePage';
import { SellerPromotionsPage } from './pages/seller/SellerPromotionsPage';
import { SellerFinancingPage } from './pages/seller/SellerFinancingPage';
import { SellerReviewsPage } from './pages/seller/SellerReviewsPage';
import { SellerAnalyticsPage } from './pages/seller/SellerAnalyticsPage';
import { SellerEarningsPage } from './pages/seller/SellerEarningsPage';
import { SellerSettingsPage } from './pages/seller/SellerSettingsPage';

// Buyer Pages
import { BuyerOverviewPage } from './pages/buyer/BuyerOverviewPage';
import { BuyerSavedCarsPage } from './pages/buyer/BuyerSavedCarsPage';
import { BuyerEnquiriesPage } from './pages/buyer/BuyerEnquiriesPage';
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage';
import { BuyerBookingsPage } from './pages/buyer/BuyerBookingsPage';
import { BuyerHistoryPage } from './pages/buyer/BuyerHistoryPage';
import { BuyerComparePage } from './pages/buyer/BuyerComparePage';
import { BuyerWishlistPage } from './pages/buyer/BuyerWishlistPage';
import { BuyerNotificationsPage } from './pages/buyer/BuyerNotificationsPage';
import { BuyerProfilePage } from './pages/buyer/BuyerProfilePage';
import { BuyerAddressesPage } from './pages/buyer/BuyerAddressesPage';
import { BuyerPaymentMethodsPage } from './pages/buyer/BuyerPaymentMethodsPage';
import { BuyerSettingsPage } from './pages/buyer/BuyerSettingsPage';

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
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Route Guard for Seller
const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  if (role !== 'seller' && role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Route Guard for Buyer
const BuyerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
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

          {/* =========================================================================
              ADMIN DASHBOARD NESTED ROUTES
          ========================================================================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverviewPage />} />
            <Route path="vehicles" element={<AdminVehiclesPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
            <Route path="accessories" element={<AdminAccessoriesPage />} />
            <Route path="motorbikes" element={<AdminMotorbikesPage />} />
            <Route path="orders" element={<AdminOrdersEnquiriesPage />} />
            <Route path="enquiries" element={<AdminOrdersEnquiriesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="financing" element={<AdminFinancingPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="marketing" element={<AdminMarketingPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* =========================================================================
              SELLER DASHBOARD NESTED ROUTES
          ========================================================================= */}
          <Route
            path="/seller"
            element={
              <SellerRoute>
                <SellerLayout />
              </SellerRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SellerOverviewPage />} />
            <Route path="vehicles" element={<SellerVehiclesPage />} />
            <Route path="vehicles/new" element={<SellerAddVehiclePage />} />
            <Route path="inventory" element={<SellerInventoryPage />} />
            <Route path="enquiries" element={<SellerEnquiriesPage />} />
            <Route path="orders" element={<SellerOrdersBookingsPage />} />
            <Route path="bookings" element={<SellerOrdersBookingsPage />} />
            <Route path="customers" element={<SellerCustomersPage />} />
            <Route path="store" element={<SellerStoreProfilePage />} />
            <Route path="promotions" element={<SellerPromotionsPage />} />
            <Route path="financing" element={<SellerFinancingPage />} />
            <Route path="reviews" element={<SellerReviewsPage />} />
            <Route path="analytics" element={<SellerAnalyticsPage />} />
            <Route path="earnings" element={<SellerEarningsPage />} />
            <Route path="settings" element={<SellerSettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* =========================================================================
              BUYER DASHBOARD NESTED ROUTES
          ========================================================================= */}
          <Route
            path="/account"
            element={
              <BuyerRoute>
                <BuyerLayout />
              </BuyerRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<BuyerOverviewPage />} />
            <Route path="saved" element={<BuyerSavedCarsPage />} />
            <Route path="enquiries" element={<BuyerEnquiriesPage />} />
            <Route path="orders" element={<BuyerOrdersPage />} />
            <Route path="bookings" element={<BuyerBookingsPage />} />
            <Route path="history" element={<BuyerHistoryPage />} />
            <Route path="compare" element={<BuyerComparePage />} />
            <Route path="wishlist" element={<BuyerWishlistPage />} />
            <Route path="notifications" element={<BuyerNotificationsPage />} />
            <Route path="profile" element={<BuyerProfilePage />} />
            <Route path="addresses" element={<BuyerAddressesPage />} />
            <Route path="payment-methods" element={<BuyerPaymentMethodsPage />} />
            <Route path="settings" element={<BuyerSettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
