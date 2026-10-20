import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Search, Plus, Filter, Eye, Edit3, Trash2, CheckCircle2,
  Clock, MapPin, X, AlertCircle, ShieldCheck
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerVehiclesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const sellerId = user?.user_id;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, [sellerId]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Query vehicles belonging to this authenticated seller, or all listings if seller has none yet
      const data = await DealershipService.getVehicles(sellerId ? { sellerId } : undefined);
      setVehicles(data);
    } catch (err) {
      console.error('Error loading seller vehicles from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this listing from Supabase?')) {
      try {
        await DealershipService.deleteVehicle(id);
        await loadVehicles();
        if (selectedVehicle?.id === id) setSelectedVehicle(null);
      } catch (err: any) {
        alert(`Failed to delete vehicle from Supabase: ${err.message}`);
      }
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && v.publication_status === 'approved') ||
      (statusFilter === 'pending' && v.publication_status === 'pending_approval') ||
      (statusFilter === 'inactive' && v.publication_status === 'inactive');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Car className="w-7 h-7 text-[#ef172b]" />
            My Vehicles
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your showroom inventory, track review statuses, and update pricing.
          </p>
        </div>

        <Link
          to="/seller/vehicles/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Link>
      </div>

      {/* Info notice about seller restrictions */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-800 font-medium">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <span>
          <strong>Seller Policy:</strong> You can create and edit your listings at any time. All newly submitted vehicles are reviewed by Swahivo administration before becoming live on the public showroom.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by brand, model, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'approved', label: 'Approved & Live' },
            { id: 'pending', label: 'Pending Approval' },
            { id: 'inactive', label: 'Draft / Inactive' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your vehicle listings...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-12 text-center">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No vehicles found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filter tags.'
                : 'Start listing cars to reach thousands of buyers across Tanzania.'}
            </p>
            <Link
              to="/seller/vehicles/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" /> Add First Vehicle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Specs</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'}
                          alt={vehicle.title}
                          className="w-14 h-11 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{vehicle.title}</div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                            <span>{vehicle.brand} {vehicle.model}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {vehicle.city || vehicle.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <div>{vehicle.year} • {vehicle.fuel_type}</div>
                      <div className="text-[11px] text-slate-400">{vehicle.mileage?.toLocaleString()} km • {vehicle.transmission}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900 text-sm">
                        TZS {vehicle.price.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        {vehicle.condition}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {vehicle.publication_status === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
                        </span>
                      ) : vehicle.publication_status === 'pending_approval' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-500" /> Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedVehicle(vehicle)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          title="Delete Listing"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
        )}
      </div>

      {/* Quick View Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedVehicle.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'}
              alt={selectedVehicle.title}
              className="w-full h-48 object-cover rounded-xl border border-slate-200 mb-4"
            />

            <h3 className="text-lg font-black text-slate-900">{selectedVehicle.title}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedVehicle.year} • {selectedVehicle.brand} {selectedVehicle.model} • {selectedVehicle.location}
            </p>

            <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400">Price:</span>
                <div className="font-bold text-slate-900">TZS {selectedVehicle.price.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-slate-400">Mileage:</span>
                <div className="font-bold text-slate-900">{selectedVehicle.mileage?.toLocaleString()} km</div>
              </div>
              <div>
                <span className="text-slate-400">Transmission:</span>
                <div className="font-bold text-slate-900">{selectedVehicle.transmission}</div>
              </div>
              <div>
                <span className="text-slate-400">Review Status:</span>
                <div className="font-bold text-slate-900 capitalize">{selectedVehicle.publication_status?.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
