import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Plus, Layers, MessageSquare, ShoppingBag,
  Users, Store, Zap, DollarSign, Star, BarChart3, Wallet, Settings,
  ExternalLink, Menu, X, Bell, ChevronDown, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { SwahivoLogo } from '../components/common/SwahivoLogo';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseStatusBanner } from '../components/common/DatabaseStatusBanner';

export const SellerLayout: React.FC = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navMenuItems = [
    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seller/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/seller/vehicles/new', label: 'Add Vehicle', icon: Plus, highlight: true },
    { to: '/seller/inventory', label: 'Inventory', icon: Layers },
    { to: '/seller/enquiries', label: 'Enquiries', icon: MessageSquare, badge: '12' },
    { to: '/seller/orders', label: 'Orders / Bookings', icon: ShoppingBag, badge: '3' },
    { to: '/seller/customers', label: 'Customers', icon: Users },
    { to: '/seller/store', label: 'My Store Profile', icon: Store },
    { to: '/seller/promotions', label: 'Promote / Boost', icon: Zap },
    { to: '/seller/financing', label: 'Financing Requests', icon: DollarSign },
    { to: '/seller/reviews', label: 'Reviews', icon: Star },
    { to: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/seller/earnings', label: 'Payouts / Earnings', icon: Wallet },
    { to: '/seller/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col antialiased font-sans">
      <DatabaseStatusBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            SELLER SIDEBAR (Matching Reference 5: #081725)
        ========================================================================= */}
        <aside className="w-64 bg-[#081725] text-slate-300 flex-shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-800">
          <div className="p-6 overflow-y-auto">
            {/* Logo */}
            <Link to="/" className="block mb-8">
              <SwahivoLogo variant="light" size="md" />
            </Link>

            {/* Nav List */}
            <nav className="space-y-1">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#ef172b] text-white shadow-md shadow-red-500/20'
                          : item.highlight
                          ? 'text-white bg-slate-800/60 hover:bg-slate-800'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Link */}
          <div className="p-6 border-t border-slate-800/80">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Showroom</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative w-72 bg-[#081725] text-slate-300 flex flex-col justify-between h-full p-6 z-10 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <SwahivoLogo variant="light" size="sm" />
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                            isActive
                              ? 'bg-[#ef172b] text-white'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Showroom</span>
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* Main Seller Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            {/* Mobile Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <SwahivoLogo variant="dark" size="sm" />
            </div>

            {/* Portal Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-red-50 text-[#ef172b] font-bold rounded-lg flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Seller: Prime Motors Tanzania
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              <NavLink to="/seller/enquiries" className="relative p-2 text-slate-600 hover:text-[#ef172b] hover:bg-slate-50 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  12
                </span>
              </NavLink>

              {/* Seller Avatar */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="Seller"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight">Ali Hassan</p>
                  <p className="text-[10px] text-slate-500">Prime Motors (Seller)</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      switchRole('admin');
                      navigate('/admin/dashboard');
                    }}
                    className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                    title="Switch to admin portal"
                  >
                    Admin Portal
                  </button>
                  <button
                    onClick={() => {
                      switchRole('buyer');
                      navigate('/account/dashboard');
                    }}
                    className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                    title="Switch to buyer portal"
                  >
                    Buyer Portal
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
