import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Trash2, Scale, ExternalLink, Compass, MapPin,
  Car, CheckCircle2, ArrowRight
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';

import { useAuth } from '../../contexts/AuthContext';

export const BuyerSavedCarsPage: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const activeUserId = user?.user_id || user?.id;

  useEffect(() => {
    loadSaved();
  }, [activeUserId]);

  const loadSaved = async () => {
    setLoading(true);
    const [allVehicles, favIds] = await Promise.all([
      DealershipService.getVehicles(),
      DealershipService.getFavorites(activeUserId)
    ]);
    setVehicles(allVehicles);
    setSavedIds(favIds);
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    const updated = await DealershipService.toggleFavorite(id, activeUserId);
    setSavedIds(updated);
  };

  const savedVehicles = vehicles.filter(v => savedIds.includes(v.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-[#ef172b] fill-[#ef172b]" />
            Saved Cars & Garage
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Keep track of prices, status changes, and compare specs of your shortlisted cars.
          </p>
        </div>

        <Link
          to="/cars"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Compass className="w-4 h-4" /> Browse More Cars
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your saved vehicles...</div>
      ) : savedVehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#ef172b] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">Your Garage is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            You haven't saved any vehicles yet. Explore our marketplace and tap the heart icon on any car to track price drops.
          </p>
          <Link
            to="/cars"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20"
          >
            Explore Verified Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600'}
                    alt={vehicle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {vehicle.year}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      {vehicle.condition}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(vehicle.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition shadow-sm"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{vehicle.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5 font-medium">
                    <span>{vehicle.fuel_type}</span>
                    <span>•</span>
                    <span>{vehicle.transmission}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {vehicle.city || vehicle.location}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Price</span>
                      <span className="text-base font-black text-slate-900">
                        TZS {vehicle.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Stock
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <Link
                  to={`/cars/${vehicle.slug || vehicle.id}`}
                  className="flex-1 py-2.5 text-center bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-red-500/20"
                >
                  View Details
                </Link>
                <Link
                  to="/account/compare"
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  title="Compare"
                >
                  <Scale className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
