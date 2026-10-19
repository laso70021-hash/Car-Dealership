import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, User, Menu, X, ArrowRight, ShieldCheck, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { SwahivoLogo } from '../common/SwahivoLogo';
import { useAuth } from '../../contexts/AuthContext';
import { DealershipService } from '../../services/dealershipService';

export const Navbar: React.FC = () => {
  const { user, role, signOut, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const favorites = DealershipService.getFavoritesSync();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Cars', path: '/cars' },
    { label: 'Accessories', path: '/accessories' },
    { label: 'Services', path: '/services' },
    { label: 'Finance', path: '/finance' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'seller') return '/seller/dashboard';
    return '/account/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-[1.02]">
            <SwahivoLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive ? 'text-[#ef172b]' : 'text-slate-700 hover:text-[#ef172b]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ef172b] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Visit Showroom */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-700 hover:text-[#ef172b] hover:bg-slate-50 rounded-full transition-colors"
              title="Search cars"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / Favorites */}
            <Link
              to="/account/dashboard"
              className="p-2 text-slate-700 hover:text-[#ef172b] hover:bg-slate-50 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Role & User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-all text-xs font-semibold text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs uppercase overflow-hidden">
                  {user?.avatar_url && user.avatar_url.trim() !== '' ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <span className="capitalize">{user?.role || 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{user?.full_name}</p>
                    <p className="text-slate-500 truncate">{user?.email}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#ef172b]">
                      Active: {user?.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#ef172b]" />
                      Go to {user?.role === 'admin' ? 'Admin' : user?.role === 'seller' ? 'Seller' : 'Buyer'} Portal
                    </Link>
                  </div>

                  {/* Switch Role Quick Tester */}
                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Switch Portal (Instant Test):
                    </p>
                    <div className="flex gap-1">
                      {(['admin', 'seller', 'buyer'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setUserDropdownOpen(false);
                          }}
                          className={`flex-1 py-1 rounded text-[11px] font-semibold capitalize transition-all ${
                            role === r ? 'bg-[#ef172b] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Visit Showroom CTA Button matching exact red pill from design */}
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-sm font-semibold rounded-full shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Visit Showroom</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-3">
            <Link
              to="/cars"
              className="px-3 py-1.5 bg-[#ef172b] text-white text-xs font-semibold rounded-full"
            >
              Showroom
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#ef172b] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="py-3 border-t border-slate-100 flex items-center gap-2 animate-in fade-in">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Toyota, BMW, Land Cruiser, hybrid, Dar es Salaam..."
              className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none placeholder-slate-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#ef172b] text-white rounded-lg text-xs font-semibold hover:bg-[#d01122]"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-slate-400 hover:text-slate-700 text-xs px-2"
            >
              Close
            </button>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-slate-100 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#ef172b]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold"
              >
                {user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'seller' ? 'Seller Portal' : 'Buyer Dashboard'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
