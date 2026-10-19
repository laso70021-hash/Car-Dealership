import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Gauge, Fuel, Cog, MapPin, ArrowRight } from 'lucide-react';
import { Vehicle } from '../../types';
import { DealershipService } from '../../services/dealershipService';
import { useAuth } from '../../contexts/AuthContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onFavoriteChange?: () => void;
  showActions?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onFavoriteChange,
  showActions = true
}) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('swahivo_cache_favorites');
      return saved ? JSON.parse(saved).includes(vehicle.id) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let active = true;
    DealershipService.getFavorites(user?.user_id || user?.id).then((ids) => {
      if (active) {
        setIsFavorited(ids.includes(vehicle.id));
      }
    });
    return () => { active = false; };
  }, [vehicle.id, user]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = await DealershipService.toggleFavorite(vehicle.id, user?.user_id || user?.id);
    setIsFavorited(updated.includes(vehicle.id));
    if (onFavoriteChange) onFavoriteChange();
  };

  const formattedPrice = new Intl.NumberFormat('en-US').format(vehicle.price);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col group">
      
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={(vehicle.primary_image && vehicle.primary_image.trim()) || (vehicle.images && vehicle.images[0] && vehicle.images[0].trim()) || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Tag */}
        {vehicle.featured_status && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#ef172b] text-white text-[11px] font-bold rounded-md shadow-xs uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all ${
            isFavorited
              ? 'bg-[#ef172b] text-white shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Condition tag */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold rounded">
          {vehicle.condition}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/cars/${vehicle.slug || vehicle.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ef172b] transition-colors line-clamp-1">
              {vehicle.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-1 text-lg font-extrabold text-[#ef172b]">
            {vehicle.currency || 'TZS'} {formattedPrice}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Intl.NumberFormat('en-US').format(vehicle.mileage)} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.fuel_type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-[#ef172b]" />
            <span>{vehicle.location || vehicle.city || 'Dar es Salaam'}</span>
          </div>
        </div>

        {/* CTA Button */}
        {showActions && (
          <div className="mt-5 pt-3">
            <Link
              to={`/cars/${vehicle.slug || vehicle.id}`}
              className="w-full py-2.5 px-4 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all hover:shadow-md hover:shadow-red-500/20 active:scale-[0.99]"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
