import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, Heart, Trash2, Share2, Compass, Car, MapPin,
  CheckCircle2, Plus, Sparkles
} from 'lucide-react';
import { DealershipService } from '../../services/dealershipService';
import { Vehicle } from '../../types';

export const BuyerWishlistPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const [all, favs] = await Promise.all([
      DealershipService.getVehicles(),
      Promise.resolve(DealershipService.getFavorites())
    ]);
    setVehicles(all);
    setSavedIds(favs);
  };

  const handleRemove = async (id: string) => {
    const updated = await DealershipService.toggleFavorite(id);
    setSavedIds(updated);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const wishlistVehicles = vehicles.filter(v => savedIds.includes(v.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-[#ef172b]" />
            Buyer Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Your personalized dream cars collection and price alert watchlist.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            {copied ? 'Link Copied!' : 'Share Wishlist'}
          </button>
          <Link
            to="/cars"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ef172b] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-red-500/20"
          >
            <Plus className="w-4 h-4" /> Add More Cars
          </Link>
        </div>
      </div>

      {wishlistVehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <Bookmark className="w-12 h-12 text-slate-200 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700">Wishlist is empty</h3>
          <p className="mt-1">Save cars while browsing the showroom to receive price drop notifications.</p>
          <Link
            to="/cars"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={v.primary_image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600'}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(v.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white text-slate-400 hover:text-red-500 transition shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{v.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">{v.year} • {v.fuel_type} • {v.location}</div>
                  <div className="mt-3 font-black text-slate-900 text-base">
                    TZS {v.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/cars/${v.slug || v.id}`}
                  className="block text-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
