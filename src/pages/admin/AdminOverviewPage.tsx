import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, ShoppingBag, MessageSquare, Plus, ArrowUpRight, CheckCircle2,
  AlertCircle, Eye, Trash2, Edit3, X, DollarSign, Clock, MapPin
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
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

export const AdminOverviewPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
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

  return (
    <div className="space-y-8">
      {/* Title and Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back! Here's what's happening with your dealership today.</p>
        </div>
        
        <button
          onClick={() => setIsAddVehicleOpen(true)}
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
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
            <p className="text-2xl font-extrabold text-slate-900">{vehicles.length}</p>
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
            <p className="text-2xl font-extrabold text-slate-900">{enquiries.length}</p>
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
            <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Sales / Orders</p>
            <p className="text-[10px] text-slate-400">Completed sales</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 24%
            </span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-slate-900">TZS 1.48B</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Revenue</p>
            <p className="text-[10px] text-slate-400">Year to date</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full">
              Action Req.
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">12</p>
            <p className="text-xs text-slate-500 mt-0.5">Pending Approvals</p>
            <p className="text-[10px] text-slate-400">Seller listings</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHARTS SECTION (Sales & Enquiries Line Chart + Category Donut)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enquiries & Sales Overview</h3>
              <p className="text-xs text-slate-500">Monthly conversion and lead velocity in 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef172b]"></span>
                <span className="text-slate-600">Enquiries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-slate-600">Sales</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_ENQUIRIES_DATA}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#081725',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="enquiries"
                  stroke="#ef172b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ef172b' }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inventory Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Stock proportion by primary category</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DISTRIBUTION}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#081725',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-[11px]">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 truncate">{cat.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          RECENT VEHICLES TABLE
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Vehicle Listings</h3>
            <p className="text-xs text-slate-500">Live vehicles currently showcased on Swahivo</p>
          </div>
          <Link
            to="/admin/vehicles"
            className="text-xs font-bold text-[#ef172b] hover:underline"
          >
            View All ({vehicles.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 text-slate-500 border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-6">Vehicle</th>
                <th className="py-3 px-6">Type & Year</th>
                <th className="py-3 px-6">Price (TZS)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.slice(0, 6).map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={vehicle.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80'}
                          alt={vehicle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{vehicle.title}</p>
                        <p className="text-[10px] text-slate-400">{vehicle.brand} • {vehicle.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {vehicle.vehicle_type} ({vehicle.year})
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    TZS {vehicle.price.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {vehicle.location || 'Dar es Salaam'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/cars/${vehicle.slug}`}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          RECENT ENQUIRIES & ORDERS GRID
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiries Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Enquiries</h3>
              <p className="text-xs text-slate-500">Inbound buyer questions on vehicles</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-[#ef172b] hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {enquiries.slice(0, 4).map((enq) => (
              <div key={enq.id} className="py-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">{enq.customer_name}</p>
                  <p className="text-[11px] text-[#ef172b] font-medium">{enq.vehicle_title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">"{enq.message}"</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                    {enq.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{enq.last_message_at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Vehicle Orders</h3>
              <p className="text-xs text-slate-500">Processed purchases and deposit agreements</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-[#ef172b] hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">{ord.product_name}</p>
                  <p className="text-[11px] text-slate-500">{ord.customer_name} • {ord.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-slate-900">TZS {(ord.amount || ord.total_amount || 0).toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                    ord.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Vehicle Listing</h3>
              <button onClick={() => setIsAddVehicleOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Land Cruiser Prado TX"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  >
                    <option>Toyota</option>
                    <option>BMW</option>
                    <option>Mercedes-Benz</option>
                    <option>Ford</option>
                    <option>Land Rover</option>
                    <option>Nissan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prado TX"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ef172b]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef172b] hover:bg-[#d01122] text-white rounded-xl font-bold shadow-md shadow-red-500/20"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
