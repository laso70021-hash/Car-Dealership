import React, { useState, useEffect } from 'react';
import {
  Layers, Search, Filter, CheckCircle2, AlertCircle, Clock,
  DollarSign, PackageCheck, Archive, Tag, RefreshCw, Car
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerInventoryPage: React.FC = () => {
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || 'seller-ali-hassan';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [sellerId]);

  const loadData = async () => {
    const data = await DealershipService.getVehicles({ sellerId });
    setVehicles(data);
  };

  const handleUpdateAvailability = async (id: string, newAvailability: 'available' | 'reserved' | 'sold') => {
    setUpdatingId(id);
    try {
      await DealershipService.updateVehicle(id, { availability: newAvailability });
      setVehicles(vehicles.map(v => v.id === id ? { ...v, availability: newAvailability } : v));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability =
      availabilityFilter === 'all' || v.availability === availabilityFilter;
    return matchesSearch && matchesAvailability;
  });

  const availableCount = vehicles.filter(v => v.availability === 'available').length;
  const reservedCount = vehicles.filter(v => v.availability === 'reserved').length;
  const soldCount = vehicles.filter(v => v.availability === 'sold').length;
  const totalValuation = vehicles
    .filter(v => v.availability !== 'sold')
    .reduce((sum, v) => sum + Number(v.price), 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-[#ef172b]" />
          Inventory Management
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Track showroom availability, manage reservation holds, and mark units as sold.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Available Stock</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{availableCount}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><PackageCheck className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reserved Units</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">{reservedCount}</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sold This Period</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-blue-600">{soldCount}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Stock Value</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-black text-slate-900 line-clamp-1">TZS {(totalValuation / 1000000).toFixed(1)}M</span>
            <div className="p-2 bg-red-50 text-[#ef172b] rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Units' },
            { id: 'available', label: 'In Stock' },
            { id: 'reserved', label: 'Reserved' },
            { id: 'sold', label: 'Sold' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAvailabilityFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                availabilityFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'}
                        alt={v.title}
                        className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{v.title}</div>
                        <div className="text-[11px] text-slate-400">{v.year} • {v.fuel_type} • {v.transmission}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-black text-slate-900">
                    TZS {v.price.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {v.city || v.location}
                  </td>

                  <td className="py-3 px-4">
                    {v.availability === 'available' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
                      </span>
                    ) : v.availability === 'reserved' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" /> Reserved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Sold Out
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateAvailability(v.id, 'available')}
                        disabled={updatingId === v.id || v.availability === 'available'}
                        className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-30 transition"
                      >
                        In Stock
                      </button>
                      <button
                        onClick={() => handleUpdateAvailability(v.id, 'reserved')}
                        disabled={updatingId === v.id || v.availability === 'reserved'}
                        className="px-2 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-30 transition"
                      >
                        Hold / Reserve
                      </button>
                      <button
                        onClick={() => handleUpdateAvailability(v.id, 'sold')}
                        disabled={updatingId === v.id || v.availability === 'sold'}
                        className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition"
                      >
                        Sold
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
