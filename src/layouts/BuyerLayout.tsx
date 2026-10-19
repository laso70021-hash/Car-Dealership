import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Heart, MessageSquare, ShoppingBag,
  Calendar, History, Scale, Bookmark, Bell, User, MapPin,
  CreditCard, Settings, Menu, X, ExternalLink, ShieldCheck, ChevronDown
} from 'lucide-react';
import { SwahivoLogo } from '../components/common/SwahivoLogo';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseStatusBanner } from '../components/common/DatabaseStatusBanner';
import { DealershipService } from '../services/dealershipService';

export const BuyerLayout: React.FC = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const favs = DealershipService.getFavorites();
    setSavedCount(favs.length);
  }, []);

  const navMenuItems = [
    { to: '/account/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cars', label: 'Browse Cars', icon: Compass, external: true },
    { to: '/account/saved', label: 'Saved Cars', icon: Heart, badge: savedCount > 0 ? String(savedCount) : undefined },
    { to: '/account/enquiries', label: 'My Enquiries', icon: MessageSquare, badge: '5' },
    { to: '/account/orders', label: 'My Orders', icon: ShoppingBag, badge: '2' },
    { to: '/account/bookings', label: 'My Bookings', icon: Calendar },
    { to: '/account/history', label: 'Search History', icon: History },
    { to: '/account/compare', label: 'Compare Cars', icon: Scale },
    { to: '/account/wishlist', label: 'Wishlist', icon: Bookmark },
    { to: '/account/notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { to: '/account/profile', label: 'My Profile', icon: User },
    { to: '/account/addresses', label: 'My Addresses', icon: MapPin },
    { to: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard },
    { to: '/account/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col antialiased font-sans">
      <DatabaseStatusBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            BUYER SIDEBAR (Matching Reference 6: #081725)
        ========================================================================= */}
        <aside className="w-64 bg-[#081725] text-slate-300 flex-shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-800">
          <div className="p-6 overflow-y-auto">
            {/* Logo */}
            <Link to="/" className="block mb-8">
              <SwahivoLogo variant="light" size="md" />
            </Link>

            {/* Nav list */}
            <nav className="space-y-1">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                if (item.external) {
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#ef172b] text-white shadow-md shadow-red-500/20'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              isActive ? 'bg-white text-[#ef172b]' : 'bg-[#ef172b] text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User footer & fast role switcher */}
          <div className="p-4 border-t border-slate-800 bg-[#06121d]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#ef172b] flex items-center justify-center font-bold text-xs border border-red-500/20">
                {user?.name?.[0] || 'B'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Buyer Account'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || 'buyer@swahivo.co.tz'}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Switch:</span>
              <button
                onClick={() => { switchRole('admin'); navigate('/admin/dashboard'); }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold transition"
              >
                Admin
              </button>
              <button
                onClick={() => { switchRole('seller'); navigate('/seller/dashboard'); }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold transition"
              >
                Seller
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-[#081725] text-slate-300 p-6 flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <SwahivoLogo variant="light" size="sm" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
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
                              ? 'bg-[#ef172b] text-white shadow-md shadow-red-500/20'
                              : 'text-slate-300 hover:bg-slate-800'
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
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Buyer Top Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buyer Portal</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-black text-slate-900">Karibu {user?.name || 'Customer'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/cars"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                <Compass className="w-3.5 h-3.5" />
                Browse 850+ Cars
              </Link>

              <NavLink
                to="/account/notifications"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#ef172b] absolute top-1.5 right-1.5" />
              </NavLink>

              <NavLink
                to="/account/profile"
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition"
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#ef172b] flex items-center justify-center font-bold text-xs border border-red-100">
                  {user?.full_name?.[0] || user?.name?.[0] || 'B'}
                </div>
                <span className="text-xs font-bold text-slate-800 hidden md:inline">
                  {user?.full_name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Buyer'}
                </span>
              </NavLink>

              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <button
                  onClick={() => {
                    switchRole('admin');
                    navigate('/admin/dashboard');
                  }}
                  className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                  title="Switch to Admin Portal"
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => {
                    switchRole('seller');
                    navigate('/seller/dashboard');
                  }}
                  className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition"
                  title="Switch to Seller Portal"
                >
                  Seller Portal
                </button>
              </div>
            </div>
          </header>

          {/* Subpage Content Rendered by Outlet */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
