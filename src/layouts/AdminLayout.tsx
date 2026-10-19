import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Layers, Tag, Wrench, Bike, ShoppingBag,
  Users, UserCheck, Calendar, DollarSign, FileText, Star,
  Megaphone, Settings, Search, Bell, MessageSquare, ChevronDown,
  ExternalLink, Menu, X, CheckCircle2, Shield
} from 'lucide-react';
import { SwahivoLogo } from '../components/common/SwahivoLogo';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseStatusBanner } from '../components/common/DatabaseStatusBanner';

export const AdminLayout: React.FC = () => {
  const { user, signOut, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navMenuItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/brands', label: 'Brands', icon: Tag },
    { to: '/admin/accessories', label: 'Accessories', icon: Wrench },
    { to: '/admin/motorbikes', label: 'Motorbikes', icon: Bike },
    { to: '/admin/orders', label: 'Orders / Enquiries', icon: ShoppingBag, badge: '5' },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/leads', label: 'Leads (CRM)', icon: UserCheck, badge: 'New' },
    { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { to: '/admin/financing', label: 'Financing', icon: DollarSign },
    { to: '/admin/content', label: 'Content', icon: FileText },
    { to: '/admin/users', label: 'Users', icon: Shield },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/marketing', label: 'Marketing', icon: Megaphone },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col antialiased font-sans">
      <DatabaseStatusBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            ADMIN SIDEBAR (Matching Reference 4: #081725)
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
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Visit Website Link */}
          <div className="p-6 border-t border-slate-800/80">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Public Website</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
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
                  <span>Visit Public Website</span>
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* =========================================================================
            MAIN ADMIN WRAPPER WITH TOP HEADER
        ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            {/* Mobile Menu Toggle & Brand */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              <SwahivoLogo variant="dark" size="sm" />
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search vehicles, customers, enquiries..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#ef172b]"
              />
            </div>

            {/* Right User & Notifications */}
            <div className="flex items-center space-x-4">
              {/* Date Range Badge */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Oct 1, 2026 - Oct 31, 2026</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-600 hover:text-[#ef172b] hover:bg-slate-50 rounded-full"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    5
                  </span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                      <span className="text-[10px] font-semibold text-[#ef172b]">5 New</span>
                    </div>
                    <div className="space-y-2.5 mt-3 max-h-60 overflow-y-auto">
                      <div className="text-xs p-2 bg-red-50/50 rounded-xl">
                        <p className="font-bold text-slate-800">New Financing Request</p>
                        <p className="text-[11px] text-slate-500">Godfrey Mwalimu applied for Toyota Land Cruiser</p>
                      </div>
                      <div className="text-xs p-2 bg-slate-50 rounded-xl">
                        <p className="font-bold text-slate-800">New Customer Enquiry</p>
                        <p className="text-[11px] text-slate-500">Fatma Said enquired about BMW 3 Series</p>
                      </div>
                      <div className="text-xs p-2 bg-slate-50 rounded-xl">
                        <p className="font-bold text-slate-800">Test Drive Booking</p>
                        <p className="text-[11px] text-slate-500">Juma Rashid scheduled test drive for 25 Oct</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Icon */}
              <NavLink to="/admin/orders" className="p-2 text-slate-600 hover:text-[#ef172b] hover:bg-slate-50 rounded-full">
                <MessageSquare className="w-5 h-5" />
              </NavLink>

              {/* Admin Avatar */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight">Admin</p>
                  <p className="text-[10px] text-slate-500">Super Administrator</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => switchRole('seller')}
                    className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    title="Switch to seller portal"
                  >
                    Seller Portal
                  </button>
                  <button
                    onClick={() => switchRole('buyer')}
                    className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    title="Switch to buyer portal"
                  >
                    Buyer Portal
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Content via Outlet */}
          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
