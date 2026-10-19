import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Heart, MessageSquare, ShoppingBag,
  Calendar, History, Scale, Bookmark, Bell, User, MapPin,
  CreditCard, Settings, Headphones, Search, CheckCircle2,
  Trash2, ArrowRight, ShieldCheck, Wrench, Bike, Car, Sparkles,
  Clock, Check
} from 'lucide-react';
import { SwahivoLogo } from '../../components/common/SwahivoLogo';
import { useAuth } from '../../contexts/AuthContext';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';

export const BuyerDashboard: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [savedCarIds, setSavedCarIds] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await DealershipService.getVehicles();
      setVehicles(data);
      setSavedCarIds(DealershipService.getFavorites());
    };
    load();
  }, []);

  const handleRemoveSaved = async (id: string) => {
    const updated = await DealershipService.toggleFavorite(id);
    setSavedCarIds(updated);
  };

  const savedVehicles = vehicles.filter(v => savedCarIds.includes(v.id));

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex text-slate-800 antialiased font-sans">
      
      {/* =========================================================================
          BUYER SIDEBAR (Matching Reference 6: #081725)
      ========================================================================= */}
      <aside className="w-64 bg-[#081725] text-slate-300 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800">
        <div className="p-6">
          <Link to="/" className="block mb-8">
            <SwahivoLogo variant="light" size="md" />
          </Link>

          <nav className="space-y-1">
            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#ef172b] text-white shadow-md shadow-red-500/20">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            <Link to="/cars" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Compass className="w-4 h-4" />
              <span>Browse Cars</span>
            </Link>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>Saved Cars</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">
                {savedVehicles.length}
              </span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>My Enquiries</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">
                5
              </span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Calendar className="w-4 h-4" />
              <span>My Bookings</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <History className="w-4 h-4" />
              <span>Search History</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Scale className="w-4 h-4" />
              <span>Compare Cars</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Bookmark className="w-4 h-4" />
              <span>Wishlist</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <MapPin className="w-4 h-4" />
              <span>My Addresses</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <CreditCard className="w-4 h-4" />
              <span>Payment Methods</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Need Help Box */}
        <div className="p-5 border-t border-slate-800">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white text-xs font-bold">
              <Headphones className="w-4 h-4 text-[#ef172b]" />
              <span>Need Help?</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Contact our certified vehicle support team 24/7.
            </p>
            <a
              href="tel:+255770565656"
              className="block w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl text-center transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          BUYER MAIN CONTENT
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header matching Reference 6 */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1 flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <input
                type="text"
                placeholder="Search for cars, brands, or anything..."
                className="w-full px-4 py-2 text-xs bg-transparent outline-none"
              />
              <select className="text-xs bg-white border-l px-3 text-slate-600 outline-none">
                <option>All Categories</option>
                <option>New Cars</option>
                <option>Used Cars</option>
                <option>Accessories</option>
              </select>
              <button className="px-4 bg-[#ef172b] text-white">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-6 pl-4">
            <nav className="hidden lg:flex items-center space-x-5 text-xs font-semibold text-slate-700">
              <Link to="/" className="hover:text-[#ef172b]">Home</Link>
              <Link to="/cars" className="hover:text-[#ef172b]">Cars</Link>
              <Link to="/accessories" className="hover:text-[#ef172b]">Accessories</Link>
              <Link to="/services" className="hover:text-[#ef172b]">Services</Link>
              <Link to="/blog" className="hover:text-[#ef172b]">Blog</Link>
            </nav>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-slate-600 hover:text-[#ef172b]">
                <Heart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedVehicles.length}
                </span>
              </button>
              <button className="relative p-2 text-slate-600 hover:text-[#ef172b]">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Salim Khamis avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
                    alt="Salim Khamis"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight">Salim Khamis</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Verified Buyer</p>
                </div>
                <button
                  onClick={() => switchRole('admin')}
                  className="text-[10px] text-slate-500 hover:text-[#ef172b] underline"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Welcome Greeting Banner (Matching Reference 6 Coastal Sunset) */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[190px] flex items-center">
            <img
              src="/src/assets/images/drive_dreams_banner_1792348476854.jpg"
              alt="Toyota Land Cruiser Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent lg:w-3/5" />

            <div className="relative z-10 p-6 sm:p-8 flex items-center gap-5">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-xl bg-slate-200 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
                  alt="Salim Khamis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-300">Welcome back,</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>Salim Khamis</span>
                  <span className="text-[10px] bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                </h1>
                <p className="text-xs text-slate-200 max-w-xl">
                  Find your next car and enjoy a smooth, secure buying experience with Swahivo.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Pill Buttons (Matching Reference 6) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Browse Cars', sub: 'Explore inventory', icon: Search, to: '/cars' },
              { label: 'New Cars', sub: 'Latest models', icon: Car, to: '/cars?condition=New' },
              { label: 'Used Cars', sub: 'Quality pre-owned', icon: ShieldCheck, to: '/cars?condition=Used' },
              { label: 'Motorbikes', sub: 'Explore bikes', icon: Bike, to: '/cars?type=Motorbike' },
              { label: 'Accessories', sub: 'Genuine parts', icon: Sparkles, to: '/accessories' },
              { label: 'Book a Service', sub: 'Schedule now', icon: Wrench, to: '/services' },
            ].map((btn, i) => {
              const Icon = btn.icon;
              return (
                <Link
                  key={i}
                  to={btn.to}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/90 hover:border-[#ef172b] hover:shadow-md transition-all flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 group-hover:text-[#ef172b] transition-colors">{btn.label}</p>
                    <p className="text-[10px] text-slate-400">{btn.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* =========================================================================
              SAVED CARS, RECENT ENQUIRIES & NOTIFICATIONS ROW
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Saved Cars (3 cards) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Saved Cars ({savedVehicles.length})</h3>
                <Link to="/cars" className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</Link>
              </div>

              <div className="space-y-4">
                {savedVehicles.slice(0, 3).map((car) => (
                  <div key={car.id} className="border border-slate-200/80 rounded-xl overflow-hidden p-3 bg-slate-50/50 flex gap-3">
                    <div className="w-24 h-20 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                      <img
                        src={(car.primary_image && car.primary_image.trim()) || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80'}
                        alt={car.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{car.title}</h4>
                        <p className="text-xs font-extrabold text-[#ef172b] mt-0.5">
                          TZS {new Intl.NumberFormat('en-US').format(car.price)}
                        </p>
                        <p className="text-[10px] text-slate-500">{car.year} · {car.transmission} · {car.city}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          to={`/cars/${car.slug || car.id}`}
                          className="px-2.5 py-1 bg-[#ef172b] text-white text-[10px] font-bold rounded-lg"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleRemoveSaved(car.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enquiries (1 Col) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recent Enquiries</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Toyota Land Cruiser', sub: 'Price and availability?', status: 'New', date: 'Oct 20, 2026' },
                  { name: 'BMW 3 Series', sub: 'Is this still available?', status: 'Replied', date: 'Oct 18, 2026' },
                  { name: 'Ford Ranger', sub: 'Can I get a test drive?', status: 'Pending', date: 'Oct 16, 2026' },
                  { name: 'Honda Civic', sub: 'Any discount available?', status: 'Closed', date: 'Oct 14, 2026' },
                  { name: 'Toyota RAV4', sub: 'Do you have this in white?', status: 'Replied', date: 'Oct 12, 2026' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-500">{item.sub}</p>
                      <p className="text-[9px] text-slate-400">{item.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'New' ? 'bg-red-50 text-red-600' : item.status === 'Replied' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications & Financing Promo */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                  <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</button>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Your enquiry has been replied', desc: 'Toyota Land Cruiser', time: '2 minutes ago', dot: 'bg-red-500' },
                    { title: 'New cars added', desc: 'Check out the latest stock', time: '1 hour ago', dot: 'bg-blue-500' },
                    { title: 'Price drop alert', desc: 'BMW 3 Series is now TZS 43,000,000', time: '3 hours ago', dot: 'bg-amber-500' },
                    { title: 'Your booking is confirmed', desc: 'Service booking on 25 Oct 2026', time: '1 day ago', dot: 'bg-emerald-500' },
                  ].map((notif, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${notif.dot} mt-1 flex-shrink-0`} />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                        <p className="text-[10px] text-slate-500">{notif.desc}</p>
                        <p className="text-[9px] text-slate-400">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financing Card matching Reference 6 */}
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ef172b] text-white flex items-center justify-center font-bold">
                    TZS
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Need Financing?</h4>
                    <p className="text-[10px] text-slate-500">Flexible car finance options with trusted partners.</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Financing application opened!')}
                  className="w-full py-2 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Apply for Finance →
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MY ORDERS / BOOKINGS & RECOMMENDED FOR YOU (Matching Reference 6)
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Orders & Bookings with Timeline */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">My Orders / Bookings (2)</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</button>
              </div>

              {/* Order 1: Toyota RAV4 with 4-step progress */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-200">
                      <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=200&q=80" alt="RAV4" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Toyota RAV4</h4>
                      <p className="text-[10px] text-slate-500">Order #SWV00123 · Oct 10, 2026</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">
                    Processing
                  </span>
                </div>

                {/* Progress bar timeline matching Reference 6 */}
                <div className="pt-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                    <div className="absolute left-0 w-2/3 top-1/2 -translate-y-1/2 h-0.5 bg-[#ef172b] z-0" />

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#ef172b] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1">Order Placed</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#ef172b] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1">Payment</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#ef172b] text-white flex items-center justify-center text-[10px] animate-pulse">
                        <Clock className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold text-[#ef172b] mt-1">Processing</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
                        4
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-1">Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking 2: Service Booking */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-200">
                    <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&q=80" alt="Civic" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Honda Civic</h4>
                    <p className="text-[10px] text-slate-500">Booking #SWV00987 · Service Booking · Oct 25, 2026 at 10:00 AM</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Popular Brands Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Popular Brands</h3>
                <Link to="/cars" className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Toyota', 'BMW', 'Mercedes-Benz', 'Ford', 'Honda', 'Land Rover', 'Nissan', 'Mitsubishi'].map((b) => (
                  <Link
                    key={b}
                    to={`/cars?brand=${b}`}
                    className="p-3 bg-slate-50 hover:bg-red-50 hover:border-[#ef172b] border border-slate-200/80 rounded-xl text-center transition-all group"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#ef172b]">{b}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
