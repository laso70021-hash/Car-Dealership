import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, MessageSquare, ShoppingBag, Plus, ArrowUpRight, CheckCircle2,
  Clock, MapPin, Eye, Trash2, Edit3, X, DollarSign, ChevronRight, TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle, Order, Enquiry } from '../../types';

const MONTHLY_EARNINGS_DATA = [
  { month: 'May', earnings: 18.5 },
  { month: 'Jun', earnings: 24.0 },
  { month: 'Jul', earnings: 28.5 },
  { month: 'Aug', earnings: 36.0 },
  { month: 'Sep', earnings: 42.0 },
  { month: 'Oct', earnings: 48.5 },
];

export const SellerOverviewPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeVehicleFilter, setActiveVehicleFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add vehicle form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Toyota');
  const [newModel, setNewModel] = useState('');
  const [newPrice, setNewPrice] = useState(48000000);
  const [newYear, setNewYear] = useState(2023);
  const [newCity, setNewCity] = useState('Dar es Salaam');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [vData, oData, eData] = await Promise.all([
      DealershipService.getVehicles({ sellerId: 'seller-ali-hassan' }),
      DealershipService.getOrders(),
      DealershipService.getEnquiries('seller-ali-hassan')
    ]);
    setVehicles(vData);
    setOrders(oData.slice(0, 4));
    setEnquiries(eData.slice(0, 4));
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await DealershipService.createVehicle({
      seller_id: 'seller-ali-hassan',
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      brand: newBrand,
      model: newModel,
      vehicle_type: 'SUV',
      condition: 'Used',
      year: Number(newYear),
      mileage: 18000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      price: Number(newPrice),
      currency: 'TZS',
      location: newCity,
      city: newCity,
      availability: 'available',
      verification_status: 'pending',
      featured_status: false,
      publication_status: 'pending_approval',
      primary_image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
    });
    setVehicles([created, ...vehicles]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewModel('');
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (activeVehicleFilter === 'active') return v.publication_status === 'approved' || v.publication_status === 'active';
    if (activeVehicleFilter === 'pending') return v.publication_status === 'pending_approval';
    if (activeVehicleFilter === 'inactive') return v.publication_status === 'inactive';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Seller Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back, Ali! Here is a summary of your vehicle listings and buyer interactions.</p>
        </div>
        <Link
          to="/seller/vehicles/new"
          className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-red-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +3
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{vehicles.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">My Listed Vehicles</p>
            <p className="text-[10px] text-slate-400">8 currently active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 12 New
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{enquiries.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Customer Enquiries</p>
            <p className="text-[10px] text-slate-400">Direct lead inquiries</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 2 Sold
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Vehicles Sold</p>
            <p className="text-[10px] text-slate-400">Total closed sales</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              Available
            </span>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">TZS 124.5M</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Revenue</p>
            <p className="text-[10px] text-slate-400">Ready for payout</p>
          </div>
        </div>
      </div>

      {/* Seller Vehicles Table with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Vehicle Inventory</h3>
            <p className="text-xs text-slate-500">Listings managed under Prime Motors dealership</p>
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'active', 'pending', 'inactive'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveVehicleFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeVehicleFilter === tab
                    ? 'bg-[#ef172b] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Vehicle</th>
                <th className="py-3 px-6">Condition & Year</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Approval Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((vehicle) => {
                const isApproved = vehicle.publication_status === 'approved' || vehicle.publication_status === 'active';
                return (
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
                      {vehicle.condition} ({vehicle.year})
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-slate-900">
                      TZS {vehicle.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isApproved ? 'Live on Swahivo' : 'Pending Admin Approval'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/cars/${vehicle.slug}`}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="View listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/seller/vehicles`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit vehicle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Earnings Bar Chart & Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Earnings Trend (Million TZS)</h3>
              <p className="text-xs text-slate-500">Net vehicle commission payouts</p>
            </div>
            <Link to="/seller/earnings" className="text-xs font-bold text-[#ef172b] hover:underline">
              View Payouts
            </Link>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_EARNINGS_DATA}>
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
                <Bar dataKey="earnings" fill="#ef172b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Inquiries</h3>
              <p className="text-xs text-slate-500">Interested buyers on your vehicle listings</p>
            </div>
            <Link to="/seller/enquiries" className="text-xs font-bold text-[#ef172b] hover:underline">
              View All ({enquiries.length})
            </Link>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {enquiries.map((e) => (
              <div key={e.id} className="py-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">{e.customer_name}</p>
                  <p className="text-[11px] text-[#ef172b] font-medium">{e.vehicle_title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">"{e.message}"</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                    {e.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{e.last_message_at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
