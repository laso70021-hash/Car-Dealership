import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Gauge, Fuel, Cog, MapPin, Heart, ShieldCheck,
  CheckCircle2, MessageSquare, Phone, ArrowLeft, Share2, Car
} from 'lucide-react';
import { DealershipService } from '../services/dealershipService';
import { Vehicle } from '../types';
import { EnquiryModal } from '../components/modals/EnquiryModal';
import { BookingModal } from '../components/modals/BookingModal';
import { VehicleCard } from '../components/common/VehicleCard';

export const CarDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!slug) return;
      setLoading(true);
      const defaultImg = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80';
      const found = await DealershipService.getVehicleBySlug(slug);
      setVehicle(found);
      if (found) {
        setSelectedImage((found.primary_image && found.primary_image.trim()) || (found.images && found.images[0]) || defaultImg);
        const favs = await DealershipService.getFavorites();
        setIsFavorited(favs.includes(found.id));
        const all = await DealershipService.getVehicles();
        setSimilarVehicles(all.filter(v => v.id !== found.id).slice(0, 3));
      }
      setLoading(false);
    };
    loadVehicle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleFavoriteToggle = async () => {
    if (!vehicle) return;
    const favs = await DealershipService.toggleFavorite(vehicle.id);
    setIsFavorited(favs.includes(vehicle.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef172b]" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-4">
          <Car className="w-12 h-12 text-[#ef172b] mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Vehicle Not Found</h2>
          <p className="text-xs text-slate-500">The vehicle listing you are looking for may have been sold or moved.</p>
          <Link to="/cars" className="inline-block px-5 py-2.5 bg-[#ef172b] text-white text-xs font-bold rounded-xl">
            Browse All Cars
          </Link>
        </div>
      </div>
    );
  }

  const defaultFallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80';
  const galleryImages = [
    (vehicle.primary_image && vehicle.primary_image.trim()) || defaultFallbackImage,
    ...(vehicle.images || [])
  ].filter((img): img is string => typeof img === 'string' && img.trim() !== '');

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/cars"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#ef172b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2.5 rounded-full border transition-all ${
                isFavorited
                  ? 'bg-red-50 border-red-200 text-[#ef172b]'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-[#ef172b]'
              }`}
              title={isFavorited ? 'Remove from saved' : 'Save vehicle'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Listing link copied to clipboard!');
              }}
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#ef172b]"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Vehicle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Gallery, Overview, Specifications, Description */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src={(selectedImage && selectedImage.trim()) || (vehicle.primary_image && vehicle.primary_image.trim()) || defaultFallbackImage}
                  alt={vehicle.title}
                  className="w-full h-full object-cover transition-all"
                />
                {vehicle.featured_status && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#ef172b] text-white text-xs font-bold rounded-lg shadow-sm uppercase tracking-wider">
                    Featured Vehicle
                  </div>
                )}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-xs font-medium rounded-lg">
                  {vehicle.condition} · {vehicle.year}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === img ? 'border-[#ef172b] scale-105 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Vehicle Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Brand / Make</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.brand}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Model</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.model}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Year of Make</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.year}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Mileage</p>
                  <p className="font-bold text-slate-900 mt-1">{new Intl.NumberFormat('en-US').format(vehicle.mileage)} km</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Transmission</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.transmission}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Fuel Type</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.fuel_type}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Body Type</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.vehicle_type}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Engine Capacity</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.engine_capacity || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Drive Train</p>
                  <p className="font-bold text-slate-900 mt-1">{vehicle.drive_type || '4WD'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">Vehicle Description</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {vehicle.description || 'Pristine certified vehicle available at Swahivo dealership.'}
                </p>
              </div>

              {/* Features Tags */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Key Features & Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{feature}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Price, Action CTA, Dealer Card */}
          <div className="space-y-6">
            
            {/* Price & Primary Actions Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 sticky top-28">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{vehicle.condition} Vehicle</p>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{vehicle.title}</h1>
                <div className="mt-3 text-3xl font-extrabold text-[#ef172b]">
                  {vehicle.currency} {new Intl.NumberFormat('en-US').format(vehicle.price)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {vehicle.negotiable ? 'Price is slightly negotiable' : 'Fixed price (all taxes included)'}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full py-3.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Enquiry</span>
                </button>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Test Drive</span>
                </button>
              </div>

              {/* Verified Dealer Assurance */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-2 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Swahivo Buyer Protection</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-normal">
                  All listings verified against Tanzania Revenue Authority (TRA) customs and chassis registry. Complete peace of mind guaranteed.
                </p>
              </div>

              {/* Verified Seller Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                      alt="Ali Hassan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Ali Hassan</h4>
                    <p className="text-[11px] text-[#ef172b] font-semibold">Verified Agent · Swahivo</p>
                    <p className="text-[10px] text-slate-500">Dar es Salaam & Zanzibar</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex gap-2">
                  <a
                    href="tel:+255770565656"
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#ef172b]" />
                    <span>Call Dealer</span>
                  </a>
                  <a
                    href="https://wa.me/255770565656"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Grid */}
        {similarVehicles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Similar Vehicles You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry and Booking Modals */}
      <EnquiryModal
        vehicle={vehicle}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
      <BookingModal
        vehicle={vehicle}
        type="test_drive"
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
