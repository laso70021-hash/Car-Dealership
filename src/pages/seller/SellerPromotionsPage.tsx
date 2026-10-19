import React, { useState, useEffect } from 'react';
import {
  Zap, Sparkles, TrendingUp, CheckCircle2, Clock, Eye,
  Car, ArrowRight, ShieldCheck, DollarSign, X
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const SellerPromotionsPage: React.FC = () => {
  const { user } = useAuth();
  const sellerId = user?.user_id || user?.id || 'seller-ali-hassan';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('featured_7');
  const [successMsg, setSuccessMsg] = useState(false);

  const boostPackages = [
    {
      id: 'featured_7',
      name: 'Featured Badge',
      duration: '7 Days',
      price: 35000,
      description: 'Highlight vehicle in red with a verified badge across all search grids.',
      multiplier: '3.5x more views'
    },
    {
      id: 'top_14',
      name: 'Top of Search Priority',
      duration: '14 Days',
      price: 65000,
      description: 'Pin your vehicle at the absolute top of search results for its brand & model.',
      multiplier: '6x more enquiries'
    },
    {
      id: 'spotlight_30',
      name: 'Homepage Spotlight & Social Push',
      duration: '30 Days',
      price: 135000,
      description: 'Homepage hero slider rotation plus Swahivo Instagram & Facebook showcase.',
      multiplier: '12x maximum exposure'
    }
  ];

  const [activePromotions, setActivePromotions] = useState([
    {
      id: 'p1',
      vehicle_title: '2022 Toyota Land Cruiser Prado TX-L',
      package: 'Top of Search Priority',
      start_date: '2026-10-10',
      end_date: '2026-10-24',
      views_generated: 1420,
      enquiries_generated: 18,
      status: 'active'
    },
    {
      id: 'p2',
      vehicle_title: '2020 Mercedes-Benz C200 AMG Line',
      package: 'Featured Badge',
      start_date: '2026-10-05',
      end_date: '2026-10-12',
      views_generated: 890,
      enquiries_generated: 9,
      status: 'expired'
    }
  ]);

  useEffect(() => {
    loadVehicles();
  }, [sellerId]);

  const loadVehicles = async () => {
    const data = await DealershipService.getVehicles({ sellerId });
    setVehicles(data);
    if (data.length > 0) setSelectedVehicleId(data[0].id);
  };

  const handleBoost = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = boostPackages.find(p => p.id === selectedPackage);
    const veh = vehicles.find(v => v.id === selectedVehicleId);
    if (!pkg || !veh) return;

    const newPromo = {
      id: 'p-' + Date.now(),
      vehicle_title: veh.title,
      package: pkg.name,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      views_generated: 0,
      enquiries_generated: 0,
      status: 'active'
    };

    setActivePromotions([newPromo, ...activePromotions]);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Zap className="w-7 h-7 text-[#ef172b]" />
          Promote & Boost Listings
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Accelerate your sales velocity by featuring listings to thousands of serious buyers.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Boost campaign activated successfully! Your listing has been prioritized across search results.
        </div>
      )}

      {/* Boost Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ef172b]" />
          Choose a Listing and Boost Package
        </h3>

        <form onSubmit={handleBoost} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Select Vehicle to Boost</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} — TZS {v.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Payment Method</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800">
                <span>Deduct from Showroom Wallet Balance</span>
                <span className="text-emerald-600 font-black">TZS 1,240,000 available</span>
              </div>
            </div>
          </div>

          {/* Package Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {boostPackages.map((pkg) => {
              const selected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                    selected
                      ? 'border-[#ef172b] bg-red-50/40 ring-2 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{pkg.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {pkg.duration}
                      </span>
                    </div>

                    <div className="mt-3 text-lg font-black text-slate-900">
                      TZS {pkg.price.toLocaleString()}
                    </div>

                    <div className="mt-1 text-[11px] font-bold text-[#ef172b]">
                      {pkg.multiplier}
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Select</span>
                    <input
                      type="radio"
                      checked={selected}
                      onChange={() => setSelectedPackage(pkg.id)}
                      className="accent-[#ef172b]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4" /> Activate Boost Now
            </button>
          </div>
        </form>
      </div>

      {/* Active Boost Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Campaign Performance & History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Leads</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activePromotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.vehicle_title}</td>
                  <td className="py-3 px-4 font-medium text-slate-600">{p.package}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{p.start_date} to {p.end_date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.views_generated.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{p.enquiries_generated}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
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
