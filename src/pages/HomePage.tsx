import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Play, ShieldCheck, Handshake, CreditCard, Headphones,
  ArrowRight, Star, ChevronRight, CheckCircle2, Quote
} from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { ShowroomModal } from '../components/modals/ShowroomModal';
import { DealershipService } from '../services/dealershipService';
import { Vehicle, Category, CustomerReview } from '../types';
import heroSunsetImg from '../assets/images/Swahivo Dealership at Sunset.png';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isShowroomModalOpen, setIsShowroomModalOpen] = useState(false);

  // Search Filter State
  const [carType, setCarType] = useState('All Types');
  const [make, setMake] = useState('All Makes');
  const [priceRange, setPriceRange] = useState('Any Price');
  const [location, setLocation] = useState('All Locations');

  useEffect(() => {
    const loadData = async () => {
      const [vData, cData, rData] = await Promise.all([
        DealershipService.getVehicles({ featured: true }),
        DealershipService.getCategories(),
        DealershipService.getReviews()
      ]);
      setVehicles(vData);
      setCategories(cData);
      setReviews(rData);
    };
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (carType !== 'All Types') params.set('type', carType);
    if (make !== 'All Makes') params.set('brand', make);
    if (priceRange !== 'Any Price') params.set('priceRange', priceRange);
    if (location !== 'All Locations') params.set('location', location);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      
      {/* =========================================================================
          HERO SECTION (Matching Reference 1 & 3)
      ========================================================================= */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#081725]">
        {/* Dealership Sunset Hero Background */}
        <div className="absolute inset-0">
          <img
            src={heroSunsetImg}
            alt="Swahivo Dealership at Sunset"
            className="w-full h-full object-cover object-center brightness-75 contrast-105"
          />
          {/* Subtle gradient overlays to guarantee perfect text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081725]/95 via-[#081725]/75 to-transparent lg:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081725] via-transparent to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Tagline */}
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white/90">
              PREMIUM CARS. REAL PEOPLE. BETTER JOURNEYS.
            </p>

            {/* Headline matching Reference 1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Find Your <br />
              <span className="text-[#ef172b]">Perfect Drive</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-xl">
              Swahivo Car Dealership brings you a wide range of new and pre-owned vehicles with trusted service, flexible finance options, and a smooth buying experience.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/cars"
                className="px-6 py-3.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all hover:scale-105"
              >
                <span>Browse All Cars</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsShowroomModalOpen(true)}
                className="px-6 py-3.5 bg-black/40 hover:bg-black/60 border border-white/30 text-white text-sm font-semibold rounded-xl flex items-center gap-2.5 backdrop-blur-md transition-all hover:border-white"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span>Watch Our Showroom</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLOATING SEARCH BAR & TRUST BADGES (Matching Reference 1)
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* Search Bar Card */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
        >
          {/* Car Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Car Type</label>
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#ef172b]"
            >
              <option>All Types</option>
              <option>SUV</option>
              <option>Sedan</option>
              <option>Pickup</option>
              <option>Coupe</option>
              <option>Hatchback</option>
            </select>
          </div>

          {/* Make */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Make</label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#ef172b]"
            >
              <option>All Makes</option>
              <option>Toyota</option>
              <option>BMW</option>
              <option>Mercedes-Benz</option>
              <option>Ford</option>
              <option>Honda</option>
              <option>Land Rover</option>
              <option>Nissan</option>
              <option>Mitsubishi</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#ef172b]"
            >
              <option>Any Price</option>
              <option>Under TZS 30M</option>
              <option>TZS 30M - 50M</option>
              <option>TZS 50M - 80M</option>
              <option>TZS 80M+</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#ef172b]"
            >
              <option>All Locations</option>
              <option>Dar es Salaam</option>
              <option>Arusha</option>
              <option>Mwanza</option>
              <option>Zanzibar</option>
              <option>Dodoma</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2 lg:col-span-1 pt-4 sm:pt-0 lg:self-end">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all hover:scale-[1.02]"
            >
              <Search className="w-4 h-4" />
              <span>Search Cars</span>
            </button>
          </div>
        </form>

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Verified Listings</p>
              <p className="text-[11px] text-slate-500">Full TRA Documentation</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Dealer Warranty</p>
              <p className="text-[11px] text-slate-500">Peace of Mind</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Flexible Finance</p>
              <p className="text-[11px] text-slate-500">Easy Monthly Plans</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef172b] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Expert Support</p>
              <p className="text-[11px] text-slate-500">Here for You Always</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POPULAR CAR CATEGORIES (Matching Reference 1)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">Explore Our Range</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Popular Car Categories</h2>
          </div>
          <Link
            to="/cars"
            className="text-xs font-bold text-[#ef172b] hover:text-[#d01122] flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/cars?category=${cat.slug}`}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-[#ef172b] hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center">
                <img
                  src={(cat.image_url && cat.image_url.trim()) || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#ef172b] transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{cat.description}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ef172b]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FEATURED VEHICLES IN TANZANIA (Matching Reference 1 Grid)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Vehicles in Tanzania</h2>
            <p className="text-xs text-slate-500 mt-1">
              {vehicles.length} available · Verified listings with full TRA documentation and dealer warranties
            </p>
          </div>
          <Link
            to="/cars"
            className="text-xs font-bold text-[#ef172b] hover:text-[#d01122] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Vehicles</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-6 Vehicle Cards Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {vehicles.slice(0, 5).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          DRIVE YOUR DREAMS PROMO BANNER (Matching Reference 1 & Coastal Photo)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[340px] flex items-center">
          
          {/* Background image of coastal Land Cruiser */}
          <img
            src="/src/assets/images/drive_dreams_banner_1792348476854.jpg"
            alt="Toyota Land Cruiser along coastal road"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent lg:w-3/5" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Drive Your Dreams <br />
              <span className="text-[#ef172b]">with Swahivo</span>
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed max-w-lg">
              Quality vehicles, trusted service, and flexible finance options. Your next journey starts here.
            </p>

            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all hover:scale-105"
            >
              <span>Explore Our Cars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* 4 Stats Badges matching design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <p className="text-xl font-extrabold text-[#ef172b]">500+</p>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Vehicles Available</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <p className="text-xl font-extrabold text-white">10K+</p>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Happy Customers</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <p className="text-xl font-extrabold text-emerald-400">100%</p>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Verified Listings</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <p className="text-xl font-extrabold text-amber-400">5 Star</p>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHAT OUR CUSTOMERS SAY (Matching Reference 1 Testimonials)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">What Our Customers Say</h2>
            <p className="text-xs text-slate-500 mt-1">Real experiences from happy Swahivo customers.</p>
          </div>
          <Link
            to="/reviews"
            className="text-xs font-bold text-[#ef172b] hover:text-[#d01122] flex items-center gap-1 group"
          >
            <span>View All Reviews</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                    <img
                      src={(rev.customer_avatar && rev.customer_avatar.trim()) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'}
                      alt={rev.customer_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{rev.customer_name}</h4>
                    <p className="text-[10px] text-slate-500">{rev.customer_city}</p>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Showroom Walkthrough Modal */}
      <ShowroomModal
        isOpen={isShowroomModalOpen}
        onClose={() => setIsShowroomModalOpen(false)}
      />
    </div>
  );
};
