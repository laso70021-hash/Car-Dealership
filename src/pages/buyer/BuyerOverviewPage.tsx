import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, MessageSquare, ShoppingBag, Calendar, Compass,
  Car, ArrowRight, ShieldCheck, Clock, MapPin, Eye, Sparkles, CheckCircle2
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const BuyerOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await DealershipService.getVehicles();
    setVehicles(data);
    setSavedIds(DealershipService.getFavorites());
  };

  const savedVehicles = vehicles.filter(v => savedIds.includes(v.id));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#081725] to-[#12283e] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-red-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-[#ef172b] text-[11px] font-bold border border-red-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Buyer Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
            Find your dream ride with verified inspection reports, direct showroom messaging, and certified escrow protection.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/20"
            >
              <Compass className="w-4 h-4" /> Browse 850+ Vehicles
            </Link>
            <Link
              to="/account/saved"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-xs"
            >
              <Heart className="w-4 h-4 text-red-400" /> View Saved ({savedVehicles.length})
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Overview Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/account/saved"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-red-300 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saved Vehicles</span>
            <div className="p-2.5 bg-red-50 text-[#ef172b] rounded-xl group-hover:scale-110 transition">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{savedVehicles.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            Cars in your garage <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </span>
        </Link>

        <Link
          to="/account/enquiries"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-red-300 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Enquiries</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">5</div>
          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            Showroom replies <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </span>
        </Link>

        <Link
          to="/account/orders"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-red-300 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Orders</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">2</div>
          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            Active reservations <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </span>
        </Link>

        <Link
          to="/account/bookings"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-red-300 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Test Drives</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">1</div>
          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            Confirmed visit <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </span>
        </Link>
      </div>

      {/* Saved Cars Preview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#ef172b] fill-[#ef172b]" />
              Your Saved Vehicles
            </h2>
            <p className="text-xs text-slate-400">Cars you marked as favorite for quick access and price updates.</p>
          </div>
          <Link
            to="/account/saved"
            className="text-xs font-bold text-[#ef172b] hover:text-red-700 flex items-center gap-1"
          >
            View all ({savedVehicles.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedVehicles.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-700">No saved vehicles yet</h3>
            <p className="text-[11px] text-slate-400 mt-1">Browse cars and click the heart icon to bookmark.</p>
            <Link
              to="/cars"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Browse Cars Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedVehicles.slice(0, 3).map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={v.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600'}
                      alt={v.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-xs">
                      {v.year}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{v.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{v.fuel_type}</span>
                      <span>•</span>
                      <span>{v.transmission}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {v.city || v.location}</span>
                    </div>
                    <div className="mt-3 font-black text-slate-900 text-base">
                      TZS {v.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <Link
                    to={`/cars/${v.slug || v.id}`}
                    className="flex-1 py-2 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    View Car
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
