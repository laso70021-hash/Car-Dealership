import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Layers, Tag, Wrench, Bike, ShoppingBag,
  Users, UserCheck, Calendar, DollarSign, FileText, Star,
  Megaphone, Settings, Search, Bell, MessageSquare, ChevronDown,
  ArrowUpRight, Plus, ExternalLink, MoreVertical, CheckCircle2,
  Clock, AlertCircle, MapPin, Eye, Trash2, Edit3, X
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { SwahivoLogo } from '../../components/common/SwahivoLogo';
import { useAuth } from '../../contexts/AuthContext';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle, Order, Enquiry } from '../../types';

// Enquiries & Sales Chart Data (Jan - Dec)
const SALES_ENQUIRIES_DATA = [
  { month: 'Jan', enquiries: 18, sales: 6 },
  { month: 'Feb', enquiries: 24, sales: 9 },
  { month: 'Mar', enquiries: 32, sales: 12 },
  { month: 'Apr', enquiries: 45, sales: 15 },
  { month: 'May', enquiries: 42, sales: 16 },
  { month: 'Jun', enquiries: 56, sales: 20 },
  { month: 'Jul', enquiries: 52, sales: 21 },
  { month: 'Aug', enquiries: 65, sales: 25 },
  { month: 'Sep', enquiries: 62, sales: 26 },
  { month: 'Oct', enquiries: 85, sales: 32 },
  { month: 'Nov', enquiries: 74, sales: 28 },
  { month: 'Dec', enquiries: 92, sales: 35 },
];

// Donut Chart Data
const CATEGORY_DISTRIBUTION = [
  { name: 'New Cars', value: 82, color: '#ef172b' },
  { name: 'Used Cars', value: 96, color: '#3b82f6' },
  { name: 'Accessories', value: 24, color: '#10b981' },
  { name: 'Motorbikes', value: 18, color: '#f59e0b' },
  { name: 'Electric', value: 16, color: '#8b5cf6' },
  { name: 'Others', value: 10, color: '#64748b' },
];

export const AdminDashboard: React.FC = () => {
  const { user, signOut, switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState<Vehicle | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  // New vehicle form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Toyota');
  const [newModel, setNewModel] = useState('');
  const [newPrice, setNewPrice] = useState(45000000);
  const [newYear, setNewYear] = useState(2023);
  const [newCity, setNewCity] = useState('Dar es Salaam');

  useEffect(() => {
    const loadData = async () => {
      const [vData, oData, eData] = await Promise.all([
        DealershipService.getVehicles(),
        DealershipService.getOrders(),
        DealershipService.getEnquiries()
      ]);
      setVehicles(vData);
      setOrders(oData);
      setEnquiries(eData);
    };
    loadData();
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createVehicle({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      brand: newBrand,
      model: newModel,
      vehicle_type: 'SUV',
      condition: 'Used',
      year: Number(newYear),
      mileage: 15000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      price: Number(newPrice),
      currency: 'TZS',
      location: newCity,
      city: newCity,
      availability: 'available',
      verification_status: 'verified',
      featured_status: true,
      publication_status: 'approved',
      primary_image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
    });
    setVehicles([created, ...vehicles]);
    setIsAddVehicleOpen(false);
    setNewTitle('');
    setNewModel('');
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle listing?')) {
      await DealershipService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Car, hasSub: true },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'brands', label: 'Brands', icon: Tag },
    { id: 'accessories', label: 'Accessories', icon: Wrench },
    { id: 'motorbikes', label: 'Motorbikes', icon: Bike },
    { id: 'orders', label: 'Orders / Enquiries', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'leads', label: 'Leads (CRM)', icon: UserCheck },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'financing', label: 'Financing', icon: DollarSign },
    { id: 'content', label: 'Content', icon: FileText, hasSub: true },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, hasSub: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex text-slate-800 antialiased font-sans">
      
      {/* =========================================================================
          DARK NAVY SIDEBAR (Matching Reference 4: #081725)
      ========================================================================= */}
      <aside className="w-64 bg-[#081725] text-slate-300 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800">
        <div className="p-6">
          {/* Logo */}
          <Link to="/" className="block mb-8">
            <SwahivoLogo variant="light" size="md" />
          </Link>

          {/* Nav List */}
          <nav className="space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#ef172b] text-white shadow-md shadow-red-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSub && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
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
            <span>Visit Website</span>
          </Link>
        </div>
      </aside>

      {/* =========================================================================
          MAIN ADMIN CONTENT AREA
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          
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
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 1, 2026 - Oct 31, 2026</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-600 hover:text-[#ef172b] hover:bg-slate-50 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef172b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* Message Icon */}
            <button className="p-2 text-slate-600 hover:text-[#ef172b] hover:bg-slate-50 rounded-full">
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
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
              <button
                onClick={() => switchRole('seller')}
                className="text-[10px] text-slate-500 hover:text-[#ef172b] underline"
                title="Switch to seller portal"
              >
                Switch Role
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Title and Intro */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">Welcome back! Here's what's happening with your dealership today.</p>
            </div>
            
            <button
              onClick={() => setIsAddVehicleOpen(true)}
              className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* =========================================================================
              5 TOP STAT METRICS (Matching Reference 4)
          ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total Vehicles */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">246</p>
                <p className="text-xs text-slate-500 mt-0.5">Total Vehicles</p>
                <p className="text-[10px] text-slate-400">Active listings</p>
              </div>
            </div>

            {/* Enquiries */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 18%
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">128</p>
                <p className="text-xs text-slate-500 mt-0.5">Enquiries</p>
                <p className="text-[10px] text-slate-400">New this month</p>
              </div>
            </div>

            {/* Sales */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 6%
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">32</p>
                <p className="text-xs text-slate-500 mt-0.5">Sales</p>
                <p className="text-[10px] text-slate-400">Completed sales</p>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 24%
                </span>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">TZS 1.28B</p>
                <p className="text-xs text-slate-500 mt-0.5">Revenue (TZS)</p>
                <p className="text-[10px] text-slate-400">This month</p>
              </div>
            </div>

            {/* Customers */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 15%
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">1,452</p>
                <p className="text-xs text-slate-500 mt-0.5">Customers</p>
                <p className="text-[10px] text-slate-400">Total registered</p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MIDDLE CHARTS ROW: Enquiries & Sales | Vehicles by Category | Quick Actions
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Enquiries & Sales (Line Chart) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Enquiries & Sales</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef172b]" /> Enquiries
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Sales
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SALES_ENQUIRIES_DATA}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#081725', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="enquiries" stroke="#ef172b" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Vehicles by Category (Donut Chart) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Vehicles by Category</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All</button>
              </div>

              <div className="h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DISTRIBUTION}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {CATEGORY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute text-center">
                  <p className="text-xl font-extrabold text-slate-900">246</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Total Vehicles</p>
                </div>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                {CATEGORY_DISTRIBUTION.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Add Vehicle</span>
                </button>

                <button
                  onClick={() => alert('Category management: All 6 categories active')}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Add Category</span>
                </button>

                <button
                  onClick={() => alert('Brand management: 8 brands configured')}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Add Brand</span>
                </button>

                <button
                  onClick={() => alert('Inventory manager: All 6 vehicles in stock')}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Manage Stock</span>
                </button>

                <button
                  onClick={() => alert('Special promotion campaigns active')}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Create Offer</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-[#ef172b] hover:bg-red-50/40 transition-all flex flex-col items-center justify-center gap-2 text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">View Enquiries</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              LATEST VEHICLES ROW & RECENT ENQUIRIES
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Latest Vehicles Cards (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Latest Vehicles</h3>
                  <p className="text-[11px] text-slate-400">Recently approved active listings in Tanzania</p>
                </div>
                <Link to="/cars" className="text-xs font-semibold text-[#ef172b] hover:underline">View All</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {vehicles.slice(0, 5).map((veh) => (
                  <div key={veh.id} className="border border-slate-200/80 rounded-xl overflow-hidden p-2.5 space-y-2 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 relative">
                      <img
                        src={(veh.primary_image && veh.primary_image.trim()) || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80'}
                        alt={veh.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded">
                        Active
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900 truncate">{veh.title}</h4>
                      <p className="text-xs font-extrabold text-[#ef172b]">
                        TZS {new Intl.NumberFormat('en-US').format(veh.price)}
                      </p>
                      <p className="text-[10px] text-slate-500">{veh.year} · {veh.transmission}</p>
                    </div>

                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <Link
                        to={`/cars/${veh.slug || veh.id}`}
                        className="text-[#ef172b] font-semibold text-[11px] hover:underline"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleDeleteVehicle(veh.id)}
                        className="text-slate-400 hover:text-red-600"
                        title="Delete vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enquiries (1 Col) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recent Enquiries</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All</button>
              </div>

              <div className="space-y-3">
                {enquiries.slice(0, 5).map((enq) => {
                  const statusColors: Record<string, string> = {
                    New: 'bg-red-50 text-red-600',
                    Contacted: 'bg-blue-50 text-blue-600',
                    Pending: 'bg-amber-50 text-amber-600',
                    Responded: 'bg-emerald-50 text-emerald-600'
                  };

                  return (
                    <div key={enq.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {enq.customer_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{enq.customer_name}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {enq.vehicle_title || 'Enquiry'}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[enq.status] || 'bg-slate-100 text-slate-700'}`}>
                        {enq.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM ROW: Recent Orders / Sales Table | Top Brands | Customer Locations
          ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Orders / Sales Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Recent Orders / Sales</h3>
                  <p className="text-[11px] text-slate-400">Transactions processed across all branches</p>
                </div>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      <th className="pb-3">#</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Vehicle</th>
                      <th className="pb-3">Amount (TZS)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.map((ord) => {
                      const statusBadge = ord.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : ord.status === 'Processing'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700';

                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-mono font-bold text-slate-900">{ord.order_number}</td>
                          <td className="py-3 font-semibold text-slate-900">{ord.customer_name}</td>
                          <td className="py-3 text-slate-600">{ord.product_name}</td>
                          <td className="py-3 font-bold text-slate-900">
                            {new Intl.NumberFormat('en-US').format(ord.amount)}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 text-[11px]">{ord.created_at}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Brands Progress Bars */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Top Brands</h3>
                <button className="text-xs font-semibold text-[#ef172b] hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Toyota', count: 92, pct: 92 },
                  { name: 'BMW', count: 48, pct: 48 },
                  { name: 'Mercedes-Benz', count: 36, pct: 36 },
                  { name: 'Ford', count: 28, pct: 28 },
                  { name: 'Honda', count: 24, pct: 24 },
                ].map((brand) => (
                  <div key={brand.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{brand.name}</span>
                      <span className="font-semibold text-slate-600">{brand.count} listings</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ef172b] rounded-full transition-all duration-500"
                        style={{ width: `${brand.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Locations Map Widget matching Reference 4 */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">Customer Locations</h4>
                  <span className="text-[10px] text-slate-400">Tanzania Coverage</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#ef172b]" /> Dar es Salaam
                    </span>
                    <span className="font-bold text-slate-900">148 listings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#ef172b]" /> Zanzibar
                    </span>
                    <span className="font-bold text-slate-900">36 listings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#ef172b]" /> Arusha
                    </span>
                    <span className="font-bold text-slate-900">18 listings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#ef172b]" /> Mwanza
                    </span>
                    <span className="font-bold text-slate-900">12 listings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#ef172b]" /> Dodoma
                    </span>
                    <span className="font-bold text-slate-900">5 listings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Vehicle Listing</h3>
              <button onClick={() => setIsAddVehicleOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2024 Toyota Prado TX-L"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none bg-white"
                  >
                    <option>Toyota</option>
                    <option>BMW</option>
                    <option>Mercedes-Benz</option>
                    <option>Ford</option>
                    <option>Honda</option>
                    <option>Land Rover</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="e.g. Prado"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (TZS) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Make *</label>
                  <input
                    type="number"
                    required
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Branch</label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-[#ef172b] outline-none bg-white"
                >
                  <option>Dar es Salaam</option>
                  <option>Zanzibar</option>
                  <option>Arusha</option>
                  <option>Mwanza</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Publish Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
