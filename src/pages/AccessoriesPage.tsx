import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Check, CheckCircle2 } from 'lucide-react';

interface AccessoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  compatibility: string;
  stock: number;
}

const SAMPLE_ACCESSORIES: AccessoryItem[] = [
  {
    id: 'a1',
    name: '20" Off-Road Alloy Wheel Set (4pcs)',
    category: 'Wheels & Rims',
    brand: 'Fuel Off-Road',
    price: 3800000,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80',
    compatibility: 'Toyota Land Cruiser, Hilux, Ford Ranger',
    stock: 8
  },
  {
    id: 'a2',
    name: 'Harman Kardon Premium Subwoofer System',
    category: 'Audio & Tech',
    brand: 'Harman Kardon',
    price: 1850000,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80',
    compatibility: 'Universal 12V Installation',
    stock: 14
  },
  {
    id: 'a3',
    name: 'Ceramic Pro 9H Paint Protection Kit',
    category: 'Detailing',
    brand: 'Ceramic Pro',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80',
    compatibility: 'All Vehicles',
    stock: 22
  },
  {
    id: 'a4',
    name: 'Heavy Duty LED Spot Roof Bar Light',
    category: 'Lighting',
    brand: 'Stedi Australia',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80',
    compatibility: '4x4 SUVs and Pickups',
    stock: 19
  },
  {
    id: 'a5',
    name: 'WeatherTech Custom All-Weather Floor Mats',
    category: 'Interior',
    brand: 'WeatherTech',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&q=80',
    compatibility: 'Toyota Prado, Land Cruiser 300, RAV4',
    stock: 30
  },
  {
    id: 'a6',
    name: 'Brembo High Performance Brake Kit',
    category: 'Performance',
    brand: 'Brembo',
    price: 4500000,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80',
    compatibility: 'BMW 3/5 Series, Mercedes C/E Class',
    stock: 5
  }
];

export const AccessoriesPage: React.FC = () => {
  const [accessories, setAccessories] = useState<AccessoryItem[]>(SAMPLE_ACCESSORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [orderedId, setOrderedId] = useState<string | null>(null);

  const categories = ['All', 'Wheels & Rims', 'Audio & Tech', 'Detailing', 'Lighting', 'Interior', 'Performance'];

  const filtered = accessories.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOrder = (id: string) => {
    setOrderedId(id);
    setTimeout(() => setOrderedId(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#ef172b] uppercase tracking-wider">Swahivo Auto Store</span>
            <h1 className="text-3xl font-extrabold text-slate-900">Genuine & Performance Accessories</h1>
            <p className="text-xs text-slate-500">Certified auto parts, alloy wheels, high-end sound systems, and 4x4 upgrades in Tanzania.</p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search parts, wheels, audio..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-[#ef172b] outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-[#ef172b] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">{item.brand}</p>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#ef172b] transition-colors">{item.name}</h3>
                  <p className="text-base font-extrabold text-[#ef172b]">
                    TZS {new Intl.NumberFormat('en-US').format(item.price)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Fitment:</span> {item.compatibility}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOrder(item.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    orderedId === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-[#ef172b] text-white shadow-xs'
                  }`}
                >
                  {orderedId === item.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Order Request Sent!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Part / Enquire</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
