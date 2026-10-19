import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, Car } from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { DealershipService } from '../services/dealershipService';
import { Vehicle, Brand } from '../types';

export const CarsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All Makes');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All Types');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All Locations');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [vData, bData] = await Promise.all([
        DealershipService.getVehicles(),
        DealershipService.getBrands()
      ]);
      setVehicles(vData);
      setBrands(bData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('All Makes');
    setSelectedType('All Types');
    setSelectedCondition('All');
    setSelectedLocation('All Locations');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setMaxPrice(100000000);
    setSearchParams({});
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedBrand !== 'All Makes' && v.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    if (selectedType !== 'All Types' && v.vehicle_type.toLowerCase() !== selectedType.toLowerCase()) return false;
    if (selectedCondition !== 'All' && v.condition.toLowerCase() !== selectedCondition.toLowerCase()) return false;
    if (selectedLocation !== 'All Locations' && !v.location?.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (selectedFuel !== 'All' && v.fuel_type.toLowerCase() !== selectedFuel.toLowerCase()) return false;
    if (selectedTransmission !== 'All' && v.transmission.toLowerCase() !== selectedTransmission.toLowerCase()) return false;
    if (v.price > maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'newest') return b.year - a.year;
    if (sortBy === 'mileage') return a.mileage - b.mileage;
    return b.featured_status ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Vehicles in Tanzania</h1>
              <p className="text-xs text-slate-500 mt-1">
                Browse certified new and used cars with dealer warranty and verified TRA documentation.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by model, brand, e.g. Land Cruiser, BMW..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ef172b]"
              />
            </div>
          </div>
        </div>

        {/* Content Layout: Filters Sidebar + Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6 h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Filter className="w-4 h-4 text-[#ef172b]" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-[#ef172b] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Condition</label>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'New', 'Used'].map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      selectedCondition === cond
                        ? 'bg-[#ef172b] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Make / Brand */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Make / Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#ef172b]"
              >
                <option>All Makes</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Vehicle Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#ef172b]"
              >
                <option>All Types</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>Pickup</option>
                <option>Coupe</option>
                <option>Hatchback</option>
              </select>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider">Max Price</span>
                <span className="font-extrabold text-[#ef172b]">
                  TZS {new Intl.NumberFormat('en-US').format(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="20000000"
                max="120000000"
                step="5000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#ef172b] cursor-pointer"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#ef172b]"
              >
                <option>All Locations</option>
                <option>Dar es Salaam</option>
                <option>Arusha</option>
                <option>Mwanza</option>
                <option>Zanzibar</option>
                <option>Dodoma</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#ef172b]"
              >
                <option>All</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
          </aside>

          {/* Vehicles List & Sorting Header */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-semibold text-slate-700">
                Showing <span className="text-[#ef172b] font-bold">{filteredVehicles.length}</span> vehicles
              </div>

              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-800"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ef172b]" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 outline-none focus:border-[#ef172b]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Year</option>
                  <option value="mileage">Lowest Mileage</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFiltersOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-4 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xs">Filters</h3>
                  <button onClick={resetFilters} className="text-xs text-[#ef172b]">Reset</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg">
                    <option>All Makes</option>
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg">
                    <option>All Types</option>
                    <option>SUV</option>
                    <option>Sedan</option>
                    <option>Pickup</option>
                  </select>
                </div>
              </div>
            )}

            {/* Vehicles Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse p-4 space-y-4">
                    <div className="aspect-[16/10] bg-slate-100 rounded-xl" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-6 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-red-50 text-[#ef172b] rounded-full flex items-center justify-center mx-auto">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">No Vehicles Match Your Search</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your filters or search keywords to explore more available vehicles in our inventory.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#ef172b] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
