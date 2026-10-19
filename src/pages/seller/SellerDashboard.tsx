import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Car, Plus, Layers, MessageSquare, ShoppingBag,
  Users, Store, Megaphone, DollarSign, Star, BarChart3,
  CreditCard, Settings, Search, Bell, ChevronDown, CheckCircle,
  ArrowUpRight, ExternalLink, Edit3, Eye, MoreVertical, X, TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { SwahivoLogo } from '../../components/common/SwahivoLogo';
import { useAuth } from '../../contexts/AuthContext';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';

const SELLER_LINE_DATA = [
  { month: 'Jan', enquiries: 12, orders: 1 },
  { month: 'Feb', enquiries: 18, orders: 2 },
  { month: 'Mar', enquiries: 22, orders: 2 },
  { month: 'Apr', enquiries: 30, orders: 3 },
  { month: 'May', enquiries: 28, orders: 3 },
  { month: 'Jun', enquiries: 34, orders: 4 },
  { month: 'Jul', enquiries: 31, orders: 3 },
  { month: 'Aug', enquiries: 39, orders: 5 },
  { month: 'Sep', enquiries: 36, orders: 4 },
  { month: 'Oct', enquiries: 42, orders: 6 },
  { month: 'Nov', enquiries: 40, orders: 5 },
  { month: 'Dec', enquiries: 48, orders: 7 },
];

const VEHICLE_STATUS_DATA = [
  { name: 'Active', value: 12, color: '#10b981' },
  { name: 'Pending Approval', value: 4, color: '#f59e0b' },
  { name: 'Inactive', value: 2, color: '#ef172b' },
];

const WEEKLY_EARNINGS = [
  { week: 'W1', earnings: 10 },
  { week: 'W2', earnings: 14 },
  { week: 'W3', earnings: 12 },
  { week: 'W4', earnings: 12.5 },
];

export const SellerDashboard: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleFilter, setActiveVehicleFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Listing Form
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState(45000000);
  const [year, setYear] = useState(2023);
  const [fuel, setFuel] = useState<'Petrol' | 'Diesel' | 'Hybrid'>('Diesel');
  const [city, setCity] = useState('Dar es Salaam');

  useEffect(() => {
    const load = async () => {
      const data = await DealershipService.getVehicles();
      setVehicles(data);
    };
    load();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createVehicle({
      seller_id: user?.user_id || user?.id || '8916c8d8-3037-4e54-9ea5-d025cd77e042',
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      brand,
      model,
      vehicle_type: 'SUV',
      condition: 'Used',
      year: Number(year),
      mileage: 12000,
      fuel_type: fuel,
      transmission: 'Automatic',
      price: Number(price),
      currency: 'TZS',
      location: city,
      city,
      availability: 'available',
      verification_status: 'pending',
      featured_status: false,
      publication_status: 'pending_approval',
      primary_image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
    });
    setVehicles([created, ...vehicles]);
    setIsAddModalOpen(false);
    setTitle('');
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (activeVehicleFilter === 'active') return v.publication_status === 'approved' || v.publication_status === 'active';
    if (activeVehicleFilter === 'pending') return v.publication_status === 'pending_approval';
    if (activeVehicleFilter === 'inactive') return v.publication_status === 'inactive';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex text-slate-800 antialiased font-sans">
      
      {/* =========================================================================
          SELLER SIDEBAR (Matching Reference 5: #081725)
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

            <button onClick={() => setActiveVehicleFilter('all')} className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4" />
                <span>My Vehicles</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button onClick={() => setIsAddModalOpen(true)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Layers className="w-4 h-4" />
              <span>Inventory</span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Enquiries</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">12</span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders / Bookings</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">3</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Store className="w-4 h-4" />
              <span>My Store Profile</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Megaphone className="w-4 h-4" />
              <span>Promote / Boost</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <CreditCard className="w-4 h-4" />
              <span>Financing Requests</span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ef172b] text-white text-[10px] font-bold flex items-center justify-center">5</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4" />
                <span>Payouts / Earnings</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Promo Box matching design */}
        <div className="p-5 border-t border-slate-800">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <span>👑</span>
              <span>Grow Your Sales</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Boost your listings to reach 10x more active car buyers in Tanzania.
            </p>
            <button
              onClick={() => alert('Boost promo campaign activated!')}
              className="w-full py-2 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl transition-all"
            >
              Boost Now →
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          SELLER MAIN CONTENT
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vehicles, enquiries, customers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#ef172b]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-600 hover:text-[#ef172b]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
            </button>
            <button className="relative p-2 text-slate-600 hover:text-[#ef172b]">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            {/* Seller profile pill matching Reference 5 */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Ali Hassan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <span>Ali Hassan</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 text-white" />
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold">Verified Agent</p>
              </div>
              <button
                onClick={() => switchRole('buyer')}
                className="text-[10px] text-slate-500 hover:text-[#ef172b] underline"
              >
                Switch
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Welcome Greeting Banner (Matching Reference 5) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                Welcome back, Ali Hassan 👏
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage your vehicles, enquiries and grow your dealership with Swahivo.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
              <Link
                to="/cars"
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <span>View My Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              5 SELLER STAT METRICS (Matching Reference 5)
          ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">18</p>
              <p className="text-xs text-slate-500">Total Vehicles</p>
              <p className="text-[10px] text-slate-400">12 Active · 4 Pending · 2 Inactive</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 28%
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">42</p>
              <p className="text-xs text-slate-500">Total Enquiries</p>
              <p className="text-[10px] text-slate-400">18 New this month</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 20%
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">6</p>
              <p className="text-xs text-slate-500">Orders / Bookings</p>
              <p className="text-[10px] text-slate-400">3 Pending · 3 Completed</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 35%
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900">TZS 48.5M</p>
              <p className="text-xs text-slate-500">Total Revenue</p>
              <p className="text-[10px] text-slate-400">This month</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 18%
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">12,480</p>
              <p className="text-xs text-slate-500">Profile Views</p>
              <p className="text-[10px] text-slate-400">This month</p>
            </div>
          </div>

          {/* =========================================================================
              CHARTS ROW: Enquiries & Orders | Vehicle Status | Quick Actions
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Line Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Enquiries & Orders</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef172b]" /> Enquiries
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Orders
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SELLER_LINE_DATA}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#081725', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="enquiries" stroke="#ef172b" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart: Vehicle Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Vehicle Status</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</button>
              </div>

              <div className="h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={VEHICLE_STATUS_DATA}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {VEHICLE_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-2xl font-extrabold text-slate-900">18</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Total Vehicles</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Active (12)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600">Pending (4)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-slate-600">Inactive (2)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center"
                >
                  <Car className="w-6 h-6 text-[#ef172b]" />
                  <span className="text-xs font-bold text-slate-800">Add Vehicle</span>
                </button>
                <button
                  onClick={() => setActiveVehicleFilter('all')}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center"
                >
                  <Layers className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Manage Vehicles</span>
                </button>
                <button className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">View Enquiries</span>
                </button>
                <button className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center">
                  <Megaphone className="w-6 h-6 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">Promote Listing</span>
                </button>
                <button className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center">
                  <Store className="w-6 h-6 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">Edit Store Profile</span>
                </button>
                <button className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MY VEHICLES SECTION (Matching Reference 5)
          ========================================================================= */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-slate-900">My Vehicles</h3>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveVehicleFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeVehicleFilter === 'all' ? 'bg-[#ef172b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({vehicles.length})
                  </button>
                  <button
                    onClick={() => setActiveVehicleFilter('active')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeVehicleFilter === 'active' ? 'bg-[#ef172b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Active (12)
                  </button>
                  <button
                    onClick={() => setActiveVehicleFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeVehicleFilter === 'pending' ? 'bg-[#ef172b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending (4)
                  </button>
                  <button
                    onClick={() => setActiveVehicleFilter('inactive')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeVehicleFilter === 'inactive' ? 'bg-[#ef172b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Inactive (2)
                  </button>
                </div>
              </div>

              <Link to="/cars" className="text-xs font-bold text-[#ef172b] hover:underline">
                View All →
              </Link>
            </div>

            {/* Vehicle Cards Grid matching Reference 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredVehicles.slice(0, 4).map((veh, idx) => (
                <div key={veh.id} className="border border-slate-200/90 rounded-2xl overflow-hidden p-3 bg-white space-y-3 hover:shadow-lg transition-all">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={(veh.primary_image && veh.primary_image.trim()) || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80'}
                      alt={veh.title}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                      idx === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      {idx === 2 ? 'Pending' : 'Active'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 truncate">{veh.title}</h4>
                    <p className="text-sm font-extrabold text-[#ef172b] mt-0.5">
                      TZS {new Intl.NumberFormat('en-US').format(veh.price)}
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 mt-2">
                      <span>📅 {veh.year}</span>
                      <span>⏱️ {new Intl.NumberFormat('en-US').format(veh.mileage)} km</span>
                      <span>⛽ {veh.fuel_type}</span>
                      <span>⚙️ {veh.transmission}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => alert(`Edit ${veh.title}`)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      Edit
                    </button>
                    <Link
                      to={`/cars/${veh.slug || veh.id}`}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold text-center transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              RECENT ENQUIRIES, TOP PERFORMING & EARNINGS ROW (Matching Reference 5)
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Enquiries List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recent Enquiries</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Juma Saleh', car: 'Toyota Land Cruiser', msg: 'Hi, is this still available?', status: 'New', time: '2 mins ago' },
                  { name: 'Fatma Ali', car: 'BMW 3 Series', msg: 'Can I get more photos?', status: 'Replied', time: '12 mins ago' },
                  { name: 'Omar Hassan', car: 'Honda Civic', msg: 'What is the final price?', status: 'Pending', time: '1 hour ago' },
                  { name: 'Aisha Mohammed', car: 'Ford Ranger', msg: 'Can I arrange a test drive?', status: 'Closed', time: '3 hours ago' },
                  { name: 'Hamisi Abdalla', car: 'Toyota RAV4', msg: 'Do you offer financing?', status: 'Replied', time: '5 hours ago' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-500">{item.car} · {item.msg}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'New' ? 'bg-red-50 text-red-600' : item.status === 'Replied' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Vehicles */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Top Performing Vehicles</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All →</button>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Toyota Land Cruiser', views: '1245 views', enq: '35 enquiries' },
                  { rank: 2, name: 'BMW 3 Series', views: '980 views', enq: '28 enquiries' },
                  { rank: 3, name: 'Ford Ranger', views: '750 views', enq: '18 enquiries' },
                  { rank: 4, name: 'Honda Civic', views: '620 views', enq: '12 enquiries' },
                  { rank: 5, name: 'Toyota RAV4', views: '540 views', enq: '10 enquiries' },
                ].map((car) => (
                  <div key={car.rank} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-white font-extrabold flex items-center justify-center text-[10px]">
                        {car.rank}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{car.name}</p>
                        <p className="text-[10px] text-slate-400">{car.views}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 text-[11px]">{car.enq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Earnings Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Total Earnings (TZS)</h3>
                <span className="text-xs text-slate-500 font-semibold">This Month</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_EARNINGS}>
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#ef172b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xl font-extrabold text-slate-900">TZS 48,500,000</p>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +35% total earnings this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900">Add Vehicle for Listing</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateListing} className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2023 Toyota Land Cruiser ZX"
                  className="w-full text-xs p-2.5 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Fuel</label>
                  <select
                    value={fuel}
                    onChange={(e: any) => setFuel(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#ef172b] text-white text-xs font-bold rounded-xl">
                  Submit Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
